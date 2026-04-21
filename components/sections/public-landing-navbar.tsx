import Link from "next/link";

import { Button } from "@/components/ui/button";

export function PublicLandingNavbar() {
  return (
    <section className="mx-auto w-full max-w-6xl">
      <div className="surface-glass rounded-[var(--radius-nav)] px-4 py-3 md:px-5 md:py-3.5">
        <div className="flex items-center justify-between gap-5">
          <Link
            href="/landing"
            className="font-serif text-[1.5rem] leading-none tracking-tight text-foreground transition-opacity duration-300 hover:opacity-80"
          >
            Atriae
          </Link>

          <nav aria-label="Public navigation" className="hidden items-center gap-7 md:flex">
            <a href="#philosophy" className="nav-link text-[0.7rem] uppercase tracking-[0.2em]">
              Philosophy
            </a>
            <a href="#how-it-feels" className="nav-link text-[0.7rem] uppercase tracking-[0.2em]">
              How it feels
            </a>
            <Link href="/dashboard" className="nav-link text-[0.7rem] uppercase tracking-[0.2em]">
              Enter
            </Link>
            <Button asChild size="sm" className="h-9 px-4 text-[0.68rem] uppercase tracking-[0.18em]">
              <Link href="/login">Request access</Link>
            </Button>
          </nav>

          <Button asChild size="sm" className="h-9 px-4 text-[0.68rem] uppercase tracking-[0.18em] md:hidden">
            <Link href="/login">Request access</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
