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
        body: JSON.stringify({ input: payload.text, mode: payload.mode })
      });

      const data = (await res.json().catch(() => null)) as { text?: unknown; error?: unknown } | null;
      const text = typeof data?.text === "string" && data.text.trim().length > 0
        ? data.text
        : "I’m here with you. Try reframing this as one concrete next step, then submit again.";

      if (!res.ok) {
        setError("I’m having trouble reaching the intelligence layer right now. You can keep going, and try again in a moment.");
      }

      setResponse(text);
    } catch {
      setError("I'm having trouble reaching the intelligence layer right now. You can keep going, and try again in a moment.");
      setResponse("I'm temporarily unable to respond right now, but your thought was captured. Please try again shortly.");
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
