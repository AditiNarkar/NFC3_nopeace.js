import { getContract } from "./index";

const parseErrorMsg = (e) => {
  const json = JSON.parse(JSON.stringify(e));
  return json?.reason || json?.error?.msg;
};

let contractObject = null;

const initContract = async () => {
  if (!contractObject) {
    contractObject = await getContract();
    const { tokenContractReader, medicalContractReader } = contractObject;
    console.log(tokenContractReader, medicalContractReader)
    return { tokenContractReader, medicalContractReader };
  }
};


export async function uploadPaper(title, contentHash, accessFee, keywords) {
  try {
    const { tokenContractReader, medicalContractReader } = await initContract();
    const contract = medicalContractReader
    if (!contract) throw new Error("Contract is not initialized");
    const tx = await contract.uploadPaper(
      title,
      contentHash,
      accessFee,
      keywords
    );
    await tx.wait();
    console.log("Paper uploaded successfully");
  } catch (error) {
    console.error("Error uploading paper:", error);
    return {
      success: false,
      errorMessage: parseErrorMsg(error),
    };
  }
}

export async function accessPaper(paperId) {
  try {
    const contract = initContract();
    if (!contract) throw new Error("Contract is not initialized");
    const tx = await contract.accessPaper(paperId);
    await tx.wait();
    console.log("Paper accessed successfully");
  } catch (error) {
    console.error("Error accessing paper:", error);
    return {
      success: false,
      errorMessage: parseErrorMsg(error),
    };
  }
}

export async function submitContribution(paperId, changesHash, stakeAmount) {
  try {
    const contract = initContract();
    if (!contract) throw new Error("Contract is not initialized");
    const tx = await contract.submitContribution(
      paperId,
      changesHash,
      stakeAmount
    );
    await tx.wait();
    console.log("Contribution submitted successfully");
  } catch (error) {
    console.error("Error submitting contribution:", error);
    return {
      success: false,
      errorMessage: parseErrorMsg(error),
    };
  }
}

export async function approveContribution(paperId, contributionIndex) {
  try {
    const contract = initContract();
    if (!contract) throw new Error("Contract is not initialized");
    const tx = await contract.approveContribution(paperId, contributionIndex);
    await tx.wait();
    console.log("Contribution approved successfully");
  } catch (error) {
    console.error("Error approving contribution:", error);
    return {
      success: false,
      errorMessage: parseErrorMsg(error),
    };
  }
}

export async function getPapers() {
  try {
    const { tokenContract, contract } = initContract();
    if (!contract) throw new Error("Contract is not initialized");
    const papers = await contract.getPapers();
    console.log("Papers:", papers);
    return papers;
  } catch (error) {
    console.error("Error fetching papers:", error);
    return {
      success: false,
      errorMessage: parseErrorMsg(error),
    };
  }
}

export async function getPapersByOwnerAddress(owner) {
  try {
    const contract = initContract();
    if (!contract) throw new Error("Contract is not initialized");
    const papers = await contract.getPapersByOwnerAddress(owner);
    console.log("Papers owned by", owner, ":", papers);
    return papers;
  } catch (error) {
    console.error("Error fetching papers by owner:", error);
    return {
      success: false,
      errorMessage: parseErrorMsg(error),
    };
  }
}

export async function getContributions(paperId) {
  try {
    const contract = initContract();
    if (!contract) throw new Error("Contract is not initialized");
    const contributions = await contract.getContributions(paperId);
    console.log("Contributions for paper ID", paperId, ":", contributions);
    return contributions;
  } catch (error) {
    console.error("Error fetching contributions:", error);
    return {
      success: false,
      errorMessage: parseErrorMsg(error),
    };
  }
}

export async function getPapersAccessedByUser(user) {
  try {
    const contract = initContract();
    if (!contract) throw new Error("Contract is not initialized");
    const papers = await contract.getPapersAccessedByUser(user);
    console.log("Papers accessed by", user, ":", papers);
    return papers;
  } catch (error) {
    console.error("Error fetching papers accessed by user:", error);
    return {
      success: false,
      errorMessage: parseErrorMsg(error),
    };
  }
}

export async function getUserContributionCount(user) {
  try {
    const contract = initContract();
    if (!contract) throw new Error("Contract is not initialized");
    const count = await contract.getUserContributionCount(user);
    console.log("Contribution count for", user, ":", count.toString());
    return count;
  } catch (error) {
    console.error("Error fetching user contribution count:", error);
    return {
      success: false,
      errorMessage: parseErrorMsg(error),
    };
  }
}

export async function getPaperById(paperId) {
  try {
    const contract = initContract();
    if (!contract) throw new Error("Contract is not initialized");
    const paper = await contract.getPaperById(paperId);
    console.log("Paper details:", paper);
    return paper;
  } catch (error) {
    console.error("Error fetching paper by ID:", error);
    return {
      success: false,
      errorMessage: parseErrorMsg(error),
    };
  }
}

export async function getOriginalPaper(paperId) {
  try {
    const contract = initContract();
    if (!contract) throw new Error("Contract is not initialized");
    const originalPaper = await contract.getOriginalPaper(paperId);
    console.log("Original paper details:", originalPaper);
    return originalPaper;
  } catch (error) {
    console.error("Error fetching original paper details:", error);
    return {
      success: false,
      errorMessage: parseErrorMsg(error),
    };
  }
}
