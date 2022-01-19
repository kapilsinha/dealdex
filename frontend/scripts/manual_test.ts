// Stuff here is just to help manually test, distinct from the automated tests in test/PogDealTest.ts

import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ERC20, Deal, DealFactory, SimpleToken, SimpleNFT } from "../typechain-types";
import helper from "../test/TestHelpers";

import Moralis from 'moralis/node';
import moralisConfig from '../../secrets/moralisConfig.json';
Moralis.start({ serverUrl: moralisConfig.SERVER_URL, appId: moralisConfig.APP_ID });

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

	async createDeal() {
		return await helper.createDeal(this.dealFactory!, this.accounts[0].address, this.accounts[1].address, this.simpleToken!, this.usdp!, this.simpleNft!);
	}

	async createKapDeal() {
		return await helper.createDeal(this.dealFactory!, "0xBb6354C590d49D8c81B2b86D3972dD0Be6976478", "0xDA144333D1F0172963F2f0a20F9C4686E8829141", this.simpleToken!, this.usdp!, this.simpleNft!);
	}
}

async function main() {
	let testHelper = new ManualTestHelper();
	await testHelper.init();
	await testHelper.createKapDeal();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });