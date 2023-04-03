// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Ownable {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Only Owner can use this function.");
        _;
    }

}

contract StoreFund_v3 is Ownable{
    using SafeERC20 for IERC20;
    mapping(address => mapping(address => uint256)) public balances;
    mapping(address => uint256) public totalfee;
    bool public initialized;


    function initialize(address NewOwner) public {
        require(!initialized, "already initialized");
        owner = NewOwner;
        initialized = true;
    }

    function deposit(address tokenAddress, uint256 amount) external {
        require(amount > 0, "Amount should be larger than 0.");
        uint fee = 0;
        IERC20(tokenAddress).safeTransferFrom(msg.sender, address(this), amount);

        if(amount < 1000) {
            fee = 1;
            amount = amount - 1;
        }
        else{
            fee = amount * 20 / 10000; // multiply first before doing the division. 0.1% => 0.001
            amount = amount - fee;
        }

        balances[msg.sender][tokenAddress] += amount;
        totalfee[tokenAddress] += fee;
    }

    function withdraw(address tokenAddress, uint256 amount) external {
        require(amount > 0, "Amount should be larger than 0.");
        balances[msg.sender][tokenAddress] -= amount;
        IERC20(tokenAddress).safeTransfer(msg.sender, amount);
    }

    function takefee(address tokenAddress) external onlyOwner{
        IERC20(tokenAddress).safeTransfer(owner, totalfee[tokenAddress]);
        totalfee[tokenAddress] = 0;
    }


}
