import axios from "axios";
import { chunkFile } from "./chunker";
import { hashBuffer } from "./hasher";
import { getConfig } from "./client";
import { sendStoreTx } from "./blockchain";
import type { StoreParams } from "./types";

export async function store({ file, replicas, duration, payment }: StoreParams) {
  const buffer: Buffer = Buffer.isBuffer(file)
    ? file
    : Buffer.from(await (file as any).arrayBuffer());

  const chunks = chunkFile(buffer);
  const blobHashes = chunks.map((chunk) => hashBuffer(chunk));
  const cid = hashBuffer(Buffer.from(blobHashes.join("")));

  const { nodes } = getConfig();

  // Upload first `replicas` chunks to corresponding nodes (as per spec simplification)
  for (let i = 0; i < Math.min(replicas, nodes.length, chunks.length); i++) {
    await axios.post(`${nodes[i]}/storeBlob`, {
      hash: blobHashes[i],
      data: chunks[i].toString("base64"),
    });
  }

  await sendStoreTx(cid, nodes, payment);

  return cid;
}