"use client";

import { usePathname } from "next/navigation";

import { PremiumNavbar, type PremiumNavbarItem } from "@/components/ui/premium-navbar";

const landingNavigation: PremiumNavbarItem[] = [
  { label: "Dashboard", href: "/dashboard", kind: "route" },
  { label: "Learn", href: "/learn", kind: "route" },
  { label: "Rituals", href: "/rituals", kind: "route" },
  { label: "Settings", href: "/settings", kind: "route" }
];

export function LandingNavSection() {
  const pathname = usePathname();

  return (
    <section aria-label="Site navigation" className="mx-auto w-full max-w-6xl">
      <PremiumNavbar items={landingNavigation} activeHref={pathname ?? "/dashboard"} />
    </section>
  );
}
