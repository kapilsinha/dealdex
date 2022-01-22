import {ethers, BigNumber, Signer, providers } from 'ethers';
import {BigNumber as BigNumberJS} from "bignumber.js"
import NetworkUser from '../DataModels/User';
import { Deal } from '../DataModels/DealData'
import PendingDeal from '../DataModels/PendingDeal'
import { DealConfig, DealToken, ParticipantAddresses, ExchangeRate, InvestConfig, RefundConfig, ClaimTokensConfig, ClaimFundsConfig, VestingSchedule, getUnixTimestamp } from '../DataModels/DealConfig'
import SmartContractService from "./SmartContractService"
import { DealConfigStruct } from "../../typechain-types/DealFactory";
import Moralis from "./MoralisService";


import DatabaseService from './DatabaseService';
import DealMetadata from '../DataModels/DealMetadata';


export default class DealService {

    static async createDeal(user: Moralis.User,
                            chainId: number,
                            dealName: string, 
                            nftAddress: string,
                            paymentTokenAddress: string,
                            minRoundSize: string,
                            maxRoundSize: string,
                            minInvestPerInvestor: string,
                            maxInvestPerInvestor: string,
                            investDeadline: string,
                            projectWalletAddress: string,
                            projectTokenPrice: string,
                            vestingSchedule: Array<{percent: string, date: string}>,
                            projectTokenAddress?: string,
                            syndicateWalletAddress?: string,
                            syndicationFee?: string) {
        let signer = await SmartContractService.getSignerForUser(user)

        let dealFactoryAddress = await DatabaseService.getDealFactoryAddress()
        console.log(user)
        console.log(SmartContractService.getChecksumAddress(user.get("ethAddress")))
        console.log(dealFactoryAddress)

        if (!signer || !dealFactoryAddress) {
            return {error: "Unable to create deal. Please try again"}
        }

        let paymentToken = await DealToken.fromContractAddress(paymentTokenAddress, chainId)

        var projectToken = paymentToken
        if (projectTokenAddress) {
            var projectToken = await DealToken.fromContractAddress(projectTokenAddress, chainId)

            if (!projectToken) {
                return {error: "Invalid project token"}
            }
        }

        if (!paymentToken) {
            return {error: "Invalid payment token"}
        }
        
        let participantsConfig = new ParticipantAddresses(
            dealFactoryAddress, 
            syndicateWalletAddress, 
            projectWalletAddress 
        )
        let exchangeRateConfig = ExchangeRate.fromDisplayValue(
            projectTokenPrice,
            paymentToken,
            projectToken
        )

        let investConfig = new InvestConfig(
            paymentToken.getTokenBits(minInvestPerInvestor), 
            paymentToken.getTokenBits(maxInvestPerInvestor),
            paymentToken.getTokenBits(minRoundSize),
            paymentToken.getTokenBits(maxRoundSize),
            nftAddress,
            new Date(investDeadline),
            paymentTokenAddress,
            1   // This means that the investment is tied to the NFT
        )

        let refundConfig = new RefundConfig(true)   // Allow refunds

        var managerFeeBps = 0
        if (syndicationFee) {
            managerFeeBps = Number(syndicationFee) * 100    // Convert to basis points
        }

        let claimTokensConfig = new ClaimTokensConfig(
            1,  // DealDex fee is overridden in smart contract
            projectTokenAddress,
            managerFeeBps
        )

        let claimFundsConfig = new ClaimFundsConfig(
            1,  // DealDex fee is overridden in smart contract
            0   // Currently the syndication fee is only in project tokens, not payment tokens
        )

        let vestingConfig = new VestingSchedule(
            0,
            vestingSchedule.map((vest) => Number(vest.percent) * 100),  // Convert to basis points
            vestingSchedule.map((vest) => new Date(vest.date))
        )

        let dealConfig = new DealConfig(
            participantsConfig,
            exchangeRateConfig,
            investConfig,
            refundConfig,
            claimTokensConfig,
            claimFundsConfig,
            vestingConfig
        )

        let creator = await DatabaseService.getUser(user.get("ethAddress"));

        let res = await DealService.recordPendingDeal(Number(minInvestPerInvestor), dealConfig, dealName, creator, paymentToken);
        if (res.error !== undefined) {
            return res;
        }
        let txn = await SmartContractService.createDeal(dealFactoryAddress, signer, dealConfig)
        if (txn.error !== undefined) {
            await DealService.revertPendingDeal(creator!, res.pendingDeal);
        }
        return txn;
    }

