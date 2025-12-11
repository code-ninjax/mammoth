"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "@wagmi/core";

export default function Connect() {
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();

  return (
    <div className="flex items-center gap-2">
      {isConnected ? (
        <button
          onClick={() => disconnect()}
          className="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
        >
          Disconnect {address?.slice(0, 6)}...{address?.slice(-4)}
        </button>
      ) : (
        <button
          onClick={() => connect({ connector: injected() })}
          disabled={isPending}
          className="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
        >
          {isPending ? "Connecting..." : "Connect Wallet"}
        </button>
      )}
    </div>
  );
}