"use client";

import { motion } from "framer-motion";
import { Code, Image, FileArchive, Globe, Database } from "lucide-react";

const useCases = [
  {
    icon: <Code className="h-10 w-10 text-accent" />,
    title: "dApps & Smart Contracts",
    description: "Store metadata, configurations, and assets for your decentralized applications and smart contracts."
  },
  {
    icon: <Image className="h-10 w-10 text-accent" />,
    title: "NFT Collections",
    description: "Securely store images, metadata, and JSON files for your NFT collections with permanent pinning."
  },
  {
    icon: <FileArchive className="h-10 w-10 text-accent" />,
    title: "App File Storage",
    description: "User uploads, media storage, and backups for traditional and Web3 applications."
  },
  {
    icon: <Globe className="h-10 w-10 text-accent" />,
    title: "Static Website Hosting",
    description: "Host decentralized websites and assets with high availability and censorship resistance."
  },
  {
    icon: <Database className="h-10 w-10 text-accent" />,
    title: "Enterprise Archiving",
    description: "BDAG-level permanent storage for enterprise data with compliance and audit capabilities."
  }
];

export function UseCasesSection() {
  return (
    <section className="section bg-white dark:bg-primary">
      <div className="container">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-digital">Use Cases</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Mammoth storage powers a wide range of applications across the BlockDAG ecosystem
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              className="card flex flex-col items-center text-center p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="mb-4 p-3 rounded-full bg-accent/10">
                {useCase.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{useCase.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{useCase.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
