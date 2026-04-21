import Link from "next/link";

import { AtriaeHomeExperienceSection } from "@/components/sections/atriae-home-experience-section";
import { Button } from "@/components/ui/button";

const statementBlocks = [
  "Atriae helps you think, not just store",
  "Turn thoughts into decisions",
  "Turn noise into direction",
  "Build a personal intelligence rhythm"
];

const workflowSteps = [
  "Capture a thought",
  "Shape it with AI",
  "Move forward with clarity"
];

export default function PublicLandingPage() {
  return (
    <div className="pb-16 pt-4 md:pb-24 md:pt-6">
      <header className="mx-auto w-full max-w-6xl">
        <div className="surface-glass rounded-[var(--radius-nav)] px-4 py-3 md:px-5 md:py-3.5">
          <div className="flex items-center justify-between gap-5">
            <Link
              href="/"
              className="font-serif text-[1.5rem] leading-none tracking-tight text-foreground transition-opacity duration-300 hover:opacity-80"
            >
              Atriae
            </Link>

            <nav aria-label="Public navigation" className="flex items-center gap-2 md:gap-3">
              <Button asChild size="sm" variant="quiet" className="h-9 px-4 text-[0.68rem] uppercase tracking-[0.18em]">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm" className="h-9 px-4 text-[0.68rem] uppercase tracking-[0.18em]">
                <Link href="/login">Request access</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto mt-8 flex w-full max-w-6xl flex-col gap-20 px-1 md:mt-12 md:gap-28">
        <section className="relative overflow-hidden rounded-[2rem] px-6 pb-14 pt-16 md:px-12 md:pb-20 md:pt-24">
          <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(120%_95%_at_18%_8%,rgba(237,170,178,0.34),transparent_62%),radial-gradient(90%_85%_at_78%_20%,rgba(252,236,216,0.42),transparent_66%),radial-gradient(120%_95%_at_52%_112%,rgba(173,196,166,0.28),transparent_65%)]" />
          <div className="relative mx-auto max-w-4xl space-y-7 text-center md:space-y-8">
            <h1 className="text-[clamp(2.15rem,6.5vw,4.5rem)] leading-[0.93]">Think clearly. Choose well. Move with intention.</h1>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground md:text-lg">
              A personal intelligence system for learning, thinking, and living better.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button asChild className="px-7 text-[0.72rem] uppercase tracking-[0.18em]">
                <Link href="/login">Request access</Link>
              </Button>
              <Button asChild variant="quiet" className="px-7 text-[0.72rem] uppercase tracking-[0.18em]">
                <a href="#explore-system">Explore system</a>
              </Button>
            </div>
          </div>
        </section>

        <section className="space-y-8 md:space-y-10" id="explore-system">
          <p className="text-[0.66rem] uppercase tracking-[0.27em] text-muted-foreground">What Atriae is</p>
          <div className="grid gap-8 md:grid-cols-2 md:gap-10">
            {statementBlocks.map((statement) => (
              <article key={statement} className="space-y-3">
                <h2 className="text-2xl leading-[1.02] md:text-[2rem]">{statement}</h2>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="space-y-2">
            <p className="text-[0.66rem] uppercase tracking-[0.27em] text-muted-foreground">Product glimpse</p>
            <h2 className="text-3xl md:text-[2.35rem]">A quiet peek into the system.</h2>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/50 bg-[linear-gradient(145deg,rgba(255,251,246,0.75),rgba(233,240,230,0.52))] p-2 shadow-[0_35px_70px_-45px_rgba(44,56,44,0.55)] md:p-4">
            <div className="pointer-events-none absolute inset-0 z-20 rounded-[2rem] bg-[radial-gradient(circle_at_top,transparent_40%,rgba(248,245,240,0.85)_100%)]" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-28 bg-gradient-to-t from-[#f7f3ec]/95 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-gradient-to-r from-[#f7f3ec]/95 to-transparent md:w-24" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-gradient-to-l from-[#f7f3ec]/95 to-transparent md:w-24" />
            <div className="origin-top scale-[0.9] opacity-75 blur-[1.8px] md:scale-[0.86]">
              <AtriaeHomeExperienceSection />
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <p className="text-[0.66rem] uppercase tracking-[0.27em] text-muted-foreground">How it works</p>
          <ol className="grid gap-8 md:grid-cols-3 md:gap-10">
            {workflowSteps.map((step, index) => (
              <li key={step} className="space-y-3">
                <p className="text-[0.62rem] uppercase tracking-[0.24em] text-muted-foreground">Step {index + 1}</p>
                <p className="text-2xl leading-[1.02] md:text-[2rem]">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mx-auto max-w-3xl space-y-6 pb-6 text-center md:space-y-7">
          <h2 className="text-[clamp(2rem,4.6vw,3.3rem)] leading-[0.95]">Request access</h2>
          <p className="mx-auto max-w-xl text-sm text-muted-foreground md:text-base">
            Built for people who want to think better, not faster.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild className="px-7 text-[0.72rem] uppercase tracking-[0.18em]">
              <Link href="/login">Request access</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="mx-auto mt-16 flex w-full max-w-6xl items-center justify-between border-t border-foreground/10 pt-6 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        <p>Atriae</p>
        <nav className="flex items-center gap-4">
          <Link href="/login" className="transition-colors hover:text-foreground">
            Sign in
          </Link>
          <a href="#explore-system" className="transition-colors hover:text-foreground">
            System
          </a>
        </nav>
      </footer>
    </div>
  );
}
