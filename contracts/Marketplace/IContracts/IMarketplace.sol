pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import '../../Upgradeability/IOwnableUpgradeableImplementation.sol';

contract IMarketplace is IOwnableUpgradeableImplementation {

    function buy(bytes32 ID, uint quantity) public payable;
    
    function update(bytes32 ID, uint newQuantity) public;
    
    function updatePrice(bytes32 ID, uint newQuantity) internal;
    
    //creates a new product and returns its ID
    function newProduct(string memory name, uint price, uint quantity) public returns(bytes32);
    
    function removeProduct(bytes32 ID) public;
    
    function getProduct(bytes32 ID) public view returns(string memory name, uint price, uint quantity);
    
    function getProducts() public view returns(bytes32[] memory);
    
    function getPrice(bytes32 ID, uint quantity) public view returns (uint);
    
    // function withdraw() public;
    
    function getBalance() public view returns (uint);
}