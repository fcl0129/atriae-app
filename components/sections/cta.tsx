import Link from "next/link";

import { Container } from "@/components/landing/container";
import { CtaButton } from "@/components/landing/cta-button";
import { Reveal } from "@/components/landing/reveal";

export function CtaSection() {
  return (
    <section className="py-24 md:py-32">
      <Container className="max-w-5xl">
        <Reveal className="space-y-8">
          <p className="text-xs uppercase tracking-[0.22em] text-[#2a4234]/80">Private access</p>
          <h2 className="max-w-3xl text-4xl leading-[1.02] text-[#102017] md:text-6xl">Request access.</h2>
          <p className="max-w-3xl text-base leading-8 text-[#21362a]/86 md:text-lg">
            Built for people who value calm, precision, and better judgment over noise.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <CtaButton className="h-14 px-8 text-base">Request access</CtaButton>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-[#173124] transition hover:translate-x-0.5"
            >
              Learn more <span aria-hidden>→</span>
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
