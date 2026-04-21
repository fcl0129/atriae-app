import { BrainCircuit, Compass, PenLine, Target } from "lucide-react";

import { Container } from "@/components/landing/container";
import { Reveal } from "@/components/landing/reveal";
import { SectionWrapper } from "@/components/landing/section-wrapper";

const pillars = [
  {
    title: "Think clearly",
    text: "Capture what matters and separate signal from noise.",
    icon: PenLine
  },
  {
    title: "Plan intentionally",
    text: "Turn ideas into a plan you can trust before the day begins.",
    icon: Compass
  },
  {
    title: "Act deliberately",
    text: "Focus on the next meaningful step without context switching.",
    icon: Target
  },
  {
    title: "Learn over time",
    text: "See your patterns, strengthen judgment, and compound insight week by week.",
    icon: BrainCircuit
  }
];

export function ValueSection() {
  return (
    <SectionWrapper className="scroll-mt-24 py-10 md:py-14" surface="soft">
      <Container>
        <Reveal>
          <p id="value" className="text-xs font-medium tracking-[0.2em] text-[#2a4636]/80">
            INTELLIGENCE, NOT STORAGE
          </p>
          <h2 className="mt-4 max-w-[18ch] text-3xl leading-[1.03] text-[#111f16] md:text-[2.7rem]">
            Atriae helps you think better, not just collect more.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-10 md:grid-cols-2 xl:grid-cols-4">
          {pillars.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={index * 80}>
                <div className="space-y-4 pr-4">
                  <Icon className="h-5 w-5 stroke-[1.4] text-[#294837]" />
                  <h3 className="text-[1.7rem] leading-tight text-[#111f16]">{item.title}</h3>
                  <p className="max-w-[28ch] text-sm leading-7 text-[#26372d]/90">{item.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </SectionWrapper>
  );
}
