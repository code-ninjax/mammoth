# Mammoth Storage Flow

This document outlines the Pay-to-Store architecture of Mammoth Storage, integrating the Mammoth SDK, BLOCKDAG Blockchain, and Mammoth Storage Server.

## Architecture Overview

1.  **Mammoth SDK (Client-side)**: Handles file chunking, hashing, transaction creation, and upload orchestration.
2.  **BLOCKDAG Blockchain**: Handles payments and stores integrity proofs (root hash, metadata hash).
3.  **Mammoth Storage Server**: Centralized infrastructure that stores file chunks after verifying on-chain payment.

## Pay-to-Store Flow

### Upload Process

1.  **File Preparation**:
    *   File is split into chunks (Client-side).
    *   Each chunk is hashed (SHA-256).
    *   Root hash is computed (Merkle root of chunk hashes).
    *   Metadata object is created (size, count, rootHash, etc.).

2.  **Payment & Commitment**:
    *   SDK calculates storage cost.
    *   SDK creates a BLOCKDAG transaction:
        *   **Value**: Storage cost.
        *   **Data**: Root Hash + Metadata Hash.
    *   User signs and sends the transaction.
    *   SDK waits for transaction confirmation.

3.  **Storage**:
    *   SDK sends chunks + metadata + transaction hash to Mammoth Storage Server.
    *   Storage Server verifies:
        *   Transaction exists and is confirmed on-chain.
        *   Transaction data matches the file's root hash.
    *   If valid, Server accepts and stores chunks.

### Retrieval Process

1.  **Request**:
    *   SDK requests file by `fileId` (Root Hash).

2.  **Verification**:
    *   SDK fetches file record from BLOCKDAG (Root Hash, Metadata Hash).
    *   SDK fetches metadata from Storage Server.
    *   SDK verifies metadata integrity against on-chain Metadata Hash.

3.  **Download**:
    *   SDK downloads chunks from Storage Server.
    *   SDK re-hashes chunks and re-computes Root Hash.
    *   SDK compares re-computed Root Hash with on-chain Root Hash.
    *   If matches, file integrity is verified.

## SDK Usage

### Installation

```bash
npm install mammoth-sdk
```

### Initialization

```typescript
import { Mammoth } from "mammoth-sdk";

const mammoth = new Mammoth({
  rpcUrl: "https://rpc.awakening.bdagscan.com", // BLOCKDAG testnet RPC
  contractAddress: "0xYourContractAddress",
  nodes: ["http://localhost:8080"] // Your Storage Server URL
});
```

### Uploading a File

```typescript
// Select a file from input
const fileInput = document.getElementById("fileInput");
const file = fileInput.files[0];

// Upload
const response = await mammoth.store({
  file: file,
  payment: "0.01" // Amount in native currency
});

console.log("File ID:", response.fileId);
console.log("Transaction Hash:", response.txHash);
```

### Retrieving a File

```typescript
const fileId = "0x..."; // The Root Hash returned from upload

const fileBuffer = await mammoth.retrieve(fileId);

// Download or display
const blob = new Blob([fileBuffer]);
const url = URL.createObjectURL(blob);
window.open(url);
```

## Comparison with Walrus

| Feature | Walrus | Mammoth (v1) |
| :--- | :--- | :--- |
| **Storage Nodes** | Independent global nodes | Centralized storage server |
| **Integrity** | On-chain | On-chain (BLOCKDAG) |
| **Payment** | Pay-to-store | Pay-to-store |
| **Transaction** | Yes | Yes (BLOCKDAG testnet) |

Mammoth v1 focuses on decentralized integrity and payment enforcement while using centralized storage infrastructure for reliability during the hackathon phase.
