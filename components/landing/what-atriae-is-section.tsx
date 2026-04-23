import { Reveal } from "@/components/landing/reveal";
import { LandingContainer, SectionFrame } from "@/components/landing/landing-shell";

export function WhatAtriaeIsSection() {
  return (
    <SectionFrame className="pt-8 md:pt-12 xl:pt-16">
      <LandingContainer>
        <div className="grid gap-10 xl:grid-cols-12 xl:gap-14">
          <Reveal className="space-y-5 xl:col-span-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[#5D735D]">What Atriae is</p>
            <h2 className="max-w-[16ch] text-[32px] leading-[1.03] tracking-[-0.01em] md:text-[40px]">
              A calmer system for everyday life
            </h2>
          </Reveal>

          <Reveal className="space-y-6 xl:col-span-7" delay={90}>
            <p className="max-w-[64ch] text-[16px] leading-[1.65] text-[#425149] md:text-[18px]">
              Atriae helps you build a more intentional relationship with your time, thoughts, rituals, and
              attention. It works like a personal system that creates clarity instead of pressure.
            </p>
            <p className="max-w-[64ch] text-[16px] leading-[1.65] text-[#425149] md:text-[18px]">
              The structure is simple: notice what matters, keep it organized, revisit it often, and make space for
              reflection before the next decision.
            </p>
          </Reveal>
        </div>
      </LandingContainer>
    </SectionFrame>
  );
}
