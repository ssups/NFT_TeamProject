// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./TestToken.sol";

contract TestTrade {
    TestToken public Token;

    constructor(address _tokenAddress) {
        Token = TestToken(_tokenAddress);
    }

    mapping(uint => uint) public tokenPrices;
    // hi

}