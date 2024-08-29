const networkConfig = {
  11155111: {
    // if network is sepolia
    name: "sepolia",
    //0x694AA1769357215DE4FAC081bf1f309aDC325306
  },
  137: {
    name: "Polygon",
  },
  // localhost
  5777: {
    name: "localhost",
  },
};

// chains that mocks are goin to be deployed on
const devChains = ["hardhat", "localhost"];

module.exports = {
  networkConfig,
  devChains,
};
