"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Mammoth } from "mammoth-sdk";

export default function WalletStoreDemo() {
  const { isConnected } = useAccount();

  const [file, setFile] = useState<File | null>(null);
  const [nodeUrl, setNodeUrl] = useState<string>(
    process.env.NEXT_PUBLIC_NODE_URL || (typeof window !== "undefined" ? window.location.origin : "http://localhost:8080")
  );
  const [contractAddress, setContractAddress] = useState<string>(
    process.env.NEXT_PUBLIC_MAMMOTH_STORAGE_ADDRESS || ""
  );
  const [paymentEth, setPaymentEth] = useState<string>("0.001");
  const [logs, setLogs] = useState<string[]>([]);
  const [retrievalUrl, setRetrievalUrl] = useState<string>("");

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
      log("Initializing Mammoth SDK...");
      Mammoth.init({
        rpcUrl: "https://rpc.awakening.bdagscan.com",
        contractAddress: contractAddress,
        nodes: [nodeUrl],
      });

      log("Starting Upload Flow (Chunking -> Payment -> Storage)...");
      log("Please confirm the transaction in your wallet.");

      const result = await Mammoth.store({
        file: file,
        payment: paymentEth,
      });

      log("Upload Successful!");
      log(`File ID (Root Hash): ${result.fileId}`);
      log(`Transaction Hash: ${result.txHash}`);
      log(`Retrieval Endpoint: ${result.retrievalEndpoint}`);
      
      setRetrievalUrl(result.retrievalEndpoint);

    } catch (error: any) {
      console.error(error);
      log(`Error: ${error.message || error}`);
    }
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold mb-4">1. Configuration</h2>
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Storage Node URL</label>
            <input
              type="text"
              value={nodeUrl}
              onChange={(e) => setNodeUrl(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contract Address</label>
            <input
              type="text"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Payment (ETH/BDAG)</label>
            <input
              type="text"
              value={paymentEth}
              onChange={(e) => setPaymentEth(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            />
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">2. Upload File</h2>
        <div className="space-y-4">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-accent file:text-white
              hover:file:bg-accent/90"
          />
          
          <button
            onClick={runFlow}
            disabled={!file || !isConnected}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConnected ? "Upload & Pay" : "Connect Wallet First"}
          </button>
        </div>
      </div>
      
      {retrievalUrl && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4">3. Verification</h2>
          <a
            href={retrievalUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary w-full block text-center"
          >
            Retrieve & Verify Integrity
          </a>
        </div>
      )}

      <div className="card bg-black font-mono text-sm h-64 overflow-y-auto p-4 border border-gray-800">
        <h3 className="text-gray-500 mb-2 uppercase text-xs">Activity Log</h3>
        {logs.map((msg, i) => (
          <div key={i} className="mb-1">
            <span className="text-accent mr-2">{">"}</span>
            {msg}
          </div>
        ))}
        {logs.length === 0 && <span className="text-gray-600">Waiting for action...</span>}
      </div>
    </div>
  );
}
