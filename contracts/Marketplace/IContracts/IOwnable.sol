pragma solidity ^0.4.23;

contract IOwnable {
    
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    function transferOwnership(address newOwner) public;
}