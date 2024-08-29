const { network, getNamedAccounts, deployments } = require("hardhat");
const { devChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const args = [ethers.parseEther("10000000000000000000000000")];

  const MedChainToken = await deploy("MedChainToken", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  log("-------Contract Deployed--------");

  if (!devChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    log("Verifying.........");
    await verify(MedChainToken.address, args);
  }
  log("--------------------");
};
module.exports.tags = ["all", "MedChainToken"];
