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
import NFTMetadata from "./NFTMetadata"

// Moralis.User is garbage that only the actual user can access...
export default class NetworkUser extends Moralis.Object {
    constructor() {
        super("NetworkUser")
    }

    getName(): string {
        return this.get("name")
    }

    getVerifiedStatus(): boolean {
        return Boolean(this.get("isVerified"))
    }

    getAddress(): string {
        return this.get("address")
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
        user.set("isVerified", false)
        return user
    }

    async refresh() {
        await this.fetch();
    }

    async updateName(newName: string) {
        this.set("name", newName)
        await this.save()
        await this.refresh()
    }

    async getDealsWhereProject() : Promise<DealMetadata[]> {
        await this.refresh()
        const dealsWhereProject = this.get("dealsWhereProject")

        const result = await Moralis.Object.fetchAllWithInclude(dealsWhereProject, ["manager", "project"])

        return result as DealMetadata[]
    }

    // TODO: need to pass in list of NFTs to this function
    async getDealsWhereManager() : Promise<DealMetadata[]> {
        await this.refresh()

        const dealsWhereManager = this.get("dealsWhereManager")

        try {
            const result = await Moralis.Object.fetchAllWithInclude(dealsWhereManager, ["manager", "project"])
            return result as DealMetadata[]
        } catch(error) {
            return []
        }
        
    }

    async getPendingDealsCreated() : Promise<PendingDeal[]> {
        await this.refresh()
        const pendingDealsCreated = this.get("pendingDealsCreated")

        try {
            const result = await Moralis.Object.fetchAllWithInclude(pendingDealsCreated, ["manager", "project"])
            return result as PendingDeal[]
        } catch(error) {
            return []
        }
        
    }

    async getInvestments(chainId: number) : Promise<{name: any; symbol: any; metadata: NFTMetadata}[]> {
        const options = { chain: "testnet", address: this.getAddress() };
        // @ts-ignore
        const result = await Moralis.Web3API.account.getNFTs(options)
        if (!result.result) {
            return []
        } 
        const primaryKeyToMetadata = result.result.reduce(function(map, obj) {
            const primaryKey = `${obj.token_address}_${obj.token_id}`
            map.set(primaryKey, obj)
            return map
        }, new Map<string, any>())
        const primaryKeys = Array.from(primaryKeyToMetadata.keys())
        const query = new Moralis.Query(NFTMetadata)
        query.containedIn("address_nftId", primaryKeys)

        const nfts = await query.find()
        const nftMetadata = nfts.map(val => {
            const obj = primaryKeyToMetadata.get(val.get("address_nftId"))
            return {name: obj.name, symbol: obj.symbol, metadata: val}
        })
        return nftMetadata
    }

    async getNftsForDeal(nftAddress?: string, chainId?: number) {
        if (!nftAddress) {
            return new Map<string, any>()
        }
        const options = { chain: "testnet", address: this.getAddress() };
        // @ts-ignore
        const result = await Moralis.Web3API.account.getNFTs(options)
        console.log(result)
        if (!result.result) {
            return new Map<string, any>()
        } 
        const resultFilteredByNftAddress = result.result.filter((nft) => {
            console.log(nft.token_address)
            console.log(nftAddress)
            return (nft.token_address.toLowerCase() == nftAddress.toLowerCase())
        })

        const primaryKeyToMetadata = resultFilteredByNftAddress.reduce(function(map, obj) {
            const primaryKey = `${obj.token_address}_${obj.token_id}`
            map.set(primaryKey, obj)
            return map
        }, new Map<string, any>())

        return primaryKeyToMetadata
    }

    static empty(address?: string) {
        return NetworkUser.createUser((address === undefined ? "" : address), "")
    }

    static anonymous(address: string) {
        return NetworkUser.createUser(address, "anonymous")
    }
}
Moralis.Object.registerSubclass('NetworkUser', NetworkUser)
