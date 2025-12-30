# Mammoth (Hackathon MVP)

Mammoth is a pay-to-store developer stack for the BlockDAG ecosystem: a smart contract + SDK + storage node.
Think of it like “Sui ↔ Walrus”, but for BDAG: the chain provides payment + on-chain proof, while the storage network serves the bytes.

## What Happens When You Upload

1. The SDK chunks the file (`256KB` chunks).
2. Each chunk is SHA-256 hashed.
3. A deterministic `rootHash` is built as `sha256(concat(chunkHashes))` (Merkle-like simplification).
4. Metadata (name, size, mimeType, chunkCount, rootHash) is JSON-stringified and hashed to `metadataHash`.
5. The SDK sends an on-chain `storeFile(rootHash, metadataHash)` payable transaction on BDAG and returns the `txHash`.
6. The storage node accepts chunk uploads only after it verifies the on-chain record exists for `rootHash`.
7. The SDK returns:
   - `fileId` = `rootHash`
   - `txHash`
   - `retrievalEndpoint` (HTTP download URL)

## Where The File Is Stored (Dev Server)

On the local node, files are stored as:
- `mammoth-node/storage/<rootHash>/metadata.json`
- `mammoth-node/storage/<rootHash>/<chunkIndex>`

## How Judges Can Test (End-to-End)

1. Install dependencies: `npm install`
2. Create `.env.local` at repo root:
   - `BDAG_RPC_URL=https://rpc.awakening.bdagscan.com`
   - `NEXT_PUBLIC_MAMMOTH_STORAGE_ADDRESS=<deployed_contract_address>`
3. Deploy contract (optional if you already have one): `npm run contracts:deploy:bdag`
4. Start storage node: `npm run node:start`
5. Start frontend: `npm run dev`
6. Open `http://localhost:3000/demo`, connect wallet, upload a file.

After upload, click “Retrieve & Verify Integrity” to download from the storage node.

## Transaction Link (BDAG Scan)

The UI prints a `Transaction Hash` after upload. Paste it here:
- `https://awakening.bdagscan.com/tx/<txHash>`

## SDK Usage (For Other Teams)

Install:
- `npm i mammoth-sdk`

Use:
```ts
import { Mammoth } from "mammoth-sdk";

Mammoth.init({
  rpcUrl: "https://rpc.awakening.bdagscan.com",
  contractAddress: "<MammothStorageAddress>",
  nodes: ["http://localhost:8080"],
});

const result = await Mammoth.store({
  file,            // Browser File or Buffer
  payment: "0.001" // BDAG-native value (18 decimals)
});

console.log(result.fileId);            // rootHash
console.log(result.txHash);            // on-chain proof
console.log(result.retrievalEndpoint); // HTTP download link
```

Verify + retrieve via SDK:
```ts
const buf = await Mammoth.retrieve(result.fileId);
```
