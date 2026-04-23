"use client";

import { useState } from "react";

import { IntelligenceInput } from "@/components/ui/intelligence-input";
import { cn } from "@/lib/utils";

type AtriaeMode = "learn" | "plan" | "focus" | "organize";

type IntelligenceResponse = {
  title: string;
  summary: string;
  sections: { heading: string; content: string }[];
  next_steps: string[];
  mode: AtriaeMode;
};

type IntelligencePanelProps = {
  heading?: string;
  contextLabel?: string;
  className?: string;
  defaultMode?: AtriaeMode;
};

const modeOptions = [
  { value: "plan", label: "Plan" },
  { value: "focus", label: "Focus" },
  { value: "learn", label: "Learn" },
  { value: "organize", label: "Organize" }
] as const;

function mapLegacyMode(mode?: "clarity" | "plan" | "focus" | "decision" | "learn" | "organize"): AtriaeMode {
  if (mode === "focus") return "focus";
  if (mode === "plan") return "plan";
  if (mode === "organize" || mode === "decision") return "organize";
  return mode === "learn" ? "learn" : "learn";
}

export function IntelligencePanel({
  heading = "Shape today clearly",
  contextLabel,
  className,
  defaultMode = "plan"
}: IntelligencePanelProps) {
  const [response, setResponse] = useState<IntelligenceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <section className={cn("space-y-4", className)}>
      <IntelligenceInput
        heading={heading}
        placeholder="Capture one thought and let Atriae structure it."
        modeOptions={modeOptions.map((mode) => ({ value: mode.value, label: mode.label }))}
        suggestions={[
          "Shape one clear focus for today",
          "Turn this into a gentle plan",
          "Help me understand this better",
          "Organize this mental clutter"
        ]}
        allowAttachments={false}
        submitLabel="Shape response"
        onSubmit={async (payload) => {
          try {
            setLoading(true);
            setError(null);

            const mode = payload.mode ? mapLegacyMode(payload.mode) : defaultMode;

            const res = await fetch("/api/intelligence", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                mode,
                input: payload.text,
                context: contextLabel ? { context: contextLabel } : undefined
              })
            });

            const data = (await res.json().catch(() => null)) as Record<string, unknown> | null;

            if (!res.ok) {
              const message =
                data && typeof data.error === "object" && data.error && typeof (data.error as { message?: string }).message === "string"
                  ? (data.error as { message: string }).message
                  : "Atriae could not shape this right now. Please try again.";
              setError(message);
              return;
            }

            if (!data || typeof data !== "object" || !("title" in data)) {
              setError("Atriae returned an incomplete response. Please retry.");
              return;
            }

            setResponse(data as unknown as IntelligenceResponse);
          } catch {
            setError("Atriae is temporarily unavailable. Please return in a moment.");
          } finally {
            setLoading(false);
          }
        }}
      />

      {loading ? <p className="text-sm text-muted-foreground">Shaping a calm brief…</p> : null}

      {error ? (
        <div className="surface-paper p-4 text-sm text-muted-foreground">
          <p className="text-foreground">{error}</p>
          <p className="mt-1">Keep your thought as it is, and try again when ready.</p>
        </div>
      ) : null}

      {response ? (
        <article className="surface-paper space-y-4 p-5">
          <header className="space-y-2 border-b border-border/50 pb-3">
            <p className="type-label text-muted-foreground">{response.mode}</p>
            <h3 className="text-2xl">{response.title}</h3>
            <p className="text-sm text-muted-foreground">{response.summary}</p>
          </header>

          <div className="grid gap-3 md:grid-cols-2">
            {response.sections.map((section) => (
              <section key={section.heading} className="rounded-2xl border border-border/50 bg-background/50 p-3.5">
                <h4 className="text-sm font-semibold text-foreground">{section.heading}</h4>
                <p className="mt-1.5 text-sm text-muted-foreground">{section.content}</p>
              </section>
            ))}
          </div>

          <section className="space-y-2">
            <p className="type-label text-muted-foreground">Next steps</p>
            <ol className="space-y-1.5 text-sm text-foreground/90">
              {response.next_steps.map((step) => (
                <li key={step} className="rounded-xl bg-secondary/40 px-3 py-2">{step}</li>
              ))}
            </ol>
          </section>
        </article>
      ) : null}
    </section>
  );
}
