import User from "./User";
import Moralis from "moralis";

export default class NFTMetadata extends Moralis.Object {
    // TODO: change to private?
	constructor() {
        super('NFT')
    }

    static createNFTMetadata(
        address: string, 
        id: string
    )
    {
        let nftMetadata = new NFTMetadata()
        nftMetadata.set("address", address)
        nftMetadata.set("id", id)
        nftMetadata.set("dealAndInvestments", [])
        return nftMetadata
    }
}
Moralis.Object.registerSubclass('NFT', NFTMetadata)