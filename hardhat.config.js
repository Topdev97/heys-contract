/**
 * @type import('hardhat/config').HardhatUserConfig
 */

 require('dotenv').config()
 require("@nomiclabs/hardhat-ethers")
 require('@openzeppelin/hardhat-upgrades');
 require("@nomiclabs/hardhat-etherscan");
 require("@nomiclabs/hardhat-waffle");
 require("hardhat-test-utility")();
 
 const { API_URL, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env
 
 module.exports = {
   solidity: "0.8.9",
   networks: {
     hardhat: {},
     mumbai: {
       url: API_URL,
       accounts: [`0x${PRIVATE_KEY}`]
     }
   },
   etherscan: {
     apiKey: {
       polygonMumbai: ETHERSCAN_API_KEY,
     }
   },
   mocha: {
    timeout: 100000000
   },
 }
 