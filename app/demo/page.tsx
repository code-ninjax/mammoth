import { Navbar } from "@/components/navbar";
import Connect from "@/components/Connect";
import WalletStoreDemo from "@/components/WalletStoreDemo";
import { Footer } from "@/components/footer";

export default function Demo() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Wallet E2E Demo</h1>
          <Connect />
        </div>
        <WalletStoreDemo />
      </div>
      <Footer />
    </main>
  );
}