import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { ethers } from "ethers";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import next from "next";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
dotenv.config();

const app = express();
const corsOrigin = process.env.CORS_ORIGIN;
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (corsOrigin) return cb(null, origin === corsOrigin);
      if (/http:\/\/localhost:\d{4}/.test(origin)) return cb(null, true);
      return cb(null, false);
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);
app.options("*", cors());
app.use(express.json({ limit: "50mb" }));

const STORAGE_DIR = process.env.STORAGE_DIR
  ? path.resolve(process.env.STORAGE_DIR)
  : path.resolve(__dirname, "storage");
const LEGACY_STORAGE_DIR = path.resolve(__dirname, "mammoth-node", "storage");
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

function resolveFileDir(rootHash) {
  const primary = path.join(STORAGE_DIR, rootHash);
  if (fs.existsSync(primary)) return primary;
  const legacy = path.join(LEGACY_STORAGE_DIR, rootHash);
  if (fs.existsSync(legacy)) return legacy;
  return primary;
}

// Blockchain Config
const RPC_URL = process.env.BDAG_RPC_URL || "https://rpc.awakening.bdagscan.com";
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MAMMOTH_STORAGE_ADDRESS;

if (!CONTRACT_ADDRESS) {
    console.warn("WARNING: NEXT_PUBLIC_MAMMOTH_STORAGE_ADDRESS is not set. Verification will fail.");
}
console.log("[Node] RPC_URL:", RPC_URL);
console.log("[Node] CONTRACT_ADDRESS:", CONTRACT_ADDRESS);

// Minimal ABI
const ABI = [
  "function files(bytes32 rootHash) view returns (bytes32 rootHash, bytes32 metadataHash, address owner, uint256 paid, bool released)"
];

const verifiedFiles = new Set();
const verificationPromises = new Map();

// Initialize Provider & Contract once
let provider;
let contract;
if (RPC_URL && CONTRACT_ADDRESS) {
    provider = new ethers.JsonRpcProvider(RPC_URL);
    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
}

app.post("/upload", async (req, res) => {
  const { chunk, chunkIndex, chunkHash, rootHash, metadata, txHash, contractAddress } = req.body || {};
  
  if (!chunk || chunkIndex === undefined || !rootHash || !metadata || !txHash) {
      return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const effectiveContractAddress = contractAddress || CONTRACT_ADDRESS;
    if (!effectiveContractAddress) {
      return res.status(500).json({ error: "Server missing contract address configuration" });
    }

    const verificationKey = `${effectiveContractAddress}:${rootHash}`;

    if (!verifiedFiles.has(verificationKey)) {
        if (provider && contract) {
             const effectiveContract =
               effectiveContractAddress === CONTRACT_ADDRESS
                 ? contract
                 : new ethers.Contract(effectiveContractAddress, ABI, provider);

             if (!verificationPromises.has(verificationKey)) {
                 const verificationTask = (async () => {
                     const rootHashHex = rootHash.startsWith("0x") ? rootHash : `0x${rootHash}`;
                     try {
                         const code = await provider.getCode(effectiveContractAddress);
                         if (!code || code === "0x") {
                           throw new Error(`No contract deployed at ${effectiveContractAddress}`);
                         }
                         if (
                           typeof txHash === "string" &&
                           txHash.startsWith("0x") &&
                           txHash.length === 66 &&
                           txHash !== "0x" + "0".repeat(64)
                         ) {
                           try {
                             await provider.waitForTransaction(txHash, 1, 60_000);
                           } catch {}
                         }
                         const record = await effectiveContract.files(rootHashHex);
                         if (record.rootHash !== ethers.ZeroHash) {
                             verifiedFiles.add(verificationKey);
                         }
                     } catch (err) {
                        console.error("Blockchain verification error:", err);
                        throw err;
                     }
                 })();
                 verificationPromises.set(verificationKey, verificationTask);
             }

             // Wait for the pending verification
             try {
                 await verificationPromises.get(verificationKey);
             } catch (err) {
                 verificationPromises.delete(verificationKey);
                 return res.status(502).json({
                   error: "Blockchain verification failed",
                   details: err?.message || String(err),
                   contractAddress: effectiveContractAddress,
                 });
             }
             
             // Cleanup promise after completion (optional, but good for memory if we keep map clean)
             // We can keep it or delete it. Since verifiedFiles is the source of truth, we can delete the promise.
             verificationPromises.delete(verificationKey);

             if (!verifiedFiles.has(verificationKey)) {
                 return res.status(402).json({ error: "Payment not found on-chain. Please pay before uploading." });
             }
        } else {
            console.warn("Skipping on-chain verification: Config missing.");
        }
    }

    // 2. Store Chunk
    const fileDir = path.join(STORAGE_DIR, rootHash);
    if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir, { recursive: true });
    }

    // Store Metadata
    const metadataPath = path.join(fileDir, "metadata.json");
    if (!fs.existsSync(metadataPath)) {
        fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    }

    // Store Chunk
    const buffer = Buffer.from(chunk, "base64");
    // Verify chunk hash?
    // const calculatedHash = ...
    // if (calculatedHash !== chunkHash) return res.status(400).json({ error: "Chunk integrity failed" });

    fs.writeFileSync(path.join(fileDir, `${chunkIndex}`), buffer);

    res.json({ success: true, message: `Chunk ${chunkIndex} stored` });

  } catch (e) {
    console.error("Upload error:", e);
    res.status(500).json({ error: "Internal server error" + e.message });
  }
});

