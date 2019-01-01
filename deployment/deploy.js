const etherlime = require('etherlime');
const MarketPlace = require('../build/MarketPlace.json');
const IMarketPlace = require('../build/ImarketPlace.json');
const Proxy = require('../build/Proxy.json');


const deploy = async (network, secret) => {

  const deployer = new etherlime.EtherlimeGanacheDeployer();
  
  const marketPlace = await deployer.deploy(MarketPlace);
  console.log(marketPlace.contractAddress)
  
  const proxy = await deployer.deploy(Proxy, {}, marketPlace.contractAddress);

  const implementedContract = await etherlime.ContractAt(IMarketPlace, proxy.contractAddress);
  console.log(implementedContract)

};

module.exports = {
	deploy
};