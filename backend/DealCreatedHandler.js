Moralis.Cloud.afterSave("DealCreatedSync", async (request) => {
	if (request.object.get("confirmed") === undefined || request.object.get("confirmed") === false) {
		// Write txnHash to pending deal object
		const creatorQuery = new Moralis.Query("NetworkUser");
		creatorQuery.equalTo("address", request.object.get("creator"));
		const creatorUser = await creatorQuery.first();
		if (creatorUser === undefined) {
			logger.info("Error, deal will not be saved to db! Failed to find creator user upon deal creation")
			return;
		}

		const projectQuery = new Moralis.Query("NetworkUser");
		projectQuery.equalTo("address", request.object.get("project"));
		const projectUser = await projectQuery.first();
		if (projectUser === undefined) {
			logger.info("Error, deal will not be saved to db! Failed to find project user upon deal creation")
			return;
		}

		const query = new Moralis.Query("PendingDeal");
		query.equalTo("creator", creatorUser);
		query.equalTo("project", projectUser);
		const pendingDeal = await query.first();
		if (pendingDeal === undefined) {
			logger.info("Error, deal will not be saved to db! Failed to find pending deal by creator, project upon deal creation")
			return;
		}
		pendingDeal.set("txnHash", request.object.get("transaction_hash"));
		logger.info("Updated pending deal with txnHash " + request.object.get("transaction_hash"));
		await pendingDeal.save();
	}
	if (request.object.get("confirmed") === undefined || request.object.get("confirmed") === true) {
		// 1. Copy data from pending deal (lookup via txnHash) to new deal object
		// 2. Update creator's pendingDealsCreated, project's dealsWhereProject, manager's dealsWhereManager
		// 3. Delete old pending deal objecg
		// 4. Add a new watchContractEvent function for this new deal address
		const query = new Moralis.Query("PendingDeal");
		query.equalTo("txnHash", request.object.get("transaction_hash"));
		const pendingDeal = await query.first();
		if (pendingDeal === undefined) {
			logger.info("Error, deal will not be saved to db! Failed to find pending deal by txnHash upon deal creation")
			return;
		}

		const DealMetadata = Moralis.Object.extend("Deal");
		const dealMetadata = new DealMetadata();
		// Copy fields from PendingDeal
		let copyFields = ["name", "creator", "txnHash", "project", "manager", "investorPaymentToken", "nftAddress", "minInvestmentAmt", "investmentDeadline"];
		for (const field of copyFields) {
			dealMetadata.set(field, pendingDeal.get(field));
		}
		// Add new fields from the smart contract event
		dealMetadata.set("address", request.object.get("dealAddress"));
		dealMetadata.set("totalFunds", 0);
		await dealMetadata.save();

		let creatorUser = dealMetadata.get("creator");
		creatorUser.remove("pendingDealsCreated", pendingDeal);
		await creatorUser.save();

		let projectUser = dealMetadata.get("project");
		projectUser.add("dealsWhereProject", dealMetadata)
		await projectUser.save();

		let managerUser = dealMetadata.get("manager");
		managerUser.add("dealsWhereManager", dealMetadata);
		await managerUser.save();

		await pendingDeal.destroy();

		// Hard-coding Ropsten chainId here. Needs to be made dynamic...
		let options = {
		    "chainId": "0x3",
		    "address": request.object.get("dealAddress"),
		    "topic": "InvestUpdate(address,uint256,uint256,uint256)",
		    "abi": {
		      "anonymous": false,
		      "inputs": [
		        { "indexed": true,  "internalType": "address", "name": "investor",    "type": "address" },
		        { "indexed": true,  "internalType": "uint256", "name": "nftId",       "type": "uint256" },
		        { "indexed": false, "internalType": "uint256", "name": "investedAmt", "type": "uint256" },
		        { "indexed": false, "internalType": "uint256", "name": "totalFunds",  "type": "uint256" }
		      ],
		      "name": "InvestUpdate",
		      "type": "event"
		    },
		    "tableName": "InvestUpdateSync_" + request.object.get("dealAddress"),
		    "sync_historical": false
		}

		await Moralis.Cloud.run("watchContractEvent", options, {useMasterKey:true});
		logger.info("Processed creation of new deal with address " + request.object.get("dealAddress"));
	}
});