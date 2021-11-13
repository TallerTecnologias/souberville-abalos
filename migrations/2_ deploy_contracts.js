const BetCoin = artifacts.require('BetCoin')
const Exchanger = artifacts.require('Exchanger')

module.exports = async function (deployer) {
  // Deploy BetCoin
  await deployer.deploy(BetCoin)
  const betCoin = await BetCoin.deployed()

  // Deploy Exchanger
  await deployer.deploy(Exchanger, betCoin.address)
  const exchanger = await Exchanger.deployed()

  // Transfer all tokens to Exchanger (1 million)
  await betCoin.transfer(exchanger.address, '1000000000000000000000000')
}
