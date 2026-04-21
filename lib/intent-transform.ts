import { AtriaeIntentMode, SubmissionPayload } from "@/components/ui/intelligence-input";

export type StructuredSection = {
  title: string;
  points: string[];
};

export type StructuredOutput = {
  id: string;
  mode: AtriaeIntentMode;
  source: string;
  refinementNote?: string;
  sections: StructuredSection[];
};

const refinementTemplates: Record<string, (source: string) => string[]> = {
  "make this lighter": (source) => [
    `Cut low-impact tasks from "${source}" and keep only the top 2 priorities.`,
    "Batch related actions into one focused session.",
    "Set a strict end condition so the plan does not expand unnecessarily."
  ],
  "make this more concrete": (source) => [
    `Reduce "${source}" into one guiding focus for the day.`,
    "Replace complex task sequences with a three-step path.",
    "Use plain language checkpoints that are easy to review quickly."
  ]
};

const modeScaffolds: Record<AtriaeIntentMode, StructuredSection[]> = {
  learn: [
    { title: "Current issue", points: ["Define what is still unclear.", "Name one assumption to challenge."] },
    { title: "Suggested structure", points: ["Collect one strong source.", "Extract key principles.", "Apply one principle immediately."] },
    { title: "Actionable steps", points: ["Study for 20 focused minutes.", "Write a 4-line synthesis.", "Turn one insight into a next action."] }
  ],
  plan: [
    { title: "Current issue", points: ["The goal feels broad and difficult to start."] },
    { title: "Suggested structure", points: ["Define outcome.", "Sequence milestones.", "Assign clear timing."] },
    { title: "Actionable steps", points: ["Choose today's highest-leverage move.", "Set a 45-minute execution block.", "Review and adjust before close of day."] }
  ],
  focus: [
    { title: "Current issue", points: ["Attention is fragmented across too many tasks."] },
    { title: "Suggested structure", points: ["Protect one deep-work block.", "Use a visible single-task list.", "Pause interruptions until checkpoint."] },
    { title: "Actionable steps", points: ["Silence non-critical notifications.", "Run one timed focus sprint.", "Capture distractions for later review."] }
  ],
  organize: [
    { title: "Current issue", points: ["Ideas are present but not yet structured."] },
    { title: "Suggested structure", points: ["Group by theme.", "Prioritize by impact.", "Convert themes into executable steps."] },
    { title: "Actionable steps", points: ["Create three categories only.", "Move each note into one category.", "Schedule first action for each category."] }
  ]
};

export function transformIntentToOutput(payload: SubmissionPayload, refinementNote?: string): StructuredOutput {
  const normalizedRefinement = refinementNote?.trim().toLowerCase();
  const refinementAction = normalizedRefinement ? refinementTemplates[normalizedRefinement] : undefined;

  const sections = modeScaffolds[payload.mode].map((section, index) => {
    if (index !== 2 || !refinementAction) return section;

    return {
      ...section,
      points: refinementAction(payload.text)
    };
  });

  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    mode: payload.mode,
    source: payload.text,
    refinementNote,
    sections
  };
}

export const exampleTransformations: SubmissionPayload[] = [
  {
    mode: "plan",
    text: "Help me fix my morning routine",
    attachments: []
  },
  {
    mode: "focus",
    text: "I lose momentum after lunch and stop finishing tasks",
    attachments: []
  }
];
