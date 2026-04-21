export function PublicLandingGlimpse() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-[0.66rem] uppercase tracking-[0.27em] text-muted-foreground">Product glimpse</p>
        <h2 className="text-3xl md:text-[2.35rem]">A quiet interface for sharper thinking.</h2>
      </div>

      <div className="relative overflow-hidden rounded-[2rem] border border-white/50 bg-[linear-gradient(145deg,rgba(255,251,246,0.75),rgba(233,240,230,0.52))] p-5 shadow-[0_35px_70px_-45px_rgba(44,56,44,0.55)] md:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/55 to-transparent" />
        <div className="relative grid gap-4 blur-[1px] md:grid-cols-[1.15fr_0.85fr] md:gap-5">
          <div className="liquid-glass-card rounded-[1.4rem] border p-5 md:p-6">
            <p className="text-[0.62rem] uppercase tracking-[0.24em] text-muted-foreground">Intent</p>
            <p className="mt-3 text-base text-foreground/95 md:text-lg">
              I feel scattered between study goals and life decisions. I need a cleaner path for this week.
            </p>
          </div>
          <div className="liquid-glass-card rounded-[1.4rem] border p-5 md:p-6">
            <p className="text-[0.62rem] uppercase tracking-[0.24em] text-muted-foreground">Direction</p>
            <ul className="mt-3 space-y-2 text-sm text-foreground/90 md:text-[0.95rem]">
              <li>Distill one active learning priority.</li>
              <li>Clarify the decision in one sentence.</li>
              <li>Take one calm action before noon.</li>
            </ul>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 rounded-[2rem] border border-white/40" />
      </div>
    </section>
  );
}
