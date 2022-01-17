# POG-Coin: Smart contract & frontend

## Setup

### Hardhat
Guide here: https://www.youtube.com/watch?v=a0osIaAOFSE (recommend watching the entire thing on 1.5x)
Hardhat is a standard Ethereum development environment, and allows you to run Solidity locally (all the hardhat commands below have details at https://hardhat.org/hardhat-network/)

### Moralis
Setup here: https://docs.moralis.io/moralis-server/web3/setting-up-ganache#connecting-hardhat-to-moralis-real-time-and-historical-transactions)

### Node/NPM
```shell
# Pls ensure your Node.js is on v14.17.5 (the current latest LTS). This will hopefully avoid random dependency conflicts down the road
nvm install v14.17.5
# Sets default Node to this new version
nvm alias default node
PATH should contain something like this: ~/.nvm/versions/node/v14.17.5/bin

npm install
```

## Run the app
```shell
# 1. Start Hardhat Network (keep this running)
npx hardhat node

# 2. Compile smart contracts, deploy to above node, write deployment state to Moralis
./run.sh

# 3. Start reverse proxy to connect HardHat network to Moralis (keep this running)
./frpc -c frpc.ini

# 4. Run our application on localhost (keep this running)
npm start
```

## Testing

### Automated test suite
```shell
npx hardhat test
```

### Manual test helpers -> *important*, this can save your time!
```
# *IMPORTANT*: Has a create deal function that creates a deal with the currently deployed DealFactory. More to be added
npx hardhat run scripts/manual_test.ts --network localhost

# Print state of a specific deal
npx hardhat printDealState --address 0xbf9fBFf01664500A33080Da5d437028b07DFcC55 --network localhost

# Print state of all our deals
npx hardhat printState --network localhost
```

### Manual test from UI
1. Log into metamask
2. Set metamask eth network to Localhost 8545
3. Make sure you are on one of the 20 accounts listed when you ran "npx hardhat node"
4. Go to Settings -> Advanced -> Reset Account if necessary
5. Go to the Create a Deal form and create a deal. Use the startup token address listed when you ran scripts/deploy.js

## Hosting on Firebase
```
# Configure for testnet deployment
npx hardhat configureForTestnet

npm run build
firebase emulators:start // Test on local machine
firebase deploy --only hosting // Deploy live
firebase hosting:channel:deploy CHANNEL_ID // Deploy to a preview url
```

## Troubleshooting
Localhost MetaMask gets screwed up when you restart yor Hardhat node:
Go to your metamask wallet -> Settings -> Advanced -> Reset account
