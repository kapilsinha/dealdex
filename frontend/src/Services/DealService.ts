import {ethers, BigNumber, Signer, providers } from 'ethers';
import {BigNumber as BigNumberJS} from "bignumber.js"
import User from '../DataModels/User';
import {Deal} from '../DataModels/DealData'
import {DealConfig, ParticipantAddresses, ExchangeRate, InvestConfig, RefundConfig, ClaimTokensConfig, ClaimFundsConfig, VestingSchedule} from '../DataModels/DealConfig'
import SmartContractService from "./SmartContractService"


import DatabaseService from './DatabaseService';
import DealMetadata from '../DataModels/DealMetadata';


export default class DealService {

    static async publishDeal(dealData: Deal, user: User) { 
        let signer = await SmartContractService.getSignerForUser(user)       
        const creatorAddress = await signer!.getAddress()
        const startupAddress = dealData.startup.get("address")
        

        const minWeiPerInvestor = ethers.utils.parseEther(dealData.minInvestmentPerInvestor!.toString())
        const maxWeiPerInvestor = ethers.utils.parseEther(dealData.maxInvestmentPerInvestor!.toString()) 

        const minTotalWei = ethers.utils.parseEther(dealData.minTotalInvestment!.toString())
        const maxTotalWei = ethers.utils.parseEther(dealData.maxTotalInvestment!.toString())

        const deadlineUnixTimestamp = Math.round( 
            dealData.investmentDeadline!.getTime() / 1000
        )
        const deadline = BigNumber.from(deadlineUnixTimestamp.toString())

        const gateToken = dealData.gateToken

        let participantAddresses = new ParticipantAddresses(dealData.dealdexAddress, dealData.managerAddress, startupAddress)
        let exchangeRateConfig = await getTickDetailsConfig(dealData, user)
        let investConfig = new InvestConfig(minWeiPerInvestor, maxWeiPerInvestor, minTotalWei, maxTotalWei, gateToken, deadline, dealData.investmentTokenAddress, dealData.investmentKeyType)
        let refundConfig = new RefundConfig(true) // just arbitrarily always allow refunds
        let claimTokensConfig = new ClaimTokensConfig(dealData.startupTokenAddress, dealData.dealdexFeeBps, dealData.managerFeeBps)
        let claimFundsConfig = new ClaimFundsConfig(dealData.dealdexFeeBps, dealData.managerFeeBps)
        let vestingSchedule = new VestingSchedule(dealData.vestingStrategy, dealData.vestingBps, dealData.vestingTimestamps)

        let dealConfig = new DealConfig(
            participantAddresses,
            exchangeRateConfig,
            investConfig,
            refundConfig,
            claimTokensConfig,
            claimFundsConfig,
            vestingSchedule
        )

        const dealFactoryAddress = await DatabaseService.getDealFactoryAddress()

        if (dealFactoryAddress === undefined) {
            console.log("Error: unable to find deal factory")
            return
        }

        let txn = await SmartContractService.createDeal(dealFactoryAddress!, signer!, dealConfig)
        /// TODO: This should be done in Moralis backend
        // if (txn.error == null) {
        //     await DatabaseService.recordPendingDeal(
        //         user,
        //         dealConfig,
        //         new DealMetadata(dealData.get("name")!),
        //         txn.hash
        //     )
        // }
        return txn;
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

        let project = await DatabaseService.getUser(startupAddress) || User.empty(startupAddress)
        let investors = investorAddresses.map(async function(investorAddress: string, index: Number){
            return await DatabaseService.getUser(investorAddress) || User.empty(investorAddress)
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
        // TODO: This should be handled in the Moralis backend
        // if (txn.error == null) {
        //     const address = await signer.getAddress();
        //     await DatabaseService.recordInvestment(address, dealData.dealAddress!)
        // }
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

    static async updateStartupToken(user: User, 
                                    dealData: Deal, 
                                    newStartupTokenAddress: string, 
                                    newStartupTokenPrice: string) {
        const newDeal = Deal.empty()
        newDeal.ethPerToken = newStartupTokenPrice
        newDeal.startupTokenAddress = newStartupTokenAddress
        const exchangeRate = await getTickDetailsConfig(newDeal, user)

        const signer = await SmartContractService.getSignerForUser(user)
        return await SmartContractService.updateProjectToken(dealData.dealAddress!, newStartupTokenAddress, exchangeRate, signer!)
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


// tickSize is in wei. tickValue is in tokenBits.
async function getTickDetailsConfig(dealData: Deal, user: User): Promise<ExchangeRate> {
    let startupTokenAddress = dealData.startupTokenAddress

    if (isInvalidAddress(dealData.startupTokenAddress)) {
        return ExchangeRate.undefined()
    }

    if (dealData.ethPerToken === undefined) {
        return ExchangeRate.undefined()
    }

    let signer = await SmartContractService.getSignerForUser(user)
    const decimals = await SmartContractService.getERC20Decimals(startupTokenAddress!, signer!)

    if (decimals === undefined) {
        return ExchangeRate.undefined()
    }
    let result = new ExchangeRate(dealData.ethPerToken, decimals)
    return result
}


function getEthPerToken(tickSize: BigNumber, tickValue: BigNumber, tokenDecimals: number): string {
    const bigTickSize = new BigNumberJS(tickSize.toString())
    const bigTickValue = new BigNumberJS(tickValue.toString())
    const weiPerTokenBits = bigTickSize.dividedBy(bigTickValue)

    const multiplier = (new BigNumberJS(10)).exponentiatedBy(tokenDecimals - 18)

    const ethPerToken = weiPerTokenBits.multipliedBy(multiplier)
    return ethPerToken.toString()
}
