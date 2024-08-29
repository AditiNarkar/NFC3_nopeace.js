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

    if (!ethereum) {
      throw new Error(
        "Ethereum provider not found. Please install MetaMask or another Web3 wallet."
      );
    }

    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
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

    return { tokenContractReader, medicalContractReader };
  } catch (error) {
    console.error(
      "An error occurred while setting up the contract:",
      error.message
    );
    return null;
  }
};
