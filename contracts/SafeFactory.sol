// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./proxy.sol";
import "./safe.sol";

contract SafeFactory is Ownable {
    address public implementation;
    address public contractAddr;

    constructor(address implementation_){
        implementation = implementation_;
        owner = msg.sender;
    }

    function updateImplementation(address newImp) external onlyOwner{
        implementation = newImp;
    }
    
    function deploySafeProxy() external onlyOwner {
        Proxy_contract proxy = new Proxy_contract(implementation, msg.sender);
        contractAddr = address(proxy);
    }

    function getAddress() external view returns(address) {
        return contractAddr;
    }

    function deploySafe() external onlyOwner {
        StoreFund safe = new StoreFund(msg.sender);
        contractAddr = address(safe);
    }
}

