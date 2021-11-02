import betFactoryArtifact from '../../build/contracts/BetFactory.json'
const Web3 = require('web3')

const App = {
  web3: null,
  account: null,
  betFactory: null,

  start: async function () {
    const { web3 } = this

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId()
      const deployedNetwork = betFactoryArtifact.networks[networkId]
      this.betFactory = new web3.eth.Contract(
        betFactoryArtifact.abi,
        deployedNetwork.address
      )

      // get accounts
      const accounts = await web3.eth.getAccounts()
      this.account = accounts[0]

      this.refreshBalance()
    } catch (error) {
      console.error('Could not connect to contract or chain.')
    }
  },

  refreshBalance: async function () {
    const { getBalance } = this.betFactoryArtifact.methods
    const balance = await getBalance(this.account).call()

    const balanceElement = document.getElementsByClassName('balance')[0]
    balanceElement.innerHTML = balance
  },

  getBets: async function () {
    const { _getBets } = this.betFactoryArtifact.methods
    const bets = await _getBets().call()
    const container = document.getElementById('activeBetsContainer')
    container.innerHTML = bets
  },

  createBet: async function () {
    const betName = document.getElementById('betName').value
    const optionA = document.getElementById('optionA').value
    const optionB = document.getElementById('optionB').value
    const oracleAddress = document.getElementById('oracleAddress').value

    this.setStatus('Creando Apuesta... (Por favor espere)')

    const { _createBet } = this.betFactoryArtifact.methods
    await _createBet(oracleAddress, betName, optionA, optionB).send({
      from: this.account
    })
    this.setStatus('Transacción completa!')
    this.getBets()
    // this.refreshBalance() Hay que mostrar el saldo de la cuenta actualizado
  },

  setStatus: function (message) {
    const status = document.getElementById('status')
    status.innerHTML = message
  }
}

window.App = App

window.addEventListener('load', function () {
  if (window.ethereum) {
    // use betFactoryArtifactMask's provider
    App.web3 = new Web3(window.ethereum)
    window.ethereum.enable() // get permission to access accounts
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider('http://127.0.0.1:8545')
    )
  }

  App.start()
})
