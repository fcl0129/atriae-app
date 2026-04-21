import { PublicLandingFinalCta } from "@/components/sections/public-landing-final-cta";
import { PublicLandingGlimpse } from "@/components/sections/public-landing-glimpse";
import { PublicLandingHero } from "@/components/sections/public-landing-hero";
import { PublicLandingNavbar } from "@/components/sections/public-landing-navbar";
import { PublicLandingPhilosophy } from "@/components/sections/public-landing-philosophy";
import { PublicLandingPositioning } from "@/components/sections/public-landing-positioning";

export default function LandingPage() {
  return (
    <div className="pb-16 pt-4 md:pb-24 md:pt-6">
      <PublicLandingNavbar />

      <main className="mx-auto mt-8 flex w-full max-w-6xl flex-col gap-20 px-1 md:mt-12 md:gap-28">
        <PublicLandingHero />
        <PublicLandingPositioning />
        <PublicLandingPhilosophy />
        <PublicLandingGlimpse />
        <PublicLandingFinalCta />
      </main>
    </div>
  );
}
