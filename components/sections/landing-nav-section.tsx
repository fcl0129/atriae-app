"use client";

import { usePathname } from "next/navigation";

import { PremiumNavbar, type PremiumNavbarItem } from "@/components/ui/premium-navbar";

const landingNavigation: PremiumNavbarItem[] = [
  { label: "Home", href: "/", kind: "route" },
  { label: "Story", href: "/#story", kind: "hash" },
  { label: "Features", href: "/#features", kind: "hash" },
  { label: "Experience", href: "/#experience", kind: "hash" },
  { label: "For Hosts", href: "/dashboard", kind: "route" },
  { label: "Request access", href: "/login", kind: "route" }
];

export function LandingNavSection() {
  const pathname = usePathname();

  return (
    <section aria-label="Site navigation" className="mx-auto w-full max-w-6xl">
      <PremiumNavbar items={landingNavigation} activeHref={pathname === "/" ? "/" : pathname} />
    </section>
  );
}
