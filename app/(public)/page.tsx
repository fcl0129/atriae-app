import { HeroSection } from "@/components/sections/hero";
import { PublicSiteNavbar } from "@/components/sections/public-site-navbar";
import { SystemSection } from "@/components/sections/system";
import { ValueSection } from "@/components/sections/value";

export default function LandingPage() {
  return (
    <div className="pb-12 pt-4 md:pb-16 md:pt-6">
      <PublicSiteNavbar />
      <main className="mx-auto w-full">
        <HeroSection />
        <SystemSection />
        <ValueSection />
      </main>
    </div>
  );
}
