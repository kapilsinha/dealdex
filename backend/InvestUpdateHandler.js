Moralis.Cloud.afterSave("InvestUpdateSync_<dealAddress>", async (request) => {
	// 1. Update totalFunds on deal object
	// 2. Update nft object with investedAmt
	if (request.object.get("confirmed") === false) {
		return;
	}
	const dealQuery = new Moralis.Query("Deal");
	dealQuery.equalTo("address", request.object.get("address"));
	const deal = await dealQuery.first();
	if (deal === undefined) {
		logger.info("Error, failed to find deal with address " + request.object.get("address"));
		return;
	}
	deal.set("totalFunds", Number(request.object.get("totalFunds")))
	await deal.save()

	let nftAddress = deal.get("nftAddress");
	let nftId = request.object.get("nftId");

	const nftQuery = new Moralis.Query("NFT");
	nftQuery.equalTo("address", nftAddress);
	nftQuery.equalTo("nftId", nftId);

	let nft = await nftQuery.first().then(async function(result) {
        if (result === undefined) {
        	const NFT = Moralis.Object.extend("NFT");
            const newNft = new NFT();
            newNft.set("address", nftAddress);
			newNft.set("nftId", nftId);
			newNft.set("dealAndInvestments", []);
            return await newNft.save().then(
                (newNft) => { return newNft; },
                (error) => { logger.info("Unable to create NFT", error); return undefined; }
            );
        }
        return result;
    });
	let dealInvestment = {deal: deal, investedAmt: request.object.get("investedAmt")};
	nft.add("dealAndInvestments", dealInvestment);
	await nft.save();
	logger.info("Updated investments for deal " + request.object.get("address") + " and NFT id " + nftId);
});