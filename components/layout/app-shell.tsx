"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { MarketingNavbar } from "@/components/layout/marketing-navbar";
import { LandingNavSection } from "@/components/sections/landing-nav-section";
import { cn } from "@/lib/utils";

const APP_ROUTE_PREFIXES = ["/dashboard", "/learn", "/rituals", "/settings"];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAppRoute = APP_ROUTE_PREFIXES.some((route) => pathname?.startsWith(route));

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 px-4 py-3 md:px-7 md:py-4">
        {isAppRoute ? <LandingNavSection /> : <MarketingNavbar />}
      </header>

      <main className={cn(isAppRoute ? "px-5 md:px-10" : "")}>{children}</main>
    </div>
  );
}
