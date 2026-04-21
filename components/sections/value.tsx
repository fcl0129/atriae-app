import { Container } from "@/components/landing/container";
import { Reveal } from "@/components/landing/reveal";
import { SectionWrapper } from "@/components/landing/section-wrapper";

const flow = [
  {
    title: "You bring a thought",
    text: "A question, note, decision, or uncertainty enters the system as raw input."
  },
  {
    title: "Atriae structures it",
    text: "The platform organizes context into a usable breakdown, priorities, and next actions."
  },
  {
    title: "You move deliberately",
    text: "Clear options reduce noise so you can act with intention instead of urgency."
  }
];

const pillars = ["Think clearly", "Plan intentionally", "Act deliberately", "Reflect and improve"];

export function ValueSection() {
  return (
    <SectionWrapper className="scroll-mt-24 py-10 md:py-14">
      <Container>
        <Reveal>
          <p id="value" className="text-xs font-medium tracking-[0.2em] text-[#2a4636]/80">
            CLARITY FLOW
          </p>
          <h2 className="mt-4 max-w-[22ch] text-3xl leading-[1.03] text-[#111f16] md:text-[2.7rem]">
            From a passing thought to a grounded plan.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {flow.map((item, index) => (
            <Reveal key={item.title} delay={index * 80}>
              <article className="h-full rounded-2xl border border-[#1f3d2b]/13 bg-[#fffdf8]/82 p-5 md:p-6">
                <h3 className="text-xl text-[#13241a] md:text-2xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#26372d]/90 md:text-base">{item.text}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 md:mt-12">
          <div className="rounded-[1.7rem] border border-[#1f3d2b]/14 bg-[rgba(255,252,245,0.76)] p-6 md:p-8">
            <p className="text-xs font-medium tracking-[0.2em] text-[#2a4636]/78">ADJUST THE RESPONSE</p>
            <p className="mt-3 max-w-[62ch] text-base leading-8 text-[#23352a]/90 md:text-lg">
              Thinking is iterative. Refine in layers with prompts like <span className="font-medium">“Make this tighter”</span> and <span className="font-medium">“Make this more concrete.”</span> Atriae keeps shaping the same thread until it becomes clear enough to use.
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-10 md:mt-12">
          <div className="grid gap-6 rounded-[1.9rem] border border-[#1f3d2b]/14 bg-[#fefcf7]/90 p-6 md:grid-cols-[1.2fr_0.8fr] md:p-8">
            <div>
              <p className="text-xs font-medium tracking-[0.2em] text-[#2a4636]/78">AI + LEARNING</p>
              <h3 className="mt-3 text-2xl leading-tight text-[#13241a] md:text-[2.1rem]">AI that helps you think.</h3>
              <p className="mt-4 max-w-[60ch] text-sm leading-7 text-[#26372d]/90 md:text-base">
                Atriae learns how you reason over time — where you hesitate, what patterns repeat, and which framing
                leads to better outcomes. It teaches while it assists, helping you build stronger judgment through daily
                use.
              </p>
            </div>
            <div className="rounded-2xl border border-[#1f3d2b]/13 bg-white/70 p-5">
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#335140]/80">Core rhythm</p>
              <ul className="mt-4 space-y-2 text-sm text-[#22372c]/90">
                {pillars.map((pillar) => (
                  <li key={pillar}>• {pillar}</li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </Container>
    </SectionWrapper>
  );
}
