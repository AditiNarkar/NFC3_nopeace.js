// SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// // import "@openzeppelin/contracts/access/Ownable.sol";

// contract MedicalResearch {
//     // ERC20 token used for payments and staking
//     ERC20 public token;

//     // Struct to represent a research paper
//     struct Paper {
//         address author; // Address of the paper's author
//         string title; // Title of the paper
//         string contentHash; // Hash of the content to ensure integrity
//         uint256 accessFee; // Fee in tokens to access the paper
//         string[] keywords; // Array of keywords related to the paper
//         bool exists; // Flag to indicate if the paper exists
//         uint256 parentPaperId; // ID of the original paper (0 if original)
//     }

//     // Struct to represent a contribution to a paper
//     struct Contribution {
//         address contributor; // Address of the contributor
//         string changesHash; // Hash of the changes made
//         bool approved; // Flag to indicate if the contribution is approved
//         uint256 stakeAmount; // Amount of tokens staked for the contribution
//     }

//     uint256 private nextPaperId; // Counter for generating new paper IDs
//     uint256 private nextContributionIndex; // Counter for generating new contribution indices
//     uint private totalPaperCount;

//     // Mappings to store papers, contributions, access fees, and other data
//     mapping(uint256 => Paper) public papers; // Mapping from paper ID to Paper struct
//     mapping(uint256 => Contribution[]) public contributions; // Mapping from paper ID to an array of Contribution structs
//     mapping(uint256 => uint256) public paperAccessFees; // Mapping from paper ID to total access fees earned
//     mapping(address => uint256[]) private papersByOwner; // Mapping from owner address to an array of paper IDs owned
//     mapping(uint256 => mapping(address => bool)) public paperAccessed; // Mapping from paper ID to a mapping of user addresses to access status
//     mapping(address => uint256) public userContributionCount; // Mapping from user address to number of contributions made

//     // Events to log actions in the contract
//     event PaperUploaded(
//         uint256 paperId,
//         address indexed author,
//         string title,
//         string contentHash,
//         uint256 accessFee,
//         string[] keywords
//     );
//     event ContributionSubmitted(
//         uint256 paperId,
//         uint256 contributionIndex,
//         address indexed contributor,
//         string changesHash,
//         uint256 stakeAmount
//     );
//     event ContributionApproved(
//         uint256 oldPaperId,
//         uint256 newPaperId,
//         uint256 contributionIndex,
//         address indexed contributor,
//         uint256 rewardAmount
//     );
//     event PaperAccessed(uint256 paperId, address indexed user, uint256 feePaid);
//     event PaperUpdated(uint256 newPaperId, string newContentHash); // Event for new paper update

//     // Constructor to initialize the contract with the token address
//     constructor(address _tokenAddress) {
//         token = ERC20(_tokenAddress);
//         nextPaperId = 1; // Start paper IDs from 1
//         nextContributionIndex = 0; // Start contribution indices from 0
//         totalPaperCount = 0;
//     }

//     // Function to upload a new paper
//     function uploadPaper(
//         string memory title,
//         string memory contentHash,
//         uint256 accessFee,
//         string[] memory keywords
//     ) external {
//         uint256 paperId = nextPaperId;
//         nextPaperId++; // Increment the paper ID counter

//         papers[paperId] = Paper({
//             author: msg.sender,
//             title: title,
//             contentHash: contentHash,
//             accessFee: accessFee,
//             keywords: keywords,
//             exists: true,
//             parentPaperId: 0 // No parent for original papers
//         });

//         papersByOwner[msg.sender].push(paperId); // Add the paper ID to the list of papers owned by the author
//         totalPaperCount++;

//         emit PaperUploaded(
//             paperId,
//             msg.sender,
//             title,
//             contentHash,
//             accessFee,
//             keywords
//         );
//     }

//     // Function to access a paper by paying the access fee
//     function accessPaper(uint256 paperId) external {
//         require(papers[paperId].exists, "Paper does not exist");
//         require(
//             !paperAccessed[paperId][msg.sender],
//             "User already has access to this paper"
//         );

//         if (papers[paperId].accessFee > 0) {
//             require(
//                 token.transferFrom(
//                     msg.sender,
//                     papers[paperId].author,
//                     papers[paperId].accessFee
//                 ),
//                 "Token transfer failed"
//             );
//             paperAccessFees[paperId] =
//                 paperAccessFees[paperId] +
//                 papers[paperId].accessFee; // Add the fee to the total access fees
//         }

//         paperAccessed[paperId][msg.sender] = true; // Mark the paper as accessed by the user

//         emit PaperAccessed(paperId, msg.sender, papers[paperId].accessFee);
//     }

//     // Function to submit a contribution to a paper
//     function submitContribution(
//         uint256 paperId,
//         string memory changesHash,
//         uint256 stakeAmount
//     ) external {
//         require(papers[paperId].exists, "Paper does not exist");
//         require(
//             token.transferFrom(msg.sender, address(this), stakeAmount),
//             "Token transfer failed"
//         );

//         uint256 contributionIndex = contributions[paperId].length; // Get the index for the new contribution

//         contributions[paperId].push(
//             Contribution({
//                 contributor: msg.sender,
//                 changesHash: changesHash,
//                 approved: false,
//                 stakeAmount: stakeAmount
//             })
//         );

//         userContributionCount[msg.sender]++; // Increment the contribution count for the user

