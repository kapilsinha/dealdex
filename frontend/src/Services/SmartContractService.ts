// artifacts directory is generated when you run 
// npx hardhat compile
// in the commandline
// compile target directory is defined in hardhat.config.js
import DealFactory from '../artifacts/contracts/PogDeal.sol/DealFactory.json'
import Deal from '../artifacts/contracts/PogDeal.sol/Deal.json'
import ERC20_ABI from "../ContractABIs/ERC20.json"
import NetworkUser from "../DataModels/User"
import {ethers, BigNumber, Signer, providers } from 'ethers';

import {DealConfig, ExchangeRate} from "../DataModels/DealConfig"
import DatabaseService from "./DatabaseService"
import Moralis from "./MoralisService"

export default class SmartContractService {
    /* Modify the blockchain */
    static async createDeal(dealFactoryAddress: string, signer: ethers.Signer, dealConfig: DealConfig) {
        const contract = new ethers.Contract(dealFactoryAddress, DealFactory.abi, signer)

        let smartContractInput = dealConfig.toSmartContractInput()
        // If you get this error:
        // "Unhandled Rejection (Error): invalid ENS name (argument="name", value=0, code=INVALID_ARGUMENT, version=providers/5.4.4)"
        // it means something in the argument is malformatted e.g. gateToken is 0 instead of ethers.constants.AddressZero :/
        const txn = await makeSafe(contract.createDeal)(smartContractInput);

        return txn
    }

    static async invest(dealContractAddress: string, paymentTokenAddress: string, tokenBitsToInvest: BigNumber, nftId: number, user: Moralis.User) {
        const signer = await SmartContractService.getSignerForUser(user)

        if (!signer) {
            return {error: "Invalid signer"}
        }
        const contract = new ethers.Contract(dealContractAddress, Deal.abi, signer)
        const paymentTokenContract = new ethers.Contract(paymentTokenAddress, ERC20_ABI, signer)

        let approveTxn = await makeSafe(paymentTokenContract.approve)(dealContractAddress, tokenBitsToInvest)

        if (approveTxn.error) {
            return approveTxn
        }
        
        let txn = await makeSafe(contract.invest)(tokenBitsToInvest, nftId);

        return txn
    }

    static async claimFunds(dealContractAddress: string, signer: ethers.Signer) {
        const contract = new ethers.Contract(dealContractAddress, Deal.abi, signer)
        let txn = await makeSafe(contract.claimFunds)();
        return txn
    }

    static async claimRefund(dealContractAddress: string, nftId: number, user: Moralis.User) {
        const signer = await SmartContractService.getSignerForUser(user)

        if (!signer) {
            return {error: "Invalid signer"}
        }

        const contract = new ethers.Contract(dealContractAddress, Deal.abi, signer)
        let txn = await makeSafe(contract.claimRefund)(nftId);
        return txn
    }

    static async claimTokens(dealContractAddress: string, nftId: number, user: Moralis.User) {
        const signer = await SmartContractService.getSignerForUser(user)

        if (!signer) {
            return {error: "Invalid signer"}
        }
        const contract = new ethers.Contract(dealContractAddress, Deal.abi, signer)
        let txn = await makeSafe(contract.claimTokens)(nftId);
        return txn
    }

    static async updateProjectToken(dealContractAddress: string, newToken: String, exchangeRate: ExchangeRate, signer: ethers.Signer) {
        const contract = new ethers.Contract(dealContractAddress, Deal.abi, signer)
        let tickDetails = exchangeRate.toSmartContractInput()
        let txn = await makeSafe(contract.setStartupToken)(newToken, tickDetails);
        return txn
    }

    static async sendERC20Tokens(erc20TokenAddress: string, dealContractAddress: string, signer: ethers.Signer, amount: string) {
        const tokenContract = new ethers.Contract(erc20TokenAddress, ERC20_ABI, signer)
        const decimals = await tokenContract.decimals()
        let amountNum = Number(amount) * 10**decimals;
        if (amountNum === 0) {
            return {error: "Can only send a positive number of tokens"};
        }
        const finalAmount = BigNumber.from(amountNum.toString())
        console.log(finalAmount)
        let result = await makeSafe(tokenContract.transfer)(dealContractAddress, finalAmount);
        return result
    }

    static async getDealAddressFromTransactionHash(transactionHash: string, 
                                                    dealCreator: string,
                                                    provider: providers.Provider): Promise<string | undefined> {
        let receipt = await provider.getTransactionReceipt(transactionHash)
        if (!receipt) {
            return undefined
        }
        const dealFactoryAddress = await DatabaseService.getDealFactoryAddress()
        if (dealFactoryAddress === undefined) {
            return undefined
        }
        const contract = new ethers.Contract(dealFactoryAddress!, DealFactory.abi, provider)

        const filter = contract.filters.DealCreated(dealCreator);
        const events = await contract.queryFilter(filter, receipt.blockHash)

        for (let eventData of events) {
            if (eventData.event == "DealCreated") {
                console.log(eventData.args)

                // index 0 is the address of the deal creator 
                let dealAddress = (eventData as any).args[1]
                return dealAddress
            }
        }
        return undefined
    }

