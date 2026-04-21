import type { DigestTemplate } from "@/lib/digests";

type PreviewTone = "warm" | "focused" | "light";

interface PreviewContent {
  headline: string;
  dek: string;
  sampleBlocks: string[];
  tone: PreviewTone;
}

const TEMPLATE_PREVIEWS: Record<string, PreviewContent> = {
  "morning-brief": {
    headline: "Good morning — here is your calm edge for the day.",
    dek: "A balanced opening: what matters, what shifts, and what deserves your first attention.",
    sampleBlocks: [
      "Top signal: Markets open softer while AI infra demand remains strong in enterprise software.",
      "Wardrobe cue: 62° and clear by noon, layer light and keep a structured jacket nearby.",
      "Focus block: Protect 9:30–11:00 for the one decision that reduces downstream churn."
    ],
    tone: "warm"
  },
  "executive-morning": {
    headline: "Before the first meeting, own the narrative.",
    dek: "A precision brief built for leaders who need high signal and fewer tabs.",
    sampleBlocks: [
      "Priority lens: One board topic is trending toward risk — align legal and finance early.",
      "Calendar framing: Two dense windows; preserve a 25-minute strategy slot post-lunch.",
      "Learn in 90 seconds: A sharp model for reducing decision latency across teams."
    ],
    tone: "focused"
  },
  "sunday-reset": {
    headline: "Reset with intention, not urgency.",
    dek: "A gentle weekly ritual to clear friction and prepare your week with confidence.",
    sampleBlocks: [
      "Weekly reset: clear inbox debt, choose Monday's top three outcomes, archive loose notes.",
      "Kitchen planning: One high-protein batch, one comfort dinner, one frictionless lunch option.",
      "Social nudge: Send one thoughtful check-in message to someone you've been meaning to call."
    ],
    tone: "warm"
  },
  "culture-edit": {
    headline: "A tasteful edit for your cultural appetite.",
    dek: "Reading, watching, and listening picks selected for perspective and pleasure.",
    sampleBlocks: [
      "Read: A concise essay on creative discipline and quiet ambition.",
      "Watch: A character-led film with luminous pacing and restraint.",
      "Listen: A podcast episode unpacking modern etiquette in digital spaces."
    ],
    tone: "light"
  },
  "soft-life-evening": {
    headline: "Evening, softened.",
    dek: "A graceful close to the day with gentle prompts and elegant decompression.",
    sampleBlocks: [
      "Unwind cue: Lower overhead lighting and put a softer playlist on for 20 minutes.",
      "Reflection line: What did you do today that your future self will thank you for?",
      "Custom note: Tomorrow's first task is already defined — you can fully log off now."
    ],
    tone: "warm"
  },
  "host-mode": {
    headline: "Host with ease, not last-minute stress.",
    dek: "A confidence-oriented prep digest before guests arrive.",
    sampleBlocks: [
      "Timeline: T-minus 3 hours — table styling, ice setup, and scent check.",
      "Food plan: One hero dish, one effortless side, one no-cook option.",
      "Conversation spark: Keep one fresh question ready for each guest archetype."
    ],
    tone: "focused"
  },
  "learning-drop": {
    headline: "One meaningful idea, delivered consistently.",
    dek: "A compact learning ritual that compounds into real intellectual momentum.",
    sampleBlocks: [
      "Core concept: The difference between linear effort and leveraged systems.",
      "Book clip: A paragraph on designing environments that protect attention.",
      "Applied prompt: Where can you remove one recurring low-value decision this week?"
    ],
    tone: "focused"
  },
  "commute-capsule": {
    headline: "A compact companion for the ride ahead.",
    dek: "Headlines, audio picks, and reminders in one clean capsule.",
    sampleBlocks: [
      "Briefing: Three headlines to know before 9 a.m., no doomscroll required.",
      "Listen next: A 12-minute episode on resilient routines for busy operators.",
      "Reminder: RSVP closes at 10 a.m. — reply now while you're in transit."
    ],
    tone: "light"
  }
};

const toneStyles: Record<PreviewTone, string> = {
  warm: "from-rose-50/75 via-paper to-amber-50/65",
  focused: "from-slate-100/85 via-paper to-zinc-100/65",
  light: "from-indigo-50/75 via-paper to-cyan-50/65"
};

function fallbackPreview(template: DigestTemplate): PreviewContent {
  return {
    headline: template.strapline ?? template.display_name,
    dek: template.description ?? "A curated digest ritual designed to feel intentional and premium.",
    sampleBlocks: template.modules.slice(0, 3).map((module) => `Module spotlight: ${module.module.replaceAll("_", " ")}`),
    tone: "light"
  };
}

export function getTemplatePreview(template: DigestTemplate) {
  return TEMPLATE_PREVIEWS[template.slug] ?? fallbackPreview(template);
}

export function TemplatePreview({ template }: { template: DigestTemplate }) {
  const preview = getTemplatePreview(template);

  return (
    <div className={`rounded-3xl border border-border/60 bg-gradient-to-br p-5 shadow-[0_12px_28px_-24px_rgba(15,23,42,0.55)] md:p-7 ${toneStyles[preview.tone]}`}>
      <p className="text-[0.65rem] uppercase text-muted-foreground/90" style={{ letterSpacing: "var(--text-eyebrow-tracking)" }}>
        Editorial preview
      </p>
      <h3 className="mt-3 text-[1.7rem] leading-tight tracking-tight">{preview.headline}</h3>
      <p className="mt-2 text-sm leading-7 text-foreground/75">{preview.dek}</p>

      <div className="mt-6 space-y-2.5 border-t border-border/50 pt-4">
        {preview.sampleBlocks.map((block) => (
          <div key={block} className="rounded-2xl border border-border/65 bg-paper/85 px-4 py-3 text-sm leading-6 text-foreground/90">
            {block}
          </div>
        ))}
      </div>
    </div>
  );
}
