import Link from "next/link";

const marketingLinks = [
  { label: "Home", href: "/" },
  { label: "How it works", href: "#how" },
  { label: "About", href: "#about" },
  { label: "Login", href: "/login" }
] as const;

export function MarketingNavbar() {
  return (
    <section aria-label="Marketing navigation" className="mx-auto w-full max-w-6xl">
      <nav className="flex items-center justify-between gap-4 py-1">
        <Link
          href="/"
          className="font-serif text-[1.45rem] leading-none tracking-tight text-foreground/85 transition-opacity duration-300 hover:opacity-70"
        >
          Atriaé
        </Link>

        <div className="flex items-center gap-3 md:gap-6">
          <ul className="hidden items-center gap-4 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-muted-foreground md:flex md:gap-6">
            {marketingLinks.map((link) => (
              <li key={link.href}>
                {link.href.startsWith("#") ? (
                  <a href={link.href} className="transition-opacity duration-300 hover:opacity-70">
                    {link.label}
                  </a>
                ) : (
                  <Link href={link.href} className="transition-opacity duration-300 hover:opacity-70">
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <Link href="/login" className="editorial-cta text-[0.65rem] uppercase tracking-[0.2em] text-foreground">
            Enter Atriae
          </Link>
        </div>
      </nav>
    </section>
  );
}
