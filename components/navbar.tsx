"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useEffect } from "react";

const navLinks = [
  { name: "Products", href: "#products" },
  { name: "Solutions", href: "#solutions" },
  { name: "Docs", href: "/docs" },
  { name: "Pricing", href: "#pricing" },
  { name: "Developers", href: "#developers" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const injectedConnector = connectors.find((c) => c.id === "metaMask") ?? connectors[0];
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (error) {
      // Surface connector errors for debugging
      console.error("Wallet connect error:", error);
    }
  }, [error]);

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-primary border-b border-gray-100 dark:border-gray-800 backdrop-blur-md bg-opacity-80 dark:bg-opacity-80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center ml-6 md:ml-10">
              <Image src="/logo-removebg-preview.png" alt="Mammoth logo" width={96} height={96} className="rounded-sm" />
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-accent dark:hover:text-accent"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {isConnected ? (
              <button
                onClick={() => {
                  disconnect();
                }}
                className="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 text-sm text-gray-700 dark:text-gray-200 dark:hover:text-black"
              >
                Disconnect {address?.slice(0, 6)}...{address?.slice(-4)}
              </button>
            ) : (
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
                className="btn btn-primary"
              >
                {isPending ? "Connecting..." : "Connect Wallet"}
              </button>
            )}
            <ThemeToggle />
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-accent dark:hover:text-accent focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-accent dark:hover:text-accent"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
              <div className="px-3 py-2">
                {isConnected ? (
                <button
                  onClick={() => {
                      disconnect();
                      setIsOpen(false);
                  }}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 text-gray-700 dark:text-gray-200 dark:hover:text-black"
                >
                  Disconnect {address?.slice(0, 6)}...{address?.slice(-4)}
              </button>
            ) : (
                <button
                  onClick={() => {
                    try {
                      const hasWindow = typeof window !== "undefined";
                      const hasProvider = hasWindow && !!(window as any).ethereum;
                      if (!hasProvider) {
                        window.open("https://metamask.io/download/", "_blank", "noopener,noreferrer");
                        setIsOpen(false);
                        return;
                      }
                      connect({ connector: injectedConnector });
                    } catch (e) {
                      console.error("Connect call failed:", e);
                    }
                    setIsOpen(false);
                  }}
                  disabled={isPending}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
                >
                  {isPending ? "Connecting..." : "Connect Wallet"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
