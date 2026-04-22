"use client";

import { useState } from "react";

import { IntelligenceInput, type AtriaeIntentMode, type SubmissionPayload } from "@/components/ui/intelligence-input";

type IntelligenceSection = {
  heading: string;
  content: string;
};

type IntelligenceResult = {
  title: string;
  summary: string;
  sections: IntelligenceSection[];
  next_steps: string[];
  mode: AtriaeIntentMode;
};

function ModeBadge({ mode }: { mode: AtriaeIntentMode }) {
  return (
    <span className="rounded-full bg-background/70 px-3 py-1 text-[0.64rem] uppercase tracking-[0.16em] text-muted-foreground">
      {mode}
    </span>
  );
}

export function IntelligencePanel() {
  const [response, setResponse] = useState<IntelligenceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (payload: SubmissionPayload) => {
    if (loading) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: payload.text, mode: payload.mode })
      });

      const data = (await res.json().catch(() => null)) as
        | (Partial<IntelligenceResult> & { error?: string })
        | null;

      if (!res.ok) {
        setError(
          data?.error?.trim() ||
            "Atriae couldn’t shape this right now. Please pause, then try again."
        );
        return;
      }

      if (
        !data ||
        typeof data.title !== "string" ||
        typeof data.summary !== "string" ||
        !Array.isArray(data.sections) ||
        !Array.isArray(data.next_steps) ||
        typeof data.mode !== "string"
      ) {
        setError("Atriae returned an incomplete response. Please try again.");
        return;
      }

      setResponse(data as IntelligenceResult);
    } catch {
      setError("Atriae is temporarily quiet. Please try shaping this again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-4">
      <IntelligenceInput
        heading="What deserves your clearest attention right now?"
        placeholder="Capture a thought, a decision, or a question"
        isSubmitting={loading}
        onSubmit={handleSubmit}
      />

      {loading ? <p className="text-sm text-muted-foreground">Shaping a calm response for your current mode…</p> : null}

      {error ? (
        <div className="surface-paper space-y-2 p-4 text-sm text-foreground/90">
          <p>{error}</p>
          <p className="text-muted-foreground">You can keep your thought as-is and try again when ready.</p>
        </div>
      ) : null}

      {response ? (
        <article className="surface-paper space-y-5 p-4 text-sm leading-7 text-foreground/95 sm:p-5">
          <header className="space-y-2 border-b border-border/45 pb-3">
            <ModeBadge mode={response.mode} />
            <h3 className="text-xl leading-tight text-foreground">{response.title}</h3>
            <p className="text-muted-foreground">{response.summary}</p>
          </header>

          <section className="space-y-4">
            {response.sections.map((section) => (
              <div key={section.heading} className="space-y-1.5">
                <h4 className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{section.heading}</h4>
                <p>{section.content}</p>
              </div>
            ))}
          </section>

          <section className="space-y-2 border-t border-border/45 pt-4">
            <h4 className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Next steps</h4>
            <ul className="space-y-1.5 pl-5 text-foreground/90">
              {response.next_steps.map((step, index) => (
                <li key={`${step}-${index}`} className="list-disc">
                  {step}
                </li>
              ))}
            </ul>
          </section>
        </article>
      ) : null}
    </section>
  );
}
