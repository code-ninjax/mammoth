"use client";

import Link from "next/link";
import Image from "next/image";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

const footerLinks = [
  {
    title: "Product",
    links: [
      { name: "Features", href: "#products" },
      { name: "Pricing", href: "#pricing" },
      { name: "SDK", href: "/docs" },
      { name: "Status", href: "/status" }
    ]
  },
  {
    title: "Resources",
    links: [
      { name: "Documentation", href: "/docs" },
      { name: "Guides", href: "/docs/guides" },
      { name: "Blog", href: "/blog" },
      { name: "Support", href: "/support" }
    ]
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/contact" },
      { name: "Partners", href: "/partners" }
    ]
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy", href: "/privacy" },
      { name: "Terms", href: "/terms" },
      { name: "Security", href: "/security" },
      { name: "Compliance", href: "/compliance" }
    ]
  }
];

const socialLinks = [
  { icon: <Github className="h-5 w-5" />, href: "#", label: "GitHub" },
  { icon: <Twitter className="h-5 w-5" />, href: "#", label: "Twitter" },
  { icon: <Linkedin className="h-5 w-5" />, href: "#", label: "LinkedIn" },
  { icon: <Mail className="h-5 w-5" />, href: "#", label: "Email" }
];

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center mb-6">
              <Image src="/logo-removebg-preview.png" alt="Mammoth logo" width={44} height={44} className="mr-2 rounded-sm" />
              <span className="text-2xl font-bold font-digital">Mammoth</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Decentralized storage built for the BlockDAG ecosystem.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-accent hover:text-white dark:hover:bg-accent transition-colors"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
          
          {footerLinks.map((column, i) => (
            <div key={i}>
              <h3 className="font-bold mb-4">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link, j) => (
                  <li key={j}>
                    <Link 
                      href={link.href} 
                      className="text-gray-600 dark:text-gray-400 hover:text-accent dark:hover:text-accent transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-100 dark:border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Mammoth Storage. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <span className="text-gray-600 dark:text-gray-400 text-sm">
              Powered by <span className="text-accent">BlockDAG</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
