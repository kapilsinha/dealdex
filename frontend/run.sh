#!/usr/bin/env bash

npx hardhat run scripts/deploy.js --network localhost
npx hardhat writeMoralisDealMetadata --network localhost
