"use client";

import { createConfig, WagmiProvider } from "wagmi";
import { polygonAmoy } from "wagmi/chains";
import { http } from "viem";
import { injected } from "@wagmi/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Reverted to injected-only connector for simpler behavior

const config = createConfig({
  chains: [polygonAmoy],
  transports: {
    [polygonAmoy.id]: http("https://rpc-amoy.polygon.technology"),
  },
  connectors: [injected()],
});

export default function Web3Provider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>{children}</WagmiProvider>
    </QueryClientProvider>
  );
}