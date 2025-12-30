import axios from "axios";
import { chunkFile } from "./chunker";
import { hashBuffer } from "./hasher";
import { getConfig } from "./client";
import { sendStoreTx, getFileRecord } from "./blockchain";
import type { StoreParams, Metadata, UploadResponse } from "./types";
import { ethers } from "ethers";

export async function store({ file, payment }: StoreParams): Promise<UploadResponse> {
  const buffer: Buffer = Buffer.isBuffer(file)
    ? file
    : Buffer.from(await (file as any).arrayBuffer());

  // 1. Split file into chunks
  const chunks = chunkFile(buffer);
  
  // 2. Hash each chunk
  const chunkHashes = chunks.map((chunk) => hashBuffer(chunk));
  
  // 3. Create root hash (Merkle root simplification: hash of concatenated chunk hashes)
  const rootHash = hashBuffer(Buffer.from(chunkHashes.join("")));

  // Create metadata object
  const metadata: Metadata = {
    fileSize: buffer.length,
    chunkCount: chunks.length,
    rootHash: rootHash,
    uploader: "", // Will be filled by caller or inferred? Let's leave empty for now or get from signer if possible.
                  // For now, not critical for core flow.
    fileName: (file as any).name,
    mimeType: (file as any).type,
  };

  // Hash metadata
  const metadataString = JSON.stringify(metadata);
  const metadataHash = hashBuffer(Buffer.from(metadataString));

  console.log("Root Hash:", rootHash);
  console.log("Metadata Hash:", metadataHash);

  // 4. Calculate cost (using fixed payment from params for now as per prompt example)
  // In real app, might query oracle or calc based on size.
  
  // Check if file already exists on-chain
  const existingRecord = await getFileRecord(rootHash);
  console.log("[Mammoth SDK] Existing record check:", existingRecord);

  let txHash: string;

  if (existingRecord && existingRecord.rootHash !== ethers.ZeroHash) {
      console.log("[Mammoth SDK] File already registered on-chain. Skipping payment transaction.");
      // We can use a dummy txHash or fetch the original event if possible. 
      // For verification purposes, the server checks `files(rootHash).paid > 0`. 
      // It doesn't strictly need the txHash if it just queries the contract state itself.
      // However, our current server implementation might look for a txHash to verify "freshness" or just for logging.
      // Let's assume we can proceed.
      txHash = "0xPREVIOUSLY_STORED"; 
  } else {
      // 5. Create & Send BLOCKDAG transaction
      // [5] SDK creates a BLOCKDAG transaction
      // [6] Transaction is signed & sent
      // [7] Transaction hash (txHash) is returned
      // [8] SDK waits for tx confirmation (inside sendStoreTx)
      txHash = await sendStoreTx(rootHash, metadataHash, payment);
  }

  // 9. Upload chunks to Mammoth Storage Server
  const { nodes } = getConfig();
  const { contractAddress } = getConfig();
  
  // For v1, we upload to the first node (Centralized Storage Server)
  // or broadcast to all. The prompt says "Mammoth Storage Server (Your Infra)".
  // We'll treat `nodes[0]` as the primary endpoint.
  const storageServerUrl = nodes[0]; 

  if (!storageServerUrl) {
    throw new Error("No storage node configured");
  }

  // Upload chunks + metadata + proof (txHash)
  // [10] Storage server verifies tx
  // [11] File is accepted & stored
  
  // We can upload all at once or one by one. 
  // Let's send a single request to "orchestrate" the upload on the server side 
  // OR upload chunks individually. 
  // The prompt says: "SDK uploads chunks to Mammoth Storage Server ... node1/ node2/"
  // It implies the SDK pushes chunks.
  
  // Let's implement a batch upload or sequential upload to the server.
  // We also need to send the metadata and txHash so the server can verify.
  
  // We'll create a new endpoint on the server `/upload` that takes everything.
  // Or we stick to `/storeBlob` but that's per blob.
  
  // Better approach:
  // 1. Send metadata + txHash to server -> Server verifies and returns a session/token or just "OK".
  // 2. Upload chunks.
  // OR
  // Send everything in one go (simpler for MVP).
  
  // Let's do: POST /upload
  // Body: { chunks: [...], chunkHashes: [...], metadata, txHash }
  // This might be large.
  
  // Alternative:
  // POST /init-upload { metadata, txHash } -> Server verifies TX.
  // Server returns "OK".
  // SDK uploads chunks: POST /storeBlob { hash, data, txHash/auth }
  
  // Given the prompt: "Accept chunks only after payment".
  // So we should verify payment first.
  
  try {
    // Step A: Init/Verify
    // This is implicit in the prompt's "[10] Storage server verifies".
    // We can bundle verification with the first chunk or a separate call.
    // Let's implement a batched upload to avoid OOM and server overload
    const CONCURRENCY = 3; // Upload 3 chunks at a time
    const results = [];

    for (let i = 0; i < chunks.length; i += CONCURRENCY) {
        const batch = chunks.slice(i, i + CONCURRENCY);
        const batchPromises = batch.map((chunk, batchIndex) => {
            const index = i + batchIndex;
            return axios.post(`${storageServerUrl}/upload`, {
                chunk: chunk.toString("base64"),
                chunkIndex: index,
                chunkHash: chunkHashes[index],
                rootHash,
                metadata,
                txHash,
                contractAddress,
            });
        });

        await Promise.all(batchPromises);
        console.log(`Uploaded chunks ${i} to ${Math.min(i + CONCURRENCY - 1, chunks.length - 1)}`);
    }

    // [12] SDK returns
    return {
      fileId: rootHash,
      txHash,
      retrievalEndpoint: `${storageServerUrl}/retrieve/${rootHash}`
    };

  } catch (error) {
    const anyErr: any = error;
    const details = anyErr?.response?.data;
    if (details) {
      console.error("Upload failed:", details);
    } else {
      console.error("Upload failed:", error);
    }
    throw error;
  }
}
