"use client";

import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { parseEther } from "viem";

// Minimal ABI for storeFile(bytes32 cid, address[] nodes) payable
const MammothStorageAbi = [
  {
    type: "function",
    name: "storeFile",
    stateMutability: "payable",
    inputs: [
      { name: "cid", type: "bytes32" },
      { name: "nodes", type: "address[]" },
    ],
    outputs: [],
  },
 ] as const;

// Web crypto helpers
function toArrayBuffer(view: Uint8Array): ArrayBuffer {
  const buf = new ArrayBuffer(view.byteLength);
  const copy = new Uint8Array(buf);
  copy.set(view);
  return buf;
}

async function sha256Hex(buffer: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToUtf8Bytes(hex: string): Uint8Array {
  // Treat hex string as a plain UTF-8 string input to hash for simplicity
  return new TextEncoder().encode(hex);
}

async function computeCid(file: File): Promise<{ cid: string; base64: string }> {
  const arrayBuffer = await file.arrayBuffer();
  const chunkSize = 256 * 1024; // 256KB
  const bytes = new Uint8Array(arrayBuffer);
  const chunkHashes: string[] = [];
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    const chunk = bytes.slice(offset, Math.min(offset + chunkSize, bytes.length));
    const chunkHash = await sha256Hex(toArrayBuffer(chunk));
    chunkHashes.push(chunkHash);
  }
  // Simplified CID: sha256 over concatenated hex string of chunk hashes
  const concatenated = chunkHashes.join("");
  const cid = await sha256Hex(toArrayBuffer(hexToUtf8Bytes(concatenated)));

  // Base64 encode entire file for node storage
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return { cid, base64 };
}

export default function WalletStoreDemo() {
  const { isConnected, address } = useAccount();
  const { writeContractAsync, status } = useWriteContract();

  const [file, setFile] = useState<File | null>(null);
  const [nodeUrl, setNodeUrl] = useState<string>("http://localhost:8080");
  const [contractAddress, setContractAddress] = useState<string>(
    process.env.NEXT_PUBLIC_MAMMOTH_STORAGE_ADDRESS || ""
  );
  const [paymentEth, setPaymentEth] = useState<string>("0.001");
  const [nodeAddress, setNodeAddress] = useState<string>("");
  const [logs, setLogs] = useState<string[]>([]);

  function log(msg: string) {
    console.log(msg);
    setLogs((prev) => [msg, ...prev]);
  }

  async function runFlow() {
    if (!isConnected) {
      log("Wallet not connected.");
      return;
    }
    if (!file) {
      log("Select a file first.");
      return;
    }
    if (!contractAddress) {
      log("Enter the deployed MammothStorage contract address.");
      return;
    }

    try {
      log("Computing CID from chunks (256KB, SHA-256)...");
      const { cid, base64 } = await computeCid(file);
      log(`CID computed: ${cid}`);

      log(`Uploading blob to node: ${nodeUrl}/storeBlob ...`);
      const res = await fetch(`${nodeUrl}/storeBlob`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hash: cid, data: base64 }),
      });
      const j = await res.json().catch(() => ({}));
      log(`Node response: ${res.status} ${JSON.stringify(j)}`);

      if (!nodeAddress) {
        log("Enter a node EVM address to receive payment.");
        return;
      }

      log("Sending storeFile transaction from connected wallet...");
      const txHash = await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: MammothStorageAbi,
        functionName: "storeFile",
        args: [`0x${cid}`, [nodeAddress as `0x${string}`]],
        value: parseEther(paymentEth),
      });
      log(`Tx sent: ${txHash}`);
    } catch (err: any) {
      log(`Error: ${err?.message || String(err)}`);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4 border rounded-md space-y-3">
      <h2 className="text-lg font-semibold">Wallet-Driven Store Demo</h2>
      <p className="text-sm text-gray-600">
        Connect your wallet, choose a file, upload it to the node, then call
        <code className="ml-1">storeFile</code> on-chain.
      </p>

      <div className="space-y-2">
        <label className="block text-sm">Deployed Contract Address</label>
        <input
          className="w-full border rounded p-2"
          placeholder="0x..."
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm">Storage Node URL</label>
        <input
          className="w-full border rounded p-2"
          placeholder="http://localhost:8080"
          value={nodeUrl}
          onChange={(e) => setNodeUrl(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm">Node EVM Address (receives payment)</label>
        <input
          className="w-full border rounded p-2"
          placeholder={address || "0x..."}
          value={nodeAddress}
          onChange={(e) => setNodeAddress(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm">Payment (BDAG)</label>
        <input
          className="w-full border rounded p-2"
          placeholder="0.001"
          value={paymentEth}
          onChange={(e) => setPaymentEth(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm">Select File</label>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </div>

      <button
        onClick={runFlow}
        disabled={!isConnected || status === "pending"}
        className="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
      >
        {status === "pending" ? "Sending..." : "Run Wallet E2E"}
      </button>

      <div className="pt-3">
        <h3 className="text-sm font-semibold">Logs</h3>
        <pre className="text-xs bg-gray-50 p-2 rounded max-h-48 overflow-auto">
          {logs.join("\n")}
        </pre>
      </div>
    </div>
  );
}