app.get("/metadata/:rootHash", (req, res) => {
    const { rootHash } = req.params;
    const metadataPath = path.join(resolveFileDir(rootHash), "metadata.json");
    
    if (!fs.existsSync(metadataPath)) {
        return res.status(404).json({ error: "File not found" });
    }
    
    const metadata = fs.readFileSync(metadataPath, "utf-8");
    res.json(JSON.parse(metadata));
});

app.get("/chunk/:rootHash/:index", (req, res) => {
    const { rootHash, index } = req.params;
    const chunkPath = path.join(resolveFileDir(rootHash), index);
    
    if (!fs.existsSync(chunkPath)) {
        return res.status(404).json({ error: "Chunk not found" });
    }
    
    const data = fs.readFileSync(chunkPath);
    res.send(data);
});

app.get("/retrieve/:rootHash", (req, res) => {
    const { rootHash } = req.params;
    const fileDir = resolveFileDir(rootHash);
    const metadataPath = path.join(fileDir, "metadata.json");

    if (!fs.existsSync(metadataPath)) {
        return res.status(404).json({ error: "File not found" });
    }

    let metadata;
    try {
        metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
    } catch {
        return res.status(500).json({ error: "Invalid metadata" });
    }

    const entries = fs.readdirSync(fileDir, { withFileTypes: true });
    const chunkFiles = entries
        .filter((e) => e.isFile() && e.name !== "metadata.json" && /^\d+$/.test(e.name))
        .map((e) => e.name)
        .sort((a, b) => Number(a) - Number(b));

    if (chunkFiles.length === 0) {
        return res.status(404).json({ error: "No chunks found" });
    }

    const buffers = chunkFiles.map((name) => fs.readFileSync(path.join(fileDir, name)));
    const fileBuffer = Buffer.concat(buffers);

    const fileName = typeof metadata?.fileName === "string" && metadata.fileName.length > 0 ? metadata.fileName : `${rootHash}.bin`;
    const mimeType = typeof metadata?.mimeType === "string" && metadata.mimeType.length > 0 ? metadata.mimeType : "application/octet-stream";

    res.setHeader("Content-Type", mimeType);
    res.setHeader("Content-Disposition", `attachment; filename="${fileName.replace(/\"/g, "")}"`);
    res.send(fileBuffer);
});

// Legacy support if needed, or remove
app.post("/storeBlob", (req, res) => {
    // ... old logic ...
    res.status(410).json({ error: "Deprecated. Use /upload" });
});
app.get("/getBlob/:hash", (req, res) => {
     // ... old logic ...
     res.status(410).json({ error: "Deprecated. Use /retrieve flow" });
});


const PORT = Number(process.env.PORT || 8080);

async function start() {
  const dev = process.env.NODE_ENV !== "production";
  if (!dev) {
    const nextApp = next({ dev, dir: path.resolve(__dirname, "..") });
    const handle = nextApp.getRequestHandler();
    await nextApp.prepare();
    app.all("*", (req, res) => handle(req, res));
  }

  const server = app.listen(PORT, () =>
    console.log(dev ? `Mammoth node running on ${PORT}` : `Mammoth app running on ${PORT}`)
  );
  server.on("error", (err) => {
    if (err?.code === "EADDRINUSE") {
      console.error(
        `[Node] Port ${PORT} is already in use. Stop the other process, or run with a different port (PowerShell: $env:PORT=8081; npm run node:start).`
      );
      process.exit(1);
    }
    console.error("[Node] Server error:", err);
    process.exit(1);
  });
}

start().catch((err) => {
  console.error("[Node] Startup failed:", err);
  process.exit(1);
});
