pragma solidity ^0.4.23;

import "../Marketplace/Icontracts/IOwnable.sol";


contract IOwnableUpgradeableImplementation is IOwnable {

    function init() public;
    
    function getOwner() public view returns (address);

    function upgradeImplementation(address _newImpl) public;

    function getImplementation() public view returns (address);
}