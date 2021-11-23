AdministrarBetCoin = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  price: 1000000000000000,
  tokensSold: 0,
  buy: true,

  init: function () {
    return AdministrarBetCoin.initWeb3()
  },

  initWeb3: async function () {
    if (typeof web3 !== 'undefined') {
      // Si una instancia de web3 ya fue confirmada por metamask
      AdministrarBetCoin.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      // creamos una instancia default si no obtenemos una
      AdministrarBetCoin.web3Provider = new Web3.providers.HttpProvider(
        'http://localhost:7545'
      )
      web3 = new Web3(AdministrarBetCoin.web3Provider)
    }

    return await AdministrarBetCoin.initContract()
  },

  initContract: function () {
    $.getJSON('BetCoin.json', function (betCoin) {
      // Instancia el contrato a partir del artefacto
      AdministrarBetCoin.contracts.BetCoin = TruffleContract(betCoin)
      // Conecta el proveedor
      AdministrarBetCoin.contracts.BetCoin.setProvider(
        AdministrarBetCoin.web3Provider
      )
      AdministrarBetCoin.contracts.BetCoin.deployed().then(function (betCoin) {
        console.log('BetCoin token address', betCoin.address)
      })
    }).done(function () {
      $.getJSON('Exchanger.json', function (exchanger) {
        // Instancia el contrato a partir del artefacto
        AdministrarBetCoin.contracts.Exchanger = TruffleContract(exchanger)
        // Conecta el proveedor para interactuar con el contrato
        AdministrarBetCoin.contracts.Exchanger.setProvider(
          AdministrarBetCoin.web3Provider
        )
        AdministrarBetCoin.contracts.Exchanger.deployed().then(function (
          exchanger
        ) {
          console.log('Exchanger Address:', exchanger.address)
        })
        // AdministrarBetCoin.listenForEvents()
        return AdministrarBetCoin.render()
      })
    })
  },

  betCoins: function (n) {
    return web3.utils.toWei(n, 'ether')
  },
  buyBetCoin: function () {
    var amountToSell = $('#buyAmount').val()
    var amoutInBetCoin = betCoins(amountToSell)
    AdministrarBetCoin.contracts.Exchanger.deployed()
      .then(function (instance) {
        return instance.buyBetCoin(amoutInBetCoin, {
          from: AdministrarBetCoin.account
          // precisa aprobacion de Exchanger
        })
      })
      .then(function (result) {
        console.log('Se compraron betCoin ' + result)
        AdministrarBetCoin.render()
      })
  },
  sellBetCoin: function () {
    console.log('click en vender')
    var amountToSell = $('#sellAmount').val()
    var amoutInBetCoin = betCoins(amountToSell)
    AdministrarBetCoin.contracts.Exchanger.deployed()
      .then(function (instance) {
        return instance.sellBetCoin(amoutInBetCoin, {
          from: AdministrarBetCoin.account
          // precisa aprobacion de Exchanger
        })
      })
      .then(function (result) {
        console.log('Se compraron betCoin ' + result)
        AdministrarBetCoin.render()
      })
  },

  render: function () {
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        AdministrarBetCoin.account = account
        $('#accountAddress').html('Cuenta: ' + account)
        web3.eth.getBalance(account, function (err, balance) {
          if (err === null) {
            // console.log(web3.utils.fromWei(balance, 'ether'))
            $('#etherBalance').html('Ether: ' + balance / 1000000000000000000)
          }
        })
      }
    })
    // Carga el saldo en betCoin
    AdministrarBetCoin.contracts.BetCoin.deployed()
      .then(function (instance) {
        betCoinInstance = instance
        return betCoinInstance.balanceOf(AdministrarBetCoin.account)
      })
      .then(function (balance) {
        $('#betCoinBalance').html('Saldo de BetCoin: ' + balance.toNumber())
      })

    if (buy) {
      $('#sell').hide()
      $('#buy').show()
    } else {
      $('#buy').hide()
      $('#sell').show()
    }
  },

  ChangeForm: function () {
    buy = !buy
    AdministrarBetCoin.render()
  }
}

$(function () {
  $(window).load(function () {
    AdministrarBetCoin.init()
  })
})
