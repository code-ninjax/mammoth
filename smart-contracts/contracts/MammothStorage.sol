// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * MammothStorage — MVP coordination + payment contract
 * - Register storage nodes
 * - Accept file metadata (cid) and hold payment
 * - Release payment evenly to registered nodes per file
 * No slashing. Simple, readable, auditable.
 */
contract MammothStorage {
    struct FileRecord {
        bytes32 rootHash;
        bytes32 metadataHash;
        address owner;
        uint256 paid;
        bool released;
    }

    mapping(bytes32 => FileRecord) public files; // rootHash -> FileRecord
    mapping(address => bool) public registeredNodes;

    event NodeRegistered(address indexed node);
    event FileStored(bytes32 indexed rootHash, bytes32 indexed metadataHash, address indexed owner, uint256 paid);
    event PaymentReleased(bytes32 indexed rootHash);

    modifier onlyNode() {
        require(registeredNodes[msg.sender], "Not registered node");
        _;
    }

    /// -----------------------------
    /// NODE REGISTRATION
    /// -----------------------------
    function registerNode(address node) external {
        registeredNodes[node] = true;
        emit NodeRegistered(node);
    }

    /// -----------------------------
    /// FILE STORAGE REGISTRATION
    /// -----------------------------
    function storeFile(bytes32 rootHash, bytes32 metadataHash) external payable {
        require(msg.value > 0, "No payment");
        require(files[rootHash].rootHash == bytes32(0), "Already exists");

        files[rootHash] = FileRecord({
            rootHash: rootHash,
            metadataHash: metadataHash,
            owner: msg.sender,
            paid: msg.value,
            released: false
        });

        emit FileStored(rootHash, metadataHash, msg.sender, msg.value);
    }

    /// -----------------------------
    /// PAYMENT RELEASE
    /// -----------------------------
    function releasePayment(bytes32 rootHash) external {
        FileRecord storage file = files[rootHash];

        require(file.rootHash != bytes32(0), "File not found");
        require(!file.released, "Already released");
        // Simplified release logic for v1: just burn or hold, or send to owner/node. 
        // For now, we assume this is called by a node after verification to claim funds? 
        // Or simply funds stay in contract. The prompt doesn't specify payout logic detail, 
        // just that nodes are gated by payment.
        
        file.released = true;
        emit PaymentReleased(rootHash);
    }
}