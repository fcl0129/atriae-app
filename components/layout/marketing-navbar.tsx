"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

const marketingLinks = [
  { label: "Home", href: "/" },
  { label: "How it feels", href: "/how-it-works" },
  { label: "About", href: "/about" }
] as const;

export function MarketingNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section aria-label="Marketing navigation" className="mx-auto w-full max-w-6xl">
      <nav className="glass-nav rounded-[var(--radius-nav)] px-4 py-2.5 md:px-5 md:py-3">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="font-serif text-[1.38rem] leading-none tracking-tight text-foreground/90 transition-opacity duration-300 hover:opacity-75">
            Atriaé
          </Link>

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="marketing-mobile-nav"
            aria-label="Toggle marketing menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-foreground/15 text-muted-foreground transition hover:border-foreground/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>

          <div className="hidden items-center gap-7 md:flex">
            <ul className="flex items-center gap-6 text-[0.66rem] font-medium uppercase tracking-[0.19em] text-muted-foreground">
              {marketingLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="nav-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <Link href="/login" className="editorial-cta text-[0.66rem] uppercase tracking-[0.19em] text-foreground">
              Enter Atriae
            </Link>
          </div>
        </div>

        <nav
          id="marketing-mobile-nav"
          aria-label="Mobile marketing"
          className={cn(
            "grid overflow-hidden transition-all duration-300 ease-out md:hidden",
            menuOpen ? "grid-rows-[1fr] pt-2.5 opacity-100" : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="surface-paper min-h-0 rounded-xl p-2.5 shadow-none">
            <ul className="space-y-0.5 text-[0.66rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {marketingLinks.map((link) => (
                <li key={`mobile-${link.href}`}>
                  <Link
                    href={link.href}
                    className="block rounded-lg px-3 py-2.5 transition-colors duration-300 hover:bg-foreground/4 hover:text-foreground"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <Link href="/login" onClick={() => setMenuOpen(false)} className="editorial-cta mt-2.5 inline-flex text-[0.66rem] uppercase tracking-[0.18em] text-foreground">
              Enter Atriae
            </Link>
          </div>
        </nav>
      </nav>
    </section>
  );
}
