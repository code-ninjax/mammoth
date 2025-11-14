"use client";

import { motion } from "framer-motion";
import { Coins, Wallet } from "lucide-react";
import Link from "next/link";

const paymentOptions = [
  {
    name: "BDAG Token",
    icon: "💎",
    description: "Pay with BlockDAG native token",
    rate: "11,000 FROST/MiB",
    features: [
      "Storage Price: 11,000 FROST/MiB/EPOCH",
      "Write Price: 20,000 FROST/MiB",
      "Instant transactions",
      "Lower fees",
      "Native ecosystem support"
    ],
    popular: true
  },
  {
    name: "USDT",
    icon: "💵",
    description: "Pay with Tether stablecoin",
    rate: "~$0.05/GB",
    features: [
      "Stable pricing in USD",
      "Wide acceptance",
      "Easy conversion",
      "Predictable costs",
      "Multiple chain support"
    ],
    popular: false
  }
];

export function PricingSection() {
  return (
    <section id="pricing" className="section bg-white dark:bg-primary">
      <div className="container">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-digital">Payment Options</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Pay for decentralized storage with BlockDAG tokens or stablecoins
          </p>
        </motion.div>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {paymentOptions.map((option, index) => (
            <motion.div
              key={index}
              className={`card flex flex-col ${
                option.popular ? 'border-accent ring-2 ring-accent ring-opacity-50' : ''
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {option.popular && (
                <div className="bg-accent text-white text-center py-1 px-4 rounded-t-md -mt-6 mb-4 text-sm font-medium">
                  Recommended
                </div>
              )}
              
              <div className="p-6 flex-grow">
                <div className="text-5xl mb-4">{option.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{option.name}</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{option.description}</p>
                <div className="mb-6 p-3 bg-accent/10 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Rate</p>
                  <p className="text-xl font-bold text-accent">{option.rate}</p>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {option.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mr-2 mt-2 flex-shrink-0"></span>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link 
            href="/payment"
            className="inline-flex items-center px-8 py-3 bg-accent text-white rounded-md font-medium hover:bg-opacity-90 transition-all duration-200"
          >
            <Wallet className="mr-2 h-5 w-5" />
            Connect Wallet to Pay
          </Link>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Connect your BlockDAG wallet to start using Mammoth storage
          </p>
        </motion.div>
        
        <motion.div 
          className="mt-12 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-start">
            <Coins className="h-6 w-6 text-accent mr-3 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-bold mb-2">How Pricing Works</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Mammoth uses a pay-as-you-go model. Storage is priced per MiB per epoch, and writes are charged per MiB. 
                You only pay for what you use, with no monthly subscriptions or hidden fees. All transactions are processed 
                on the BlockDAG network for maximum transparency and security.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
