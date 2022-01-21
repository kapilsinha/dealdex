import Moralis from "../Services/MoralisService";

export default class NFTMetadata extends Moralis.Object {
	constructor() {
        super('NFT')
    }

    static createNFTMetadata(
        address: string, 
        nftId: string
    )
    {
        let nftMetadata = new NFTMetadata()
        nftMetadata.set("address", address)
        // id is a reserved keyword in Moralis, don't use it!
        nftMetadata.set("nftId", nftId)
        nftMetadata.set("dealAndInvestments", [])
        return nftMetadata
    }
}
Moralis.Object.registerSubclass('NFT', NFTMetadata)