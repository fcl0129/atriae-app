import Link from "next/link";

import { LandingContainer, LandingShell, SectionFrame } from "@/components/landing/landing-shell";

const steps = [
  {
    title: "Organize thoughts",
    body: "Capture ideas and open loops in one place, then shape them into clear threads you can return to."
  },
  {
    title: "Build rituals",
    body: "Define repeatable daily and weekly practices that support your mindset, priorities, and energy."
  },
  {
    title: "Support learning",
    body: "Collect what you are studying, connect insights over time, and keep useful knowledge easy to revisit."
  },
  {
    title: "Return to focus",
    body: "Use the system to reduce internal noise and bring attention back to what deserves it now."
  },
  {
    title: "Stay consistent",
    body: "Atriae works best as an ongoing rhythm: brief check-ins, thoughtful review, and steady refinement."
  }
];

export default function HowItWorksPage() {
  return (
    <LandingShell>
      <main>
        <SectionFrame className="pt-14 md:pt-20">
          <LandingContainer className="max-w-6xl">
            <div className="max-w-4xl space-y-6">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">How it works</p>
              <h1 className="text-4xl leading-[1.02] tracking-[-0.02em] text-foreground md:text-6xl">
                A simple system for clearer days.
              </h1>
              <p className="max-w-[62ch] text-[18px] leading-[1.7] text-foreground/85">
                Atriae combines reflection, structure, and continuity so you can think with less friction and act with
                more intention.
              </p>
            </div>
          </LandingContainer>
        </SectionFrame>

        <SectionFrame className="pt-6 md:pt-8">
          <LandingContainer className="max-w-6xl">
            <div className="divide-y divide-border/55">
              {steps.map((step, index) => (
                <article
                  key={step.title}
                  className="grid gap-4 py-7 md:grid-cols-[120px_1fr] md:items-start md:gap-7 md:py-8"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Step {String(index + 1).padStart(2, "0")}
                  </p>
                  <div className={index === 2 ? "surface-tinted rounded-[var(--radius)] p-5 md:p-6" : ""}>
                    <h2 className="font-serif text-[30px] leading-[1.08] text-foreground">{step.title}</h2>
                    <p className="pt-3 max-w-[62ch] leading-8 text-foreground/84">{step.body}</p>
                  </div>
                </article>
              ))}
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
