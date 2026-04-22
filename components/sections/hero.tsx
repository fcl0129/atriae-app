import Link from "next/link";

import { Container } from "@/components/landing/container";
import { CtaButton } from "@/components/landing/cta-button";
import { Reveal } from "@/components/landing/reveal";

function HeroAtmosphere() {
  return (
    <div
      aria-hidden
      className="relative h-[24rem] w-full overflow-hidden rounded-[2rem] border border-[#244032]/18 bg-[linear-gradient(145deg,rgba(253,247,242,0.9),rgba(233,241,229,0.72))] shadow-[0_42px_80px_-56px_rgba(26,40,31,0.5)] md:h-[30rem]"
    >
      <div className="absolute -right-16 top-6 h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(233,167,176,0.4),rgba(233,167,176,0))] blur-2xl" />
      <div className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(149,181,142,0.42),rgba(149,181,142,0))] blur-2xl" />
      <div className="absolute left-[16%] top-[13%] h-36 w-52 rounded-[2rem] border border-white/40 bg-white/26 backdrop-blur-md" />
      <div className="absolute right-[14%] top-[32%] h-44 w-44 rounded-[2.2rem] border border-white/52 bg-white/36 backdrop-blur-[6px]" />
      <div className="absolute bottom-[14%] left-[28%] h-28 w-56 rounded-[1.7rem] border border-white/50 bg-gradient-to-r from-[#f8e9df]/65 to-[#e2ecdd]/50 backdrop-blur-md" />
      <div className="absolute inset-x-8 bottom-8 h-px bg-gradient-to-r from-transparent via-[#2d4437]/24 to-transparent" />
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 lg:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(64%_52%_at_14%_16%,rgba(238,176,184,0.24),rgba(238,176,184,0)_72%),radial-gradient(56%_42%_at_88%_14%,rgba(250,236,215,0.36),rgba(250,236,215,0)_74%)]" />

      <Container className="relative max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.86fr)] lg:gap-16">
          <Reveal className="max-w-xl space-y-8 text-left">
            <p className="text-xs uppercase tracking-[0.28em] text-[#1f3327]/82">A CALM, INTELLIGENT SYSTEM</p>

            <h1 className="text-[clamp(2.5rem,7vw,5.2rem)] leading-[0.92] text-[#102016]">
              Think clearly.
              <br />
              Move with intention.
            </h1>

            <p className="max-w-lg text-base leading-8 text-[#1c3024]/84 md:text-lg">
              Atriae shapes thought into direction so your next move feels precise, not rushed.
            </p>

            <div className="flex flex-wrap items-center gap-5 pt-1">
              <CtaButton className="h-12 px-7 text-sm tracking-[0.12em] shadow-[0_18px_34px_-24px_rgba(39,59,45,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#31503f]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4ece2]">
                Request access
              </CtaButton>
              <Link
                href="#how-it-works"
                className="inline-flex items-center gap-2 text-sm tracking-[0.08em] text-[#163226] underline-offset-4 transition-colors duration-300 hover:text-[#0e241b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#31503f]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4ece2]"
              >
                Explore the system <span aria-hidden>→</span>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:pl-2">
            <HeroAtmosphere />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
