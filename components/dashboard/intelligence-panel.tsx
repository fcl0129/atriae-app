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

type IntelligenceApiErrorCode =
  | "SUPABASE_CONFIG_MISSING"
  | "SESSION_MISSING"
  | "INVALID_INPUT"
  | "OPENAI_CONFIG_MISSING"
  | "OPENAI_TIMEOUT"
  | "OPENAI_REQUEST_FAILED"
  | "MODEL_OUTPUT_MALFORMED"
  | "MODEL_OUTPUT_INVALID"
  | "UNKNOWN_SERVER_ERROR";

type IntelligenceApiError = {
  code: IntelligenceApiErrorCode;
  message: string;
  retryable: boolean;
};

type IntelligenceApiResponse = Partial<IntelligenceResult> & {
  error?: IntelligenceApiError;
  request_id?: string;
};

function ModeBadge({ mode }: { mode: AtriaeIntentMode }) {
  return (
    <span className="rounded-full bg-background/70 px-3 py-1 text-[0.64rem] uppercase tracking-[0.16em] text-muted-foreground">
      {mode}
    </span>
  );
}

function mapApiErrorToUiMessage(error: IntelligenceApiError | undefined, fallback: string): string {
  if (!error) return fallback;

  switch (error.code) {
    case "SESSION_MISSING":
      return "You’re signed out. Please sign in again, then retry.";
    case "SUPABASE_CONFIG_MISSING":
      return "Atriae is missing Supabase configuration. Please contact support or check deployment settings.";
    case "OPENAI_CONFIG_MISSING":
      return "Atriae intelligence is not configured yet. Please set OPENAI_API_KEY in the server environment.";
    case "OPENAI_TIMEOUT":
      return "Atriae is taking longer than expected right now. Please try again in a moment.";
    case "OPENAI_REQUEST_FAILED":
      return "Atriae is temporarily unable to reach intelligence services. Please retry shortly.";
    case "MODEL_OUTPUT_MALFORMED":
    case "MODEL_OUTPUT_INVALID":
      return "Atriae returned an unexpected response format. Please retry.";
    case "INVALID_INPUT":
      return "Please enter a thought or question so Atriae can shape a response.";
    default:
      return error.message?.trim() || fallback;
  }
}

function isValidResult(data: IntelligenceApiResponse | null): data is IntelligenceResult {
  return Boolean(
    data &&
      typeof data.title === "string" &&
      typeof data.summary === "string" &&
      Array.isArray(data.sections) &&
      data.sections.every(
        (section) => section && typeof section.heading === "string" && typeof section.content === "string"
      ) &&
      Array.isArray(data.next_steps) &&
      data.next_steps.every((step) => typeof step === "string") &&
      typeof data.mode === "string"
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

      const data = (await res.json().catch(() => null)) as IntelligenceApiResponse | null;

      if (!res.ok) {
        const fallback = "Atriae couldn’t shape this right now. Please pause, then try again.";
        const message = mapApiErrorToUiMessage(data?.error, fallback);
        const requestIdSuffix = data?.request_id ? ` (Ref: ${data.request_id})` : "";
        setError(`${message}${requestIdSuffix}`);
        return;
      }

      if (!isValidResult(data)) {
        setError("Atriae returned an incomplete response. Please try again.");
        return;
      }

      setResponse(data);
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
