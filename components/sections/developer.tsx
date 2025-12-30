"use client";

import { motion } from "framer-motion";
import { Code, FileCode, Terminal, BookOpen } from "lucide-react";

const devFeatures = [
  {
    icon: <Code className="h-6 w-6 text-accent" />,
    title: "SDKs",
    items: ["JavaScript", "Python", "Go", "PHP (coming soon)"]
  },
  {
    icon: <FileCode className="h-6 w-6 text-accent" />,
    title: "Mammoth SDK Methods",
    items: ["File Store (Pay-to-Store)", "File Retrieve", "Metadata Verification", "Node Status"]
  },
  {
    icon: <Terminal className="h-6 w-6 text-accent" />,
    title: "Decentralized Retrieval",
    items: ["Verify Root Hash", "Download Chunks", "Reassemble File", "Check Integrity"]
  },
  {
    icon: <FileCode className="h-6 w-6 text-accent" />,
    title: "Node Management",
    items: ["Run Node", "Sync Blocks", "Verify Payments", "Store Chunks"]
  }
];

export function DeveloperSection() {
  return (
    <section id="developers" className="section bg-gray-50 dark:bg-gray-900">
      <div className="container">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-digital">Built for Developers</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              Mammoth provides a comprehensive set of tools and APIs designed to make integration simple and powerful.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {devFeatures.map((feature, index) => (
                <motion.div 
                  key={index}
                  className="p-4 rounded-lg border border-gray-100 dark:border-gray-800"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex items-center mb-3">
                    <div className="p-1.5 rounded-full bg-accent/10 mr-3">
                      {feature.icon}
                    </div>
                    <h3 className="font-bold">{feature.title}</h3>
                  </div>
                  <ul className="space-y-1 text-sm">
                    {feature.items.map((item, i) => (
                      <li key={i} className="flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mr-2"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <a href="/docs" className="btn btn-primary flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Read the Docs
              </a>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="rounded-lg bg-gray-900 dark:bg-gray-800 p-4 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>
              <pre className="text-sm text-gray-300 font-mono overflow-x-auto">
                <code>{`// Upload a file to Mammoth storage
import { Mammoth } from "mammoth-sdk";

// Initialize
Mammoth.init({
  rpcUrl: "https://rpc.awakening.bdagscan.com",
  nodes: ["http://node1.mammoth.storage"]
});

// Pay-to-Store Flow
const result = await Mammoth.store({
  file: myFile,
  payment: "0.01" // BLOCKDAG
});

console.log(\`File ID: \${result.fileId}\`);
console.log(\`TX Hash: \${result.txHash}\`);`}</code>
              </pre>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
