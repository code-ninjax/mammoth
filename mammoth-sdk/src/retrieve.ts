import axios from "axios";
import { getConfig } from "./client";

export async function retrieve(cid: string): Promise<Buffer> {
  const { nodes } = getConfig();
  const response = await axios.get(`${nodes[0]}/getBlob/${cid}`, {
    responseType: "arraybuffer",
  });
  return Buffer.from(response.data);
}