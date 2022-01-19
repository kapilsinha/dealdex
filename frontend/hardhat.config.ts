// These includes are needed to add to the Hardhat object
// e.g. to use hre.upgrades in deploy script
import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import '@openzeppelin/hardhat-upgrades';

import 'hardhat-contract-sizer';
import { task } from "hardhat/config";
import Moralis from 'moralis/node';
import moralisConfig from '../secrets/moralisConfig.json';

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("getState", "Prints state of current deals", async(taskArgs, hre) => {
    const fs = require('fs');
    const contractAddressesPath = hre.config.paths.artifacts + "/deployment-info/DeploymentState.json";
    if (!fs.existsSync(contractAddressesPath)) {
        console.log("File not found:", contractAddressesPath);
        console.log("Please deploy contracts!");
        return;
    }

    let contractAddresses = JSON.parse(fs.readFileSync(contractAddressesPath));

    const Deal = await hre.ethers.getContractFactory("Deal");
    const DealFactory = await hre.ethers.getContractFactory("DealFactory");
    const SimpleToken = await hre.ethers.getContractFactory("SimpleToken");
    const SimpleNFT = await hre.ethers.getContractFactory("SimpleToken");
    let dealFactory = await DealFactory.attach(contractAddresses.DealFactory);
    let simpleToken = await SimpleToken.attach(contractAddresses.SimpleToken);
    let usdp = await SimpleToken.attach(contractAddresses.USDP);
    let simpleNft = await SimpleNFT.attach(contractAddresses.SimpleNFT);
   
    return {"contractAddresses": contractAddresses,
            "dealFactory": dealFactory,
            "simpleToken": simpleToken,
            "usdp": usdp,
            "simpleNft": simpleNft};
});

task("printState", "Prints state of current deals", async(taskArgs, hre) => {
    let state = await hre.run("getState");
    console.log("Initial deployed contracts:", state.contractAddresses);

    const accounts = await hre.ethers.getSigners();
    for (const account of accounts) {
        let balance = parseInt(await state.simpleToken.balanceOf(account.address));
        console.log("Account=" + account.address, "==>", "Simple Token Balance=" + balance);
    }
});

task("printDealState", "Prints state of current deal")
    .addParam("address", "The deal's contract address")
    .setAction(async (taskArgs, hre) => {
    let state = await hre.run("getState");
    const SimpleToken = await hre.ethers.getContractFactory("SimpleToken");

    const Deal = await hre.ethers.getContractFactory("Deal");
    let deal = await Deal.attach(taskArgs.address);
    let dealTokenBalance = parseInt(await state.simpleToken.balanceOf(taskArgs.address));

    let startup = await deal.startup();
    let startupTokenBalance = parseInt(await state.simpleToken.balanceOf(startup));

    // let investorInfo = await deal.getInvestors();
    // let investors = investorInfo._investors;
    // let investedAmounts = investorInfo._amounts.map(x => parseInt(x));
    // let investorTokenBalances = (await Promise.all(investors.map(async x => state.simpleToken.balanceOf(x)))).map(x => parseInt(x));
    
    let json = {
                "dealAddress": taskArgs.address,
                "dealTokenBalance": dealTokenBalance,
                "startupToken": await deal.startupToken(),
                "minInvestmentAmount": parseInt(await deal.minInvestmentAmount()),
                "maxInvestmentAmount": parseInt(await deal.maxInvestmentAmount()),
                "expiryDate": parseInt(await deal.expiryDate()),
                "startup": startup,
                "startupTokenBalance": startupTokenBalance,
                // "investors": investors,
                // "investedAmounts": investedAmounts,
                // "investorTokenBalances": investorTokenBalances
               };
    console.log(json);
});

task("writeMoralisDealMetadata", "Initializes a Moralis Object with the deal and dealFactory metadata")
    .setAction(async (taskArgs, hre) => {
    Moralis.start({ serverUrl: moralisConfig.SERVER_URL, appId: moralisConfig.APP_ID });

    let state = await hre.run("getState");
    const DeploymentState = Moralis.Object.extend("DeploymentState");
    const deploymentState = new DeploymentState();
    deploymentState.set("dealAddr", state.contractAddresses.Deal);
    deploymentState.set("dealFactoryAddr", state.contractAddresses.DealFactory);
    deploymentState.set("dealFactoryImplAddr", state.contractAddresses.DealFactoryImpl);

    // Below is for testing convenience, obviously not relevant for prod usage
    deploymentState.set("simpleTokenAddr", state.contractAddresses.SimpleToken);
    deploymentState.set("usdpAddr", state.contractAddresses.USDP);
    deploymentState.set("simpleNftAddr", state.contractAddresses.SimpleNFT);

    const query = new Moralis.Query(DeploymentState);
    await query.find().then(async function(results) {
      for (const obj of results) {
        console.log("Deleting existing DeploymentState Moralis object with objectId:", obj.id)
        await obj.destroy();
      }
    });

    await deploymentState.save()
    .then((deploymentState: typeof DeploymentState) => {
      console.log('DeploymentState saved to Moralis with objectId: ' + deploymentState.id);
    }, (error: Moralis.Error) => {
      console.log('Failed to save DeploymentState to Moralis, error code: ' + error.message);
    });
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

var config = {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    artifacts: './src/artifacts',
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    strict: true,
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
  },
} as any

try {
  let ropsten = require('../secrets/ropsten_infura.json')
  config.networks.ropsten = ropsten
} catch {
  console.log("Unable to load Ropsten infura credentials")
}

try {
  let mumbai = require('../secrets/mumbai_infura.json')
  config.networks.mumbai = mumbai
} catch {
  console.log("Unable to load Mumbai infura credentials")
}



export default config
