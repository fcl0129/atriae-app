import { Reveal } from "@/components/landing/reveal";
import { LandingContainer, SectionFrame } from "@/components/landing/landing-shell";

export function WhyItMattersSection() {
  return (
    <SectionFrame>
      <LandingContainer>
        <div className="grid gap-10 xl:grid-cols-12 xl:gap-14">
          <Reveal className="space-y-5 xl:col-span-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[#5D735D]">How intelligence fits naturally</p>
            <h2 className="max-w-[15ch] text-[32px] leading-[1.03] tracking-[-0.01em] md:text-[40px]">
              Guidance without the gimmicks.
            </h2>
          </Reveal>

          <Reveal className="space-y-6 xl:col-span-7" delay={100}>
            <p className="text-[16px] leading-[1.65] text-[#425149] md:text-[18px]">
              Atriae intelligence works quietly inside your flow: helping you learn, plan, focus, and organize without becoming another chat tab to manage.
            </p>
            <p className="text-[16px] leading-[1.65] text-[#425149] md:text-[18px]">
              You bring one thought. Atriae returns a structured brief with clear next steps, so action feels lighter and more intentional.
            </p>
            <blockquote className="border-l border-[#5D735D]/45 pl-5 font-serif text-[25px] leading-[1.2] text-[#1F2A24] md:text-[31px]">
              A thinking companion, not a productivity mascot.
            </blockquote>
          </Reveal>
        </div>
      </LandingContainer>
    </SectionFrame>
  );
}
