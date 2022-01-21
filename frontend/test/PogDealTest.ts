import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ERC20, Deal, DealFactory, SimpleToken, SimpleNFT } from "../typechain-types"
import helper from "./TestHelpers";

// https://hardhat.org/tutorial/testing-contracts.html

// `describe` is a Mocha function that allows you to organize your tests. It's
// not actually needed, but having your tests organized makes debugging them
// easier. All Mocha functions are available in the global scope.

// `describe` receives the name of a section of your test suite, and a callback.
// The callback must define the tests of that section. This callback can't be
// an async function.
describe("PogDeal contract", function () {
  // Mocha has four functions that let you hook into the the test runner's
  // lifecyle. These are: `before`, `beforeEach`, `after`, `afterEach`.

  // They're very useful to setup the environment for tests, and to clean it
  // up after they run.

  // A common pattern is to declare some variables, and assign them in the
  // `before` and `beforeEach` callbacks.

  let ZDeal;
  let ZDealFactory;
  let ZSimpleToken;
  let ZSimpleNFT;
  let deal: Deal;
  let dealFactory: DealFactory;
  let simpleToken: SimpleToken;
  let simpleToken2: SimpleToken;
  let simpleNft: SimpleNFT;
  let accounts: SignerWithAddress[];
  let dealdexAddress = "0xBb6354C590d49D8c81B2b86D3972dD0Be6976478";
  let simpleTokenSupply = 10000;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {

    ZDeal = await ethers.getContractFactory("Deal");
    ZDealFactory = await ethers.getContractFactory("DealFactory");
    ZSimpleToken = await ethers.getContractFactory("SimpleToken");
    ZSimpleNFT = await ethers.getContractFactory("SimpleNFT");

    deal = await ZDeal.deploy() as Deal;
    await deal.deployed();

    dealFactory = await upgrades.deployProxy(ZDealFactory, [deal.address, dealdexAddress], { initializer: 'initialize' }) as DealFactory;
    await dealFactory.deployed();

    simpleToken = await ZSimpleToken.deploy("Simple Token", "SMPL", simpleTokenSupply) as SimpleToken;
    await simpleToken.deployed();
    simpleToken2 = await ZSimpleToken.deploy("Yeesong", "YOOO", simpleTokenSupply) as SimpleToken;
    await simpleToken2.deployed();

    accounts = await ethers.getSigners();
    
    let equalSplitAmount = simpleTokenSupply / accounts.length;
    for (const account of accounts) {
        await simpleToken.transfer(account.address, BigInt(equalSplitAmount * Math.pow(10, 18)));
        await simpleToken2.transfer(account.address, BigInt(equalSplitAmount * Math.pow(10, 18)));
    }

    simpleNft = await ZSimpleNFT.deploy("Simple NFT", "SNFT", 100) as SimpleNFT;
    await simpleNft.deployed();
    const sender = accounts[0];
    for (const [tokenId, account] of accounts.slice(1,).entries()) {
        await simpleNft.transferFrom(sender.address, account.address, tokenId + 1);
    }
  });

  describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.

    // If the callback function is async, Mocha will `await` it.

    it("Should assign an equal split of tokens to all accounts", async function () {
      for (const token of [simpleToken, simpleToken2]) {
        const totalSupply = await token.totalSupply();
        const expectedBalance = totalSupply.div(accounts.length);
        for (const account of accounts) {
          const ownerBalance = await token.balanceOf(account.address);
          expect(expectedBalance).to.equal(ownerBalance);
        }
      }
    });
  });

  describe("Create dummy deal", function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.

    // If the callback function is async, Mocha will `await` it.

    it("Should create a deal", async function () {
      let dealConfig = helper.createDealConfig(accounts[0].address, accounts[1].address, simpleToken, simpleToken2, simpleNft);
      await helper.createDeal(dealFactory, dealConfig);
    });
  });
