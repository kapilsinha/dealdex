// Stuff here is just to help manually test, distinct from the automated tests in test/PogDealTest.ts

import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ERC20, Deal, DealFactory, SimpleToken, SimpleNFT } from "../typechain-types";
import helper from "../test/TestHelpers";
import DatabaseService from "../src/Services/DatabaseService";
import PendingDeal from "../src/DataModels/PendingDeal";
import { DealConfigStruct } from "../typechain-types/DealFactory";

import Moralis from '../src/Services/MoralisService';

class ManualTestHelper {
	dealFactory: DealFactory | undefined
	simpleToken: SimpleToken | undefined
	usdp: SimpleToken | undefined
	simpleNft: SimpleNFT | undefined
	accounts: SignerWithAddress[]

	constructor() {
		this.accounts = [];
	}

	async init() {
		const DeploymentState = Moralis.Object.extend("DeploymentState");
		const query = new Moralis.Query(DeploymentState);
	    const deploymentState : Moralis.Object = (await query.first())!;

		const Deal = await ethers.getContractFactory("Deal");
	    const DealFactory = await ethers.getContractFactory("DealFactory");
	    const SimpleToken = await ethers.getContractFactory("SimpleToken");
	    const SimpleNFT = await ethers.getContractFactory("SimpleToken");
	    
	    this.dealFactory = await DealFactory.attach(deploymentState.get("dealFactoryAddr")) as DealFactory;
	    this.simpleToken = await SimpleToken.attach(deploymentState.get("simpleTokenAddr")) as SimpleToken;
	    this.usdp = await SimpleToken.attach(deploymentState.get("usdpAddr")) as SimpleToken;
	    this.simpleNft = await SimpleNFT.attach(deploymentState.get("simpleNftAddr")) as SimpleNFT;

	    this.accounts = await ethers.getSigners();
	}

	async recordPendingDeal(dealConfig: DealConfigStruct) {
		let creatorAddress = "0xBb6354C590d49D8c81B2b86D3972dD0Be6976478"; // must match your ropsten account!!
		let investorPaymentToken = await this.usdp!.name();
		// TODO: likely need to convert to something readable via decimals function
		// let investorPaymentDecimals = await this.usdp!.decimals();
		let minInvestmentAmtPerInvestor = BigNumber.from(dealConfig.investConfig.sizeConstraints.minInvestmentPerInvestor).toNumber()
		let investmentDeadline = BigNumber.from(dealConfig.investConfig.investmentDeadline).toNumber()
		let creator = await DatabaseService.getUser(creatorAddress);
		let project = await DatabaseService.getUser(dealConfig.participantAddresses.project);
		let manager = await DatabaseService.getUser(dealConfig.participantAddresses.manager);
		if (creator === undefined || project === undefined || manager === undefined) {
			return false;
		}
		let pendingDeal = PendingDeal.createPendingDeal("dealName", creator, project, manager, investorPaymentToken, dealConfig.investConfig.gateToken, minInvestmentAmtPerInvestor, investmentDeadline);
		await pendingDeal.save();
		creator.add("pendingDealsCreated", pendingDeal);
		await creator.save();
	}

	async createDealHelper(manager: string, project: string) {
		let config = helper.createDealConfig(manager, project, this.simpleToken!, this.usdp!, this.simpleNft!);
		await this.recordPendingDeal(config);
		return await helper.createDeal(this.dealFactory!, config);
	}

	async createDeal() {
		return await this.createDealHelper(this.accounts[0].address, this.accounts[1].address);
	}

	async createKapDeal() {
		return await this.createDealHelper("0xBb6354C590d49D8c81B2b86D3972dD0Be6976478", "0xDA144333D1F0172963F2f0a20F9C4686E8829141");
	}

	async invest(dealAddr: string) {
		let nftId = BigNumber.from(1);
		return await helper.invest(dealAddr, BigNumber.from(10), nftId);
	}

	async claimRefund(dealAddr: string) {
		let nftId = BigNumber.from(1);
		return await helper.claimRefund(dealAddr, nftId);
	}
}

async function main() {
	let testHelper = new ManualTestHelper();
	await testHelper.init();
	// await testHelper.createKapDeal();
	// await testHelper.usdp!.approve("0x89dd52d42431544c95f5c16d916336a9b11796cf", BigNumber.from("10000000000000000"));
	// await testHelper.invest("0x89dd52d42431544c95f5c16d916336a9b11796cf");

	await testHelper.claimRefund("0x89dd52d42431544c95f5c16d916336a9b11796cf");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });