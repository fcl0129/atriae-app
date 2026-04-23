import Link from "next/link";

export function LandingHeroSection() {
  return (
    <section className="mx-auto max-w-5xl space-y-8 py-24 text-center">
      <p className="text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground">A system for clarity</p>

      <h1 className="type-display text-5xl md:text-7xl">
        Think clearly.
        <br />
        Live intentionally.
      </h1>

      <p className="mx-auto max-w-xl text-muted-foreground">
        Atriaé is a calm system for organizing your thoughts, rituals, and attention — designed to create space, not
        noise.
      </p>

      <div className="flex justify-center gap-6 pt-4">
        <Link href="/login" className="editorial-cta text-foreground">
          Enter Atriae
        </Link>
        <a href="#how" className="editorial-cta text-foreground">
          See how it works
        </a>
      </div>
    </section>
  );
}
