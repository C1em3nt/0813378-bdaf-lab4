/**
* @type import('hardhat/config').HardhatUserConfig
*/
require("@nomicfoundation/hardhat-chai-matchers");
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("hardhat-gas-reporter");
require("solidity-coverage");


module.exports = {
   solidity: "0.8.18",
   defaultNetwork: "hardhat",
   networks: {

   }
}

