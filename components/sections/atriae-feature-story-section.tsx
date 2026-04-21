"use client";

import { StackingCard, StackingCards } from "@/components/ui/stacking-cards";

const storyCards = [
  {
    title: "Create the event",
    description: "Start with a clear brief, timeline, and mood so every decision follows one narrative.",
    emphasis: "Single source of truth"
  },
  {
    title: "Design the invitation",
    description: "Shape every invite with Atriae's calm editorial layouts, from save-the-date to final details.",
    emphasis: "Brand-led presentation"
  },
  {
    title: "Add the guests",
    description: "Curate the list, track confirmations, and keep host notes in one private, shareable workspace.",
    emphasis: "Confident guest operations"
  },
  {
    title: "Manage the experience",
    description: "Coordinate vendors, seating, and run-of-show from a focused plan built for live teams.",
    emphasis: "Operational clarity"
  },
  {
    title: "Follow the evening in real time",
    description: "Monitor arrivals, moments, and adjustments as the event unfolds — without losing composure.",
    emphasis: "Live service intelligence"
  }
] as const;

export function AtriaeFeatureStorySection() {
  return (
    <section className="space-y-8 md:space-y-10" id="story">
      <div className="grid gap-6 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <p className="text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground">Feature story</p>
          <h2 className="mt-4 max-w-[14ch] text-[2.05rem] leading-[0.95] md:text-[3.2rem]">
            One evening, designed with editorial precision.
          </h2>
        </div>
        <p className="text-sm leading-7 text-muted-foreground md:col-span-7 md:justify-self-end md:text-base md:leading-8">
          Atriae guides the full event arc — from first concept to live execution — with restrained motion and clear
          hierarchy built for modern hospitality teams.
        </p>
      </div>

      <StackingCards
        items={storyCards}
        className="pt-2"
        desktopMinSectionHeight="390vh"
        stickyTopClassName="md:top-28"
        renderCard={(card, meta) => (
          <StackingCard
            eyebrow="Atriae story"
            title={card.title}
            description={card.description}
            emphasis={card.emphasis}
            stepLabel={`0${meta.index + 1}`}
            progress={meta.progress}
            className={meta.isActive ? "ring-1 ring-foreground/8" : ""}
          />
        )}
      />
    </section>
  );
}
