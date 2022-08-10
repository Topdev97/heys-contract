```
npx hardhat run scripts/deploy.js --network polygon_mumbai
npx hardhat run scripts/deployProxy.js --network polygon_mumbai

npx hardhat run scripts/upgradeProxy.js --network polygon_mumbai
npx hardhat flatten ./contracts/GatheringToken.sol > ./contractsFlat/GatheringTokenFlat.sol
node scripts/formatFlattened.js contractsFlat/GatheringTokenFlat.sol

OR

sh ./upgradeProxyScript.sh (on Mac)
```

```
https://mumbai.polygonscan.com/address/0xa05425b2Fa8FafD7Caf0D8C5F0a78C922f607152#readContract
```

