"use client";

import { motion } from "framer-motion";
import { Database, HardDrive, Lock, BarChart3, DollarSign, Network } from "lucide-react";

const features = [
  {
    icon: <Database className="h-8 w-8 text-accent" />,
    title: "IPFS-Compatible Storage",
    description: "Keep your data decentralized and permanent. Upload, pin, and retrieve files using Mammoth's IPFS-compatible layer."
  },
  {
    icon: <HardDrive className="h-8 w-8 text-accent" />,
    title: "Mammoth Storage Nodes",
    description: "Store files securely across distributed Mammoth nodes powered by BlockDAG consensus."
  },
  {
    icon: <Network className="h-8 w-8 text-accent" />,
    title: "S3-Compatible API",
    description: "Integrate storage into any app using S3-compatible endpoints."
  },
  {
    icon: <Lock className="h-8 w-8 text-accent" />,
    title: "Encryption & Access Control",
    description: "Client-side encryption and full access control."
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-accent" />,
    title: "Dashboard & Analytics",
    description: "View storage usage, file hashes, API keys, and network stats in real time."
  },
  {
    icon: <DollarSign className="h-8 w-8 text-accent" />,
    title: "Predictable Pricing",
    description: "Simple, transparent, developer-friendly pricing."
  }
];

export function WhatWeOfferSection() {
  return (
    <section id="products" className="section bg-gray-50 dark:bg-gray-900">
      <div className="container">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-digital">What We Offer</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Comprehensive decentralized storage solutions built for the BlockDAG ecosystem
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
