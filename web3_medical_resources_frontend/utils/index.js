import { ethers } from "ethers";
import {
  tokenContractAddress,
  medicalContractAddress,
  token_abi,
  medical_abi,
} from "../constants";

export const getContract = () => {
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

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
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

    return tokenContractReader, medicalContractReader;
  } catch (error) {
    console.error(
      "An error occurred while setting up the contract:",
      error.message
    );
    return null;
  }
};
