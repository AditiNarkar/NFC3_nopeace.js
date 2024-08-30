"use client"
import { getContract } from "./index";
import { ethers } from "ethers"

const parseErrorMsg = (e) => {
  const json = JSON.parse(JSON.stringify(e));
  return json?.reason || json?.error?.msg;
};

let contractObject
const initContract = async () => {
  console.log("contractObject:", contractObject)
  if (!contractObject) {
    try {
      contractObject = await getContract();
      const { tokenContractReader, medicalContractReader } = contractObject;
      console.log("tokenContractReader",
        tokenContractReader, "medicalContractReader", medicalContractReader);

      const tx = await tokenContractReader.approve(medicalContractReader, ethers.parseEther("10000000"));
      await tx.wait(1);
      console.log("ApprovedContractToSpendToken")

      return {
        success: true,
        tokenContractReader,
        medicalContractReader
      };
    } catch (error) {
      console.log("Error initializing contract:", error);
      return {
        success: false,
        errorMessage: parseErrorMsg(error),

      }
    }
  }
  else {
    const { tokenContractReader, medicalContractReader } = contractObject;
    return { tokenContractReader, medicalContractReader }
  }
};



async function requestTokens(address) {
  const { TokenAddress, medicalContractReader } = await initContract();
  await TokenAddress.transfer(address, ethers.parseEther("1000"));
  return
}



export async function getPapersAccessedByUser(userAddress) {
  try {
    const { tokenContractReader, medicalContractReader } = await initContract();
    const contract = medicalContractReader;
    if (!contract) {
      console.log("Contract is not initialized");
    }

    // Fetch the list of paper IDs accessed by the user
    const accessedPaperIds = await contract.getPapersAccessedByUser(userAddress);

    // Convert the list of paper IDs to a format suitable for use
    const papersAccessed = accessedPaperIds.map(id => id.toString());

    console.log("Papers accessed by", userAddress, ":", papersAccessed);
    return {
      success: true,
      papersAccessed: papersAccessed
    };
  } catch (error) {
    console.error("Error fetching papers accessed by user:", error);
    return {
      success: false,
      errorMessage: parseErrorMsg(error),
    };
  }
}

export async function uploadPaper(title, contentHash, accessFee, keywords) {
  try {
    const { tokenContractReader, medicalContractReader } = await initContract();
    const contract = medicalContractReader;
    if (!contract) {
      console.log("Contract is not initialized");
    }
    const tx = await contract.uploadPaper(
      title,
      contentHash,
      accessFee,
      keywords
    );
    const txreceipt = await tx.wait(1);
    console.log("Paper uploaded successfully");
    return {
      success: true,
      txreceipt: txreceipt
    }
  } catch (error) {
    console.log("Error uploading paper:", error);
    return {
      success: false,
      errorMessage: parseErrorMsg(error),
    };
  }
}

export async function accessPaper(address, paperId) {
  try {
    const { tokenContractReader, medicalContractReader } = await initContract();
    const contract = medicalContractReader;
    if (!contract) {
      console.log("Contract is not initialized");
      return
    }

    const AMT = 10;
    const allowance = await tokenContractReader.allowance(address, medicalContractReader);
    if (allowance < AMT) {
      await tokenContractReader.connect(address).approve(medicalContractReader, AMT);
      console.log(`Approved ${ethers.formatEther(AMT)} MCT.`);
    }

    const tx = await contract.accessPaper(paperId);
    const txreceipt = await tx.wait();

    console.log("Paper accessed successfully");
    return {
      success: true,
      data: txreceipt
    };
  }
  catch (error) {
    console.error("Error accessing paper:", error);
    return {
      success: false,
      errorMessage: parseErrorMsg(error),
    };
  }
}

export async function submitContribution(paperId, changesHash, stakeAmount) {
  try {
    const { medicalContractReader } = await initContract();
    const contract = medicalContractReader;
    if (!contract) console.log("Contract is not initialized");
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
    const { medicalContractReader } = await initContract();
    const contract = medicalContractReader;
    if (!contract) console.log("Contract is not initialized");
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

export async function getPapersByOwnerAddress(owner) {
  try {
    const { medicalContractReader } = await initContract();
    const contract = medicalContractReader;
    if (!contract) console.log("Contract is not initialized");

    const ownerPaperCount = await contract.getOwnerPaperCount(owner);
    const papers = [];

    for (let i = 0; i < ownerPaperCount; i++) {
      const paperId = await contract.getPaperIdByOwnerAndIndex(owner, i);
      const paper = await contract.getPaperById(paperId);
      papers.push(paper);
    }

    console.log("Papers owned by", owner, ":", papers);
    return {
      success: true,
      papers: papers,
    };;
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
    const { medicalContractReader } = await initContract();
    const contract = medicalContractReader;
    if (!contract) console.log("Contract is not initialized");

    const contributionCount = await contract.getContributionCount(paperId);
    const contributions = [];

    for (let i = 0; i < contributionCount; i++) {
      const contribution = await contract.getContributionByIndex(paperId, i);
      contributions.push(contribution);
    }

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

export async function getAccessibillity(address, paperId) {
  try {
    const { medicalContractReader } = await initContract();
    const contract = medicalContractReader;
    if (!contract) console.log("Contract is not initialized");

    const hasAccess = await contract.getAccessibillity(address, paperId);

    return {
      success: true,
      data: hasAccess,
    };
  } catch (error) {
    return {
      success: false,
      errorMessage: parseErrorMsg(error) || "Unknown Error",
    };
  }

}
export async function getUserContributionCount(user) {
  try {
    const { medicalContractReader } = await initContract();
    const contract = medicalContractReader;
    if (!contract) console.log("Contract is not initialized");
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
    const { medicalContractReader } = await initContract();
    const contract = medicalContractReader;
    if (!contract) console.log("Contract is not initialized");
    const paper = await contract.getPaperById(paperId);
    console.log("Paper details:", paper);
    return {
      success: true,
      data: paper
    }
  } catch (error) {
    return {
      success: false,
      errorMessage: parseErrorMsg(error),
    };
  }
}

export async function getOriginalPaper(paperId) {
  try {
    const { medicalContractReader } = await initContract();
    const contract = medicalContractReader;
    if (!contract) console.log("Contract is not initialized");
    const originalPaper = await contract.getPaperById(paperId);
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

export async function getTotalPapersByCount() {
  try {
    const { medicalContractReader } = await initContract();
    const contract = medicalContractReader;
    if (!contract) console.log("Contract is not initialized");
    const totalPapers = await contract.getTotalPaperCount();
    console.log("Total paper count:", totalPapers.toString());

    const papers = [];
    for (let i = 1; i <= totalPapers; i++) {
      const paper = await contract.getPaperById(i);
      papers.push(paper);
    }

    return papers;

  } catch (error) {
    console.error("Error fetching total paper details:", error);
    return {
      success: false,
      errorMessage: parseErrorMsg(error),
    };
  }
}
