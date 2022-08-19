async function main() {
  // const HelloWorld = await ethers.getContractFactory('HelloWorld')
  // const hello_world = await HelloWorld.deploy('Hello World!')
  const GatheringToken = await ethers.getContractFactory('GatheringToken')
  const gathering_token = await GatheringToken.deploy()
  await gathering_token.deployed();
  console.log('Contract deployed to address:', gathering_token.address)

  // ********* Reward Token contract deploy ********* //
  const Token = await hre.ethers.getContractFactory("RewardToken");
  const token = await Token.deploy();
  await token.deployed();
  console.log("Token deployed to:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
