"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import { Wallet, ArrowRight, CheckCircle, Info, TrendingUp, Database } from "lucide-react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useEffect } from "react";

export default function PaymentPage() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const injectedConnector = connectors.find((c) => c.id === "injected") ?? connectors[0];
  const { disconnect } = useDisconnect();
  const [selectedToken, setSelectedToken] = useState<"BDAG" | "USDT">("BDAG");

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-primary dark:to-gray-900">
      <Navbar />
      
      <div className="container py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-digital">
              Storage Payment
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Connect your wallet to purchase Mammoth decentralized storage
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Pricing Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Storage Price Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="card bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black text-white border-cyan-500/20"
              >
                <div className="p-6">
                  <p className="text-cyan-400 text-sm font-medium mb-2">STORAGE PRICE</p>
                  <div className="text-4xl font-bold mb-2">11,000</div>
                  <p className="text-gray-400 text-sm">FROST / MiB / EPOCH</p>
                </div>
              </motion.div>

              {/* Write Price Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="card bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black text-white border-purple-500/20"
              >
                <div className="p-6">
                  <p className="text-purple-400 text-sm font-medium mb-2">WRITE PRICE</p>
                  <div className="text-4xl font-bold mb-2">20,000</div>
                  <p className="text-gray-400 text-sm">FROST / MiB</p>
                </div>
              </motion.div>

              {/* Usage Stats */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="card"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold">Network Stats</h3>
                    <TrendingUp className="h-5 w-5 text-accent" />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Used</span>
                        <span className="font-bold text-purple-500">580.73 TB</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Total</span>
                        <span className="font-bold text-cyan-500">4.16 PB</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Capacity</span>
                        <span className="font-bold">13.94%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Wallet Connection */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="card relative overflow-hidden"
              >
                {/* Decorative Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-transparent pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative p-8">
                  {!isConnected ? (
                    <>
                      <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 mb-4">
                          <Wallet className="h-10 w-10 text-accent" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2 font-digital">YOUR STAKED WAL</h2>
                        <p className="text-xl font-bold mb-2">Wallet not connected</p>
                        <p className="text-gray-600 dark:text-gray-400">
                          Please connect your crypto wallet to see your staked WAL
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          try {
                            const hasWindow = typeof window !== "undefined";
                            const hasProvider = hasWindow && !!(window as any).ethereum;
                            if (!hasProvider) {
                              window.open("https://metamask.io/download/", "_blank", "noopener,noreferrer");
                              return;
                            }
                            connect({ connector: injectedConnector });
                          } catch (e) {
                            console.error("Connect call failed:", e);
                          }
                        }}
                        disabled={isPending}
                        className="w-full py-3 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        {isPending ? "Connecting..." : "Connect Wallet"}
                      </button>

                      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-start">
                          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                          <div className="text-sm text-blue-900 dark:text-blue-200">
                            <p className="font-medium mb-1">Supported Wallets</p>
                            <p>Injected wallets (e.g., MetaMask, Bybit) via browser extension</p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mr-4">
                            <CheckCircle className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Connected Wallet</p>
                            <p className="font-bold font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => disconnect()}
                          className="text-sm text-accent hover:underline"
                        >
                          Disconnect
                        </button>
                      </div>

                      {/* Token Selection */}
                      <div className="mb-8">
                        <label className="block text-sm font-medium mb-3">Select Payment Token</label>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            onClick={() => setSelectedToken("BDAG")}
                            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                              selectedToken === "BDAG"
                                ? "border-accent bg-accent/10"
                                : "border-gray-200 dark:border-gray-700 hover:border-accent/50"
                            }`}
                          >
                            <div className="text-3xl mb-2">💎</div>
                            <p className="font-bold">BDAG Token</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">11,000 FROST/MiB</p>
                          </button>
                          <button
                            onClick={() => setSelectedToken("USDT")}
                            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                              selectedToken === "USDT"
                                ? "border-accent bg-accent/10"
                                : "border-gray-200 dark:border-gray-700 hover:border-accent/50"
                            }`}
                          >
                            <div className="text-3xl mb-2">💵</div>
                            <p className="font-bold">USDT</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">~$0.05/GB</p>
                          </button>
                        </div>
                      </div>

                      {/* Storage Amount */}
                      <div className="mb-8">
                        <label className="block text-sm font-medium mb-3">Storage Amount</label>
                        <div className="relative">
                          <input
                            type="number"
                            placeholder="Enter amount in GB"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-accent"
                            defaultValue="100"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">GB</span>
                        </div>
                      </div>

                      {/* Epoch Duration */}
                      <div className="mb-8">
                        <label className="block text-sm font-medium mb-3">Epoch Duration</label>
                        <select className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-accent">
                          <option>1 Epoch (14 days)</option>
                          <option>2 Epochs (28 days)</option>
                          <option>4 Epochs (56 days)</option>
                          <option>8 Epochs (112 days)</option>
                        </select>
                      </div>

                      {/* Cost Summary */}
                      <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h3 className="font-bold mb-4">Cost Summary</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Storage (100 GB)</span>
                            <span className="font-medium">1,100,000 FROST</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Write Fee</span>
                            <span className="font-medium">2,000,000 FROST</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Network Fee</span>
                            <span className="font-medium">~50 FROST</span>
                          </div>
                          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between">
                              <span className="font-bold">Total</span>
                              <span className="font-bold text-accent">3,100,050 FROST</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Purchase Button */}
                      <button className="w-full py-4 px-6 bg-gradient-to-r from-accent to-blue-600 hover:from-blue-600 hover:to-accent text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center">
                        Purchase Storage
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </button>

                      <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                        Transaction will be processed on BlockDAG network
                      </p>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Additional Info */}
              {isConnected && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800">
                    <div className="flex items-start">
                      <Database className="h-5 w-5 text-cyan-600 dark:text-cyan-400 mr-3 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium text-cyan-900 dark:text-cyan-200 mb-1">Instant Activation</p>
                        <p className="text-cyan-700 dark:text-cyan-300">Your storage will be available immediately after payment confirmation</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium text-purple-900 dark:text-purple-200 mb-1">Secure & Decentralized</p>
                        <p className="text-purple-700 dark:text-purple-300">All data is encrypted and distributed across Mammoth nodes</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </main>
  );
}