/*
  // TODO: Test 1 SMPL < 1 eth and 1 SMPL > 1 eth
  describe("Create Deal", function () {
    let expiryDate = 0;
    it("Should create a deal with 1 SMPL = 1 eth", async function() {
        let startup = accounts[1].address;
        let tickSize = BigNumber.from("1");
        let tickValue = BigNumber.from("1")
        let minInvestment = BigNumber.from("1");
        let maxInvestment = BigNumber.from("10");

        await helper.createAndValidateDeal(
          dealFactory,
          simpleToken,
          tickSize,
          tickValue,
          minInvestment,
          maxInvestment,
          startup,
          expiryDate
        )
    });
    it("Should create three identical deals with 1 SMPL = 1 eth", async function() {
      let startup = accounts[1].address;
      let tickSize = BigNumber.from("1");
      let tickValue = BigNumber.from("1")
      let minInvestment = BigNumber.from("1");
      let maxInvestment = BigNumber.from("10");

      for (let i = 0; i < 3; i++) {
        await helper.createAndValidateDeal(
          dealFactory,
          simpleToken,
          tickSize,
          tickValue,
          minInvestment,
          maxInvestment,
          startup,
          expiryDate
        )
      }
    });
  });
   
  // TODO: Test case where contractInvestment doesn't divide evenly i.e. some money gets stuck on the contract
  describe("Invest and Transfer Coins", function () {

    
    let minInvestment = BigNumber.from("1");
    let maxInvestment = BigNumber.from("10");

    let expiryDate = 0;
    let startupToken = simpleToken2;
    let investors; let investorAddresses; 
    let startup; let startupAddress;
    let initialBalance; // assumes deployment set the same number of tokens for each person for simpleToken and simpleToken2

    beforeEach(async function () {
        startupToken = simpleToken2;
        startup = accounts[19]; startupAddress = startup.address;
        initialBalance = await simpleToken2.balanceOf(startupAddress);
    });
    it("End to end test where 1 SMPL = 1 ETH", async function() {
        investors = [accounts[0]]; investorAddresses = investors.map(acct => acct.address);
        let startupTokensToSend = BigNumber.from("100")
        let ethToInvest = BigNumber.from("5")
        let tickSize = BigNumber.from("1");
        let tickValue = BigNumber.from("1")

        let newDeal = await helper.createDeal(
          dealFactory,
          startupToken,
          tickSize,
          tickValue,
          minInvestment,
          maxInvestment,
          startupAddress,
          expiryDate
        )

        await helper.sendTokens(newDeal, startup, startupToken, startupTokensToSend)

        await helper.validateDeal(
          newDeal,
          BigNumber.from("0"),
          startupTokensToSend,
          startupToken,
          tickSize,
          tickValue,
          minInvestment,
          maxInvestment,
          startupAddress,
          [],
          expiryDate
        )

        await helper.invest(newDeal, investors[0], ethToInvest)

        var startupTokensSentByContract = ethToInvest.mul(tickValue).div(tickSize)
        var expectedStartupTokens = startupTokensToSend.sub(startupTokensSentByContract)
        await helper.validateDeal(
          newDeal,
          ethToInvest,
          expectedStartupTokens,
          startupToken,
          tickSize,
          tickValue,
          minInvestment,
          maxInvestment,
          startupAddress,
          [investors[0].address],
          expiryDate
        )

        await helper.claimProceeds(newDeal, startup)

        await helper.validateDeal(
          newDeal,
          BigNumber.from("0"),
          expectedStartupTokens,
          startupToken,
          tickSize,
          tickValue,
          minInvestment,
          maxInvestment,
          startupAddress,
          [investors[0].address],
          expiryDate
        )

    });
    it("Invest eth in deal where 1 SMPL = 0.43 ETH", async function() {
      investors = [accounts[0]]; investorAddresses = investors.map(acct => acct.address);
      let startupTokensToSend = BigNumber.from("100")
      let ethToInvest = BigNumber.from("5")
      let tickSize = BigNumber.from("100");
      let tickValue = BigNumber.from("43")

      let newDeal = await helper.createDeal(
        dealFactory,
        startupToken,
        tickSize,
        tickValue,
        minInvestment,
        maxInvestment,
        startupAddress,
        expiryDate
      )

      await helper.sendTokens(newDeal, startup, startupToken, startupTokensToSend)

      await helper.validateDeal(
        newDeal,
        BigNumber.from("0"),
        startupTokensToSend,
        startupToken,
        tickSize,
        tickValue,
        minInvestment,
        maxInvestment,
        startupAddress,
        [],
        expiryDate
      )

      await helper.invest(newDeal, investors[0], ethToInvest)

      var startupTokensSentByContract = ethToInvest.toNumber() * tickValue.toNumber() / tickSize.toNumber() 
      var expectedStartupTokens = startupTokensToSend.toNumber() - startupTokensSentByContract
      
      await helper.validateDeal(
        newDeal,
        ethToInvest,
        expectedStartupTokens,
        startupToken,
        tickSize,
        tickValue,
        minInvestment,
        maxInvestment,
        startupAddress,
        [investors[0].address],
        expiryDate
      )
    });
  });
  */
});
