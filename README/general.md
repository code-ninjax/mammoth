# Mammoth — End-to-End Testing Guide

This guide walks through testing the full workflow across smart contracts, the SDK, and the node service.

## Prerequisites
- Node.js v18+
- npm v7+ (workspaces)
- BDAG RPC and deployer private key (optional, only required for live TXs)

## Monorepo Setup
- `npm install` — installs all workspaces
- Useful root scripts:
  - `npm run sdk:build` — builds the SDK
  - `npm run sdk:test` — runs SDK demo
  - `npm run node:start` — starts the node server
  - `npm run node:clean` — clears stored blobs
  - `npm run contracts:compile` — compiles contracts
  - `npm run contracts:test` — runs contract tests
  - `npm run contracts:demo` — local Hardhat demo
  - `npm run contracts:deploy:bdag` — deploys to BDAG

## Environment (BDAG)
- Create `smart-contracts/.env`:
  - `BDAG_RPC_URL=https://rpc.awakening.bdagscan.com`
  - `PRIVATE_KEY=0xYOUR_PRIVATE_KEY`

## Step 1 — Start a Storage Node
- `npm run node:start`
- Verifies:
  - Node is listening at `http://localhost:8080`
  - `POST /storeBlob` and `GET /getBlob/:hash` endpoints available

## Step 2 — Deploy MammothStorage (BDAG)
- `npm run contracts:compile`
- `npm run contracts:deploy:bdag`
- Copy the printed contract address to use with the SDK as `CONTRACT_ADDRESS`

Tip: If you want purely local testing without BDAG, you can use `npm run contracts:demo` to validate contract logic in Hardhat’s in-memory network.

## Step 3 — Configure SDK
- In your terminal, export or set env vars:
  - `BDAG_RPC_URL=https://rpc.awakening.bdagscan.com`
  - `CONTRACT_ADDRESS=<DEPLOYED_ADDRESS>`
  - `PRIVATE_KEY=0xYOUR_PRIVATE_KEY` (optional; enables on-chain TX from Node context)
- Build SDK:
  - `npm run sdk:build`

## Step 4 — Upload via SDK (Store Flow)
- From your app/script, or using the SDK demo:
  - `npm run -w mammoth-sdk test`
- What happens:
  - SDK chunks input file into 256KB parts
  - Hashes each chunk with SHA-256, then computes CID = hash of ordered chunk hashes
  - Uploads first `replicas` chunks to `nodes[i]` via `/storeBlob`
  - Sends `storeFile` on-chain (BDAG) with the computed CID and node list

Manual code sample:
```
import { Mammoth } from "mammoth-sdk";

Mammoth.init({
  rpcUrl: process.env.BDAG_RPC_URL!,
  contractAddress: process.env.CONTRACT_ADDRESS!,
  nodes: ["http://localhost:8080"],
});

const data = Buffer.from("hello world");
const cid = await Mammoth.store({ file: data, replicas: 1, payment: "0.001" });
console.log("CID:", cid);
```

## Step 5 — Retrieve via SDK (Retrieve Flow)
- `const buf = await Mammoth.retrieve(cid);`
- Verifies:
  - Node returns the stored blob by CID
  - Buffer length matches the original data

## Step 6 — Validate On-Chain State
- Use BDAG explorer or logs to confirm:
  - `storeFile` transaction mined
  - `FileStored` event emitted with your CID, owner, and value

## Step 7 — Release Payment (Optional)
- If testing payout flow:
  - Call `releasePayment(cid)` on-chain (via a script or Hardhat console)
  - Verify `PaymentReleased` event and per-node balances increase equally

## Expansion Scenarios
- Multiple nodes: add more node URLs to SDK `nodes` and increase `replicas`
- Larger files: validate chunking and CID stability across bigger inputs
- Error handling: simulate missing blobs, unavailable nodes, or insufficient `payment`

## Cleanup
- `npm run node:clean` — clears stored blobs
- Stop the node server (Ctrl+C)

## Troubleshooting
- If SDK skips sending TXs, set `PRIVATE_KEY` and `CONTRACT_ADDRESS`
- If network errors occur, confirm `BDAG_RPC_URL` and that your key has funds
- If events aren’t visible, verify explorer network and the correct contract address