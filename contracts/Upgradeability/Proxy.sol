pragma solidity ^0.4.23;

import './Delegate.sol';
import './SharedStorage.sol';

contract Proxy is SharedStorage, Delegate {

    event UpgradedContract(address indexed _newImpl);

    constructor(address _contractImpl) public {
        contractImplementation = _contractImpl;
    }
    
    function() public payable {
        delegatedFwd(contractImplementation);
    }

    function upgradeImplementation(address _newImpl) public {
        contractImplementation = _newImpl;
        emit UpgradedContract(_newImpl);
    }

}