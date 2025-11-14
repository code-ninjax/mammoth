"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-accent to-blue-700 text-white">
      <div className="container">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-digital">
            Start building with decentralized storage today.
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join developers and businesses already using Mammoth to power their BlockDAG applications.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <a 
              href="#" 
              className="inline-flex items-center px-8 py-3 bg-white text-accent rounded-md font-medium hover:bg-opacity-90 transition-all duration-200"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
