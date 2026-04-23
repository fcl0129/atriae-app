"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

const marketingLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Rituals", href: "/rituals" },
  { label: "Learn", href: "/learn" },
  { label: "Login", href: "/login" }
] as const;

export function MarketingNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section aria-label="Marketing navigation" className="mx-auto w-full max-w-6xl">
      <nav className="flex items-center justify-between gap-4 py-2">
        <Link
          href="/"
          className="font-serif text-[1.45rem] leading-none tracking-tight text-foreground/90 transition-opacity duration-300 hover:opacity-70"
        >
          Atriaé
        </Link>

        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="marketing-mobile-nav"
          aria-label="Toggle marketing menu"
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 text-muted-foreground transition hover:border-foreground/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <div className="hidden items-center gap-7 md:flex">
          <ul className="flex items-center gap-6 text-[0.66rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {marketingLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors duration-300 hover:text-foreground/90">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link href="/login" className="editorial-cta text-[0.66rem] uppercase tracking-[0.2em] text-foreground">
            Enter Atriae
          </Link>
        </div>
      </nav>

      <nav
        id="marketing-mobile-nav"
        aria-label="Mobile marketing"
        className={cn(
          "grid overflow-hidden transition-all duration-300 ease-out md:hidden",
          menuOpen ? "grid-rows-[1fr] pt-3 opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="min-h-0 rounded-2xl border border-foreground/10 bg-background/60 p-3 backdrop-blur-sm">
          <ul className="space-y-1 text-[0.66rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {marketingLinks.map((link) => (
              <li key={`mobile-${link.href}`}>
                <Link
                  href={link.href}
                  className="block rounded-xl px-3 py-2.5 transition-colors duration-300 hover:bg-foreground/5 hover:text-foreground"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="editorial-cta mt-3 inline-flex text-[0.66rem] uppercase tracking-[0.2em] text-foreground"
          >
            Enter Atriae
          </Link>
        </div>
      </nav>
    </section>
  );
}
