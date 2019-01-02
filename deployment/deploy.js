const etherlime = require('etherlime');
const Marketplace = require('../build/contracts/Marketplace.json')
const IMarketplace = require('./../build/contracts/IMarketplace.json')
const Marketplace2 = require('./../build/contracts/Marketplace2.json')
const IMarketplace2 = require('./../build/contracts/IMarketplace2.json')
const Proxy = require('./../build/contracts/Proxy.json')


const defaultConfigs = {
	gasPrice: 20000000000,
	gasLimit: 4700000
}

const deploy = async (network, secret) => {
	const deployer = new etherlime.InfuraPrivateKeyDeployer('12FF89704509CA185796448B22573012F5671C7F524BC980475FD3D04E8FFB0D', 'rinkeby', 'XTIF9kIt1kgSOOKclKG0', defaultConfigs);
	const marketplace = await deployer.deploy(Marketplace);
	const proxy = await deployer.deploy(Proxy, marketplace.contractAddress);
	const implementedContract = await deployer.wrapDeployedContract(IMarketplace, proxy.contractAddress)
	await implementedContract.contract.init();
	
	// const marketplace2 = await deployer.deploy(Marketplace2)
}

module.exports = {
	deploy
}

// deploy()