const { ethers, upgrades } = require('hardhat')

async function upgrade() {
  const PROXY_ADDRESS = '0xc341333737C6CDec94D40B839b43684eA9B0e5D8'

  const GatheringToken = await ethers.getContractFactory('GatheringToken')
  console.log('Upgrading GatheringToken...')
  const upgrage = await upgrades.upgradeProxy(PROXY_ADDRESS, GatheringToken);
  console.log('GatheringToken upgraded')
  console.log(upgrage.deployTransaction.data.split('000000000000000000000000')[2])
}

upgrade()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
