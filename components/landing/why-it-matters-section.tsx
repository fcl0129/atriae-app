import { Reveal } from "@/components/landing/reveal";
import { LandingContainer, SectionFrame } from "@/components/landing/landing-shell";

export function WhyItMattersSection() {
  return (
    <SectionFrame>
      <LandingContainer>
        <div className="grid gap-10 xl:grid-cols-12 xl:gap-14">
          <Reveal className="space-y-5 xl:col-span-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[#5D735D]">Why it feels different</p>
            <h2 className="max-w-[15ch] text-[32px] leading-[1.03] tracking-[-0.01em] md:text-[40px]">
              Less noise. More inner space.
            </h2>
          </Reveal>

          <Reveal className="space-y-6 xl:col-span-7" delay={100}>
            <p className="text-[16px] leading-[1.65] text-[#425149] md:text-[18px]">
              Most digital tools are designed to demand attention. Atriae is designed to hold it more carefully.
            </p>
            <p className="text-[16px] leading-[1.65] text-[#425149] md:text-[18px]">
              The pace is calmer. The structure is clearer. The system stays deliberate, so your attention can return
              to what actually matters instead of drifting into constant reaction.
            </p>
            <blockquote className="border-l border-[#5D735D]/45 pl-5 font-serif text-[25px] leading-[1.2] text-[#1F2A24] md:text-[31px]">
              Built as a personal sanctuary, not a control panel.
            </blockquote>
          </Reveal>
        </div>
      </LandingContainer>
    </SectionFrame>
  );
}
