import Link from "next/link";

import { LandingContainer } from "@/components/landing/landing-shell";

export function Footer() {
  return (
    <footer id="philosophy" className="py-12">
      <LandingContainer>
        <div className="flex flex-col gap-8 border-t border-border/60 pt-10 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="font-serif text-[28px] leading-none text-foreground">Atriae</p>
            <p className="text-[16px] text-foreground/75">A system for thinking clearly.</p>
          </div>
          <div className="space-y-4 text-sm text-foreground/72">
            <div className="flex flex-wrap gap-5">
              <a href="#about" className="transition-colors hover:text-foreground">
                About
              </a>
              <Link href="/login" className="transition-colors hover:text-foreground">
                Request access
              </Link>
              <Link href="mailto:hello@atriae.com" className="transition-colors hover:text-foreground">
                Contact
              </Link>
            </div>
            <p>© {new Date().getFullYear()} Atriae. All rights reserved.</p>
          </div>
        </div>
      </LandingContainer>
    </footer>
  );
}
