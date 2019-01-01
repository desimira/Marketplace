pragma solidity ^0.5.1;

contract IOwnable {
    
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    function transferOwnership(address payable newOwner) public;
}