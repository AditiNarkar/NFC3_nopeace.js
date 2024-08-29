export async function uploadPaper(title, contentHash, accessFee, keywords) {
    try {
        const tx = await contract.uploadPaper(title, contentHash, accessFee, keywords);
        await tx.wait();
        console.log("Paper uploaded successfully");
    } catch (error) {
        console.error("Error uploading paper:", error);
    }
}

export async function accessPaper(paperId) {
    try {
        const tx = await contract.accessPaper(paperId);
        await tx.wait();
        console.log("Paper accessed successfully");
    } catch (error) {
        console.error("Error accessing paper:", error);
    }
}

export async function submitContribution(paperId, changesHash, stakeAmount) {
    try {
        const tx = await contract.submitContribution(paperId, changesHash, stakeAmount);
        await tx.wait();
        console.log("Contribution submitted successfully");
    } catch (error) {
        console.error("Error submitting contribution:", error);
    }
}

export async function approveContribution(paperId, contributionIndex) {
    try {
        const tx = await contract.approveContribution(paperId, contributionIndex);
        await tx.wait();
        console.log("Contribution approved successfully");
    } catch (error) {
        console.error("Error approving contribution:", error);
    }
}

export async function getPapers() {
    try {
        const papers = await contract.getPapers();
        console.log("Papers:", papers);
        return papers;
    } catch (error) {
        console.error("Error fetching papers:", error);
    }
}

export async function getPapersByOwnerAddress(owner) {
    try {
        const papers = await contract.getPapersByOwnerAddress(owner);
        console.log("Papers owned by", owner, ":", papers);
        return papers;
    } catch (error) {
        console.error("Error fetching papers by owner:", error);
    }
}

export async function getContributions(paperId) {
    try {
        const contributions = await contract.getContributions(paperId);
        console.log("Contributions for paper ID", paperId, ":", contributions);
        return contributions;
    } catch (error) {
        console.error("Error fetching contributions:", error);
    }
}

export async function getPapersAccessedByUser(user) {
    try {
        const papers = await contract.getPapersAccessedByUser(user);
        console.log("Papers accessed by", user, ":", papers);
        return papers;
    } catch (error) {
        console.error("Error fetching papers accessed by user:", error);
    }
}

export async function getUserContributionCount(user) {
    try {
        const count = await contract.getUserContributionCount(user);
        console.log("Contribution count for", user, ":", count.toString());
        return count;
    } catch (error) {
        console.error("Error fetching user contribution count:", error);
    }
}

export async function getPaperById(paperId) {
    try {
        const paper = await contract.getPaperById(paperId);
        console.log("Paper details:", paper);
        return paper;
    } catch (error) {
        console.error("Error fetching paper by ID:", error);
    }
}

export async function getOriginalPaper(paperId) {
    try {
        const originalPaper = await contract.getOriginalPaper(paperId);
        console.log("Original paper details:", originalPaper);
        return originalPaper;
    } catch (error) {
        console.error("Error fetching original paper details:", error);
    }
}
