// Simple demo script to build and exercise the SDK locally if desired.
import { Mammoth } from "../dist/index.js";

async function main() {
  Mammoth.init({
    rpcUrl: process.env.BDAG_RPC_URL || "http://localhost:8545",
    contractAddress: process.env.CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000",
    nodes: ["http://localhost:8080"],
  });

  const data = Buffer.from("hello world");
  const cid = await Mammoth.store({ file: data, replicas: 1, payment: "0.001" });
  console.log("Demo CID:", cid);

  const buf = await Mammoth.retrieve(cid);
  console.log("Retrieved length:", buf.length);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});