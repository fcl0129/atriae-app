import Link from "next/link";

import { Container } from "@/components/landing/container";
import { CtaButton } from "@/components/landing/cta-button";

export function PublicSiteNavbar() {
  return (
    <header className="sticky top-3 z-40">
      <Container>
        <nav className="flex items-center justify-between rounded-2xl border border-white/50 bg-[#fffdf8]/72 px-4 py-3.5 backdrop-blur-xl md:px-6">
          <Link href="/" className="font-serif text-[1.65rem] font-medium tracking-[0.02em] text-[#111f16]">
            Atriae
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="/about" className="text-sm font-medium text-[#1a2f23] hover:text-[#0f2218]">
              About
            </Link>
            <Link href="/faq" className="text-sm font-medium text-[#1a2f23] hover:text-[#0f2218]">
              FAQ
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-[#1a2f23] hover:text-[#0f2218]">
              Sign in
            </Link>
            <CtaButton className="h-10 px-4 text-xs md:text-sm">Request access</CtaButton>
          </div>
        </nav>
      </Container>
    </header>
  );
}
