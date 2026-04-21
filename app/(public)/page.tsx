import { CtaSection } from "@/components/sections/cta";
import { HeroSection } from "@/components/sections/hero";
import { PublicSiteNavbar } from "@/components/sections/public-site-navbar";
import { SystemSection } from "@/components/sections/system";
import { ValueSection } from "@/components/sections/value";

export default function LandingPage() {
  return (
    <div className="pb-16 pt-4 md:pb-24 md:pt-6">
      <PublicSiteNavbar />
      <main className="mx-auto mt-8 flex w-full max-w-7xl flex-col gap-8 px-1 md:mt-12 md:gap-12">
        <HeroSection />
        <SystemSection />
        <ValueSection />
        <CtaSection />
      </main>
    </div>
  );
}
