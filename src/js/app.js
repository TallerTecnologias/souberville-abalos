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
    return App.initContract()
  },

  initContract: function () {
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
        .watch( async function (error, event) {
          await App.render()
          console.log('event triggered', event)
        })
    })
  },

  //Recarga datos
  render: function () {
    App.getQuantity()
    App.getBetTiles()
    App.getFirstBetTile()
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account
        $('#accountAddress').html('Usted está conectado con la address: ' + account)

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

  getFirstBetTile: function () {
    App.contracts.BetFactory.deployed()
      .then(function (instance) {
        //const betabi  = require("betabi.js"); 
        const contract_abi =[
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "oracleAddress",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "name",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "optionA",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "optionB",
                "type": "string"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "betAddress",
                "type": "address"
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "bettorAddress",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "uint16",
                "name": "optionSelected",
                "type": "uint16"
              }
            ],
            "name": "BetGenerated",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
              }
            ],
            "name": "OwnershipTransferred",
            "type": "event"
          },
          {
            "inputs": [],
            "name": "_isActive",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "_name",
            "outputs": [
              {
                "internalType": "string",
                "name": "",
                "type": "string"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "_optionA",
            "outputs": [
              {
                "internalType": "string",
                "name": "",
                "type": "string"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "_optionB",
            "outputs": [
              {
                "internalType": "string",
                "name": "",
                "type": "string"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "_oracle",
            "outputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              }
            ],
            "name": "bettorInfo",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "amountBet",
                "type": "uint256"
              },
              {
                "internalType": "uint16",
                "name": "teamSelected",
                "type": "uint16"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "name": "bettors",
            "outputs": [
              {
                "internalType": "address payable",
                "name": "",
                "type": "address"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "isOwner",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "minimumBet",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "owner",
            "outputs": [
              {
                "internalType": "address payable",
                "name": "",
                "type": "address"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "renounceOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "address payable",
                "name": "newOwner",
                "type": "address"
              }
            ],
            "name": "transferOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "isOracle",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint16",
                "name": "winnerOption",
                "type": "uint16"
              }
            ],
            "name": "endBet",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "bettor",
                "type": "address"
              }
            ],
            "name": "checkBettorExists",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint8",
                "name": "_optionSelected",
                "type": "uint8"
              }
            ],
            "name": "bet",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint16",
                "name": "optionWinner",
                "type": "uint16"
              }
            ],
            "name": "distributePrizes",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "GetName",
            "outputs": [
              {
                "internalType": "string",
                "name": "",
                "type": "string"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "GetOptionA",
            "outputs": [
              {
                "internalType": "string",
                "name": "",
                "type": "string"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "GetOptionB",
            "outputs": [
              {
                "internalType": "string",
                "name": "",
                "type": "string"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "AmountOne",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "AmountTwo",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          }
        ]
        var firstBet = web3.eth.contract(contract_abi,instance.getBets()[0])
        var betName = firstBet.methods.GetName().call()
        $("#testH").empty();
        $("#testH").append(betName.toString());
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
