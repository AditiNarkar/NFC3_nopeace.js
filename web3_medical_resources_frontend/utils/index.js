import { ethers } from "ethers";
import {
  tokenContractAddress,
  medicalContractAddress,

} from "../constants";

import token_abi from "../constants/TokenABI.json"
import medical_abi from "../constants/ContractABI.json"


export const getContract = async () => {
  if (typeof window === "undefined") {
    console.error("window is undefined, this code must be run client-side.");
    return null;
  }

  try {
    const { ethereum } = window;
    console.log("ethereum:", ethereum)
    if (!ethereum || !ethereum.isMetaMask) {
      throw new Error(
        "Ethereum provider not found. Please install MetaMask or another Web3 wallet."
      );
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    // const provider = new ethers.providers.Web3Provider(ethereum);

    //const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");

    //await ethereum.request({ method: 'eth_requestAccounts' });

    const signer = await provider.getSigner();
    console.log("signer", signer)

    const tokenContractReader = new ethers.Contract(
      tokenContractAddress,
      token_abi,
      signer
    );
    const medicalContractReader = new ethers.Contract(
      medicalContractAddress,
      medical_abi,
      signer
    );

    const tx = await tokenContractReader.approve(medicalContractReader, ethers.parseEther("100000"));
    await tx.wait(1);
    console.log("ApprovedContractToSpendToken")

    return { tokenContractReader, medicalContractReader };
  } catch (error) {
    console.error(
      "An error occurred while setting up the contract:",
      error.message
    );
    return null;
  }
};
