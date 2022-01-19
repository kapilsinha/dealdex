#!/usr/bin/env bash

npx hardhat run scripts/deploy.js --network ropsten
npx hardhat writeMoralisDealMetadata --network ropsten 
