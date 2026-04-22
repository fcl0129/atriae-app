import Link from "next/link";

import { Reveal } from "@/components/landing/reveal";
import { LandingContainer, SectionFrame } from "@/components/landing/landing-shell";

export function HeroSection() {
  return (
    <SectionFrame className="pb-20 pt-[72px] md:pt-[84px] xl:min-h-[88vh] xl:pt-[96px]">
      <LandingContainer>
        <div className="grid items-center gap-12 xl:grid-cols-12 xl:gap-8">
          <Reveal className="space-y-8 xl:col-span-6">
            <p className="text-xs uppercase tracking-[0.18em] text-[#5D735D]">Inner clarity, built deliberately</p>
            <h1 className="max-w-[12ch] text-[40px] leading-[1.01] tracking-[-0.02em] text-[#1F2A24] md:text-[56px] xl:text-[72px]">
              Clarity is not something you have. It is something you build.
            </h1>
            <p className="max-w-[520px] text-base leading-[1.5] text-[#425149] md:text-[18px] xl:text-[20px]">
              Atriae is a quiet system for people who want to think more clearly, choose more consciously, and move
              forward with intention.
            </p>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:gap-4">
              <Link
                href="/login"
                className="inline-flex h-[52px] items-center justify-center rounded-full border border-[#1F2A24] bg-[#1F2A24] px-7 text-[15px] font-medium text-[#FBF7F1] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#24322B]"
              >
                Request access
              </Link>
              <Link
                href="#what"
                className="inline-flex h-[52px] items-center justify-center rounded-full border border-[#D9D0C5] bg-[#FBF7F1] px-7 text-[15px] font-medium text-[#1F2A24] transition-all duration-300 hover:-translate-y-0.5"
              >
                Learn more
              </Link>
            </div>
          </Reveal>

          <Reveal className="relative min-h-[360px] xl:col-span-6 xl:min-h-[560px]" delay={120}>
            <div className="absolute inset-0 rounded-[20px] border border-[#D9D0C5]/70 bg-[#FBF7F1] shadow-[0_16px_38px_-30px_rgba(31,42,36,0.35)]" />
            <div className="absolute left-[10%] top-[14%] h-[44%] w-[64%] rounded-[20px] border border-[#D9D0C5]/70 bg-[#E8EFE4]" />
            <div className="absolute bottom-[17%] right-[7%] h-[36%] w-[52%] rounded-[20px] border border-[#D9D0C5]/70 bg-[#E6D1CD]/80" />
            <div className="absolute left-[24%] top-[35%] h-[40%] w-[52%] rounded-[20px] border border-[#D9D0C5]/80 bg-[#F7F2EA] shadow-[0_10px_24px_-20px_rgba(31,42,36,0.28)]" />
            <div className="absolute bottom-[22%] left-[14%] h-px w-[58%] bg-[#5D735D]/45" />
            <div className="absolute bottom-[28%] left-[14%] h-px w-[44%] bg-[#5D735D]/35" />
          </Reveal>
        </div>
      </LandingContainer>
    </SectionFrame>
  );
}
