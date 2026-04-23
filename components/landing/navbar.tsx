import Link from "next/link";

import { LandingContainer } from "@/components/landing/landing-shell";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#system", label: "The System" },
  { href: "#philosophy", label: "Philosophy" }
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50">
      <LandingContainer className="pt-2 md:pt-3">
        <nav className="glass-nav flex h-16 items-center justify-between rounded-[14px] px-4 md:h-[72px] md:px-6 xl:h-20">
          <Link href="/" className="font-serif text-[1.7rem] leading-none tracking-[0.02em] text-foreground">
            Atriae
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-sm tracking-[0.08em] text-muted-foreground transition-colors duration-300 hover:text-foreground">
                {link.label}
              </a>
            ))}
            <Link
              href="/login"
              className="inline-flex h-[48px] items-center justify-center rounded-full border border-foreground/80 bg-foreground px-7 text-[14px] font-medium text-background transition-transform duration-300 hover:-translate-y-0.5"
            >
              Request access
            </Link>
          </div>

          <Link
            href="/login"
            className="inline-flex h-10 items-center justify-center rounded-full border border-foreground/80 bg-foreground px-5 text-xs font-medium tracking-[0.08em] text-background md:hidden"
          >
            Access
          </Link>
        </nav>
      </LandingContainer>
    </header>
  );
}
