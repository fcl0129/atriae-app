import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";

import { AppShell } from "@/components/layout/app-shell";

import "./globals.css";

const serif = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap"
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Atriaé",
  description: "A calm personal operating system for learning, rituals, and life organization."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${sans.variable}`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
