"use client";

import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type RequestAccessTriggerProps = {
  label?: string;
  className?: string;
  variant?: "primary" | "quiet" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
};

export function RequestAccessTrigger({
  label = "Request access",
  className,
  variant = "primary",
  size = "default"
}: RequestAccessTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Placeholder for backend wiring once invite list endpoint is available.
    setIsSubmitted(true);
    setEmail("");
  };

  return (
    <>
      <Button
        type="button"
        onClick={() => {
          setIsSubmitted(false);
          setIsOpen(true);
        }}
        variant={variant}
        size={size}
        className={cn(
          "rounded-full border border-foreground/10 bg-[linear-gradient(145deg,rgba(252,248,242,0.96),rgba(240,236,230,0.9))] text-[0.72rem] uppercase tracking-[0.18em] shadow-[0_18px_30px_-22px_rgba(35,36,30,0.65)] hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-[0_22px_34px_-24px_rgba(35,36,30,0.7)] active:translate-y-0",
          className
        )}
      >
        {label}
      </Button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/30 p-4 backdrop-blur-sm md:items-center">
          <button
            type="button"
            aria-label="Close request access modal"
            className="absolute inset-0 cursor-default"
            onClick={() => setIsOpen(false)}
          />

          <section className="surface-paper relative w-full max-w-md rounded-[1.5rem] border border-foreground/10 p-6 shadow-[0_40px_80px_-45px_rgba(26,28,23,0.7)] md:p-8">
            <div className="space-y-2">
              <p className="text-[0.62rem] uppercase tracking-[0.24em] text-muted-foreground">Private invite</p>
              <h2 className="text-2xl leading-tight md:text-[2rem]">Request access to Atriae</h2>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                We&apos;re building this carefully.
                <br />
                Leave your email and we&apos;ll invite you.
              </p>
            </div>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <Input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@something.com"
                className="h-11 rounded-full border-foreground/15 bg-paper/80 px-4 text-sm"
              />
              <Button type="submit" className="h-11 w-full text-[0.7rem] uppercase tracking-[0.18em]">
                Request access
              </Button>
            </form>

            <p className="mt-4 text-center text-[0.66rem] uppercase tracking-[0.2em] text-muted-foreground">
              No spam. No noise. Just updates.
            </p>

            {isSubmitted ? (
              <p className="mt-3 text-center text-sm text-foreground/80">Thanks. We&apos;ll be in touch when spots open.</p>
            ) : null}
          </section>
        </div>
      ) : null}
    </>
  );
}
