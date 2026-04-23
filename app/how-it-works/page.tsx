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
            <div className="max-w-4xl space-y-7">
              <p className="text-xs uppercase tracking-[0.22em] text-[#5D735D]">How it works</p>
              <h1 className="text-4xl leading-[1.02] tracking-[-0.02em] text-[#101d14] md:text-6xl">
                A simple system for clearer days.
              </h1>
              <p className="max-w-[62ch] text-[18px] leading-[1.7] text-[#213429]/90">
                Atriae combines reflection, structure, and continuity so you can think with less friction and act with
                more intention.
              </p>
            </div>
          </LandingContainer>
        </SectionFrame>

        <SectionFrame className="border-y border-[#D9D0C5]/80 py-14 md:py-20">
          <LandingContainer className="max-w-6xl">
            <div className="space-y-4">
              {steps.map((step, index) => (
                <article
                  key={step.title}
                  className="rounded-2xl border border-[#D9D0C5]/70 bg-[#FBF7F1]/68 px-6 py-6 md:grid md:grid-cols-[120px_1fr] md:items-start md:gap-6"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-[#5D735D]">Step {String(index + 1).padStart(2, "0")}</p>
                  <div className="pt-3 md:pt-0">
                    <h2 className="font-serif text-[30px] leading-[1.06] text-[#111f16]">{step.title}</h2>
                    <p className="pt-3 max-w-[62ch] leading-8 text-[#1f3126]/90">{step.body}</p>
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
