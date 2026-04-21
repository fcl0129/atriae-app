import { TextRevealCard } from "@/components/ui/text-reveal-card";

const statements = [
  {
    baseText: "You host the people",
    revealText: "Atriae handles the details"
  },
  {
    baseText: "You plan the evening",
    revealText: "Atriae shapes the experience"
  }
] as const;

export function AtriaeStatementRevealSection() {
  return (
    <section className="space-y-8 md:space-y-10">
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <p className="text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground">Atriae statement</p>
        <h2 className="text-[2rem] leading-[0.95] md:text-[3.5rem]">A confident partner behind every hosted moment.</h2>
      </div>

      <div className="space-y-4 md:space-y-5">
        {statements.map((statement) => (
          <TextRevealCard
            key={statement.baseText}
            baseText={statement.baseText}
            revealText={statement.revealText}
            hint="Move softly to reveal the next line"
          />
        ))}
      </div>
    </section>
  );
}
