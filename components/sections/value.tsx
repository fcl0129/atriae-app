import { Container } from "@/components/landing/container";
import { Reveal } from "@/components/landing/reveal";

const transformationFlow = [
  {
    number: "01 — Capture",
    title: "Get everything out of your head and onto the page."
  },
  {
    number: "02 — Organize",
    title: "Atriae structures your thoughts and reveals what matters."
  },
  {
    number: "03 — Act",
    title: "Turn clarity into confident action with your next best step."
  }
];

export function ValueSection() {
  return (
    <section id="how-it-works" className="relative py-16 md:py-24 lg:py-28">
      <Container className="max-w-6xl">
        <Reveal className="space-y-6 text-left">
          <p className="text-xs uppercase tracking-[0.26em] text-[#294135]/78">HOW IT WORKS</p>
          <h2 className="max-w-3xl text-[clamp(2rem,5.8vw,4.2rem)] leading-[0.95] text-[#112118]">
            Clarity isn’t found.
            <br />
            It’s built.
          </h2>
          <p className="max-w-2xl text-base leading-8 text-[#20352a]/84 md:text-lg">
            Atriae turns scattered thoughts into structured clarity — so you always know what to do next.
          </p>
        </Reveal>

        <Reveal delay={110} className="mt-12 md:mt-16">
          <ol className="grid gap-4 md:grid-cols-3 md:gap-0" aria-label="Atriae transformation flow">
            {transformationFlow.map((step, index) => (
              <li
                key={step.number}
                className="relative overflow-hidden rounded-[1.4rem] border border-[#22382d]/15 bg-[linear-gradient(150deg,rgba(255,250,245,0.72),rgba(233,242,229,0.58))] px-6 py-7 shadow-[0_20px_44px_-36px_rgba(23,36,28,0.52)] md:rounded-none md:px-7 md:py-8 md:first:rounded-l-[1.4rem] md:last:rounded-r-[1.4rem]"
              >
                {index < transformationFlow.length - 1 ? (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute right-0 top-1/2 hidden h-px w-7 -translate-y-1/2 translate-x-1/2 bg-[#355341]/30 md:block"
                  />
                ) : null}

                <p className="text-xs uppercase tracking-[0.2em] text-[#274134]/72">{step.number}</p>
                <p className="mt-4 text-base leading-7 text-[#14271d]/88 md:text-[1.02rem]">{step.title}</p>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={180} className="mt-10 space-y-2 text-left md:mt-12">
          <p className="text-lg text-[#162a20] md:text-xl">Calm. Intelligent. Always by your side.</p>
          <p className="max-w-2xl text-sm leading-7 text-[#284134]/78 md:text-base">
            A system designed to help you think clearly and move forward with confidence.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
