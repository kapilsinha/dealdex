// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// Investor_wallet - only the investor wallet address that invested can withdraw funds
// Gate_token - only the owner of the gate token that the investor owned can withdraw funds
enum InvestmentKeyType {
    INVESTOR_WALLET, 
    GATE_TOKEN
}
