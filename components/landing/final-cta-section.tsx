import Link from "next/link";

import { Reveal } from "@/components/landing/reveal";
import { LandingContainer, SectionFrame } from "@/components/landing/landing-shell";

export function FinalCtaSection() {
  return (
    <SectionFrame>
      <LandingContainer>
        <Reveal className="mx-auto max-w-[960px] px-6 py-10 text-center md:px-12 md:py-14">
          <h2 className="mx-auto max-w-[18ch] text-[32px] leading-[1.03] tracking-[-0.01em] md:text-[40px]">
            Return to yourself, then move with clarity.
          </h2>
          <p className="mx-auto pt-6 text-[16px] leading-[1.6] text-[#425149] md:max-w-[640px] md:text-[18px]">
            Build a calmer rhythm for decisions, learning, and life organization — all in one intentional place.
          </p>
          <div className="pt-8">
            <Link href="/login" className="editorial-cta text-foreground">
              Enter Atriae
            </Link>
          </div>
        </Reveal>
      </LandingContainer>
    </SectionFrame>
  );
}
