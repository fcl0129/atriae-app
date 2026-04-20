import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";

import "./globals.css";

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap"
});

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Atriaé",
  description: "A calm personal operating system for learning, rituals, and life organization."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${sans.variable}`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
