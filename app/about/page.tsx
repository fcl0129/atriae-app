import Link from "next/link";

import { LandingContainer, LandingShell, SectionFrame } from "@/components/landing/landing-shell";

export default function AboutPage() {
  return (
    <LandingShell>
      <main>
        <SectionFrame className="pt-14 md:pt-20">
          <LandingContainer className="max-w-6xl">
            <div className="max-w-4xl space-y-7">
              <p className="text-xs uppercase tracking-[0.22em] text-[#5D735D]">About Atriae</p>
              <h1 className="text-4xl leading-[1.02] tracking-[-0.02em] text-[#101d14] md:text-6xl">
                A calm operating layer for inner clarity.
              </h1>
              <p className="max-w-[60ch] text-[18px] leading-[1.7] text-[#213429]/90">
                Atriae exists for people who want a more thoughtful relationship with their attention, routines, and
                internal life. It is designed so clarity can stay close.
              </p>
            </div>
          </LandingContainer>
        </SectionFrame>

        <SectionFrame className="border-y border-[#D9D0C5]/80 py-14 md:py-20">
          <LandingContainer className="max-w-6xl">
            <div className="grid gap-8 md:grid-cols-2">
              <article className="space-y-4">
                <h2 className="font-serif text-[34px] leading-[1.05] text-[#111f16]">What Atriae is</h2>
                <p className="leading-8 text-[#1f3126]/90">
                  A system for reflection, rituals, learning, and focus. Atriae helps you organize thought with
                  intentional structure, then revisit what matters with consistency.
                </p>
              </article>

              <article className="space-y-4">
                <h2 className="font-serif text-[34px] leading-[1.05] text-[#111f16]">Why it exists</h2>
                <p className="leading-8 text-[#1f3126]/90">
                  Many digital products are built around urgency and output. Atriae was created for steadier thinking,
                  emotionally intelligent design, and everyday clarity.
                </p>
              </article>

              <article className="space-y-4">
                <h2 className="font-serif text-[34px] leading-[1.05] text-[#111f16]">What it is not</h2>
                <p className="leading-8 text-[#1f3126]/90">
                  It is not a speed system, a noisy feed, or a task race. It is a quieter structure that supports
                  depth, awareness, and deliberate choices.
                </p>
              </article>

              <article className="space-y-4">
                <h2 className="font-serif text-[34px] leading-[1.05] text-[#111f16]">Calm technology</h2>
                <p className="leading-8 text-[#1f3126]/90">
                  The product is shaped to reduce friction: clear pathways, intentional rhythm, and tools that keep
                  your attention in one place instead of scattering it.
                </p>
              </article>
            </div>

            <div className="pt-12">
              <Link href="/login" className="editorial-cta text-foreground">
                Enter Atriae
              </Link>
            </div>
          </LandingContainer>
        </SectionFrame>
      </main>
    </LandingShell>
  );
}
