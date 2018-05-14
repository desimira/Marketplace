var SafeMath = artifacts.require("./SafeMath.sol")
var Ownable = artifacts.require("./Ownable.sol")
var ProductLib = artifacts.require("./ProductLib")
var MarketPlace = artifacts.require("./MarketPlace.sol");


module.exports = function(deployer) {
	deployer.deploy(SafeMath);
	deployer.deploy(Ownable);
	deployer.deploy(ProductLib);
	deployer.link(SafeMath, MarketPlace);
	deployer.link(ProductLib, MarketPlace);
	deployer.deploy(MarketPlace);
};

