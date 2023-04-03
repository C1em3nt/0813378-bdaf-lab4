// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract testcoin is ERC20 {
  constructor() ERC20('test', 'test coin') {
    _mint(msg.sender, 100000);
  }
}