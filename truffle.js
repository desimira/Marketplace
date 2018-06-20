var HDWalletProvider = require("truffle-hdwallet-provider-privkey");
let testPrivateKey = '9f42c9d8e753db56330ee67b91fdd7fd47f034862f1b96e83bc65acc2e2a463b';
let infuraRinkeby = 'https://rinkeby.infura.io/XTIF9kIt1kgSOOKclKG0 ';

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(testPrivateKey, infuraRinkeby)
      },
      network_id: 4,
      port: 8545,
      gas: 4000000
    },
  },
  olc: {
    optimizer: {
      enabled: true,
      runs: 999
    }
  }
};
