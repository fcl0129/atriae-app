"use client";

import { useState } from "react";

import { IntelligenceInput, type SubmissionPayload } from "@/components/ui/intelligence-input";

export function IntelligencePanel() {
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (payload: SubmissionPayload) => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: payload.text, mode: payload.mode })
      });

      const data = (await res.json()) as { output?: string; error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "Assistant unavailable");
      }

      setResponse(data.output ?? "");
    } catch (_error) {
      setError("The intelligence layer is unavailable right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-4">
      <IntelligenceInput
        heading="What deserves your clearest attention right now?"
        placeholder="Capture a thought, a decision, or a question"
        onSubmit={handleSubmit}
      />
      {loading ? <p className="text-sm text-muted-foreground">Thinking with your current Atriae context…</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {response ? <article className="surface-paper p-4 text-sm leading-7 text-foreground/95">{response}</article> : null}
    </section>
  );
}
