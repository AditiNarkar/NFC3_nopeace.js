require("dotenv").config();
const { ethers, deployments } = require("hardhat");
const fs = require("fs");

const FRONTEND_PATH_ABI = "constants/ContractABI.json";
const FRONTEND_PATH_TOKEN_ABI = "constants/TokenABI.json";

module.exports = async () => {
    console.log("Updating Frontend...");
    await updateAbi();
};

async function updateAbi() {
    const { deploy, log } = deployments;

    // Get the deployed contract
    const medicalResearchDeployment = await deployments.get("MedicalResearch");
    const medicalResearchContract = await ethers.getContractAt(
        "MedicalResearch",
        medicalResearchDeployment.address
    );
    // Write ABI to file
    fs.writeFileSync(FRONTEND_PATH_ABI, JSON.stringify(medicalResearchContract.interface.format("json")));

    const tokenDeployment = await deployments.get("MedChainToken");
    const tokenContract = await ethers.getContractAt(
        "MedChainToken",
        tokenDeployment.address
    );
    // Write ABI to file
    fs.writeFileSync(FRONTEND_PATH_TOKEN_ABI, JSON.stringify(tokenContract.interface.format("json")));

    console.log("Updated Frontend");
}
