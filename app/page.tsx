import Link from "next/link";

const signatureItems = [
  {
    title: "Learning journeys",
    description:
      "Shape thoughtful study arcs, keep ideas connected, and give your attention a narrative instead of a checklist."
  },
  {
    title: "Ritual layers",
    description:
      "Build morning and evening rhythms that regulate energy with softness, clarity, and emotional steadiness."
  },
  {
    title: "Intentional planning",
    description:
      "Organize your week with humane structure that preserves room for depth, reflection, and creative drift."
  }
];

const perspectiveColumns = [
  "Atriaé is designed as a private publication of your life in motion — where ideas, routines, and priorities coexist without the pressure of productivity theater.",
  "Each moment is held by typography, pacing, and quiet hierarchy. The experience invites attention rather than demanding it, creating space to think before you act.",
  "From your first note to your most established rituals, the interface remains calm, editorial, and intentionally free of dashboard language."
];

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-24 pb-20 pt-10 md:space-y-32 md:pt-16">
      <section className="space-y-12">
        <p className="text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground">Personal OS</p>

        <h1 className="max-w-5xl text-[2.6rem] leading-[0.9] md:text-[5.6rem]">
          <span className="block">A calm editorial home</span>
          <span className="block">for learning, rituals,</span>
          <span className="block">and life organization</span>
        </h1>

        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <p className="max-w-2xl text-base leading-8 text-muted-foreground md:col-span-8 md:text-lg">
            Atriaé gives your inner and practical life the same elegant space: serene typography, deliberate rhythm,
            and quiet structure designed for daily clarity.
          </p>
          <div className="md:col-span-4 md:justify-self-end">
            <Link
              href="/dashboard"
              className="inline-flex items-center border-b border-foreground pb-1 text-sm uppercase tracking-[0.18em] text-foreground transition-opacity hover:opacity-70"
            >
              Begin your day
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-10">
        <p className="text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground">Signature</p>
        <div className="grid gap-10 md:grid-cols-3 md:gap-12">
          {signatureItems.map((item) => (
            <article key={item.title} className="space-y-4">
              <h2 className="text-[1.8rem] leading-tight md:text-[2.1rem]">{item.title}</h2>
              <p className="text-sm leading-7 text-muted-foreground md:text-base md:leading-8">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-10" id="about">
        <p className="text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground">Perspective</p>
        <h2 className="max-w-4xl text-[2.1rem] leading-[0.95] md:text-[4rem]">A living index of your inner life</h2>
        <div className="grid gap-8 md:grid-cols-3 md:gap-10">
          {perspectiveColumns.map((column) => (
            <p className="text-sm leading-7 text-muted-foreground md:text-base md:leading-8" key={column}>
              {column}
            </p>
          ))}
        </div>
      </section>

      <section className="space-y-10">
        <p className="text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground">Experience</p>
        <div className="grid gap-8 md:grid-cols-12 md:gap-12">
          <h2 className="md:col-span-7 text-[2rem] leading-[0.95] md:text-[3.8rem]">Designed like a quiet publication, read one intentional moment at a time.</h2>
          <div className="space-y-6 md:col-span-5">
            <p className="text-sm leading-7 text-muted-foreground md:text-base md:leading-8">
              No boxed modules. No dashboard density. Just open composition, confident hierarchy, and generous breathing room.
            </p>
            <p className="text-sm leading-7 text-muted-foreground md:text-base md:leading-8">
              Every interaction supports a calmer pace: learning that compounds, rituals that root you, and planning that feels humane.
            </p>
            <Link
              href="/learn"
              className="inline-flex items-center border-b border-muted-foreground pb-1 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
            >
              Explore learning rituals
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-foreground/10 pt-10">
        <div className="flex flex-col gap-5 text-sm text-muted-foreground md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-serif text-2xl text-foreground">Atriaé</p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em]">Editorial personal practice</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-[0.18em]">
            <Link href="/learn" className="transition-colors hover:text-foreground">
              Learn
            </Link>
            <Link href="/rituals" className="transition-colors hover:text-foreground">
              Rituals
            </Link>
            <Link href="#about" className="transition-colors hover:text-foreground">
              About
            </Link>
            <Link href="/login" className="transition-colors hover:text-foreground">
              Sign in
            </Link>
          </div>
        </div>
        <p className="mt-8 text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground/80">© 2026 Atriaé. All rights reserved.</p>
      </footer>
    </div>
  );
}
