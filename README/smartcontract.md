# Mammoth Smart Contracts

MVP BDAG coordination + payment on-chain. No slashing. This contract registers storage nodes, accepts file CIDs, holds payment, and releases funds evenly to nodes.

## What’s Included
- `contracts/MammothStorage.sol` — core contract
- Local Hardhat project with compile, test, deploy, and demo scripts
- Step-by-step testing and deployment instructions

## Quick Start (Local)
1. Open terminal in `smart-contracts`:
   - Or use monorepo root scripts below.
2. Monorepo install (recommended):
   - From repo root: `npm install` (npm v7+ workspaces)
3. Compile (from root):
   - `npm run contracts:compile`
4. Run tests (from root):
   - `npm run contracts:test`
5. Local demo (from root):
   - `npm run contracts:demo`

You should see logs for deployment, file storage, and per-node received amounts.

## Contract Overview
- Register nodes:
  - `registerNode(address node)` — open registration (anyone can register any address)
- Store file metadata + payment:
  - `storeFile(bytes32 cid, address[] nodes)` payable — records file and holds `msg.value`
- Release payment:
  - `releasePayment(bytes32 cid)` — splits held amount evenly across `nodes` and transfers
- Events:
  - `NodeRegistered(node)`, `FileStored(cid, owner, paid)`, `PaymentReleased(cid)`

Notes:
- Equal split uses integer division. Any remainder stays in contract (MVP simplicity). Use amounts that divide cleanly for even splits (e.g., 9 ETH across 3 nodes).
- No slashing / penalties. Coordination + payment only.

## Deploy to BDAG (BlockDAG)
1. Create `.env` in `smart-contracts` from `.env.example`:
   - `BDAG_RPC_URL=https://rpc.awakening.bdagscan.com`
   - `PRIVATE_KEY=0xYOUR_PRIVATE_KEY`
2. Deploy from monorepo root:
   - `npm run contracts:deploy:bdag`
3. Output prints the contract address. Save it.

## Verify `storeFile` Works on BDAG
Use the local demo as a template for BDAG:
1. Register 3 nodes (addresses you control).
2. Call `storeFile(cid, nodes)` with `value` divisible by `nodes.length` (e.g., `0.03` across 3 nodes).
3. Confirm the transaction mined and events via your BDAG explorer.
4. Call `releasePayment(cid)` and verify node balances increase equally.

## Test Suite
Located at `smart-contracts/test/MammothStorage.ts`:
- Registers nodes and verifies `NodeRegistered` event
- Calls `storeFile` with payment and verifies `FileStored` event
- Releases payment and checks each node receives equal share
- Guards: prevents duplicate CIDs and zero-value storage

## Design Rationale (MVP)
- Simple, readable, auditable; avoids complex staking/slashing logic
- Uses native coin transfers (`transfer`) to nodes
- Single-owner `owner` field recorded for transparency; release is uncluttered (any caller allowed)

## Integration Notes
- ABI and address from Hardhat artifacts after deployment
- Frontend can call `storeFile` with `value` and later `releasePayment` once nodes prove storage off-chain

## Commands Reference
- `npm run compile` — compile contracts
- `npm run test` — run unit tests
- `npm run demo:local` — local demo script on Hardhat in-memory network
- `npm run deploy:bdag` — deploy to BDAG using `.env`

## Troubleshooting
- Ensure Node.js v18+ and npm are installed
- If `accounts` is empty on Sepolia, check `.env` `PRIVATE_KEY`
- If events not visible, confirm you’re checking the correct explorer/network
## Deploy to BDAG (BlockDAG)
1. Set BDAG RPC in `smart-contracts/.env` (or `.env`):
   - `BDAG_RPC_URL=https://rpc.awakening.bdagscan.com`
   - `PRIVATE_KEY=0xYOUR_PRIVATE_KEY`
2. Deploy from monorepo root:
   - `npm run contracts:deploy:bdag`
3. Note the deployed address and check BDAG explorer if available.


