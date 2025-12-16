# Mammoth SDK

Node.js SDK that chunks files (256KB), hashes with SHA-256, uploads blobs to storage nodes, and sends blockchain transactions to BDAG.

## Install and Build (Monorepo Root)
- `npm install` (workspaces install SDK and node)
- `npm run sdk:build`

## Usage
```ts
import { Mammoth } from "mammoth-sdk";

Mammoth.init({
  rpcUrl: process.env.BDAG_RPC_URL!,
  contractAddress: process.env.CONTRACT_ADDRESS!,
  nodes: ["http://localhost:8080"],
});

const data = Buffer.from("hello world");
const cid = await Mammoth.store({ file: data, replicas: 1, payment: "0.001" });
console.log("CID:", cid);

const buf = await Mammoth.retrieve(cid);
console.log("Retrieved bytes:", buf.length);
```

## Testing Locally
1. Start a node server:
   - `npm run node:start`
2. Build SDK:
   - `npm run sdk:build`
3. Demo script (SDK workspace):
   - `npm run -w mammoth-sdk test`

## Configuration
- Set env vars when running demo or integrating:
  - `BDAG_RPC_URL` — BDAG RPC (e.g., `https://rpc.awakening.bdagscan.com`)
  - `CONTRACT_ADDRESS` — deployed `MammothStorage` contract address
  - `PRIVATE_KEY` — optional, for sending tx in Node context

## Notes
- CID = SHA-256 hash of ordered chunk hashes.
- Store uploads first `replicas` chunks to matching nodes (MVP simplification).
- If `PRIVATE_KEY` is not set, tx sending is skipped but intentions logged.