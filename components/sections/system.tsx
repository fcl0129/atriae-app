import { Container } from "@/components/landing/container";
import { Reveal } from "@/components/landing/reveal";

const principles = [
  {
    number: "01",
    title: "Structured reflection",
    subtitle: "over reactive productivity",
    text: "Capture thoughts once, then return with clear context instead of rethinking from zero."
  },
  {
    number: "02",
    title: "Deliberate direction",
    subtitle: "over endless options",
    text: "Atriae turns uncertainty into a small set of useful paths so decisions feel grounded."
  },
  {
    number: "03",
    title: "Compounding judgment",
    subtitle: "over temporary output",
    text: "Each session strengthens how you reason, not just what you produce today."
  }
];

export function SystemSection() {
  return (
    <section id="principles" className="py-32">
      <Container className="max-w-5xl">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.24em] text-[#273c30]/80">Principles</p>
          <h2 className="mt-5 max-w-3xl text-5xl leading-[0.95] text-[#112017] md:text-7xl">
            A quieter operating rhythm for complex thinking.
          </h2>
        </Reveal>

        <div className="mt-16 border-t border-[#203428]/20">
          {principles.map((principle, index) => (
            <Reveal key={principle.number} delay={index * 80} className="border-b border-[#203428]/20 py-10 md:py-12">
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.2em] text-[#2e4739]/80">{principle.number}</p>
                <h3 className="max-w-3xl text-3xl leading-tight text-[#132319] md:text-5xl">
                  {principle.title}
                  <span className="block text-[#25392d]/88">{principle.subtitle}</span>
                </h3>
                <p className="max-w-3xl text-base leading-8 text-[#1f3328]/85 md:text-lg">{principle.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
