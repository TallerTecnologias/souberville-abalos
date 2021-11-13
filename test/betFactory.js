/* var BetFactory = artifacts.require('./BetFactory.sol')
contract('BetFactory', function (accounts) {
  var betfactoryInstance

  it('Inicializa sin instancias de apuestas', function () {
    return BetFactory.deployed()
      .then(function (instance) {
        return instance.getBets()
      })
      .then(function (result) {
        assert.equal(result.length, 0)
      })
  })

  it('Cantidad de apuestas es 1 al crear una', function () {
    return BetFactory.deployed()
      .then(function (instance) {
        betfactoryInstance = instance
        betfactoryInstance.createBet(
          '0x5c256913fd6636d9d109f440e09e42caad5f95b2',
          'Nombre apuesta',
          'Opcion 1',
          'Opcion 2'
        )
      })
      .then(function () {
        return betfactoryInstance.bets(0)
      })
      .then(function (bet) {
        assert.equal(
          bet[0],
          '0x5c256913fd6636d9d109f440e09e42caad5f95b2',
          'el address es correcto'
        )
        assert.equal(bets[1], 'Nombre apuesta', 'el nombre es correcto')
        assert.equal(bets[2], 'Opcion 1', 'Opcion 1 correcta')
        assert.equal(bets[3], 'Opcion 2', 'Opcion 2 correcta')
      })
  })

  it('allows a voter to cast a vote', function () {
    return Election.deployed()
      .then(function (instance) {
        electionInstance = instance
        candidateId = 1
        return electionInstance.vote(candidateId, { from: accounts[0] })
      })
      .then(function (receipt) {
        assert.equal(receipt.logs.length, 1, 'an event was triggered')
        assert.equal(
          receipt.logs[0].event,
          'votedEvent',
          'the event type is correct'
        )
        assert.equal(
          receipt.logs[0].args._candidateId.toNumber(),
          candidateId,
          'the candidate id is correct'
        )
        return electionInstance.voters(accounts[0])
      })
      .then(function (voted) {
        assert(voted, 'the voter was marked as voted')
        return electionInstance.candidates(candidateId)
      })
      .then(function (candidate) {
        var voteCount = candidate[2]
        assert.equal(voteCount, 1, "increments the candidate's vote count")
      })
  })

  it('throws an exception for invalid candiates', function () {
    return Election.deployed()
      .then(function (instance) {
        electionInstance = instance
        return electionInstance.vote(99, { from: accounts[1] })
      })
      .then(assert.fail)
      .catch(function (error) {
        assert(
          error.message.indexOf('revert') >= 0,
          'error message must contain revert'
        )
        return electionInstance.candidates(1)
      })
      .then(function (candidate1) {
        var voteCount = candidate1[2]
        assert.equal(voteCount, 1, 'candidate 1 did not receive any votes')
        return electionInstance.candidates(2)
      })
      .then(function (candidate2) {
        var voteCount = candidate2[2]
        assert.equal(voteCount, 0, 'candidate 2 did not receive any votes')
      })
  })

  it('throws an exception for double voting', function () {
    return Election.deployed()
      .then(function (instance) {
        electionInstance = instance
        candidateId = 2
        electionInstance.vote(candidateId, { from: accounts[1] })
        return electionInstance.candidates(candidateId)
      })
      .then(function (candidate) {
        var voteCount = candidate[2]
        assert.equal(voteCount, 1, 'accepts first vote')
        // Try to vote again
        return electionInstance.vote(candidateId, { from: accounts[1] })
      })
      .then(assert.fail)
      .catch(function (error) {
        assert(
          error.message.indexOf('revert') >= 0,
          'error message must contain revert'
        )
        return electionInstance.candidates(1)
      })
      .then(function (candidate1) {
        var voteCount = candidate1[2]
        assert.equal(voteCount, 1, 'candidate 1 did not receive any votes')
        return electionInstance.candidates(2)
      })
      .then(function (candidate2) {
        var voteCount = candidate2[2]
        assert.equal(voteCount, 1, 'candidate 2 did not receive any votes')
      })
  }) 
}) */
