// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import './../enums/LockedDealConstraint.sol';
import './../enums/VestingStrategy.sol';
import './../enums/InvestmentKeyType.sol';

struct ParticipantAddresses {
    address dealdex;
    address manager;
    address project;
}

// ExchangeRate is the number of projectTokenBits per investmentTokenBit
// i.e. ΔprojectTokens = -ΔinvestmentTokens * exchangeRate
// e.g. Exchange rate from WETH (project token) to USDC (investmentToken):
//      1 USDC (6 decimal token) = 0.0003018 WETH (18 decimal token)
//      -> 1E6 USDC bits = 3.018E14 WETH bits
//      -> Exchange rate = 3.018E8
// Deliberately storing a fraction instead of FixedPoint to ease translation from frontend
struct ExchangeRate {
    uint256 numerator;
    uint256 denominator;
}

struct InvestmentSizeConstraints {
    uint256 minInvestmentPerInvestor;
    uint256 maxInvestmentPerInvestor;
    uint256 minTotalInvestment;
    uint256 maxTotalInvestment;
}

struct InvestConfig {
    InvestmentSizeConstraints sizeConstraints;
    LockedDealConstraint lockConstraint;
    address investmentTokenAddress;
    // address of (likely ERC721) token that investor needs to own to be able to invest
    address gateToken;
    InvestmentKeyType investmentKeyType;
    // Unix timestamp after which investment is disallowed
    uint256 investmentDeadline;
}

struct ClaimRefundConfig {
    bool allowRefunds;
    LockedDealConstraint lockConstraint;
}

struct ClaimTokensConfig {
    address projectTokenAddress;
    uint16 dealdexFeeBps;
    uint16 managerFeeBps;
    LockedDealConstraint lockConstraint;
}

struct ClaimFundsConfig {
    // txn [xyz]Fee = total investment * [xyz]FeeBps / 10,000
    uint16 dealdexFeeBps;
    uint16 managerFeeBps;
    LockedDealConstraint lockConstraint;
}

struct VestingSchedule {
    VestingStrategy vestingStrategy;
    // Cannot place the below two into a struct since arrays of structs are disallowed i.e.
    // UnimplementedFeatureError: Copying of type struct VestingDetail memory[] memory to storage not yet supported
    // Must be increasing & last vestingBps must be 10,000 (for 100%)
    uint16[] vestingBps;
    // Must be increasing
    uint256[] vestingTimestamps;
}

struct DealConfig {
    ParticipantAddresses participantAddresses;
    ExchangeRate exchangeRate;
    InvestConfig investConfig;
    ClaimRefundConfig refundConfig;
    ClaimTokensConfig tokensConfig;
    ClaimFundsConfig fundsConfig;
    VestingSchedule vestingSchedule;
}
