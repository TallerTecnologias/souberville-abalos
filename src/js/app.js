App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function () {
    return App.initWeb3()
  },

  initWeb3: async function () {
    if (typeof web3 !== 'undefined') {
      // Si ya existe una instancia de web3 provista por MetaMask
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      // Sino se crea una instancia default
      App.web3Provider = new Web3.providers.HttpProvider(
        'http://localhost:7545'
      )
      web3 = new Web3(App.web3Provider)
    }
    return await App.initContract()
  },

  initContract: function () {
    $.getJSON('BetCoin.json', function (betCoin) {
      // Instancia el contrato a partir del artefacto
      App.contracts.BetCoin = TruffleContract(betCoin)
      // Conecta el proveedor
      App.contracts.BetCoin.setProvider(App.web3Provider)
      App.contracts.BetCoin.deployed().then(function (betCoin) {
        console.log('BetCoin token address', betCoin.address)
      })
    }).done(function () {
      $.getJSON('BetFactory.json', function (betFactory) {
        // Instancia un nuevo contrato truffle desde el artifact
        App.contracts.BetFactory = TruffleContract(betFactory)
        // Conecta al proveedor para interactuar con el contrato
        App.contracts.BetFactory.setProvider(App.web3Provider)
        App.contracts.BetFactory.deployed().then(function (betFactory) {
          console.log('BetFactory address', betFactory.address)
        })
        App.listenForEvents()
        return App.render()
      })
    })
  },

  // Escucha los eventos emitidos en el contrato
  listenForEvents: async function () {
    App.contracts.BetFactory.deployed().then(function (instance) {
      instance
        .NewBet(
          {},
          {
            fromBlock: 0,
            toBlock: 'latest'
          }
        )
        .watch(async function (error, event) {
          await App.render()
          console.log('event triggered', event)
          console.log('Error: ' + error)
        })
    })
  },

  // Recarga datos
  render: function () {
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account
        $('#accountAddress').html(
          'Usted está conectado con la address: ' + account
        )
      }
    })

    App.getQuantity()
    App.getBetTiles()
    // App.getFirstBetTile()
  },

  getBetTiles: function () {
    App.contracts.BetFactory.deployed()
      .then(function (instance) {
        return web3.eth.contract(instance.abi, instance.address)
      })
      .then(function (factory) {
        return factory.getAllBetsTiles
      })
      .then(function (result) {
        $('#tiles').empty()
        $('#tiles').append(result)
      })
  },

  /* getFirstBetTile: function () {
    App.contracts.BetFactory.deployed()
      .then(async function (instance) {
        return await web3.eth.contract(instance.abi, instance.address)
      })
      .then(async function (factory) {
        return await factory.getAllBetsTiles
      })
      .then(async function (result) {
        var bet = await result[0]
        $('#testH').empty()
        $('#testH').append(bet[0].toString())
      })
  }, */

  getQuantity: async function () {
    App.contracts.BetFactory.deployed()
      .then(function (instance) {
        return web3.eth.contract(instance.abi, instance.address)
      })
      .then(function (factory) {
        return factory.bets
      })
      .then(function (result) {
        $('#betQuantity').html('Cantidad de Apuestas Creadas: ' + result)
      })
  },

  _createBet: async function () {
    const betName = document.getElementById('betName').value
    const optionA = document.getElementById('optionA').value
    const optionB = document.getElementById('optionB').value
    const oracleAddress = document.getElementById('oracleAddress').value
    // console.log('Antes create Bet')
    App.contracts.BetFactory.deployed().then(function (instance) {
      instance.methods
        .createBet(oracleAddress, betName, optionA, optionB, {
          from: App.account,
          gas: 50000
        })
        .send()
    })
  },

  get createBet() {
    return this._createBet
  },

  set createBet(value) {
    this._createBet = value
  }
}

$(function () {
  $(window).load(function () {
    App.init()
  })
})
