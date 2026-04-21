import Link from "next/link";

import { Container } from "@/components/landing/container";
import { CtaButton } from "@/components/landing/cta-button";
import { Reveal } from "@/components/landing/reveal";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[100svh] items-center py-32 md:py-36">
      <Container className="max-w-5xl">
        <Reveal className="space-y-10 text-left">
          <p className="text-xs uppercase tracking-[0.26em] text-[#1f3327]/80">A calm, intelligent system</p>

          <div className="space-y-6">
            <h1 className="hero-cutout max-w-[10ch] text-6xl font-semibold leading-[0.9] tracking-[0.06em] md:text-8xl">
              ATRIAE
            </h1>
            <p className="max-w-3xl text-xl leading-relaxed text-[#16271d]/90 md:text-2xl">
              A system for thinking clearly.
            </p>
          </div>

          <p className="max-w-3xl text-base leading-8 text-[#1f3327]/85 md:text-lg">
            Atriae is a thinking environment for structured reflection, deliberate decisions, and quieter execution.
            It helps you remove noise, shape options, and move with intention.
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <CtaButton className="h-14 px-8 text-base">Request access</CtaButton>
            <Link
              href="#principles"
              className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-[#173124] transition hover:translate-x-0.5"
            >
              Explore principles <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="pt-10 text-xs uppercase tracking-[0.2em] text-[#2c4336]/65">Scroll to continue ↓</div>
        </Reveal>
      </Container>
    </section>
  );
}
