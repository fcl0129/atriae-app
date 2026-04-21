import { Container } from "@/components/landing/container";
import { Reveal } from "@/components/landing/reveal";

export function ValueSection() {
  return (
    <section className="py-24 md:py-32">
      <Container className="max-w-5xl">
        <Reveal className="space-y-6">
          <p className="text-xs uppercase tracking-[0.22em] text-[#2a4133]/80">System feeling</p>
          <h2 className="max-w-3xl text-4xl leading-[1.02] text-[#101f16] md:text-6xl">
            You bring a thought.
            <span className="block text-[#21352a]/88">Atriae shapes it into a usable direction.</span>
          </h2>
          <p className="max-w-3xl text-base leading-8 text-[#22372b]/86 md:text-lg">
            No feeds, no dashboards, no ambient urgency. Just an environment that helps you clarify what matters,
            choose what to do next, and keep improving how you think.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
