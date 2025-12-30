"use client";

import { motion } from "framer-motion";
import { Wallet, Upload, Database, Download } from "lucide-react";

const steps = [
  {
    icon: <Wallet className="h-10 w-10 text-accent" />,
    number: "1️⃣",
    title: "Connect BDAG Wallet",
    description: "Connect your BlockDAG wallet to authenticate and manage your storage."
  },
  {
    icon: <Upload className="h-10 w-10 text-accent" />,
    number: "2️⃣",
    title: "Chunk & Pay (Pay-to-Store)",
    description: "The SDK chunks your file, hashes it, and you sign a BLOCKDAG transaction to authorize storage."
  },
  {
    icon: <Database className="h-10 w-10 text-accent" />,
    number: "3️⃣",
    title: "Stored on Mammoth Nodes",
    description: "Verified chunks are stored across decentralized Mammoth nodes, gated by your payment."
  },
  {
    icon: <Download className="h-10 w-10 text-accent" />,
    number: "4️⃣",
    title: "Retrieve via SDK",
    description: "Retrieve files trustlessly using the SDK, which verifies data integrity against the blockchain."
  }
];

export function HowItWorksSection() {
  return (
    <section className="section bg-gray-50 dark:bg-gray-900">
      <div className="container">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-digital">How It Works</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Simple, secure, and decentralized storage in just a few steps
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="card flex flex-col items-center text-center p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="mb-4 p-3 rounded-full bg-accent/10 relative">
                {step.icon}
                <span className="absolute -top-2 -right-2 text-xl">{step.number}</span>
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{step.description}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-accent/10 text-accent">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">All data is encrypted and secured using BlockDAG consensus</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
