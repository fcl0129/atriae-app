import { Container } from "@/components/landing/container";
import { Reveal } from "@/components/landing/reveal";

const steps = [
  {
    number: "STEP 01",
    title: "Capture a thought",
    text: "Start with what’s on your mind."
  },
  {
    number: "STEP 02",
    title: "Shape it into clarity",
    text: "Turn it into something structured and useful.",
    indent: true
  },
  {
    number: "STEP 03",
    title: "Move forward with clarity",
    text: "Act with intention, not urgency."
  }
];

export function ValueSection() {
  return (
    <section className="py-24 md:py-32">
      <Container className="max-w-5xl">
        <Reveal className="space-y-5">
          <p className="text-xs uppercase tracking-[0.24em] text-[#294135]/80">How it works</p>
          <h2 className="max-w-3xl text-4xl leading-[1.02] text-[#112118] md:text-6xl">
            A clear progression from thought to action.
          </h2>
        </Reveal>

        <div className="mt-14 border-t border-[#1d3328]/16">
          {steps.map((step, index) => (
            <Reveal
              key={step.number}
              delay={index * 90}
              className={`border-b border-[#1d3328]/16 py-16 md:py-24 ${step.indent ? "md:pl-16" : ""}`}
            >
              <p className="text-xs uppercase tracking-[0.24em] text-[#294136]/72">{step.number}</p>
              <h3 className="mt-5 max-w-3xl text-3xl leading-tight text-[#112118] md:text-5xl">{step.title}</h3>
              <p className="mt-4 max-w-2xl text-base leading-8 text-[#20352a]/84 md:text-lg">{step.text}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
