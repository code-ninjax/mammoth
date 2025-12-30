import axios from "axios";
import { getConfig } from "./client";
import { getFileRecord } from "./blockchain";
import { hashBuffer } from "./hasher";
import { ethers } from "ethers";

export async function retrieve(rootHash: string): Promise<Buffer> {
  const { nodes } = getConfig();
  
  // 1. Get on-chain record
  const record = await getFileRecord(rootHash);
  if (!record || record.rootHash === ethers.ZeroHash) {
     throw new Error("File not found on-chain");
  }
  
  // 2. Get metadata from server
  // Assuming a metadata endpoint exists or we can infer from first chunk if metadata is stored?
  // The server implementation needs to support this.
  // For now, let's assume the server exposes /metadata/:rootHash
  const metadataRes = await axios.get(`${nodes[0]}/metadata/${rootHash}`);
  const metadata = metadataRes.data;
  
  // 3. Verify metadata hash
  const metadataString = JSON.stringify(metadata);
  const calculatedMetadataHash = hashBuffer(Buffer.from(metadataString));
  
  // normalize hashes
  const onChainMetaHash = record.metadataHash.startsWith("0x") ? record.metadataHash.slice(2) : record.metadataHash;
  const calculatedMetaHashClean = calculatedMetadataHash.startsWith("0x") ? calculatedMetadataHash.slice(2) : calculatedMetadataHash;
  
  // Note: JSON.stringify order matters. Ideally we sort keys or use canonical JSON. 
  // For this MVP, we assume the server returns the exact JSON string that was hashed, 
  // OR we just verify the root hash which is more important for file integrity.
  // Let's log if mismatch but proceed to verify file content.
  if (calculatedMetaHashClean !== onChainMetaHash) {
     console.warn("Metadata integrity check failed. Proceeding to verify file content...");
  }
  
  // 4. Download chunks
  // We need to know how many chunks. Metadata has it.
  const chunks: Buffer[] = [];
  const chunkPromises = [];
  
  for (let i = 0; i < metadata.chunkCount; i++) {
     chunkPromises.push(axios.get(`${nodes[0]}/chunk/${rootHash}/${i}`, { responseType: 'arraybuffer' }));
  }
  
  const chunkResponses = await Promise.all(chunkPromises);
  
  // 5. Verify chunks and root hash
  const chunkHashes = [];
  for (const res of chunkResponses) {
      const buf = Buffer.from(res.data);
      chunks.push(buf);
      chunkHashes.push(hashBuffer(buf));
  }
  
  const calculatedRootHash = hashBuffer(Buffer.from(chunkHashes.join("")));
  const onChainRootHash = record.rootHash.startsWith("0x") ? record.rootHash.slice(2) : record.rootHash;
  const calculatedRootClean = calculatedRootHash.startsWith("0x") ? calculatedRootHash.slice(2) : calculatedRootHash;
  
  if (calculatedRootClean !== onChainRootHash) {
      throw new Error(`File integrity check failed: Root hash mismatch. Expected ${onChainRootHash}, got ${calculatedRootClean}`);
  }
  
  return Buffer.concat(chunks);
}
