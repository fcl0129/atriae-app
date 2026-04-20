"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, LayoutDashboard, MoonStar, Settings, Sparkles } from "lucide-react";
import type { ComponentType, ReactNode } from "react";

import { cn } from "@/lib/utils";

type NavigationItem = {
  href: Route;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

const navigation: NavigationItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/rituals", label: "Rituals", icon: MoonStar },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col md:px-4">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-ivory-100/90 px-4 py-3 backdrop-blur-lg md:rounded-b-[1.2rem] md:px-6">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-matcha-300/60 bg-matcha-100 text-matcha-700">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <p className="font-serif text-xl">Atriaé</p>
              <p className="text-xs text-muted-foreground">calm editorial operating system</p>
            </div>
          </Link>
          <Link
            href="/login"
            className={cn(
              "rounded-full border border-border/80 bg-paper px-4 py-2 text-sm transition",
              pathname === "/login" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Sign in
          </Link>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-5xl flex-1">
        <nav className="sticky top-[74px] hidden h-[calc(100dvh-90px)] w-56 shrink-0 pr-5 pt-6 md:block">
          <ul className="surface-paper space-y-1.5 p-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                      active
                        ? "bg-matcha-100 text-matcha-700"
                        : "text-muted-foreground hover:bg-ivory-100 hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <main className="min-w-0 flex-1 page-padding">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-6xl border-t border-border/80 bg-ivory-100/95 px-3 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-lg md:hidden">
        <ul className="mx-auto grid max-w-5xl grid-cols-5 gap-1 rounded-2xl border border-border/80 bg-paper/95 p-1.5 shadow-soft">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl px-1.5 py-2 text-[11px] transition",
                    active ? "bg-matcha-100 text-matcha-700" : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
