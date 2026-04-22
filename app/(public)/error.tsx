"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function PublicError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Public landing route failed to render", {
      message: error.message,
      digest: error.digest
    });
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-xs tracking-[0.2em] text-[#284637]">ATRIAE</p>
      <h1 className="text-4xl leading-tight text-[#102117] md:text-5xl">We hit a temporary issue loading this page.</h1>
      <p className="max-w-xl text-base leading-7 text-[#213529]/85 md:text-lg">
        Please try again. If it keeps happening, use the sign in link below while we restore the full experience.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-11 items-center justify-center rounded-full border border-[#22392d]/15 bg-[#163127] px-6 text-sm font-medium tracking-[0.04em] text-[#f7faf4] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#11271f]"
        >
          Try again
        </button>
        <Link
          href="/login"
          className="inline-flex h-11 items-center justify-center rounded-full border border-[#203227]/20 bg-white/30 px-6 text-sm tracking-[0.04em] text-[#183126] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/45"
        >
          Go to sign in
        </Link>
      </div>
    </div>
  );
}
