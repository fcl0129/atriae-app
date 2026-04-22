import { AboutSection } from "@/components/landing/about-section";
import { FinalCtaSection } from "@/components/landing/final-cta-section";
import { Footer } from "@/components/landing/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { LandingShell } from "@/components/landing/landing-shell";
import { Navbar } from "@/components/landing/navbar";
import { SystemSection } from "@/components/landing/system-section";
import { WhatAtriaeIsSection } from "@/components/landing/what-atriae-is-section";
import { WhyItMattersSection } from "@/components/landing/why-it-matters-section";

export default function LandingPage() {
  return (
    <LandingShell>
      <Navbar />
      <main>
        <HeroSection />
        <WhatAtriaeIsSection />
        <SystemSection />
        <WhyItMattersSection />
        <AboutSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </LandingShell>
  );
}
