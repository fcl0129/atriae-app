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
        <nav className="flex h-16 items-center justify-between rounded-[14px] border border-[#D9D0C5]/75 bg-[#FBF7F1]/92 px-4 backdrop-blur md:h-[72px] md:px-6 xl:h-20">
          <Link href="/" className="font-serif text-[1.7rem] leading-none tracking-[0.02em] text-[#1F2A24]">
            Atriae
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm tracking-[0.08em] text-[#425149] transition-colors duration-300 hover:text-[#1F2A24]"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/login"
              className="inline-flex h-[52px] items-center justify-center rounded-full border border-[#5D735D] bg-[#5D735D] px-7 text-[15px] font-medium text-[#FBF7F1] transition-transform duration-300 hover:-translate-y-0.5"
            >
              Request access
            </Link>
          </div>

          <Link
            href="/login"
            className="inline-flex h-10 items-center justify-center rounded-full border border-[#5D735D] bg-[#5D735D] px-5 text-xs font-medium tracking-[0.08em] text-[#FBF7F1] md:hidden"
          >
            Access
          </Link>
        </nav>
      </LandingContainer>
    </header>
  );
}
