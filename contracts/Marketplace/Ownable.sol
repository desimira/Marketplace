pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;
import './Icontracts/IOwnable.sol';

contract Ownable is IOwnable{
    address owner;
    
    
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0));
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}