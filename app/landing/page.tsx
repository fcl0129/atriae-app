import { CtaSection } from "@/components/sections/cta";
import { DevicesSection } from "@/components/sections/devices";
import { HeroSection } from "@/components/sections/hero";
import { PublicSiteNavbar } from "@/components/sections/public-site-navbar";
import { SystemSection } from "@/components/sections/system";
import { ValueSection } from "@/components/sections/value";

export default function LandingPage() {
  return (
    <div className="pb-16 pt-4 md:pb-24 md:pt-6">
      <PublicSiteNavbar />
      <main className="mx-auto mt-8 flex w-full max-w-7xl flex-col gap-7 md:mt-12 md:gap-10">
        <HeroSection />
        <ValueSection />
        <SystemSection />
        <DevicesSection />
        <CtaSection />
      </main>
    </div>
  );
}
