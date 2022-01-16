// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// Proportional - each investor gets x% of her tokens investment
// Time_inc - investor who invested first gets tokens first
// Size_inc - investor with the smallest investment size gets tokens first
enum VestingStrategy {
    PROPORTIONAL, 
    TIME_INC,
    SIZE_INC 
}
