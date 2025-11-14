import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/sections/hero";
import { WhatWeOfferSection } from "@/components/sections/what-we-offer";
import { WhyMammothSection } from "@/components/sections/why-mammoth";
import { DeveloperSection } from "@/components/sections/developer";
import { UseCasesSection } from "@/components/sections/use-cases";
import { HowItWorksSection } from "@/components/sections/how-it-works";
import { PricingSection } from "@/components/sections/pricing";
import { CtaSection } from "@/components/sections/cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <WhatWeOfferSection />
      <WhyMammothSection />
      <DeveloperSection />
      <UseCasesSection />
      <HowItWorksSection />
      <PricingSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
