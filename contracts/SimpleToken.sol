// contracts/SimpleToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title SimpleToken
 * @dev Very simple ERC20 Token example, where all tokens are pre-assigned to the creator.
 * Note they can later distribute these tokens as they wish using `transfer` and other
 * `ERC20` functions.
 * Based on https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.5.1/contracts/examples/SimpleToken.sol
 */
contract SimpleToken is ERC20 {
    /**
     * @dev Constructor that gives msg.sender all of existing tokens.
     */
    uint8 private _decimals;

    constructor(string memory name, string memory symbol, uint256 initialSupply, uint8 numDecimals) ERC20(name, symbol) {
      _decimals = numDecimals;
      _mint(msg.sender, initialSupply * (10 ** uint256(decimals())));
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
}
