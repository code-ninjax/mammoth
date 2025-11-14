import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-geist' });

// We'll use Inter as a fallback for the digital font until we set up the proper fonts
const digital = Inter({ subsets: ['latin'], variable: '--font-digital' });

export const metadata: Metadata = {
  title: 'Mammoth - Decentralized Storage for BlockDAG',
  description: 'Store, pin, and serve data with secure, decentralized infrastructure optimized for BDAG applications.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${digital.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
