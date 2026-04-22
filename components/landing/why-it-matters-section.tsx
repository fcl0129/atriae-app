import { Reveal } from "@/components/landing/reveal";
import { LandingContainer, SectionFrame } from "@/components/landing/landing-shell";

export function WhyItMattersSection() {
  return (
    <SectionFrame className="border-y border-[#D9D0C5]/80">
      <LandingContainer>
        <div className="grid gap-10 xl:grid-cols-12">
          <Reveal className="space-y-6 xl:col-span-7">
            <p className="text-xs uppercase tracking-[0.18em] text-[#5D735D]">Why it matters</p>
            <h2 className="max-w-[15ch] text-[32px] leading-[1.03] tracking-[-0.01em] md:text-[40px]">
              When everything feels important, nothing feels clear.
            </h2>
          </Reveal>

          <Reveal className="space-y-6 xl:col-span-5" delay={100}>
            <p className="text-[16px] leading-[1.55] text-[#425149] md:text-[18px]">
              Too much input creates its own kind of paralysis. When everything competes for your attention, even
              simple decisions start to feel heavy.
            </p>
            <p className="text-[16px] leading-[1.55] text-[#425149] md:text-[18px]">
              Atriae is built to reduce that friction — to help thought become clearer, and action become lighter.
            </p>
            <blockquote className="border-l border-[#5D735D]/45 pl-5 font-serif text-[26px] leading-[1.2] text-[#1F2A24] md:text-[32px]">
              Clarity changes what happens next.
            </blockquote>
          </Reveal>
        </div>
      </LandingContainer>
    </SectionFrame>
  );
}
