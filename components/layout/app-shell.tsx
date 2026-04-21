"use client";

import type { ReactNode } from "react";

import { LandingNavSection } from "@/components/sections/landing-nav-section";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 px-4 py-4 backdrop-blur-2xl md:px-7 md:py-5">
        <LandingNavSection />
      </header>

      <main className="px-5 md:px-10">{children}</main>
    </div>
  );
}
