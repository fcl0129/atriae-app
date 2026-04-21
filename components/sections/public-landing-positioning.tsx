const positioningBlocks = [
  {
    title: "Clarity, not noise",
    text: "Turn scattered thoughts into structured direction."
  },
  {
    title: "Learn with intention",
    text: "Understand ideas more deeply, not just faster."
  },
  {
    title: "Move with calm precision",
    text: "Turn reflection into clear next steps."
  }
];

export function PublicLandingPositioning() {
  return (
    <section id="how-it-feels" className="space-y-8 md:space-y-10">
      <div className="space-y-2">
        <p className="text-[0.66rem] uppercase tracking-[0.27em] text-muted-foreground">How it feels</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3 md:gap-10">
        {positioningBlocks.map((block) => (
          <article key={block.title} className="space-y-3">
            <h2 className="text-2xl leading-[1.02] md:text-[2rem]">{block.title}</h2>
            <p className="text-sm text-muted-foreground md:text-base">{block.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
