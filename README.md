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

Reward token: 0xaBBc68F5B8882f6c74E8D9F30F21737AA586d46d
Gathering token: 0xDc254b0148b534A7c3A0A42CAbBe282148b34822
