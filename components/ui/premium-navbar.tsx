"use client";

import type { Route } from "next";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type PremiumNavbarItem =
  | {
      label: string;
      href: Route;
      kind: "route";
    }
  | {
      label: string;
      href: string;
      kind: "hash";
    };

type CursorStyle = {
  left: number;
  width: number;
  opacity: number;
};

type PremiumNavbarProps = {
  items: PremiumNavbarItem[];
  activeHref?: string;
  className?: string;
};

export function PremiumNavbar({ items, activeHref, className }: PremiumNavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cursorStyle, setCursorStyle] = useState<CursorStyle>({ left: 0, width: 0, opacity: 0 });
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  const defaultTarget = useMemo(() => activeHref ?? items[0]?.href ?? "", [activeHref, items]);

  const setCursorToHref = (href: string, visible = true) => {
    const node = itemRefs.current[href];
    if (!node) {
      setCursorStyle((current) => ({ ...current, opacity: 0 }));
      return;
    }

    setCursorStyle({
      left: node.offsetLeft,
      width: node.offsetWidth,
      opacity: visible ? 1 : 0
    });
  };

  useEffect(() => {
    setCursorToHref(defaultTarget, true);
  }, [defaultTarget]);

  useEffect(() => {
    const handleResize = () => setCursorToHref(defaultTarget, true);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [defaultTarget]);

  return (
    <div className={cn("w-full", className)}>
      <div className="glass-nav rounded-[var(--radius-nav)] px-3 py-2 md:px-4 md:py-2.5">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="font-serif text-[1.45rem] leading-none tracking-tight text-foreground transition-opacity duration-300 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-[1.65rem]"
          >
            Atriaé
          </Link>

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="premium-mobile-nav"
            aria-label="Toggle navigation menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-foreground/15 text-muted-foreground transition hover:border-foreground/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <nav aria-label="Primary" className="hidden md:block">
            <ul
              className="relative flex items-center rounded-full border border-border/55 bg-background/45 p-1 text-[0.66rem] font-medium uppercase tracking-[0.18em]"
              onMouseLeave={() => setCursorToHref(defaultTarget, true)}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-1 top-1 rounded-full bg-foreground/[0.055] transition-all duration-300 ease-out"
                style={{ left: cursorStyle.left, width: cursorStyle.width, opacity: cursorStyle.opacity }}
              />

              {items.map((item) => {
                const isActive = activeHref === item.href;
                const sharedClassName = cn(
                  "relative z-10 rounded-full px-4 py-2 text-muted-foreground transition-colors duration-300",
                  "hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70",
                  isActive && "text-foreground"
                );

                return (
                  <li key={item.href}>
                    {item.kind === "route" ? (
                      <Link
                        ref={(node) => {
                          itemRefs.current[item.href] = node;
                        }}
                        href={item.href}
                        className={sharedClassName}
                        data-active={isActive}
                        onMouseEnter={() => setCursorToHref(item.href, true)}
                        onFocus={() => setCursorToHref(item.href, true)}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <a
                        ref={(node) => {
                          itemRefs.current[item.href] = node;
                        }}
                        href={item.href}
                        className={sharedClassName}
                        onMouseEnter={() => setCursorToHref(item.href, true)}
                        onFocus={() => setCursorToHref(item.href, true)}
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <nav
          id="premium-mobile-nav"
          aria-label="Mobile"
          className={cn(
            "grid overflow-hidden transition-all duration-300 ease-out md:hidden",
            menuOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          )}
        >
          <ul className="surface-paper min-h-0 space-y-1 rounded-xl p-2 text-[0.68rem] font-medium uppercase tracking-[0.17em] shadow-none">
            {items.map((item) => (
              <li key={`mobile-${item.href}`}>
                {item.kind === "route" ? (
                  <Link
                    href={item.href}
                    className="block rounded-xl px-3 py-2.5 text-muted-foreground transition-colors duration-300 hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    className="block rounded-xl px-3 py-2.5 text-muted-foreground transition-colors duration-300 hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
