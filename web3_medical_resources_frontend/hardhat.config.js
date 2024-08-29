require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("hardhat-gas-reporter");
require("dotenv").config();

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;

module.exports = {
  //solidity: "0.8.19",
  solidity: {
    compilers: [
      { version: "0.8.4" },
      { version: "0.8.24" },
      { version: "0.6.0" },
      { version: "0.6.6" },
      { version: "0.6.12" },
      { version: "0.4.19" },
    ],
  },
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [SEPOLIA_PRIVATE_KEY],
      chainId: 11155111, // from chainlink.org
      blockConfirmations: 4,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0, //first account in the list of available accounts
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};
