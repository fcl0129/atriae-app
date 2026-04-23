"use client";

import { FormEvent, useId, useState } from "react";

import { cn } from "@/lib/utils";

export type AtriaeIntentMode = "clarity" | "plan" | "focus" | "decision" | "learn" | "organize";

type IntentModeOption = {
  value: AtriaeIntentMode;
  label: string;
};

export type SubmissionPayload = {
  mode?: AtriaeIntentMode;
  text: string;
  attachments: File[];
};

type IntelligenceInputProps = {
  className?: string;
  heading?: string;
  promptLabel?: string;
  placeholder?: string;
  modeOptions?: IntentModeOption[];
  suggestions?: string[];
  submitLabel?: string;
  attachmentLabel?: string;
  allowAttachments?: boolean;
  isSubmitting?: boolean;
  onSubmit?: (payload: SubmissionPayload) => void;
};

const defaultModes: IntentModeOption[] = [
  { value: "clarity", label: "Clarity" },
  { value: "plan", label: "Plan" },
  { value: "focus", label: "Focus" },
  { value: "learn", label: "Learn" },
  { value: "organize", label: "Organize" },
  { value: "decision", label: "Decision" }
];

const defaultSuggestions = [
  "Clarify what matters most today",
  "Turn this into a practical plan",
  "Help me protect my focus block",
  "Compare options and recommend one"
];

export function IntelligenceInput({
  className,
  heading = "What should Atriae help you shape right now?",
  promptLabel = "Atriae intent",
  placeholder = "Describe what you want to understand, improve, or simplify.",
  modeOptions = defaultModes,
  suggestions = defaultSuggestions,
  submitLabel = "Shape this",
  attachmentLabel = "Attach note",
  allowAttachments = true,
  isSubmitting = false,
  onSubmit
}: IntelligenceInputProps) {
  const attachmentId = useId();
  const [mode, setMode] = useState<AtriaeIntentMode>(modeOptions[0]?.value ?? "clarity");
  const [hasModeOverride, setHasModeOverride] = useState(false);
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [lastSubmittedIntent, setLastSubmittedIntent] = useState<string>("");

  const canSubmit = text.trim().length > 0 && !isSubmitting;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    const normalizedText = text.trim();
    onSubmit?.({ mode: hasModeOverride ? mode : undefined, text: normalizedText, attachments });
    setLastSubmittedIntent(normalizedText);
  };

  return (
    <section
      className={cn("surface-glass space-y-5 p-4 sm:space-y-6 sm:p-6 md:p-7", className)}
      aria-label="Atriae intelligence input"
    >
      <div className="space-y-2">
        <p className="text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground/85">Atriae intelligence</p>
        <h2 className="max-w-2xl text-[1.45rem] leading-tight md:text-[1.9rem]">{heading}</h2>
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Intent mode">
        {modeOptions.map((option) => {
          const isActive = option.value === mode;
          return (
            <button
              key={option.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              disabled={isSubmitting}
              onClick={() => {
                setMode(option.value);
                setHasModeOverride(true);
              }}
              className={cn(
                "rounded-full px-4 py-1.5 text-[0.68rem] uppercase tracking-[0.14em] transition-all duration-300 disabled:opacity-65",
                isActive
                  ? "bg-foreground/90 text-background"
                  : "bg-background/58 text-muted-foreground hover:bg-background/72 hover:text-foreground"
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label htmlFor="atriae-intent-input" className="sr-only">
          {promptLabel}
        </label>
        <textarea
          id="atriae-intent-input"
          rows={4}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={placeholder}
          disabled={isSubmitting}
          className="min-h-28 w-full resize-y rounded-2xl bg-background/72 px-4 py-3 text-[0.96rem] text-foreground outline-none transition focus:bg-background/90 focus:ring-2 focus:ring-ring/25 disabled:opacity-70"
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {suggestions.slice(0, 4).map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setText(suggestion)}
                disabled={isSubmitting}
                className="rounded-full bg-background/64 px-3 py-1.5 text-[0.66rem] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-70"
              >
                {suggestion}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {allowAttachments ? (
              <>
                <input
                  id={attachmentId}
                  type="file"
                  className="sr-only"
                  disabled={isSubmitting}
                  onChange={(event) => {
                    const selectedFiles = event.target.files ? Array.from(event.target.files) : [];
                    setAttachments(selectedFiles);
                  }}
                />
                <label
                  htmlFor={attachmentId}
                  className="cursor-pointer rounded-full bg-background/65 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  {attachmentLabel}
                </label>
              </>
            ) : null}
            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-full bg-foreground px-4 py-2 text-xs uppercase tracking-[0.14em] text-background transition-opacity disabled:cursor-not-allowed disabled:opacity-45"
            >
              {isSubmitting ? "Shaping…" : submitLabel}
            </button>
          </div>
        </div>

        {attachments.length > 0 ? (
          <p className="text-xs text-muted-foreground">{attachments.length} attachment{attachments.length > 1 ? "s" : ""} selected</p>
        ) : null}

        {lastSubmittedIntent ? (
          <p className="text-xs text-muted-foreground">
            Captured in <span className="font-medium text-foreground">{hasModeOverride ? modeOptions.find((option) => option.value === mode)?.label : "Auto"}</span> mode:
            <span className="ml-1 italic">“{lastSubmittedIntent}”</span>
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">Start with one thought. Atriae will structure the rest.</p>
        )}
      </form>
    </section>
  );
}