//         emit ContributionSubmitted(
//             paperId,
//             contributionIndex,
//             msg.sender,
//             changesHash,
//             stakeAmount
//         );
//     }

//     // Function to approve a contribution to a paper
//     function approveContribution(
//         uint256 paperId,
//         uint256 contributionIndex
//     ) external {
//         require(papers[paperId].exists, "Paper does not exist");
//         require(
//             msg.sender == papers[paperId].author,
//             "Only the author can approve contributions"
//         );
//         require(
//             contributionIndex < contributions[paperId].length,
//             "Invalid contribution index"
//         );
//         require(
//             !contributions[paperId][contributionIndex].approved,
//             "Contribution already approved"
//         );

//         Contribution storage contribution = contributions[paperId][
//             contributionIndex
//         ];
//         uint256 rewardAmount = contribution.stakeAmount +
//             ((paperAccessFees[paperId] * 10) / 100); // Reward includes 10% of the access fees earned by the paper

//         require(
//             token.transfer(contribution.contributor, rewardAmount),
//             "Token transfer failed"
//         );

//         // Create a new paper with the updated content
//         uint256 newPaperId = nextPaperId;
//         nextPaperId++;

//         papers[newPaperId] = Paper({
//             author: msg.sender,
//             title: papers[paperId].title, // Keep the title the same
//             contentHash: contribution.changesHash,
//             accessFee: papers[paperId].accessFee, // Keep the access fee the same
//             keywords: papers[paperId].keywords, // Keep the keywords the same
//             exists: true,
//             parentPaperId: paperId // Reference to the original paper
//         });

//         papersByOwner[msg.sender].push(newPaperId); // Add the new paper ID to the list of papers owned by the author

//         contribution.approved = true; // Mark the contribution as approved
//         paperAccessed[newPaperId][papers[paperId].author] = true;

//         emit ContributionApproved(
//             paperId,
//             newPaperId,
//             contributionIndex,
//             contribution.contributor,
//             rewardAmount
//         );
//         emit PaperUpdated(newPaperId, contribution.changesHash); // Emit event for new paper
//     }

//     // Function to get a list of all papers
//     function getPapers() external view returns (Paper[] memory) {
//         Paper[] memory allPapers = new Paper[](nextPaperId - 1);
//         for (uint256 i = 1; i < nextPaperId; i++) {
//             allPapers[i - 1] = papers[i];
//         }
//         return allPapers;
//     }

//     // Function to get a list of papers owned by a specific address
//     function getPapersByOwnerAddress(
//         address owner
//     ) external view returns (Paper[] memory) {
//         uint256[] memory paperIds = papersByOwner[owner];
//         Paper[] memory ownerPapers = new Paper[](paperIds.length);
//         for (uint256 i = 0; i < paperIds.length; i++) {
//             ownerPapers[i] = papers[paperIds[i]];
//         }
//         return ownerPapers;
//     }

//     // Function to get a list of contributions for a specific paper
//     function getContributions(
//         uint256 paperId
//     ) external view returns (Contribution[] memory) {
//         return contributions[paperId];
//     }

//     // Function to get a list of papers accessed by a specific user
//     function getPapersAccessedByUser(
//         address user
//     ) external view returns (Paper[] memory) {
//         uint256[] memory paperIds = new uint256[](nextPaperId - 1);
//         uint256 count = 0;

//         for (uint256 i = 1; i < nextPaperId; i++) {
//             if (paperAccessed[i][user]) {
//                 paperIds[count] = i;
//                 count++;
//             }
//         }

//         Paper[] memory accessedPapers = new Paper[](count);
//         for (uint256 i = 0; i < count; i++) {
//             accessedPapers[i] = papers[paperIds[i]];
//         }

//         return accessedPapers;
//     }

//     // Function to get the number of contributions made by a specific user
//     function getUserContributionCount(
//         address user
//     ) external view returns (uint256) {
//         return userContributionCount[user];
//     }

//     // Function to get paper details by paper ID
//     function getPaperById(
//         uint256 paperId
//     )
//         external
//         view
//         returns (
//             address author,
//             string memory title,
//             string memory contentHash,
//             uint256 accessFee,
//             string[] memory keywords
//         )
//     {
//         require(papers[paperId].exists, "Paper does not exist");

//         Paper storage paper = papers[paperId];
//         return (
//             paper.author,
//             paper.title,
//             paper.contentHash,
//             paper.accessFee,
//             paper.keywords
//         );
//     }

//     // Function to get the original paper details (the root paper)
//     function getOriginalPaper(
//         uint256 paperId
//     )
//         external
//         view
//         returns (
//             address author,
//             string memory title,
//             string memory contentHash,
//             uint256 accessFee,
//             string[] memory keywords
//         )
//     {
//         require(papers[paperId].exists, "Paper does not exist");

//         uint256 currentId = paperId;
//         while (papers[currentId].parentPaperId != 0) {
//             currentId = papers[currentId].parentPaperId; // Traverse up the chain to find the original paper
//         }

//         Paper storage originalPaper = papers[currentId];
//         return (
//             originalPaper.author,
//             originalPaper.title,
//             originalPaper.contentHash,
//             originalPaper.accessFee,
//             originalPaper.keywords
//         );
//     }

//     function getTotalPaperCount() public view returns (uint) {
//         return totalPaperCount;
//     }
// }
