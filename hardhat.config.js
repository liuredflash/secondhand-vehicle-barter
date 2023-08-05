// require("@nomiclabs/hardhat-waffle")
// require("@nomiclabs/hardhat-etherscan")
// require("hardhat-deploy")
// require("solidity-coverage")
require("hardhat-gas-reporter")
// require("hardhat-contract-sizer")
// require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()
// const chai = require('chai');
// const eventemitter2 = require('chai-eventemitter2');

// chai.use(eventemitter2());


const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
const PRIVATE_KEY_FOR_CONTRACT_ACCOUNT2 = process.env.PRIVATE_KEY_FOR_CONTRACT_ACCOUNT2
const PRIVATE_KEY_ACCOUNT1 = process.env.PRIVATE_KEY_ACCOUNT1
const PRIVATE_KEY_ACCOUNT3 = process.env.PRIVATE_KEY_ACCOUNT3
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
      blockConfirmations: 1,
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY_FOR_CONTRACT_ACCOUNT2, PRIVATE_KEY_ACCOUNT1, PRIVATE_KEY_ACCOUNT3],
      chainId: 11155111,
      blockConfirmations: 6,
    },
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY,
    }
  },
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 300,
      },
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    player: {
      default: 1,
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,

  },
};
