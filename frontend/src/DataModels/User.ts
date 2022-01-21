import {ethers, Signer} from 'ethers';
import {Deal} from './DealData';
import PendingDeal from './PendingDeal';
import DealFactory from '../artifacts/contracts/PogDeal.sol/DealFactory.json'
import DealService from '../Services/DealService';
import DatabaseService from '../Services/DatabaseService'
import { ParticipantAddresses } from './DealConfig';
import DealMetadata from './DealMetadata';
import SmartContractService from '../Services/SmartContractService';
import Moralis from "../Services/MoralisService";

// Moralis.User is garbage that only the actual user can access...
export default class NetworkUser extends Moralis.Object {
    constructor() {
        super("NetworkUser")
    }

    static createUser(
        address: string, 
        username: string
       ): NetworkUser
    {
        let user = new NetworkUser()
        user.set("address", address)
        user.set("name", username)
        // TODO: add network e.g. Polygon, Eth, etc.

        user.set("dealsWhereProject", [])
        user.set("dealsWhereManager", [])
        // TODO: add verified status etc
        // Excluding the below since all investments will be NFT-associated for now
        // user.set("dealAndInvestments", [])
        user.set("pendingDealsCreated", [])
        return user
    }

    getAddress() {
        return SmartContractService.getChecksumAddress(this.get("ethAddress"))
    }

    async refresh() {
        await this.fetch();
    }

    async getDealsWhereProject() : Promise<DealMetadata[]> {
        await this.refresh()
        return this.get("dealsWhereProject")
    }

    // TODO: need to pass in list of NFTs to this function
    async getDealsWhereManager() : Promise<DealMetadata[]> {
        await this.refresh()
        return this.get("dealsWhereManager")
    }

    async getPendingDealsCreated() : Promise<PendingDeal[]> {
        await this.refresh()
        return this.get("pendingDealsCreated")
    }

    async getDealsWhereInvestor() : Promise<DealMetadata[]> {
        // TODO: Loop over NFTs and use NFTMetadata
        // @Ayan?
        return []
    }

    static empty(address?: string) {
        return NetworkUser.createUser((address === undefined ? "" : address), "")
    }

    static anonymous(address: string) {
        return NetworkUser.createUser(address, "anonymous")
    }
}
Moralis.Object.registerSubclass('NetworkUser', NetworkUser)
