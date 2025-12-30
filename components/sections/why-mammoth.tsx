"use client";

import { motion } from "framer-motion";
import { Zap, Database, Code, DollarSign, Cloud, Shield } from "lucide-react";

const benefits = [
  {
    icon: <Zap className="h-6 w-6 text-accent" />,
    title: "Faster retrieval optimized for BDAG",
    description: "Optimized network architecture for BlockDAG applications with minimal latency."
  },
  {
    icon: <Database className="h-6 w-6 text-accent" />,
    title: "Permanent decentralized storage",
    description: "Your data remains accessible and immutable across the distributed network."
  },
  {
    icon: <Code className="h-6 w-6 text-accent" />,
    title: "SDK-first architecture",
    description: "Built for developers with comprehensive SDK access to all features."
  },
  {
    icon: <DollarSign className="h-6 w-6 text-accent" />,
    title: "Low cost, scalable",
    description: "Pay only for what you use with transparent pricing and no hidden fees."
  },
  {
    icon: <Cloud className="h-6 w-6 text-accent" />,
    title: "High uptime distributed network",
    description: "99.9% uptime guarantee with redundant storage across multiple nodes."
  },
  {
    icon: <Shield className="h-6 w-6 text-accent" />,
    title: "Web3-native authentication",
    description: "Connect with your BlockDAG wallet for seamless, secure access."
  }
];

export function WhyMammothSection() {
  return (
    <section id="solutions" className="section bg-white dark:bg-primary">
      <div className="container">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-digital">Why Mammoth</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Designed from the ground up for the BlockDAG ecosystem with performance and security in mind
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-lg border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all duration-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-full bg-accent/10 mr-3">
                  {benefit.icon}
                </div>
                <h3 className="font-bold">{benefit.title}</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
