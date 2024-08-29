import { ethers } from "ethers";

// Contract ABI and Address
const contractABI = [ /* ABI array here */ ];
const contractAddress = "0xYourContractAddress";

// Initialize provider and contract
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, contractABI, signer);
