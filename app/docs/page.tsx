"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useState } from "react";
import { Check, Copy } from "lucide-react";

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <button
        onClick={copy}
        className="absolute right-2 top-2 p-2 rounded-md bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100"
        title="Copy code"
      >
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      </button>
      <pre className="bg-gray-900 text-gray-300 p-4 rounded-md overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function DocsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 font-digital">Mammoth SDK Documentation</h1>
          <p className="text-xl mb-8 text-gray-700 dark:text-gray-300">
            Integrate decentralized storage with BLOCKDAG payments directly into your application.
          </p>
          
          <div className="mb-12 space-y-8">
            <section className="card">
              <h2 className="text-2xl font-bold mb-4">Installation</h2>
              <CodeBlock code="npm install mammoth-sdk" />
            </section>

            <section className="card">
              <h2 className="text-2xl font-bold mb-4">Initialization</h2>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Initialize the SDK with your blockchain provider and storage node configuration.
              </p>
              <CodeBlock code={`import { Mammoth } from "mammoth-sdk";

// Initialize with configuration
Mammoth.init({
  rpcUrl: "https://rpc.awakening.bdagscan.com", // BLOCKDAG Testnet RPC
  contractAddress: "0xYourContractAddress",
  nodes: ["http://localhost:8080"] // Mammoth Storage Node URL
});`} />
            </section>

            <section className="card">
              <h2 className="text-2xl font-bold mb-4">Upload File (Pay-to-Store)</h2>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Uploads are gated by BLOCKDAG payments. The SDK handles chunking, hashing, transaction creation, and upload orchestration.
              </p>
              <CodeBlock code={`// 1. Get file from user input
const fileInput = document.getElementById("fileInput");
const file = fileInput.files[0];

// 2. Store file (Prompt wallet for payment)
try {
  const result = await Mammoth.store({
    file: file,
    payment: "0.01" // Amount in BLOCKDAG native currency
  });

  console.log("Upload Successful!");
  console.log("File ID (Root Hash):", result.fileId);
  console.log("Transaction Hash:", result.txHash);
  console.log("Retrieval URL:", result.retrievalEndpoint);

} catch (error) {
  console.error("Upload failed:", error);
}`} />
            </section>

            <section className="card">
              <h2 className="text-2xl font-bold mb-4">Retrieve File</h2>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Retrieve and verify file integrity against the on-chain root hash.
              </p>
              <CodeBlock code={`const fileId = "0x..."; // The Root Hash from upload

try {
  // Downloads chunks, verifies on-chain hash, and reassembles
  const fileBuffer = await Mammoth.retrieve(fileId);

  // Example: Display image
  const blob = new Blob([fileBuffer]);
  const url = URL.createObjectURL(blob);
  document.getElementById("img-preview").src = url;

} catch (error) {
  console.error("Verification failed:", error);
}`} />
            </section>
          </div>

          <div className="card bg-accent/10 border-accent">
            <h2 className="text-2xl font-bold mb-4">How it Works (Under the Hood)</h2>
            <ul className="list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>Chunking:</strong> File is split into chunks and hashed client-side.</li>
              <li><strong>Payment:</strong> User signs a BLOCKDAG transaction with the Root Hash.</li>
              <li><strong>Verification:</strong> Storage Nodes verify the transaction on-chain before accepting chunks.</li>
              <li><strong>Retrieval:</strong> SDK downloads chunks from nodes and verifies them against the on-chain Root Hash.</li>
            </ul>
          </div>
          
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
