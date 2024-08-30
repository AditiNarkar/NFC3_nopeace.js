// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MedicalResearch {
    // ERC20 token used for payments and staking
    ERC20 public token;

    // Struct to represent a research paper
    struct Paper {
        address author; // Address of the paper's author
        string title; // Title of the paper
        string contentHash; // Hash of the content to ensure integrity
        uint256 accessFee; // Fee in tokens to access the paper
        string[] keywords; // Array of keywords related to the paper
        bool exists; // Flag to indicate if the paper exists
        uint256 parentPaperId; // ID of the original paper (0 if original)
    }

    // Struct to represent a contribution to a paper
    struct Contribution {
        address contributor; // Address of the contributor
        string changesHash; // Hash of the changes made
        bool approved; // Flag to indicate if the contribution is approved
        uint256 stakeAmount; // Amount of tokens staked for the contribution
    }

    uint256 private nextPaperId; // Counter for generating new paper IDs
    uint256 private nextContributionIndex; // Counter for generating new contribution indices
    uint private totalPaperCount;

    // Mappings to store papers, contributions, access fees, and other data
    mapping(uint256 => Paper) public papers; // Mapping from paper ID to Paper struct
    mapping(uint256 => mapping(uint256 => Contribution)) public contributions; // Mapping from paper ID to a mapping of contribution indices to Contribution structs
    mapping(uint256 => uint256) public paperContributionCount; // Mapping from paper ID to the number of contributions it has received
    mapping(uint256 => uint256) public paperAccessFees; // Mapping from paper ID to total access fees earned
    mapping(address => mapping(uint256 => bool)) public paperAccessed; // Mapping from user address to paper ID to access status
    mapping(address => uint256) public userContributionCount; // Mapping from user address to number of contributions made
    mapping(address => mapping(uint256 => uint256)) public ownerPapers; // Mapping from owner address to an index-to-paperId mapping
    mapping(address => uint256) public ownerPaperCount; // Mapping from owner address to the number of papers they own

    // Events to log actions in the contract
    event PaperUploaded(
        uint256 paperId,
        address indexed author,
        string title,
        string contentHash,
        uint256 accessFee,
        string[] keywords
    );
    event ContributionSubmitted(
        uint256 paperId,
        uint256 contributionIndex,
        address indexed contributor,
        string changesHash,
        uint256 stakeAmount
    );
    event ContributionApproved(
        uint256 oldPaperId,
        uint256 newPaperId,
        uint256 contributionIndex,
        address indexed contributor,
        uint256 rewardAmount
    );
    event PaperAccessed(uint256 paperId, address indexed user, uint256 feePaid);
    event PaperUpdated(uint256 newPaperId, string newContentHash); // Event for new paper update

    // Constructor to initialize the contract with the token address
    constructor(address _tokenAddress) {
        token = ERC20(_tokenAddress);
        nextPaperId = 1; // Start paper IDs from 1
        nextContributionIndex = 0; // Start contribution indices from 0
        totalPaperCount = 0;
    }

    // Function to upload a new paper
    function uploadPaper(
        string memory title,
        string memory contentHash,
        uint256 accessFee,
        string[] memory keywords
    ) external {
        uint256 paperId = nextPaperId;
        nextPaperId++; // Increment the paper ID counter

        papers[paperId] = Paper({
            author: msg.sender,
            title: title,
            contentHash: contentHash,
            accessFee: accessFee,
            keywords: keywords,
            exists: true,
            parentPaperId: 0 // No parent for original papers
        });

        ownerPapers[msg.sender][ownerPaperCount[msg.sender]] = paperId;
        ownerPaperCount[msg.sender]++; // Increment the count of papers owned by the author
        totalPaperCount++;
        paperAccessed[msg.sender][paperId] = true;

        emit PaperUploaded(
            paperId,
            msg.sender,
            title,
            contentHash,
            accessFee,
            keywords
        );
    }

    // Function to access a paper by paying the access fee
    function accessPaper(uint256 paperId) external payable {
        require(papers[paperId].exists, "Paper does not exist");
        require(
            !paperAccessed[msg.sender][paperId],
            "User already has access to this paper"
        );

        bool success = token.transferFrom(
            msg.sender,
            papers[paperId].author,
            papers[paperId].accessFee
        );
        if (success) {
            paperAccessFees[paperId] += papers[paperId].accessFee; // Add the fee to the total access fees

            paperAccessed[msg.sender][paperId] = true; // Mark the paper as accessed by the user

            emit PaperAccessed(paperId, msg.sender, papers[paperId].accessFee);
        }
    }

    // Function to submit a contribution to a paper
    function submitContribution(
        uint256 paperId,
        string memory changesHash,
        uint256 stakeAmount
    ) external {
        require(papers[paperId].exists, "Paper does not exist");
        require(
            token.transferFrom(msg.sender, address(this), stakeAmount),
            "Token transfer failed"
        );

        uint256 contributionIndex = paperContributionCount[paperId]; // Get the index for the new contribution
        paperContributionCount[paperId]++; // Increment the contribution count for the paper

        contributions[paperId][contributionIndex] = Contribution({
            contributor: msg.sender,
            changesHash: changesHash,
            approved: false,
            stakeAmount: stakeAmount
        });

        userContributionCount[msg.sender]++; // Increment the contribution count for the user

        emit ContributionSubmitted(
            paperId,
            contributionIndex,
            msg.sender,
            changesHash,
            stakeAmount
        );
    }

    // Function to approve a contribution to a paper
    function approveContribution(
        uint256 paperId,
        uint256 contributionIndex
    ) external {
        require(papers[paperId].exists, "Paper does not exist");
        require(
            msg.sender == papers[paperId].author,
            "Only the author can approve contributions"
        );
        require(
            contributionIndex < paperContributionCount[paperId],
            "Invalid contribution index"
        );
        require(
            !contributions[paperId][contributionIndex].approved,
            "Contribution already approved"
        );

        Contribution storage contribution = contributions[paperId][
            contributionIndex
        ];
        uint256 rewardAmount = contribution.stakeAmount +
            ((paperAccessFees[paperId] * 10) / 100); // Reward includes 10% of the access fees earned by the paper

        require(
            token.transfer(contribution.contributor, rewardAmount),
            "Token transfer failed"
        );

        // Create a new paper with the updated content
        uint256 newPaperId = nextPaperId;
        nextPaperId++;

        papers[newPaperId] = Paper({
            author: msg.sender,
            title: papers[paperId].title, // Keep the title the same
            contentHash: contribution.changesHash,
            accessFee: papers[paperId].accessFee, // Keep the access fee the same
            keywords: papers[paperId].keywords, // Keep the keywords the same
            exists: true,
            parentPaperId: paperId // Reference to the original paper
        });

        ownerPapers[msg.sender][ownerPaperCount[msg.sender]] = newPaperId;
        ownerPaperCount[msg.sender]++; // Increment the count of papers owned by the author

        contribution.approved = true; // Mark the contribution as approved
        paperAccessed[msg.sender][newPaperId] = true;

        emit ContributionApproved(
            paperId,
            newPaperId,
            contributionIndex,
            contribution.contributor,
            rewardAmount
        );
        emit PaperUpdated(newPaperId, contribution.changesHash); // Emit event for new paper
    }

    // Function to get the total count of papers owned by an address
    function getOwnerPaperCount(address owner) external view returns (uint256) {
        return ownerPaperCount[owner];
    }

    // Function to get the paper ID owned by an address at a specific index
    function getPaperIdByOwnerAndIndex(
        address owner,
        uint256 index
    ) external view returns (uint256) {
        require(index < ownerPaperCount[owner], "Index out of bounds");
        return ownerPapers[owner][index];
    }

    // Function to get the contribution details by paper ID and contribution index
    function getContributionByIndex(
        uint256 paperId,
        uint256 index
    ) external view returns (Contribution memory) {
        require(index < paperContributionCount[paperId], "Index out of bounds");
        return contributions[paperId][index];
    }

    // Function to get paper details by paper ID
    function getPaperById(
        uint256 paperId
    )
        external
        view
        returns (
            address author,
            string memory title,
            string memory contentHash,
            uint256 accessFee,
            string[] memory keywords,
            uint256 parentPaperId
        )
    {
        require(papers[paperId].exists, "Paper does not exist");
        Paper memory paper = papers[paperId];
        return (
            paper.author,
            paper.title,
            paper.contentHash,
            paper.accessFee,
            paper.keywords,
            paper.parentPaperId
        );
    }

    // Function to get the total count of papers in the contract
    function getTotalPaperCount() external view returns (uint256) {
        return totalPaperCount;
    }

    function getAccessibillity(
        address s,
        uint paperId
    ) public view returns (bool) {
        return paperAccessed[s][paperId];
    }

    // Function to get the list of paper IDs accessed by a user
    function getPapersAccessedByUser(
        address user
    ) external view returns (uint256[] memory) {
        uint256 paperCount = 0;
        // Calculate the number of papers accessed by the user
        for (uint256 i = 1; i <= nextPaperId; i++) {
            if (paperAccessed[user][i]) {
                paperCount++;
            }
        }

        uint256[] memory accessedPapers = new uint256[](paperCount);
        uint256 index = 0;
        // Collect the paper IDs
        for (uint256 i = 1; i <= nextPaperId; i++) {
            if (paperAccessed[user][i]) {
                accessedPapers[index] = i;
                index++;
            }
        }
        return accessedPapers;
    }
}
