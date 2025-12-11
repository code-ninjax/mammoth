"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function HeroSection() {
  const [nodes, setNodes] = useState<Array<{
    width: number;
    height: number;
    top: number;
    left: number;
    opacity: number;
    scale: number;
  }>>([]);

  useEffect(() => {
    // Generate decorative nodes on client to avoid SSR/CSR mismatch
    const generated = Array.from({ length: 20 }).map(() => ({
      width: Math.random() * 300 + 50,
      height: Math.random() * 300 + 50,
      top: Math.random() * 100,
      left: Math.random() * 100,
      opacity: Math.random() * 0.5,
      scale: Math.random() * 0.5 + 0.5,
    }));
    setNodes(generated);
  }, []);
  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-primary dark:to-gray-900">
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent"></div>
      </div>
      
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6 font-digital"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Decentralized Storage Built for the BlockDAG Ecosystem
          </motion.h1>
          
          <motion.p 
            className="text-xl mb-8 text-gray-700 dark:text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Store, pin, and serve data with secure, decentralized infrastructure optimized for BDAG applications.
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <a href="#" className="btn btn-primary">Get Started</a>
            <a href="/docs" className="btn btn-secondary">View Docs</a>
          </motion.div>
        </div>
      </div>
      
      {/* Abstract nodes background (client-only) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" suppressHydrationWarning>
        {nodes.map((node, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-accent/10 dark:bg-accent/20"
            style={{
              width: `${node.width}px`,
              height: `${node.height}px`,
              top: `${node.top}%`,
              left: `${node.left}%`,
              opacity: node.opacity,
              transform: `scale(${node.scale})`,
            }}
          />
        ))}
      </div>
    </section>
  );
}
