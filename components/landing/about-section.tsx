import { Reveal } from "@/components/landing/reveal";
import { LandingContainer, SectionFrame } from "@/components/landing/landing-shell";

export function AboutSection() {
  return (
    <SectionFrame id="about">
      <LandingContainer>
        <div className="grid gap-10 xl:grid-cols-12 xl:gap-14">
          <Reveal className="space-y-6 xl:col-span-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[#5D735D]">About Atriae</p>
            <h2 className="max-w-[16ch] text-[32px] leading-[1.03] tracking-[-0.01em] md:text-[40px]">
              A quieter system for modern minds.
            </h2>
            <p className="max-w-[560px] text-[16px] leading-[1.55] text-[#425149] md:text-[18px]">
              Atriae was created for people who do not need more stimulation — they need more clarity.
            </p>
          </Reveal>

          <Reveal className="rounded-[20px] border border-[#D9D0C5]/80 bg-[#E8EFE4]/55 p-7 md:p-9 xl:col-span-7" delay={90}>
            <div className="space-y-5 text-[16px] leading-[1.55] text-[#425149] md:text-[18px]">
              <p>
                It is for people who want to think well, choose carefully, and live with greater intention. Not
                faster. Not louder. Clearer.
              </p>
              <p className="font-serif text-[26px] leading-[1.2] text-[#1F2A24] md:text-[32px]">No feeds. No distractions. No noise.</p>
            </div>
          </Reveal>
        </div>
      </LandingContainer>
    </SectionFrame>
  );
}
