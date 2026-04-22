import { Reveal } from "@/components/landing/reveal";
import { LandingContainer, SectionFrame } from "@/components/landing/landing-shell";

const points = [
  "Create space before reacting.",
  "Organize what actually matters.",
  "Move with more clarity and less friction."
];

export function WhatAtriaeIsSection() {
  return (
    <SectionFrame id="what" className="border-y border-[#D9D0C5]/80">
      <LandingContainer>
        <div className="grid gap-10 xl:grid-cols-12 xl:gap-12">
          <Reveal className="space-y-5 xl:col-span-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[#5D735D]">What Atriae is</p>
            <h2 className="max-w-[16ch] text-[32px] leading-[1.03] tracking-[-0.01em] md:text-[40px]">Not another tool. A way of thinking.</h2>
          </Reveal>

          <Reveal className="space-y-6 xl:col-span-7" delay={80}>
            <p className="max-w-[640px] text-[16px] leading-[1.55] text-[#425149] md:text-[18px]">
              Atriae helps people structure their thoughts, reduce mental clutter, and move with more intention. It is
              not a feed, a performance system, or another source of noise. It is a quieter framework for seeing
              clearly.
            </p>
            <div className="space-y-4">
              {points.map((point) => (
                <div key={point} className="rounded-[20px] border border-[#D9D0C5]/85 bg-[#FBF7F1] px-6 py-5 shadow-[0_10px_24px_-20px_rgba(31,42,36,0.28)]">
                  <p className="text-[16px] leading-[1.5] text-[#1F2A24] md:text-[18px]">{point}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </LandingContainer>
    </SectionFrame>
  );
}
