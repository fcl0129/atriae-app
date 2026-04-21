"use client";

import { StackingCard, StackingCards } from "@/components/ui/stacking-cards";

type StoryCard = {
  label: string;
  content: string;
};

const storyCards: StoryCard[] = [
  {
    label: "A thought",
    content: "I feel overwhelmed."
  },
  {
    label: "A question",
    content: "What actually matters today?"
  },
  {
    label: "A direction",
    content: "Focus on one thing. Start small."
  }
];

export function PublicLandingTransformation() {
  return (
    <section className="space-y-7 md:space-y-10">
      <p className="text-[0.66rem] uppercase tracking-[0.27em] text-muted-foreground">From noise to direction</p>
      <StackingCards
        items={storyCards}
        desktopMinSectionHeight="310vh"
        stickyTopClassName="md:top-28"
        cardGapClassName="-mt-44"
        renderCard={(card, meta) => (
          <StackingCard
            eyebrow={card.label}
            stepLabel={`0${meta.index + 1}`}
            title={card.content}
            description="A quiet progression from mental clutter to deliberate next steps."
            emphasis={meta.index === storyCards.length - 1 ? "Built for people who think a lot." : undefined}
            progress={meta.progress}
            className="bg-[linear-gradient(160deg,rgba(251,247,241,0.92),rgba(235,243,233,0.65))]"
          />
        )}
      />
    </section>
  );
}
