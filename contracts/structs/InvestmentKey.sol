// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// Options:
// 1. If InvestmentKeyType = INVESTOR_WALLET: addr = wallet_address, id = 0
// 2. If InvestmentKeyType = GATE_TOKEN: addr = [NFT] addr, id = [NFT] id
struct InvestmentKey {
    address addr;
    uint256 id;
}
