App = {
    loading: false,
    contracts: {},

    load: async () => {
      await App.loadWeb3();
      await App.loadAccount();
      await App.loadBetFactoryContract();
      await App.render();
    },

    loadWeb3: async () => {
      if (typeof web3 !== "undefined") {
        App.web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider);
      } else {
        window.alert("Please connect to Metamask.");
      }
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
        await ethereum.enable();
        web3.eth.sendTransaction({});
      } catch (error) {}
    } else if (window.web3) {
      App.web3Provider = web3.currentProvider;
      window.web3 = new Web3(web3.currentProvider);
      web3.eth.sendTransaction({});
    } else {
      console.log("Non-Ethereum browser detected. You should consider   trying MetaMask!");
    }
    },

    loadAccount: async () => {
      // Set the current blockchain account
      App.account = web3.eth.accounts[0];
    },

    loadBetFactoryContract: async () => {
      const betFactory = await $.getJSON("BetFactory.json");
      App.contracts.BetFactory = TruffleContract(betFactory);
      App.contracts.BetFactory.setProvider(App.web3Provider);
      App.counter = await App.contracts.BetFactory.deployed();
    },

    getBetTiles: async () => {
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
    

    render: async () => {
      /*if (App.loading) {
        return;
      }
      $("#account").html(App.account);
      await App.AddTransaction();*/
      web3.eth.getCoinbase(function (err, account) {
        if (err === null) {
          App.account = account
          $('#accountAddress').html('Usted está conectado con la address: ' + account)
          App.getQuantity()
          App.getBetTiles()
          //App.getFirstBetTile()
        }
      })
    },
    };

    $(() => {
      $(window).load(() => {
        App.load();
      });
    });