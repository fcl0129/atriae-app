import { Compass, PenLine, Sparkles, Target } from "lucide-react";

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
    title: "Reflect and improve",
    text: "Review patterns, refine your process, and keep compounding.",
    icon: Sparkles
  }
];

export function ValueSection() {
  return (
    <SectionWrapper className="scroll-mt-24" surface="soft">
      <Container>
        <div id="value" className="grid gap-10 md:grid-cols-2 xl:grid-cols-4">
          {pillars.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={index * 90}>
                <div className="space-y-5 pr-4">
                  <Icon className="h-5 w-5 stroke-[1.4] text-[#294837]" />
                  <h2 className="text-2xl leading-tight text-[#111f16]">{item.title}</h2>
                  <p className="text-sm leading-7 text-[#26372d]/90">{item.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </SectionWrapper>
  );
}
