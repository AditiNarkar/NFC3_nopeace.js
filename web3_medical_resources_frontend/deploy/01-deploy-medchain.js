const { network, getNamedAccounts, deployments } = require("hardhat");
const { devChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify.js");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  let MedChainTokenAddress;

  if (devChains.includes(network.name)) {
    const token = await deployments.get("MedChainToken");
    MedChainTokenAddress = token.address;
    console.log(MedChainTokenAddress);
  }

  const args = [MedChainTokenAddress];

  const MedicalResearch = await deploy("MedicalResearch", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  log("-------Contract Deployed--------");

  if (!devChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    log("Verifying.........");
    await verify(MedicalResearch.address, args);
  }
};
module.exports.tags = ["all", "Medic  alResearch"];
