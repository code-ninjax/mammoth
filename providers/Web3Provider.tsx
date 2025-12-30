"use client";

import { createConfig, WagmiProvider } from "wagmi";
import { http } from "viem";
import type { Chain } from "viem/chains";
import { metaMask, injected } from "@wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const BDAG: Chain = {
  id: 1043,
  name: "BlockDAG Awakening",
  nativeCurrency: { name: "BDAG", symbol: "BDAG", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.awakening.bdagscan.com"] },
    public: { http: ["https://rpc.awakening.bdagscan.com"] },
  },
  blockExplorers: {
    default: { name: "BDAG Scan", url: "https://awakening.bdagscan.com" },
  },
  testnet: true,
};

const connectors = typeof window === "undefined" ? [] : [metaMask(), injected()];

const config = createConfig({
  chains: [BDAG],
  transports: {
    [BDAG.id]: http("https://rpc.awakening.bdagscan.com"),
  },
  connectors,
});

export default function Web3Provider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>{children}</WagmiProvider>
    </QueryClientProvider>
  );
}
