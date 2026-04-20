"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type NavigationItem =
  | { label: string; href: Route; kind: "route" }
  | { label: string; href: string; kind: "hash" };

const navigation: NavigationItem[] = [
  { href: "/learn", label: "Learn", kind: "route" },
  { href: "/rituals", label: "Rituals", kind: "route" },
  { href: "/#about", label: "About", kind: "hash" },
  { href: "/login", label: "Sign in", kind: "route" }
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh">
      <header className="glass-nav sticky top-0 z-30 border-b px-5 py-4 backdrop-blur-2xl md:px-10">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
          <Link href="/" className="font-serif text-2xl leading-none tracking-tight transition-opacity duration-300 hover:opacity-80 md:text-[2rem]">
            Atriaé
          </Link>

          <nav aria-label="Primary">
            <ul className="flex items-center gap-5 text-[0.68rem] font-medium uppercase tracking-[0.26em] text-muted-foreground/90 md:gap-8">
              {navigation.map((item) => {
                const active = item.kind === "route" && pathname === item.href;
                return (
                  <li key={item.label}>
                    {item.kind === "route" ? (
                      <Link
                        href={item.href}
                        data-active={active}
                        className={cn("nav-link", active && "text-foreground")}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <a href={item.href} className="nav-link">
                        {item.label}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>

      <main className="px-5 md:px-10">{children}</main>
    </div>
  );
}
