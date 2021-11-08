App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function () {
    return App.initWeb3()
  },

  initWeb3: function () {
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
    return App.initContract()
  },

  initContract: function () {
    $.getJSON('BetFactory.json', function (betFactory) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.BetFactory = TruffleContract(betFactory)
      // Connect provider to interact with contract
      App.contracts.BetFactory.setProvider(App.web3Provider)
      //App.listenForEvents()
      return App.render()
    })
  },

  // Listen for events emitted from the contract
  /*listenForEvents: function () {
    App.contracts.BetFactory.deployed().then(function (instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
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
  }, */

  render: function () {
    // var loader = $("#loader");
    // var content = $("#content");
    /*
    loader.show();
    content.hide();
    */

    // Load account data
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account
        $('#accountAddress').html('Cuenta: ' + account)
        App.getQuantity()
      }
    })

    /*
    // Load contract data
    App.contracts.Election.deployed()
      .then(function (instance) {
        electionInstance = instance
        return electionInstance.candidatesCount()
      })
      .then(function (candidatesCount) {
        var candidatesResults = $('#candidatesResults')
        candidatesResults.empty()

        var candidatesSelect = $('#candidatesSelect')
        candidatesSelect.empty()

        for (var i = 1; i <= candidatesCount; i++) {
          electionInstance.candidates(i).then(function (candidate) {
            var id = candidate[0]
            var name = candidate[1]
            var voteCount = candidate[2]

            // Render candidate Result
            var candidateTemplate =
              '<tr><th>' +
              id +
              '</th><td>' +
              name +
              '</td><td>' +
              voteCount +
              '</td></tr>'
            candidatesResults.append(candidateTemplate)

            // Render candidate ballot option
            var candidateOption =
              "<option value='" + id + "' >" + name + '</ option>'
            candidatesSelect.append(candidateOption)
          })
        }
        return electionInstance.voters(App.account)
      })
      .then(function (hasVoted) {
        // Do not allow a user to vote
        if (hasVoted) {
          $('form').hide()
        }
        loader.hide()
        content.show()
      })
      .catch(function (error) {
        console.warn(error)
      }) */
  },

  getQuantity: function () {
    App.contracts.BetFactory.deployed()
      .then(function (instance) {
        return instance.getActiveBets()
      })
      .then(function (result) {
        $('#betQuantity').html('Cantidad de Apuestas: ' + result.length)
      })
  },

  castVote: function () {
    var candidateId = $('#candidatesSelect').val()
    App.contracts.Election.deployed()
      .then(function (instance) {
        return instance.vote(candidateId, { from: App.account })
      })
      .then(function (result) {
        // Wait for votes to update
        $('#content').hide()
        $('#loader').show()
      })
      .catch(function (err) {
        console.error(err)
      })
  },

  createBet: async function () {
    const betName = document.getElementById('betName').value
    const optionA = document.getElementById('optionA').value
    const optionB = document.getElementById('optionB').value
    const oracleAddress = document.getElementById('oracleAddress').value
    console.log('Antes create Bet')
    App.contracts.BetFactory.deployed().then(function (instance) {
      instance.createBet(oracleAddress, betName, optionA, optionB)
    })
    console.log('Despues create Bet')
  }
}

$(function () {
  $(window).load(function () {
    App.init()
  })
})
