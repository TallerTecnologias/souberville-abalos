const HDWalletProvider = require('truffle-hdwallet-provider')
const mnemonic = 'incluir Mnemonic'

module.exports = {
  networks: {
    mainnet: {
      provider: function () {
        return new HDWalletProvider(
          mnemonic,
          'https://mainnet.infura.io/v3/8e85cdd375c6404bbfd537099d8a0fed'
        )
      },
      network_id: '1'
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(
          mnemonic,
          'https://rinkeby.infura.io/v3/8e85cdd375c6404bbfd537099d8a0fed'
        )
      },
      network_id: 4
    }
  },
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: '0.8.4'
    }
  }
}
