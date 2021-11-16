App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init:  function () {
    return  App.initWeb3()
  },

  initWeb3:  function () {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider(
        'http://localhost:7545'
      )
      web3 = new Web3(App.web3Provider)
    }
    return  App.initContract()
  },

  initContract:  function () {
    $.getJSON('BetFactory.json', function (betFactory) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.BetFactory = TruffleContract(betFactory)
      // Connect provider to interact with contract
      App.contracts.BetFactory.setProvider(App.web3Provider)
      App.listenForEvents()
      return  App.render()
    })
  },

  // Listen for events emitted from the contract
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
        .watch(function (error, event) {
          console.log('event triggered', event)
          console.log('event triggered', error)
          // Reload when a new vote is recorded
        })
    })
  },

  render:  function () {

    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account
        $('#accountAddress').html('Cuenta: ' + account)
         App.getQuantity()
         App.getBetList()
      }
    })

  },

  getQuantity:  function () {
    App.contracts.BetFactory.deployed()
      .then(function (instance) {
        return  instance.getBets()
      })
      .then(function (result) {
        $('#betQuantity').html('Cantidad de Apuestas: ' + result.length)
      })
  },

  getBetList: function () {
    App.contracts.BetFactory.deployed()
      .then(function (instance) {
        return  instance.getBets()
      })
      .then(function (bets) {
        App.getBetDetail(bets)
      })
  },

  getBetDetail: function (bets) {
    $("#betCards").empty();
    for (bet of bets) {

      $("#betCards").append(`<div class="bet">
        <ul>
          <li>Name: ${bet._name}</li>
          <li>Opcion A: ${bet._optionA}</li>
          <li>Opcion B: ${bet._optionB}</li>
        </ul>
      </div>`);
    }
    
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
