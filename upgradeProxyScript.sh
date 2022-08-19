#!/bin/bash

# npx hardhat run scripts/upgradeProxy.js --network polygon_mumbai
# npx hardhat flatten ./contracts/GatheringToken.sol > ./contractsFlat/GatheringTokenFlat.sol
"C:\DEV\TOOLS\nodejs\node" scripts/formatFlattened.js contractsFlat/GatheringTokenFlat.sol
notepad ./contractsFlat/output.sol