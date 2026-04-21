"use client";

import { useEffect, useState } from "react";

import { IntelligenceInput } from "@/components/ui/intelligence-input";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";

const rotatingPrompts = [
  "What do you want to understand today?",
  "Plan your day with intention",
  "Turn a thought into a system",
  "Refine something in your life"
];

const focusItems = [
  "Read one source that challenges your current assumption.",
  "Protect a 45-minute deep thinking block before noon.",
  "Close the day by turning one insight into tomorrow's first step."
];

const structuredPlan = [
  { label: "Morning", item: "Clarify your primary question." },
  { label: "Midday", item: "Draft a concise plan around that question." },
  { label: "Evening", item: "Review what changed and refine the system." }
];

const insightEntries = [
  {
    title: "How to think in systems when life feels fragmented",
    excerpt:
      "You make better decisions when each commitment has a clear role: exploration, execution, or recovery. Name the role before you say yes."
  },
  {
    title: "Learning note: depth over novelty",
    excerpt:
      "Compounding comes from revisiting core ideas with better questions. The goal isn't more inputs; it's sharper synthesis."
  },
  {
    title: "Optimization reflection",
    excerpt:
      "Design routines as support structures, not control mechanisms. If a routine increases friction, simplify it until it restores momentum."
  }
];

const subtleSuggestions = ["Continue what you started yesterday", "Refine your routine"];

export function AtriaeHomeExperienceSection() {
  const [promptIndex, setPromptIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPromptIndex((previous) => (previous + 1) % rotatingPrompts.length);
    }, 3600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-20 pb-24 pt-10 md:space-y-24 md:pt-16">
      <section className="space-y-7 md:space-y-9">
        <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">Atriae home</p>
        <IntelligenceInput
          className="mx-auto max-w-4xl p-6 md:p-8"
          heading="What should we shape together right now?"
          placeholder={rotatingPrompts[promptIndex]}
          submitLabel="Begin"
        />
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">Daily layer</p>
          <h2 className="text-2xl leading-tight md:text-[2rem]">A light plan for today</h2>
        </div>

        <LiquidGlassCard className="space-y-6" tone="neutral">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Focus items</p>
            <ul className="space-y-2.5 text-sm leading-7 text-foreground/90 md:text-base">
              {focusItems.map((item) => (
                <li key={item} className="list-inside list-disc marker:text-foreground/40">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 border-t border-border/50 pt-5">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Structured cadence</p>
            <div className="space-y-2.5">
              {structuredPlan.map((step) => (
                <p key={step.label} className="text-sm leading-7 text-muted-foreground md:text-base">
                  <span className="mr-2 font-medium text-foreground">{step.label}:</span>
                  {step.item}
                </p>
              ))}
            </div>
          </div>
        </LiquidGlassCard>
      </section>

      <section className="space-y-7">
        <div className="space-y-2">
          <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">Learning and insight</p>
          <h2 className="text-2xl leading-tight md:text-[2rem]">Recent outputs</h2>
        </div>
        <div className="space-y-9 border-l border-border/60 pl-5 md:pl-7">
          {insightEntries.map((entry) => (
            <article key={entry.title} className="space-y-2">
              <h3 className="text-xl leading-snug md:text-2xl">{entry.title}</h3>
              <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base md:leading-8">{entry.excerpt}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-3 pb-4">
        <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">Suggestions</p>
        <div className="flex flex-wrap gap-2.5">
          {subtleSuggestions.map((suggestion) => (
            <p
              key={suggestion}
              className="rounded-full border border-border/70 bg-background/70 px-4 py-2 text-xs tracking-[0.12em] text-muted-foreground"
            >
              {suggestion}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}
