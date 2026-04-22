import { Reveal } from "@/components/landing/reveal";
import { LandingContainer, SectionFrame } from "@/components/landing/landing-shell";

const steps = [
  {
    id: "01",
    title: "Empty",
    description: "Make room for thought before adding more to it.",
    microcopy: "Atriae begins by reducing noise, so the important things can surface.",
    tone: "bg-[#E8EFE4]"
  },
  {
    id: "02",
    title: "Structure",
    description: "Turn open loops into something visible.",
    microcopy: "Organize thoughts, priorities, and direction with calm precision.",
    tone: "bg-[#FBF7F1]"
  },
  {
    id: "03",
    title: "Move",
    description: "Let clarity become action.",
    microcopy: "Take the next step from intention, not mental overload.",
    tone: "bg-[#E6D1CD]/70"
  }
];

export function SystemSection() {
  return (
    <SectionFrame id="system">
      <LandingContainer>
        <Reveal className="max-w-[640px] space-y-5 pb-12 md:pb-16">
          <p className="text-xs uppercase tracking-[0.18em] text-[#5D735D]">The System</p>
          <h2 className="text-[32px] leading-[1.03] tracking-[-0.01em] md:text-[40px]">From mental noise to intentional action.</h2>
        </Reveal>

        <div className="space-y-8 md:space-y-10">
          {steps.map((step, index) => (
            <Reveal key={step.id} delay={index * 90}>
              <article className="grid gap-6 rounded-[20px] border border-[#D9D0C5]/85 bg-[#FBF7F1] p-6 shadow-[0_16px_38px_-30px_rgba(31,42,36,0.35)] md:p-8 xl:grid-cols-12 xl:items-center">
                <div
                  className={`h-40 rounded-[20px] border border-[#D9D0C5]/75 ${step.tone} ${index % 2 === 0 ? "xl:order-1" : "xl:order-2"} xl:col-span-5`}
                >
                  <div className="flex h-full items-center justify-center">
                    <div className="h-px w-2/3 bg-[#5D735D]/40" />
                  </div>
                </div>

                <div
                  className={`space-y-3 ${index % 2 === 0 ? "xl:order-2" : "xl:order-1"} xl:col-span-7 xl:px-4`}
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-[#5D735D]">{step.id} — Step</p>
                  <h3 className="text-[26px] leading-[1.05] md:text-[32px] xl:text-[40px]">{step.title}</h3>
                  <p className="text-[16px] leading-[1.5] text-[#1F2A24] md:text-[18px]">{step.description}</p>
                  <p className="max-w-[560px] text-[16px] leading-[1.55] text-[#425149]">{step.microcopy}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </LandingContainer>
    </SectionFrame>
  );
}
