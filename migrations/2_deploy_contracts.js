
var MarketPlace = artifacts.require("./MarketPlace.sol");
var MarketPlace2 = artifacts.require("./MarketPlace2.sol");
const IMarketplace = artifacts.require('./IContracts/IMarketplace.sol');
const IMarketplace2 = artifacts.require('./IContracts/IMarketplace2.sol');
var Proxy = artifacts.require("./Proxy.sol");


module.exports = async function(deployer) {
	await deployer.deploy(MarketPlace);
	const marketPlace = await MarketPlace.deployed();

	await deployer.deploy(Proxy, marketPlace.address);
	const proxy = await Proxy.deployed();

	const implementedContract = await IMarketplace.at(proxy.address)
	await implementedContract.init();

	await deployer.deploy(MarketPlace2);

};

