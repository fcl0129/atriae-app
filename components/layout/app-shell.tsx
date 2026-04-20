"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, MoonStar, Settings, Sparkles, LayoutDashboard } from "lucide-react";

import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/rituals", label: "Rituals", icon: MoonStar },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-4xl flex-col">
      <header className="sticky top-0 z-20 border-b border-border/70 bg-ivory-50/90 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-3 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-matcha-100 text-matcha-700">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="font-serif text-lg">Atriaé</span>
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-border/80 bg-card px-4 py-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            Login
          </Link>
        </div>
      </header>

      <main className="flex-1 page-padding">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-4xl border-t border-border/70 bg-ivory-50/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-lg md:static md:border-0 md:bg-transparent md:px-6 md:pb-6 md:pt-2">
        <ul className="grid grid-cols-5 gap-1 rounded-2xl border border-border/70 bg-card/95 p-1 shadow-mist md:flex md:justify-between">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium transition md:flex-row md:justify-center md:text-sm",
                    active
                      ? "bg-matcha-100 text-matcha-700"
                      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
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
