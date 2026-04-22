import Link from "next/link";

import { Container } from "@/components/landing/container";
import { CtaButton } from "@/components/landing/cta-button";

export function PublicSiteNavbar() {
  return (
    <header className="sticky top-0 z-50">
      <Container>
        <nav className="mx-auto mt-2 flex max-w-5xl items-center justify-between rounded-full border border-[#223529]/14 bg-[#fbf6ee]/66 px-4 py-3 backdrop-blur-xl md:mt-3 md:px-6">
          <Link href="/" className="font-serif text-[1.45rem] tracking-[0.05em] text-[#14251c]">
            Atriae
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="/about" className="text-sm tracking-[0.06em] text-[#22372b]/85 transition-opacity duration-300 hover:opacity-65">
              About
            </Link>
            <Link href="/faq" className="text-sm tracking-[0.06em] text-[#22372b]/85 transition-opacity duration-300 hover:opacity-65">
              FAQ
            </Link>
            <Link href="/login" className="text-sm tracking-[0.06em] text-[#22372b]/85 transition-opacity duration-300 hover:opacity-65">
              Sign in
            </Link>
          </div>

          <CtaButton className="h-10 border border-[#1a2d22] bg-[#172a20] px-5 text-[0.72rem] font-medium tracking-[0.11em] text-[#f8f8f2] hover:bg-[#102118]">
            Request access
          </CtaButton>
        </nav>
      </Container>
    </header>
  );
}
