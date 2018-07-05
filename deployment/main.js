const etherlime = require('etherlime');
let Marketplace = require('./../build/contracts/Marketplace.json')
let IMarketplace = require('./../build/contracts/IMarketplace.json')
let Marketplace2 = require('./../build/contracts/Marketplace2.json')
let IMarketplace2 = require('./../build/contracts/IMarketplace2.json')
let Proxy = require('./../build/contracts/Proxy.json')

const defaultConfigs = {
	gasPrice: 20000000000,
	gasLimit: 4700000
}

const deployer = new etherlime.InfuraPrivateKeyDeployer('9f42c9d8e753db56330ee67b91fdd7fd47f034862f1b96e83bc65acc2e2a463b', 'rinkeby', 'XTIF9kIt1kgSOOKclKG0', defaultConfigs);

const runDeployment = async () => {
    const resultMarketplace = await deployer.deploy(Marketplace)

    const resultProxy = await deployer.deploy(Proxy, resultMarketplace.contractAddress)

    const implementedContract = await deployer.wrapDeployedContract(IMarketplace, resultProxy.contractAddress)
    await implementedContract.contract.init();

    //const resultMarketplace2 = await deployer.deploy(Marketplace2)
}

runDeployment();
