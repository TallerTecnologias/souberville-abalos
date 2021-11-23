const BetCoin = artifacts.require('BetCoin')
const Exchanger = artifacts.require('Exchanger')
// var assert = require('assert')

require('chai').use(require('chai-as-promised')).should()

function betCoins(n) {
  return web3.utils.toWei(n, 'ether')
}

contract('Exchanger', ([deployer, investor]) => {
  let betCoin, exchanger

  before(async () => {
    betCoin = await BetCoin.new()
    exchanger = await Exchanger.new(betCoin.address)
    // Transfiere todos los tokens a Exchanger
    await betCoin.transfer(exchanger.address, betCoins('1000000'))
  })

  describe('Deployamiento de BetCoin', async () => {
    it('El contrato de BetCoin tiene nombre', async () => {
      const name = await betCoin.name()
      assert.equal(name, 'BetCoin')
    })
  })

  describe('Deployamiento de Exchanger', async () => {
    it('El contrato de Exchanger tiene nombre', async () => {
      const name = await exchanger.name()
      assert.equal(name, 'BetCoin Exchanger')
    })

    it('El contrato tiene betCoins', async () => {
      let balance = await betCoin.balanceOf(exchanger.address)
      assert.equal(balance.toString(), betCoins('1000000'))
    })
  })

  describe('buyBetCoin()', async () => {
    let result

    before(async () => {
      // Compra BetCoin antes de cada prueba
      result = await exchanger.buyBetCoin({
        from: investor,
        value: web3.utils.toWei('1', 'ether')
      })
    })

    it('Permite a los usuario comprar BetCoin de Exchanger por valor fijo', async () => {
      // Verifica el saldo en BetCoin del comprador despues de la compra
      let investorBalance = await betCoin.balanceOf(investor)
      assert.equal(investorBalance.toString(), betCoins('100'))

      // Verifica el saldo de Exchanger despues de la compra
      let exchangerBalance
      exchangerBalance = await betCoin.balanceOf(exchanger.address)
      assert.equal(exchangerBalance.toString(), betCoins('999900'))
      exchangerBalance = await web3.eth.getBalance(exchanger.address)
      assert.equal(exchangerBalance.toString(), web3.utils.toWei('1', 'Ether'))

      // Verifica que los log fueron lanzados con los datos correctos
      const event = result.logs[0].args
      assert.equal(event.account, investor)
      assert.equal(event.token, betCoin.address)
      assert.equal(event.amount.toString(), betCoins('100').toString())
      assert.equal(event.rate.toString(), '100')
    })
  })

  describe('sellBetCoin()', async () => {
    let result

    before(async () => {
      // El vendedor debe aprobar los betCoins antes de cada venta
      await betCoin.approve(exchanger.address, betCoins('100'), {
        from: investor
      })
      // El vendedor vende betCoins
      result = await exchanger.sellBetCoin(betCoins('100'), { from: investor })
    })

    it('Permite a los usuario vender betCoins a exchanger con valor fijo', async () => {
      // Verifica el saldo en betCoins del usuario despues de la compra
      let investorBalance = await betCoin.balanceOf(investor)
      assert.equal(investorBalance.toString(), betCoins('0'))

      // Verifica el saldo de exchanger despues de la compra
      let exchangerBalance
      exchangerBalance = await betCoin.balanceOf(exchanger.address)
      assert.equal(exchangerBalance.toString(), betCoins('1000000'))
      exchangerBalance = await web3.eth.getBalance(exchanger.address)
      assert.equal(exchangerBalance.toString(), web3.utils.toWei('0', 'Ether'))

      // Verifica los logs para saber si los eventos fueron emitidos con la informacion correcta
      const event = result.logs[0].args
      assert.equal(event.account, investor)
      assert.equal(event.token, betCoin.address)
      assert.equal(event.amount.toString(), betCoins('100').toString())
      assert.equal(event.rate.toString(), '100')

      // Error el vendedor no puede vender mas betCoins de las que tiene
      await exchanger.sellBetCoin(betCoins('500'), { from: investor }).should.be
        .rejected
    })
  })
})
