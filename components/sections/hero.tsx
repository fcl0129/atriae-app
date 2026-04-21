import Link from "next/link";

import { Container } from "@/components/landing/container";
import { CtaButton } from "@/components/landing/cta-button";
import { Reveal } from "@/components/landing/reveal";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[92svh] items-center overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(54%_46%_at_50%_34%,rgba(255,250,241,0.45),rgba(255,250,241,0)_72%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-multiply [background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22140%22 height=%22140%22 viewBox=%220 0 140 140%22%3E%3Cg fill=%22%235c4938%22 fill-opacity=%220.38%22%3E%3Ccircle cx=%2211%22 cy=%228%22 r=%220.7%22/%3E%3Ccircle cx=%2243%22 cy=%2338%22 r=%220.7%22/%3E%3Ccircle cx=%2292%22 cy=%2260%22 r=%220.7%22/%3E%3Ccircle cx=%23126%22 cy=%22116%22 r=%220.7%22/%3E%3Ccircle cx=%2227%22 cy=%22112%22 r=%220.7%22/%3E%3C/g%3E%3C/svg%3E')]" />

      <Container className="relative max-w-6xl">
        <div className="pointer-events-none absolute -top-10 left-1/2 z-0 w-full -translate-x-1/2 text-center font-serif text-[20vw] font-semibold leading-none tracking-[0.05em] text-[#132219]/[0.12]">
          ATRIAE
        </div>

        <Reveal className="relative z-10 max-w-2xl space-y-9 text-left">
          <p className="text-xs uppercase tracking-[0.28em] text-[#1f3327]/80">A calm, intelligent system</p>

          <h1 className="max-w-2xl text-5xl font-medium leading-[0.95] text-[#0f1d15] md:text-7xl">
            A system for thinking clearly.
          </h1>

          <p className="max-w-xl text-base leading-8 text-[#1c3024]/84 md:text-lg">
            Atriae shapes thought into direction so your next move feels precise, not rushed.
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <CtaButton className="h-14 px-8 text-base">Request access</CtaButton>
            <Link
              href="#system-preview"
              className="inline-flex items-center gap-2 text-sm tracking-[0.14em] text-[#153023] transition-opacity duration-300 hover:opacity-70"
            >
              Explore the system <span aria-hidden>→</span>
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
