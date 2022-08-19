const { ethers, upgrades } = require('hardhat')

async function main() {
  const GatheringToken = await ethers.getContractFactory('GatheringToken')
  console.log('Deploying GatheringToken...')
  const gatheringToken = await upgrades.deployProxy(GatheringToken, [], { initializer: 'initialize' });
  await gatheringToken.deployed();
  console.log('GatheringToken Proxy deployed to:', gatheringToken.address)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
