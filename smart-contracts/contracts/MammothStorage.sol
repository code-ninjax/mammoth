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
        bytes32 cid;
        address owner;
        address[] nodes;
        uint256 paid;
        bool released;
    }

    mapping(bytes32 => FileRecord) public files;
    mapping(address => bool) public registeredNodes;

    event NodeRegistered(address indexed node);
    event FileStored(bytes32 indexed cid, address indexed owner, uint256 paid);
    event PaymentReleased(bytes32 indexed cid);

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
    function storeFile(bytes32 cid, address[] calldata nodes) external payable {
        require(msg.value > 0, "No payment");
        require(files[cid].cid == bytes32(0), "Already exists");

        files[cid] = FileRecord({
            cid: cid,
            owner: msg.sender,
            nodes: nodes,
            paid: msg.value,
            released: false
        });

        emit FileStored(cid, msg.sender, msg.value);
    }

    /// -----------------------------
    /// PAYMENT RELEASE
    /// -----------------------------
    function releasePayment(bytes32 cid) external {
        FileRecord storage file = files[cid];

        require(file.cid != bytes32(0), "File not found");
        require(!file.released, "Already released");
        require(file.nodes.length > 0, "No nodes");

        uint256 share = file.paid / file.nodes.length;

        for (uint256 i = 0; i < file.nodes.length; i++) {
            payable(file.nodes[i]).transfer(share);
        }

        file.released = true;
        emit PaymentReleased(cid);
    }
}