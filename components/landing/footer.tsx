import Link from "next/link";

import { LandingContainer } from "@/components/landing/landing-shell";

export function Footer() {
  return (
    <footer id="philosophy" className="border-t border-[#D9D0C5]/80 py-12">
      <LandingContainer>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="font-serif text-[28px] leading-none">Atriae</p>
            <p className="text-[16px] text-[#425149]">A system for thinking clearly.</p>
          </div>
          <div className="space-y-4 text-sm text-[#425149]">
            <div className="flex flex-wrap gap-5">
              <a href="#about" className="transition-colors hover:text-[#1F2A24]">
                About
              </a>
              <Link href="/login" className="transition-colors hover:text-[#1F2A24]">
                Request access
              </Link>
              <Link href="mailto:hello@atriae.com" className="transition-colors hover:text-[#1F2A24]">
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