    static async recordPendingDeal(minInvestmentAmt: number, dealConfig: DealConfig, dealName: string, creator: NetworkUser | undefined, paymentToken: DealToken) {
        let project = await DatabaseService.getUser(dealConfig.participantAddresses.projectAddress);
        let manager = await DatabaseService.getUser(dealConfig.participantAddresses.managerAddress);
        if (creator === undefined || project === undefined || manager === undefined) {
            console.log("Failed to retrieve all users!", creator, project, manager)
            return { error: "Failed to retrieve user: please check your internet connection" };
        }
        let pendingDeal = PendingDeal.createPendingDeal(
            dealName, 
            creator, 
            project, 
            manager, 
            paymentToken.contractAddress, 
            dealConfig.investConfig.gateToken, 
            minInvestmentAmt,
            getUnixTimestamp(dealConfig.investConfig.deadline).toNumber()
        );
        await pendingDeal.save();
        creator.add("pendingDealsCreated", pendingDeal);
        await creator.save();
        return { pendingDeal: pendingDeal }
    }

    static async revertPendingDeal(creator: NetworkUser, pendingDeal: PendingDeal) {
        creator.remove("pendingDealsCreated", pendingDeal)
        await creator.save();
        await pendingDeal.destroy();
    }

    static async fetchDeal(provider: providers.Provider, dealAddress: string) {
        const config = await SmartContractService.fetchDealConfig(dealAddress, provider)
        console.log("Deal config:", config)
        const startupAddress = config.participantAddresses.startup

        // [ [investors], [amounts] ]
        const investment = await SmartContractService.fetchSubscribedInvestors(dealAddress, provider)
        const investorAddresses = investment[0]
        const investorAmounts = investment[1]
        console.log(investorAddresses)

        // All numbers are of type BigNumber
        const tickSize = config.tickDetails.tickSize
        const tickValue = config.tickDetails.tickValue

        const startupTokenAddress = config.claimTokensConfig.startupTokenAddress

        const gateToken = config.investConfig.gateToken

        const ethPerToken = await getEthPerTokenInContract(startupTokenAddress, tickSize, tickValue, provider)
        const tokensInContract = await getTokensInContract(
            startupTokenAddress,
            dealAddress,
            provider
        )

        const weiInContract = await SmartContractService.getWeiBalance(dealAddress, provider)
        const ethInContract = ethers.utils.formatEther(weiInContract)

        var minInvestmentPerInvestor = config.investConfig.sizeConstraints.minInvestmentPerInvestor
        minInvestmentPerInvestor = ethers.utils.formatEther(minInvestmentPerInvestor)
        var maxInvestmentPerInvestor = config.investConfig.sizeConstraints.maxInvestmentPerInvestor
        maxInvestmentPerInvestor = ethers.utils.formatEther(maxInvestmentPerInvestor)

        var minTotalInvestment = config.investConfig.sizeConstraints.minTotalInvestment
        minTotalInvestment = ethers.utils.formatEther(minTotalInvestment)
        var maxTotalInvestment = config.investConfig.sizeConstraints.maxTotalInvestment
        maxTotalInvestment = ethers.utils.formatEther(maxTotalInvestment)

        var investmentDeadline = config.investConfig.investmentDeadline
        investmentDeadline = new Date(investmentDeadline.toNumber() * 1000) // Seconds -> Milliseconds

        var vestingStrategy = config.vestingSchedule.vestingStrategy
        var investmentKeyType = config.investmentKeyType

        let project = await DatabaseService.getUser(startupAddress) || NetworkUser.empty(startupAddress)
        let investors = investorAddresses.map(async function(investorAddress: string, index: Number){
            return await DatabaseService.getUser(investorAddress) || NetworkUser.empty(investorAddress)
        })
        let dealMetadata = await DatabaseService.getDealMetadata(dealAddress)
        
        const deal = new Deal(
            project,
            investors,
            investorAmounts,
            vestingStrategy,
            investmentKeyType,
            dealMetadata?.get("name"),
            dealAddress,
            ethPerToken,
            getValidatedAddress(startupTokenAddress),
            minInvestmentPerInvestor,
            maxInvestmentPerInvestor,
            minTotalInvestment,
            maxTotalInvestment,
            investmentDeadline,
            tokensInContract,
            ethInContract,
            getValidatedAddress(gateToken)
        )

        return deal
    }

