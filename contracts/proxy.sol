// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Proxy_contract {
    bytes32 private constant implementation_slot = bytes32(uint256(keccak256("eip1967.proxy.implementation")) - 1);
    bytes32 private constant owner_slot = bytes32(uint256(keccak256("contract_owner")) - 1);
    
    constructor(address implementation, address whodeploy){
        SetContent(owner_slot, whodeploy);
        SetContent(implementation_slot, implementation);
    }

    function update(address implementation) external onlyOwner{
        SetContent(implementation_slot, implementation);
    }

    function changeOwner(address new_owner) external onlyOwner{
        SetContent(owner_slot, new_owner);
    }

    function getOwner() external view returns (address) {
        return GetContent(owner_slot);
    }


    fallback(bytes calldata callData) external payable returns (bytes memory resultData) {   
        address logic;
        logic = GetContent(implementation_slot);
        bool success;
        (success, resultData) = logic.delegatecall(callData);
        if (!success) {
            assembly { revert(add(resultData, 0x20), mload(resultData)) }
        }
    }

    receive() external payable {}
    
    modifier onlyOwner {
        address owner = GetContent(owner_slot);
        require(msg.sender == owner, "Only Owner can use this function.");
        _;
    }

    function GetContent(bytes32 slot) internal view returns (address addr_content){
        assembly{
            addr_content := sload(slot)
        }
    }

    function SetContent(bytes32 slot, address addr_content) internal {
        assembly{
            sstore(slot, addr_content)
        }
    }

}