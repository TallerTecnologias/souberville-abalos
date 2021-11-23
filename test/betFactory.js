const BetFactory = artifacts.require('BetFactory')

contract('BetFactory', function () {
  let betFactory

  before(async () => {
    betFactory = await BetFactory.new()
  })

  describe('Deployamiento de BetFactory', async () => {
    /*it('El contrato base tiene versión 1', async () => {
      const version = await betFactory.version()
      assert.equal(version, 1)
    })
    it('El contrato base tiene nombre', async () => {
      const name = await betFactory.contractName()
      assert.equal(name, 'Factory of Bets')
    })*/
    it('Inicializa con 1 (una) instancia de apuestas default', async function () {
      const betsQuantity = await betFactory.getBetsCount()
      assert.equal(betsQuantity, 1)
    })
  })

  describe('Emisión de una apuesta', async () => {
    // Datos para crear la apuesta
    const address = '0x5c256913fd6636d9d109f440e09e42caad5f95b2'
    const name = 'Clásico Uruguayo'
    const optionA = 'Gana Peñarol'
    const optionB = 'No Gana Peñarol'
    let result

    it('Verifica información del evento', async function () {
      // Verifica que los log fueron lanzados con los datos correctos
      result = await betFactory.createBet(address, name, optionA, optionB)
      const emitedEvent = result.logs[1].args

      // no es posible leer el address de la bet
      // assert.equal(emitedEvent.oracleAddress, address)
      assert.equal(emitedEvent.name, name)
      assert.equal(emitedEvent.optionA, optionA)
      assert.equal(emitedEvent.optionB, optionB)
    })

    it('Verifica que la cantidad de apuestas se incremente en 1', async function () {
      const betsQuantity = await betFactory.getBetsCount()
      assert.equal(betsQuantity, 2)
    })
  })

  /*
  describe('Cierre de una apuesta', async () => {
    // Datos para crear la apuesta
    const address = '0x5c256913fd6636d9d109f440e09e42caad5f95b2'
    const name = 'Clásico Uruguayo'
    const optionA = 'Gana Peñarol'
    const optionB = 'No Gana Peñarol'
    // Crea la apuesta
    before(async () => {
      await betFactory.createBet(address, name, optionA, optionB)
			const bets = await betFactory.bets
			await betFactory.endBet(bets[0].address)
    }) 

    it('Verifica que la cantidad de apuestas sea 0', async function () {
      const result = await betFactory.createBet(address, name, optionA, optionB)
      // const bets = await betFactory.bets
      const emitedEvent = result.logs[1].args
      const betsQuantity = await betFactory.getBets().then(function (result) {
        return result.length
      })

      await betFactory.endBet(emitedEvent.contractAddress, 1)

      // result = await betFactory.createBet(address, name, optionA, optionB)
      // const emitedEvent = result.logs[1].args

      // Verifica que no haya apuestas
      assert.equal(betsQuantity, betsQuantity - 1)
    })
  })
*/
})
