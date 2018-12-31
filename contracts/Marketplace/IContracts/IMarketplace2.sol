pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import '../../Upgradeability/IOwnableUpgradeableImplementation.sol';

contract IMarketplace2 is IOwnableUpgradeableImplementation {

    function buy(bytes memory ID, uint quantity) public payable;
    
    function update(bytes memory ID, uint newQuantity) public;
    
    function updatePrice(bytes memory ID, uint newQuantity) internal;
    
    //creates a new product and returns its ID
    function newProduct(string memory name, uint price, uint quantity) public returns(bytes memory);
    
    function removeProduct(bytes memory ID) public;

    function increasePrice(bytes memory ID, uint newPrice) public;
    
    function getProduct(bytes memory ID) public view returns(string memory name, uint price, uint quantity);
    
    function getProducts() public view returns(bytes[] memory);
    
    function getPrice(bytes memory ID, uint quantity) public view returns (uint);
    
    function withdraw() public;
    
    function getBalance() public view returns (uint);
}