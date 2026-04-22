import { HeroSection } from "@/components/sections/hero";
import { PublicSiteNavbar } from "@/components/sections/public-site-navbar";
import { ValueSection } from "@/components/sections/value";

export default function LandingPage() {
  return (
    <div className="pb-12 pt-3 md:pb-16 md:pt-5">
      <PublicSiteNavbar />
      <main className="mx-auto w-full">
        <HeroSection />
        <ValueSection />
      </main>
    </div>
  );
}
