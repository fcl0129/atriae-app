import Link from "next/link";

import { Button } from "@/components/ui/button";

export function PublicLandingFinalCta() {
  return (
    <section className="mx-auto max-w-3xl space-y-6 pb-6 text-center md:space-y-7">
      <h2 className="text-[clamp(2rem,4.6vw,3.3rem)] leading-[0.95]">Start thinking more clearly.</h2>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild className="px-7 text-[0.72rem] uppercase tracking-[0.18em]">
          <Link href="/dashboard">Enter Atriae</Link>
        </Button>
        <Button asChild variant="quiet" className="px-7 text-[0.72rem] uppercase tracking-[0.18em]">
          <Link href="/login">Request access</Link>
        </Button>
      </div>
    </section>
  );
}
