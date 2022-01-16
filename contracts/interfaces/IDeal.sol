// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IDeal {
    function invest(uint256 amount, uint256 id) external;
    function claimRefund(uint256 id) external;
    function claimTokens(uint256 id) external;
    function claimFunds() external;
}

