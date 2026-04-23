"use client";

import { usePathname } from "next/navigation";

import { PremiumNavbar, type PremiumNavbarItem } from "@/components/ui/premium-navbar";

const appNavigation: PremiumNavbarItem[] = [
  { label: "Dashboard", href: "/dashboard", kind: "route" },
  { label: "Learn", href: "/learn", kind: "route" },
  { label: "Rituals", href: "/rituals", kind: "route" },
  { label: "Settings", href: "/settings", kind: "route" }
];

export function LandingNavSection() {
  const pathname = usePathname();

  return (
    <section aria-label="Application navigation" className="mx-auto w-full max-w-6xl">
      <PremiumNavbar items={appNavigation} activeHref={pathname ?? "/dashboard"} />
    </section>
  );
}
