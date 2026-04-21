"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { LandingNavSection } from "@/components/sections/landing-nav-section";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showAuthenticatedNav = pathname.startsWith("/app");

  return (
    <div className="min-h-dvh">
      {showAuthenticatedNav ? (
        <header className="sticky top-0 z-30 px-4 py-4 backdrop-blur-2xl md:px-7 md:py-5">
          <LandingNavSection />
        </header>
      ) : null}

      <main className="px-5 md:px-10">{children}</main>
    </div>
  );
}
