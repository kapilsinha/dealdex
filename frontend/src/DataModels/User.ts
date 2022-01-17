import {ethers, Signer} from 'ethers';
import {Deal} from './DealData';
import PendingDeal from './PendingDeal';
import DealFactory from '../artifacts/contracts/PogDeal.sol/DealFactory.json'
import DealService from '../Services/DealService';
import DatabaseService from '../Services/DatabaseService'
import { ParticipantAddresses } from './DealConfig';
import DealMetadata from './DealMetadata';
import SmartContractService from '../Services/SmartContractService';
import Moralis from "moralis";

export default class User extends Moralis.User {
    // TODO: Can I make this private?
    constructor(attrs: Object) {
        super(attrs)
    }

    static createUser(
        address: string, 
        username: string
       )
    {
        let user = new User({
            address: address,
            username: username
        })
        user.set("dealsWhereProject", [])
        user.set("dealsWhereManager", [])
        // TODO: add verified status etc
        user.set("dealAndInvestments", [])
        user.set("pendingDealsCreated", [])
        return user
    }

    async refresh() {
        await this.fetch();
    }

    async getDealsWhereProject() {
        return []
        // TODO: reinstate after pulling in changes
        /*
        let result: Deal[] = []
        await this.refresh()

        let deals = this.get("dealsWhereProject")
        for(let dealAddress of dealAddresses) {
            let deal = Deal.empty()
            deal.dealAddress = dealAddress
            // Below function call updates the deal variable
            await DealService.initWithFirebase(deal)
            result.push(deal)
        }
        */
    }

    /*
    async getPendingDealsWhereStartup() {
        let result: PendingDeal[] = []
        await this.refresh()

        let pendingDeals: PendingDeal[] = this.get("pendingDealsWhereStartup")
        // We do NOT fetch/refresh each pendingDeal because those should never change
        // (just the list should grow or shrink)
        for(let transactionHash in pendingDeals) {
            let name = pendingDeals[transactionHash]['name']
            let startupAddress = pendingDeals[transactionHash]['startupAddress']
            let deal = new PendingDeal(name, startupAddress, transactionHash)
            result.push(deal)
            resolvePendingDeal(deal, this.address, name)
        }
        return result
    }
    */

    // TODO: need to pass in list of NFTs to this function
    async getDealsWhereInvestor() {
        return []
        // TODO: reinstate after pulling in changes
        /*
        let result: Deal[] = []
        let user = await DatabaseService.getUser(this.address)
        if (user !== undefined && user.dealsWhereInvestor !== undefined) {
            let addresses = user.dealsWhereInvestor
            for(var address of addresses) {
                let deal = Deal.empty()
                deal.dealAddress = address
                await DealService.initWithFirebase(deal)
                result.push(deal)
            }
        } 
        return result
        */
    }

    /*
    async getPendingDealsWhereInvestor() {
        let result: PendingDeal[] = []
        let user = await DatabaseService.getUser(this.address)
        if (user !== undefined && user.pendingDealsWhereInvestor !== undefined) {
            let pendingDeals: any = user.pendingDealsWhereInvestor
            for(let transactionHash in pendingDeals) {
                let name = pendingDeals[transactionHash]['name']
                let startupAddress = pendingDeals[transactionHash]['startupAddress']
                let deal = new PendingDeal(name, startupAddress, transactionHash)
                result.push(deal)
                resolvePendingDeal(deal, this.address, name)
            }
        } 
        return result
    }
    */

    static empty(address?: string) {
        return User.createUser((address === undefined ? "" : address), "")
    }

    static anonymous(address: string) {
        return User.createUser(address, "anonymous")
    }
}
Moralis.Object.registerSubclass('_User', User)

// Helpers

/*
async function resolvePendingDeal(dealData: PendingDeal, creatorAddress: string, dealName: string) {

    let transactionHash = dealData.transactionHash
    let startupAddress = dealData.startupAddress
    let ethereum: any = (window as any).ethereum
    if (!ethereum) {
        console.log("No Ethereum wallet in browser")
        return
    }
    const provider = new ethers.providers.Web3Provider(ethereum)

    let dealAddress = await SmartContractService.getDealAddressFromTransactionHash(transactionHash, creatorAddress, provider)
        
    if (dealAddress === undefined) {
        return
    } else {
        let dealParticipants = new ParticipantAddresses(creatorAddress, startupAddress, undefined)
        await DatabaseService.recordDeal(
            new ParticipantAddresses(creatorAddress, startupAddress, undefined),
            new DealMetadata(dealName, dealAddress)
        )

        // TODO: this should be done by Moralis backend
        // await DatabaseService.removePendingDealRecord(transactionHash)
    }
}
*/
