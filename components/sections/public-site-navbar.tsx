import Link from "next/link";

import { Container } from "@/components/landing/container";
import { CtaButton } from "@/components/landing/cta-button";

export function PublicSiteNavbar() {
  return (
    <header className="sticky top-4 z-50">
      <Container>
        <nav className="mx-auto flex max-w-5xl items-center justify-between rounded-full border border-white/30 bg-white/20 px-4 py-3 backdrop-blur-md md:px-6">
          <Link href="/" className="font-serif text-2xl tracking-[0.04em] text-[#0f1d14]">
            Atriae
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="/about" className="text-sm tracking-[0.03em] text-[#1b2d22] transition hover:-translate-y-[1px] hover:text-[#122118]">
              About
            </Link>
            <Link href="/faq" className="text-sm tracking-[0.03em] text-[#1b2d22] transition hover:-translate-y-[1px] hover:text-[#122118]">
              FAQ
            </Link>
            <Link href="/login" className="text-sm tracking-[0.03em] text-[#1b2d22] transition hover:-translate-y-[1px] hover:text-[#122118]">
              Sign in
            </Link>
          </div>

          <CtaButton className="h-11 px-5 text-sm">Request access</CtaButton>
        </nav>
      </Container>
    </header>
  );
}