    static async fetchAllDeals(): Promise<DealMetadata[]> {
        return await DatabaseService.getAllDealsMetadata()
    }

    static async invest(signer: Signer, dealData: Deal, ethToInvest: string) {
        const weiToInvest = ethers.utils.parseEther(ethToInvest.toString())
        console.log(weiToInvest.toString())
        const minWeiAmount = ethers.utils.parseEther(dealData.minInvestmentPerInvestor!)
        const maxWeiAmount = ethers.utils.parseEther(dealData.maxInvestmentPerInvestor!)

        let txn = await SmartContractService.invest(dealData.dealAddress!, signer, weiToInvest)
        return txn;
    }

    static async sendTokens(signer: Signer, dealData: Deal, amount: string) {
        return await SmartContractService.sendERC20Tokens(dealData.startupTokenAddress!, dealData.dealAddress!, signer, amount)
    }

    static async claimFunds(signer: Signer, dealData: Deal) {
        return await SmartContractService.claimFunds(dealData.dealAddress!, signer)
    }

    static async claimRefund(signer: Signer, dealData: Deal) {
        return await SmartContractService.claimRefund(dealData.dealAddress!, signer)
    }

    static async claimTokens(signer: Signer, dealData: Deal) {
        return await SmartContractService.claimTokens(dealData.dealAddress!, signer)
    }

    static async updateStartupToken(user: NetworkUser, 
                                    dealData: Deal, 
                                    newStartupTokenAddress: string, 
                                    newStartupTokenPrice: string) {

        // TODO: Update this

        // const newDeal = Deal.empty()
        // newDeal.ethPerToken = newStartupTokenPrice
        // newDeal.startupTokenAddress = newStartupTokenAddress
        // const exchangeRate = await getExchangeRateConfig(user, newStartupTokenPrice, "")
        
        // const signer = await SmartContractService.getSignerForNetworkUser(user)
        // if (exchangeRate && signer) {
        //     return await SmartContractService.updateProjectToken(dealData.dealAddress!, newStartupTokenAddress, exchangeRate, signer)
        // }
        
    }
}

// MARK: - Helpers

function getValidatedAddress(address: string): string | undefined {
    if (address === ethers.constants.AddressZero) {
        return undefined
    }
    return address
}

async function getTokensInContract(startupTokenAddress: string,
                                   contractAddress: string,
                                   provider: ethers.providers.Provider): Promise<string | undefined> {

    const decimals = await SmartContractService.getERC20Decimals(startupTokenAddress, provider)

    if (decimals === undefined) {
        return undefined
    }

    const tokenBitsInContract = await SmartContractService.getERC20Balance(startupTokenAddress, contractAddress, provider)

    if (tokenBitsInContract === undefined) {
        return undefined
    }
    const tokensInContract = ethers.utils.formatUnits(tokenBitsInContract, decimals)
    return tokensInContract
}

async function getEthPerTokenInContract(startupTokenAddress: string,
                                        tickSize: BigNumber,
                                        tickValue: BigNumber, 
                                        provider: ethers.providers.Provider): Promise<string | undefined> {
    if (startupTokenAddress === ethers.constants.AddressZero) {
        return undefined
    }

    const decimals = await SmartContractService.getERC20Decimals(startupTokenAddress, provider)
    if (decimals === undefined) {
        return undefined
    }

    const ethPerToken = getEthPerToken(tickSize, tickValue, decimals)

    return ethPerToken
}

function isInvalidAddress(address: any) {
    return address === undefined || address === ""
}



function getEthPerToken(tickSize: BigNumber, tickValue: BigNumber, tokenDecimals: number): string {
    const bigTickSize = new BigNumberJS(tickSize.toString())
    const bigTickValue = new BigNumberJS(tickValue.toString())
    const weiPerTokenBits = bigTickSize.dividedBy(bigTickValue)

    const multiplier = (new BigNumberJS(10)).exponentiatedBy(tokenDecimals - 18)

    const ethPerToken = weiPerTokenBits.multipliedBy(multiplier)
    return ethPerToken.toString()
}
