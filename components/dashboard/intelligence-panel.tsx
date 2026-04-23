"use client";

import { useState } from "react";

import { IntelligenceInput, type AtriaeIntentMode, type SubmissionPayload } from "@/components/ui/intelligence-input";

type ClarityOutput = {
  core_problem: string;
  what_matters: string[];
  what_doesnt_matter: string[];
  next_step: string;
};

type PlanOutput = {
  goal: string;
  steps: string[];
  timeline: string;
  first_action: string;
};

type FocusOutput = {
  focus_task: string;
  ignore: string[];
  duration: string;
  definition_of_done: string;
};

type DecisionOutput = {
  options: string[];
  criteria: string[];
  risks: string[];
  recommendation: string;
  reasoning: string;
};

type RunResponse = {
  sessionId: string;
  mode: AtriaeIntentMode;
  output: ClarityOutput | PlanOutput | FocusOutput | DecisionOutput;
  error?: string;
};

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isRunResponse(data: unknown): data is RunResponse {
  if (!data || typeof data !== "object") return false;

  const candidate = data as Record<string, unknown>;
  if (typeof candidate.sessionId !== "string") return false;
  if (!["clarity", "plan", "focus", "decision"].includes(String(candidate.mode))) return false;
  if (!candidate.output || typeof candidate.output !== "object") return false;

  const output = candidate.output as Record<string, unknown>;
  switch (candidate.mode) {
    case "clarity":
      return (
        typeof output.core_problem === "string" &&
        isStringArray(output.what_matters) &&
        isStringArray(output.what_doesnt_matter) &&
        typeof output.next_step === "string"
      );
    case "plan":
      return (
        typeof output.goal === "string" &&
        isStringArray(output.steps) &&
        typeof output.timeline === "string" &&
        typeof output.first_action === "string"
      );
    case "focus":
      return (
        typeof output.focus_task === "string" &&
        isStringArray(output.ignore) &&
        typeof output.duration === "string" &&
        typeof output.definition_of_done === "string"
      );
    case "decision":
      return (
        isStringArray(output.options) &&
        isStringArray(output.criteria) &&
        isStringArray(output.risks) &&
        typeof output.recommendation === "string" &&
        typeof output.reasoning === "string"
      );
    default:
      return false;
  }
}

export function IntelligencePanel() {
  const [response, setResponse] = useState<RunResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sessionId, setSessionId] = useState<string | undefined>();

  const handleSubmit = async (payload: SubmissionPayload) => {
    if (loading) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/atriae/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: payload.text, mode: payload.mode, sessionId })
      });

      const data = (await res.json().catch(() => null)) as RunResponse | { error?: string } | null;

      if (!res.ok) {
        setError(data && typeof data === "object" && typeof data.error === "string" ? data.error : "Request failed. Please retry.");
        return;
      }

      if (!isRunResponse(data)) {
        setError("Atriae returned an invalid response shape. Please retry.");
        return;
      }

      setSessionId(data.sessionId);
      setResponse(data);
    } catch {
      setError("Atriae is temporarily unavailable. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-4">
      <IntelligenceInput
        heading="What deserves your clearest attention right now?"
        placeholder="Capture a thought, challenge, or decision"
        isSubmitting={loading}
        onSubmit={handleSubmit}
      />

      {loading ? <p className="text-sm text-muted-foreground">Generating a structured response…</p> : null}

      {error ? (
        <div className="surface-paper space-y-2 p-4 text-sm text-foreground/90">
          <p>{error}</p>
          <p className="text-muted-foreground">Keep your thought as-is and retry when ready.</p>
        </div>
      ) : null}

      {response ? (
        <article className="surface-paper space-y-5 p-4 text-sm leading-7 text-foreground/95 sm:p-5">
          <header className="space-y-2 border-b border-border/45 pb-3">
            <span className="rounded-full bg-background/70 px-3 py-1 text-[0.64rem] uppercase tracking-[0.16em] text-muted-foreground">{response.mode}</span>
          </header>

          {response.mode === "clarity" ? (
            <section className="space-y-3">
              <p><strong>Core problem:</strong> {(response.output as ClarityOutput).core_problem}</p>
              <p><strong>What matters:</strong></p>
              <ul className="list-disc space-y-1.5 pl-5">{(response.output as ClarityOutput).what_matters.map((item) => <li key={item}>{item}</li>)}</ul>
              <p><strong>What doesn’t matter:</strong></p>
              <ul className="list-disc space-y-1.5 pl-5">{(response.output as ClarityOutput).what_doesnt_matter.map((item) => <li key={item}>{item}</li>)}</ul>
              <p><strong>Next step:</strong> {(response.output as ClarityOutput).next_step}</p>
            </section>
          ) : null}

          {response.mode === "plan" ? (
            <section className="space-y-3">
              <p><strong>Goal:</strong> {(response.output as PlanOutput).goal}</p>
              <p><strong>Timeline:</strong> {(response.output as PlanOutput).timeline}</p>
              <p><strong>Steps:</strong></p>
              <ul className="list-disc space-y-1.5 pl-5">{(response.output as PlanOutput).steps.map((item) => <li key={item}>{item}</li>)}</ul>
              <p><strong>First action:</strong> {(response.output as PlanOutput).first_action}</p>
            </section>
          ) : null}

          {response.mode === "focus" ? (
            <section className="space-y-3">
              <p><strong>Focus task:</strong> {(response.output as FocusOutput).focus_task}</p>
              <p><strong>Duration:</strong> {(response.output as FocusOutput).duration}</p>
              <p><strong>Ignore:</strong></p>
              <ul className="list-disc space-y-1.5 pl-5">{(response.output as FocusOutput).ignore.map((item) => <li key={item}>{item}</li>)}</ul>
              <p><strong>Definition of done:</strong> {(response.output as FocusOutput).definition_of_done}</p>
            </section>
          ) : null}

          {response.mode === "decision" ? (
            <section className="space-y-3">
              <p><strong>Options:</strong></p>
              <ul className="list-disc space-y-1.5 pl-5">{(response.output as DecisionOutput).options.map((item) => <li key={item}>{item}</li>)}</ul>
              <p><strong>Criteria:</strong></p>
              <ul className="list-disc space-y-1.5 pl-5">{(response.output as DecisionOutput).criteria.map((item) => <li key={item}>{item}</li>)}</ul>
              <p><strong>Risks:</strong></p>
              <ul className="list-disc space-y-1.5 pl-5">{(response.output as DecisionOutput).risks.map((item) => <li key={item}>{item}</li>)}</ul>
              <p><strong>Recommendation:</strong> {(response.output as DecisionOutput).recommendation}</p>
              <p><strong>Reasoning:</strong> {(response.output as DecisionOutput).reasoning}</p>
            </section>
          ) : null}
        </article>
      ) : null}
    </section>
  );
}
