App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',


  init: function () {
    return App.initWeb3()
  },

  initWeb3:  function () {
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
    return App.initContract()
  },

  initContract: async function () {
    $.getJSON('BetFactory.json', function (betFactory) {
      // Instancia un nuevo contrato truffle desde el artifact
      App.contracts.BetFactory = TruffleContract(betFactory)
      // Conecta al proveedor para interactuar con el contrato
      App.contracts.BetFactory.setProvider(App.web3Provider)
      App.listenForEvents()
      return App.render()
    })
  },

  // Escucha los eventos emitidos en el contrato
  listenForEvents: function () {
    App.contracts.BetFactory.deployed().then(function (instance) {
      instance
        .NewBet(
          {},
          {
            fromBlock: 0,
            toBlock: 'latest'
          }
        )
        .watch( async function (error, event) {
          App.render()
          console.log('event triggered', event)
        })
    })
  },

  //Recarga datos
  render: function () {
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account
        $('#accountAddress').html('Usted está conectado con la address: ' + account)
        App.getQuantity()
        App.getBetTiles()
      }
    })
  },

  getBetTiles: function () {
    App.contracts.BetFactory.deployed()
      .then(function (instance) {
        return  instance.getAllBetsTiles()
      })
      .then(function (result) {
          $("#tiles").empty();
          $("#tiles").append(result.toString());
        
      })
  },

  getQuantity:  function () {
    App.contracts.BetFactory.deployed()
      .then(function (instance) {
        return  instance.getBets()
      })
      .then(function (result) {
        $('#betQuantity').html('Cantidad de Apuestas Creadas: ' + result.length)
      })
  },

  _createBet: async function () {
    const betName = document.getElementById('betName').value
    const optionA = document.getElementById('optionA').value
    const optionB = document.getElementById('optionB').value
    const oracleAddress = document.getElementById('oracleAddress').value
    console.log('Antes create Bet')
    App.contracts.BetFactory.deployed().then(function (instance) {
      instance.createBet(oracleAddress, betName, optionA, optionB)
    })
    console.log('Despues create Bet')
  },

  get createBet() {
    return this._createBet
  },

  set createBet(value) {
    this._createBet = value
  },
}

$(function () {
  $(window).load(function () {
    App.init()
  })
})
