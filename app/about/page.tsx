import Link from "next/link";

import { LandingContainer, LandingShell, SectionFrame } from "@/components/landing/landing-shell";

export default function AboutPage() {
  return (
    <LandingShell>
      <main>
        <SectionFrame className="pt-14 md:pt-20">
          <LandingContainer className="max-w-6xl">
            <div className="max-w-4xl space-y-6">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">About Atriae</p>
              <h1 className="text-4xl leading-[1.02] tracking-[-0.02em] text-foreground md:text-6xl">
                A calm operating layer for inner clarity.
              </h1>
              <p className="max-w-[60ch] text-[18px] leading-[1.7] text-foreground/85">
                Atriae exists for people who want a more thoughtful relationship with their attention, routines, and
                internal life. It is designed so clarity can stay close.
              </p>
            </div>
          </LandingContainer>
        </SectionFrame>

        <SectionFrame className="pt-6 md:pt-8">
          <LandingContainer className="max-w-6xl">
            <div className="grid gap-5 md:grid-cols-2">
              <article className="surface-paper space-y-3 p-6 md:p-7">
                <h2 className="font-serif text-[32px] leading-[1.06] text-foreground">What Atriae is</h2>
                <p className="leading-8 text-foreground/85">
                  A system for reflection, rituals, learning, and focus. Atriae helps you organize thought with
                  intentional structure, then revisit what matters with consistency.
                </p>
              </article>

              <article className="surface-paper space-y-3 p-6 md:p-7">
                <h2 className="font-serif text-[32px] leading-[1.06] text-foreground">Why it exists</h2>
                <p className="leading-8 text-foreground/85">
                  Many digital products are built around urgency and output. Atriae was created for steadier thinking,
                  emotionally intelligent design, and everyday clarity.
                </p>
              </article>

              <article className="surface-paper space-y-3 p-6 md:p-7">
                <h2 className="font-serif text-[32px] leading-[1.06] text-foreground">What it is not</h2>
                <p className="leading-8 text-foreground/85">
                  It is not a speed system, a noisy feed, or a task race. It is a quieter structure that supports
                  depth, awareness, and deliberate choices.
                </p>
              </article>

              <article className="surface-paper space-y-3 p-6 md:p-7">
                <h2 className="font-serif text-[32px] leading-[1.06] text-foreground">Calm technology</h2>
                <p className="leading-8 text-foreground/85">
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
