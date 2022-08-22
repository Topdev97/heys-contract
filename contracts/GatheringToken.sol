// SPDX-License-Identifier: None

// Specifies the version of Solidity, using semantic versioning.
// Learn more: https://solidity.readthedocs.io/en/v0.5.10/layout-of-source-files.html#pragma
pragma solidity >=0.8.9;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";


// Defines a contract named `HelloWorld`.
// A contract is a collection of functions and data (its state). Once deployed, a contract resides at a specific address on the Ethereum blockchain. Learn more: https://solidity.readthedocs.io/en/v0.5.10/structure-of-a-contract.html
contract GatheringToken is Initializable, ERC20Upgradeable {

  uint docAward;
  uint voteAward;
  uint passThreshold;
  uint public numDocs;

  function initialize() initializer public {
    __ERC20_init("Blockchain Gathering", "gBG");
    // Mint 100 tokens to msg.sender
    _mint(msg.sender, 100 * 10**uint(decimals()));

    docAward = 100;
    voteAward = 5;
    passThreshold = 50; // %
    numDocs = 0;
  }

  receive () external payable {
  }

//  fallback() external payable {
//  }

  struct Vote {
    address voterAddress;
    uint weight;
    uint8 vote; // 1 == approve, 2 == reject, 3 == abstain
  }

  struct Doc {
    address submitter; // address of user who added the doc
    uint256 timestamp; // createdAt
    string docUid; // uid of the doc
    uint8 docType; // 1 == doc, 2 == sheet, 3 == slide
    bool approved; // passed vote
    uint256 totalVotesCount; // votes count for this doc
    uint256 totalApproveVotesWeight; // approve votes weight for this doc
    uint256 totalRejectVotesWeight; // reject votes weight for this doc
    uint256 totalAbstainVotesWeight; // abstain votes weight for this doc
    mapping(uint256 => Vote) votes;
  }

//  Doc[] public docs;
  mapping (uint => Doc) public docs;

  event DocAdded(uint docId);
  event DocApproved(uint docId);

  function addDoc(string memory docUid, uint8 docType) external returns (uint) {
    bool docExists = false;
    for (uint i; i < numDocs; i++) {
      if (keccak256(bytes(docs[i].docUid)) == keccak256(bytes(docUid)) && docs[i].docType == docType) {
        docExists = true;
        break;
      }
    }
    require(docExists == false, "Doc exists already.");

    numDocs += 1;
    Doc storage doc = docs[numDocs];
    doc.submitter = msg.sender;
    doc.timestamp = block.timestamp;
    doc.docUid = docUid;
    doc.docType = docType;
    doc.approved = false;
    doc.totalVotesCount = 0;
    doc.totalApproveVotesWeight = 0;

    emit DocAdded(numDocs);

    return numDocs;
  }

  function voteOnDoc(uint docId, uint8 vote) external returns (bool) {
    require(balanceOf(msg.sender) > 0, "Not part of this gathering.");
    require(docId < numDocs, "Doc doesn't exist.");

    bool votedAlready = false;
    Doc storage doc = docs[docId];

    // Check if the user has voted already
    for (uint j; j < doc.totalVotesCount; j++) {
      if (doc.votes[j].voterAddress == msg.sender) {
        votedAlready = true;
        break;
      }
    }
    require(votedAlready == false, "Voted already.");

    // Add vote to doc object
    doc.votes[doc.totalVotesCount] = Vote({
      voterAddress: msg.sender,
      weight: balanceOf(msg.sender),
      vote: vote
    });
    doc.totalVotesCount++;

    // If the vote is approve -> check if it passes approval threshold (50% of totalSupply)
    if (vote == 1) {
      doc.totalApproveVotesWeight += balanceOf(msg.sender);
      uint256 threshold = totalSupply() / (100 / passThreshold);
      if (doc.totalApproveVotesWeight > threshold) {
        doc.approved = true;

        // Reward submitter with award tokens
        _mint(doc.submitter, docAward * 10**uint(decimals()));

        emit DocApproved(docId);
      }
    } else if (vote == 2) {
      doc.totalRejectVotesWeight += balanceOf(msg.sender);
    } else if (vote == 3) {
      doc.totalAbstainVotesWeight += balanceOf(msg.sender);
    }

    // Reward voter with award tokens
    _mint(msg.sender, voteAward * 10**uint(decimals()));

    return true;
  }

  function docsToVoteOn() public view returns (uint256[] memory) {
    uint numDocsToVoteOn = 0;
    for (uint i; i < numDocs; i++) {
      if (docs[i].approved == false) {
        numDocsToVoteOn += 1;
      }
    }

    uint256[] memory docsToVoteOnArr = new uint256[](numDocsToVoteOn);
    uint voteDocIdx = 0;
    for (uint i; i < numDocs; i++) {
      if (docs[i].approved == false) {
        docsToVoteOnArr[voteDocIdx] = i;
        voteDocIdx += 1;
      }
    }

    return docsToVoteOnArr;
  }

  /*function approveSpend(uint256 amount) external {
    address tipTokenAddress = 0x0000000000000000000000000000000000001010;

    IERC20 tipTokenInstance = IERC20(tipTokenAddress);
    bool success = tipTokenInstance.approve(msg.sender, amount);
    // tipTokenInstance.allowance(msg.sender, address(this));

    require(success, "Approval failed");

    return true;
  }

  function tipDoc(uint docId, uint256 amount) external {
    address tipTokenAddress = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    IERC20 tipTokenInstance = IERC20(tipTokenAddress);
    require(tipTokenInstance.balanceOf(msg.sender) >= amount , "Your balance is too low" );
    bool success = tipTokenInstance.transferFrom(msg.sender, address(this), amount);

    require(success, "Transfer failed");

    return true;
  }

  function checkApproval() external {
    address tipTokenAddress = 0x0000000000000000000000000000000000001010;

    IERC20 tipTokenInstance = IERC20(tipTokenAddress);
    uint256 allowance = tipTokenInstance.allowance(msg.sender, address(this));

    return allowance;
  }*/
}
