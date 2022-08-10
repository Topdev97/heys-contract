async function main() {
const { argv } = require('process')
    console.log(argv[2])

    const fs = require('fs')
    const content = fs.readFileSync(argv[2]).toString()

    const noPragmaContent = content
        .replace(/(pragma solidity.*;)/g, '')
        .replace('// Sources flattened with hardhat v2.9.1 https://hardhat.org', '')
        .replace('﻿', '')
    const noLicenseContent = noPragmaContent
        .replace(/(\/\/ SPDX-License.*)/g, '')
    const finalContent =
        '// Sources flattened with hardhat v2.9.1 https://hardhat.org \n' +
        '// SPDX-License-Identifier: MIT \n' +
        'pragma solidity >=0.8.9; \n' +
        noLicenseContent

    fs.writeFileSync('contractsFlat/output.sol', finalContent, { encoding: 'utf16le' })

    console.log('Contract cleaned up')
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
