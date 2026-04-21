import Link from "next/link";

import { Button } from "@/components/ui/button";

export function PublicLandingHero() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] px-6 pb-14 pt-16 md:px-12 md:pb-20 md:pt-24">
      <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(120%_95%_at_18%_8%,rgba(237,170,178,0.34),transparent_62%),radial-gradient(90%_85%_at_78%_20%,rgba(252,236,216,0.42),transparent_66%),radial-gradient(120%_95%_at_52%_112%,rgba(173,196,166,0.28),transparent_65%)]" />
      <div className="relative mx-auto max-w-4xl space-y-7 text-center md:space-y-8">
        <p className="text-[0.66rem] uppercase tracking-[0.27em] text-muted-foreground">Atriae system</p>
        <h1 className="text-[clamp(2.15rem,6.5vw,4.5rem)] leading-[0.93]">
          Think clearly. Choose well. Move with intention.
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-muted-foreground md:text-lg">
          A personal intelligence space for turning messy thoughts into calm direction.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button asChild className="px-7 text-[0.72rem] uppercase tracking-[0.18em]">
            <Link href="/dashboard">Enter Atriae</Link>
          </Button>
          <Button asChild variant="quiet" className="px-7 text-[0.72rem] uppercase tracking-[0.18em]">
            <Link href="/login">Request access</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