    /* Read the blockchain */
    static async fetchDealConfig(dealAddress: string, chainId: number) {
        const provider = await getProviderForChainId(chainId)
        const contract = new ethers.Contract(dealAddress, Deal.abi, provider)
        const result = await contract.config()
        return result
    }

    static async fetchDealIsLocked(dealAddress: string, chainId: number) {
        const provider = await getProviderForChainId(chainId)
        const contract = new ethers.Contract(dealAddress, Deal.abi, provider)
        const result = await contract.isLocked()
        return result
    }

    static async fetchSubscribedInvestors(dealAddress: string, chainId: number) {
        const provider = await getProviderForChainId(chainId)
        const contract = new ethers.Contract(dealAddress, Deal.abi, provider)
        const result =  await contract.getInvestors()
        return result
    }

    static async fetchDealTotalInvestmentReceived(dealAddress: string, chainId: number) {
        const provider = await getProviderForChainId(chainId)
        const contract = new ethers.Contract(dealAddress, Deal.abi, provider)
        const result = await contract.totalReceivedInvestment()
        return result
    }

    static async getERC20Decimals(erc20TokenAddress: string, provider: providers.Provider | ethers.Signer): Promise<number | undefined> {
        if (erc20TokenAddress === ethers.constants.AddressZero) {
            return undefined
        } 

        const tokenContract = new ethers.Contract(erc20TokenAddress, ERC20_ABI, provider)
        const decimals = await tokenContract.decimals()
        return decimals
    }

    static async getERC20Balance(erc20TokenAddress: string, walletAddress: string, provider: providers.Provider | ethers.Signer): Promise<BigNumber | undefined> {
        if (erc20TokenAddress === ethers.constants.AddressZero) {
            return undefined
        } 

        const tokenContract = new ethers.Contract(erc20TokenAddress, ERC20_ABI, provider)
        const balance = await tokenContract.balanceOf(walletAddress)
        return balance
    }

    static async getERC20Metadata(erc20TokenAddress: string, chainId: number) {
        if (erc20TokenAddress === ethers.constants.AddressZero) {
            console.log("token address is AddressZero")
            return undefined
        } 

        const provider = await getProviderForChainId(chainId)

        try {
            const tokenContract = new ethers.Contract(erc20TokenAddress, ERC20_ABI, provider)
            const name = (await tokenContract.name()) as string
            const symbol = (await tokenContract.symbol()) as string
            const decimals = (await tokenContract.decimals()) as number
            return {name, symbol, decimals}
        } catch(err) {
            console.log(err)
            return undefined
        }
    }

    static async getNFTMetadata(nftAddress: string, chainId: number) {
        if (nftAddress === ethers.constants.AddressZero) {
            return undefined
        } 

        const provider = await getProviderForChainId(chainId)

        try {
            const tokenContract = new ethers.Contract(nftAddress, ERC20_ABI, provider)
            const name = await tokenContract.name()
            const symbol = await tokenContract.symbol()
            return {name, symbol}
        } catch(err) {
            return undefined
        }
    }

    static getChecksumAddress(address: string) {
        try {
            return ethers.utils.getAddress(address)
        } catch(error) {
            return undefined
        }
    }

    static async getWeiBalance(walletAddress: string, provider: providers.Provider | ethers.Signer) {
        const balance = await provider.getBalance(walletAddress)
        return balance
    }

    /* Signers and Providers */

    static async getSignerForUser(user: Moralis.User): Promise<ethers.Signer | undefined> {

        let anyWindow = window as any

        if (anyWindow.ethereum) {
            const provider = new ethers.providers.Web3Provider(anyWindow.ethereum)
            const signer = provider.getSigner()
            let signerAddress = await signer.getAddress()
            if (signerAddress == SmartContractService.getChecksumAddress(user.get("ethAddress"))) {
                return signer
            } else {
                return undefined
            }
        } else {
            console.log("err2")
            return undefined
        }

        
    }

}


/* Helpers */

async function getProviderForChainId(chainId: number) {

    const eth = (window as any).ethereum
    if (eth) {
        const walletProvider = new ethers.providers.Web3Provider(eth)
        const walletNetwork = await walletProvider.getNetwork()
        if (walletNetwork.chainId == chainId || chainId == 1337) {
            return walletProvider
        } else {
            return ethers.getDefaultProvider(chainId)
        }
    }

}


function getErrMsg(err: string) {
    let errorRegex = /Error: VM Exception while processing transaction: reverted with reason string '(.*)'/;
    let matches = err.match(errorRegex) || [];
    return matches.length == 2 ? matches[1] : err;
}

function makeSafe(fn: any) {
    return async function(this: any, ...args: any[]) {
        try {
            return await fn.apply(this, args);
        } catch (ex : any) {
            let suberr = ex.data || ex;
            const errMsg = getErrMsg(suberr.message.toString());
            return {error: errMsg};
        }
    }
}