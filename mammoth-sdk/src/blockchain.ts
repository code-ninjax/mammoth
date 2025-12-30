import { ethers } from "ethers";
import { getConfig } from "./client";

const ABI = [
  "function storeFile(bytes32 rootHash, bytes32 metadataHash) payable",
  "function files(bytes32 rootHash) view returns (bytes32 rootHash, bytes32 metadataHash, address owner, uint256 paid, bool released)",
];

function toHex32(hash: string) {
  return hash.startsWith("0x") ? hash : `0x${hash}`;
}

function getReadProvider(rpcUrl: string) {
  if (typeof window !== "undefined" && (window as any).ethereum) {
    return new ethers.BrowserProvider((window as any).ethereum);
  }
  return new ethers.JsonRpcProvider(rpcUrl);
}

export async function sendStoreTx(
  rootHash: string,
  metadataHash: string,
  payment: string
): Promise<string> {
  const { rpcUrl, contractAddress } = getConfig();

  let provider: ethers.Provider;
  let signer: ethers.Signer;

  if (typeof window !== "undefined" && (window as any).ethereum) {
    const browserProvider = new ethers.BrowserProvider((window as any).ethereum);
    provider = browserProvider;
    signer = await browserProvider.getSigner();
  } else {
    const jsonProvider = new ethers.JsonRpcProvider(rpcUrl);
    provider = jsonProvider;
    const pk = process.env.PRIVATE_KEY;
    if (!pk) {
      console.warn("[Blockchain] PRIVATE_KEY not set. Returning fake hash for testing.");
      return "0x" + "0".repeat(64);
    }
    signer = new ethers.Wallet(pk, jsonProvider);
  }

  const contract = new ethers.Contract(contractAddress, ABI, signer);

  const rootHashHex = toHex32(rootHash);
  const metadataHashHex = toHex32(metadataHash);
  const value = ethers.parseEther(payment);

  const paymentNumber = Number(payment);
  if (!Number.isFinite(paymentNumber) || paymentNumber <= 0) {
    throw new Error("Invalid payment: value must be > 0");
  }

  try {
    const readProvider = getReadProvider(rpcUrl);
    const code = await readProvider.getCode(contractAddress);
    if (!code || code === "0x") {
      throw new Error(`No contract deployed at ${contractAddress}`);
    }

    const readContract = new ethers.Contract(contractAddress, ABI, readProvider);
    let existing: any;
    try {
      existing = await readContract.files(rootHashHex);
    } catch {
      throw new Error(
        `Contract at ${contractAddress} is not MammothStorage (files() call failed)`
      );
    }

    if (existing?.rootHash && existing.rootHash !== ethers.ZeroHash) {
      return "0xALREADY_STORED_ON_CHAIN";
    }

    const tx = await contract.storeFile(rootHashHex, metadataHashHex, { 
      value,
      gasLimit: 1_000_000,
    });
    const receipt = await tx.wait();
    if (receipt.status === 0) {
      throw new Error(`Transaction reverted on-chain. Hash: ${tx.hash}`);
    }

    return tx.hash;
  } catch (error: any) {
    const msg = error?.shortMessage || error?.reason || error?.message || String(error);
    if (msg.includes("missing revert data")) {
      throw new Error(
        `Store transaction failed: missing revert data. This usually means the contract address is wrong, the contract bytecode is not MammothStorage, or the RPC/wallet is on the wrong network.`
      );
    }
    throw new Error(`Store transaction failed: ${msg}`);
  }
}

export async function getFileRecord(rootHash: string) {
  const { rpcUrl, contractAddress } = getConfig();
  const provider = getReadProvider(rpcUrl);
  const contract = new ethers.Contract(contractAddress, ABI, provider);
  
  const rootHashHex = toHex32(rootHash);
  try {
    const record = await contract.files(rootHashHex);
    return {
      rootHash: record.rootHash,
      metadataHash: record.metadataHash,
      owner: record.owner,
      paid: record.paid,
      released: record.released,
    };
  } catch {
    return null;
  }
}
