import OpenAI from "openai";
import { z } from "zod";

import { assertOpenAIKey } from "@/lib/env/openai";

export const guidedModeSchema = z.enum(["clarity", "plan", "focus", "decision"]);
export type GuidedMode = z.infer<typeof guidedModeSchema>;

export const guidedRunRequestSchema = z.object({
  sessionId: z.string().uuid().optional(),
  mode: guidedModeSchema.optional(),
  input: z.string().trim().min(1).max(4000)
});

const sharedOutputFields = {
  follow_up_question: z.string().trim().min(1).nullable(),
  next_mode: guidedModeSchema.nullable()
};

const claritySchema = z.object({
  core_problem: z.string().trim().min(1),
  what_matters: z.array(z.string().trim().min(1)),
  what_doesnt_matter: z.array(z.string().trim().min(1)),
  next_step: z.string().trim().min(1),
  ...sharedOutputFields
});

const planSchema = z.object({
  goal: z.string().trim().min(1),
  steps: z.array(z.string().trim().min(1)),
  timeline: z.string().trim().min(1),
  first_action: z.string().trim().min(1),
  ...sharedOutputFields
});

const focusSchema = z.object({
  focus_task: z.string().trim().min(1),
  ignore: z.array(z.string().trim().min(1)),
  duration: z.string().trim().min(1),
  definition_of_done: z.string().trim().min(1),
  ...sharedOutputFields
});

const decisionSchema = z.object({
  options: z.array(z.string().trim().min(1)),
  criteria: z.array(z.string().trim().min(1)),
  risks: z.array(z.string().trim().min(1)),
  recommendation: z.string().trim().min(1),
  reasoning: z.string().trim().min(1),
  ...sharedOutputFields
});

export const guidedOutputSchemas = {
  clarity: claritySchema,
  plan: planSchema,
  focus: focusSchema,
  decision: decisionSchema
} as const;

export type GuidedStructuredOutput =
  | z.infer<typeof claritySchema>
  | z.infer<typeof planSchema>
  | z.infer<typeof focusSchema>
  | z.infer<typeof decisionSchema>;

const responseFormatByMode: Record<GuidedMode, { name: string; schema: Record<string, unknown> }> = {
  clarity: {
    name: "guided_clarity_output",
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        core_problem: { type: "string" },
        what_matters: { type: "array", items: { type: "string" } },
        what_doesnt_matter: { type: "array", items: { type: "string" } },
        next_step: { type: "string" },
        follow_up_question: { type: ["string", "null"] },
        next_mode: { type: ["string", "null"], enum: ["clarity", "plan", "focus", "decision", null] }
      },
      required: ["core_problem", "what_matters", "what_doesnt_matter", "next_step", "follow_up_question", "next_mode"]
    }
  },
  plan: {
    name: "guided_plan_output",
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        goal: { type: "string" },
        steps: { type: "array", items: { type: "string" } },
        timeline: { type: "string" },
        first_action: { type: "string" },
        follow_up_question: { type: ["string", "null"] },
        next_mode: { type: ["string", "null"], enum: ["clarity", "plan", "focus", "decision", null] }
      },
      required: ["goal", "steps", "timeline", "first_action", "follow_up_question", "next_mode"]
    }
  },
  focus: {
    name: "guided_focus_output",
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        focus_task: { type: "string" },
        ignore: { type: "array", items: { type: "string" } },
        duration: { type: "string" },
        definition_of_done: { type: "string" },
        follow_up_question: { type: ["string", "null"] },
        next_mode: { type: ["string", "null"], enum: ["clarity", "plan", "focus", "decision", null] }
      },
      required: ["focus_task", "ignore", "duration", "definition_of_done", "follow_up_question", "next_mode"]
    }
  },
  decision: {
    name: "guided_decision_output",
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        options: { type: "array", items: { type: "string" } },
        criteria: { type: "array", items: { type: "string" } },
        risks: { type: "array", items: { type: "string" } },
        recommendation: { type: "string" },
        reasoning: { type: "string" },
        follow_up_question: { type: ["string", "null"] },
        next_mode: { type: ["string", "null"], enum: ["clarity", "plan", "focus", "decision", null] }
      },
      required: ["options", "criteria", "risks", "recommendation", "reasoning", "follow_up_question", "next_mode"]
    }
  }
};

const modeInstructions: Record<GuidedMode, string> = {
  clarity: `CLARITY MODE\nReturn JSON with: core_problem, what_matters[], what_doesnt_matter[], next_step, follow_up_question, next_mode.\nIdentify the real issue, remove noise, and keep it concise and sharp.\nfollow_up_question should sharpen the problem (or null if not useful).\nnext_mode should usually be "plan" when the problem is clear, otherwise null.`,
  plan: `PLAN MODE\nReturn JSON with: goal, steps[], timeline, first_action, follow_up_question, next_mode.\nCreate a practical sequence with concrete action order.\nfollow_up_question should clarify scope, constraints, or priority (or null if not useful).\nnext_mode should usually be "focus" when the plan is ready, otherwise null.`,
  focus: `FOCUS MODE\nReturn JSON with: focus_task, ignore[], duration, definition_of_done, follow_up_question, next_mode.\nNarrow attention and define a crisp execution boundary.\nfollow_up_question should confirm commitment or remove ambiguity (or null if not useful).\nnext_mode is usually null unless a switch is clearly needed.`,
  decision: `DECISION MODE\nReturn JSON with: options[], criteria[], risks[], recommendation, reasoning, follow_up_question, next_mode.\nCompare tradeoffs and produce a grounded recommendation.\nfollow_up_question should clarify priorities/tradeoffs (or null if not useful).\nnext_mode should often be "plan" or "focus" when a path is selected, otherwise null.`
};

const model = "gpt-4.1";

export class GuidedModelError extends Error {}

let openaiClient: OpenAI | null = null;

function getClient() {
  if (openaiClient) return openaiClient;
  openaiClient = new OpenAI({ apiKey: assertOpenAIKey() });
  return openaiClient;
}

function getText(response: unknown): string {
  const outputText = (response as { output_text?: unknown })?.output_text;
  if (typeof outputText === "string" && outputText.trim()) return outputText.trim();

  throw new GuidedModelError("OpenAI response text missing");
}

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    throw new GuidedModelError("OpenAI JSON parse failed");
  }
}

function normalizeAction(item: string): string {
  return item.replace(/\s+/g, " ").trim();
}

function isActionable(item: string): boolean {
  const normalized = normalizeAction(item);
  if (normalized.length < 6 || normalized.length > 120) return false;
  if (!/[a-z]/i.test(normalized)) return false;
  if (!/\b(schedule|draft|write|send|call|block|review|choose|decide|list|define|start|finish|ship|create|prepare|set|plan|commit|test|remove|organize)\b/i.test(normalized)) {
    return false;
  }
  return true;
}

const detectionFormat = {
  type: "json_schema" as const,
  strict: true,
  name: "guided_mode_detection",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      mode: { type: "string", enum: ["clarity", "plan", "focus", "decision"] }
    },
    required: ["mode"]
  }
};

export async function detectMode(input: string): Promise<GuidedMode> {
  const client = getClient();

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await client.responses.create({
        model,
        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text: `Classify the user's intent:\n- clarity → confused, overwhelmed, unclear thinking\n- plan → wants steps, structure, roadmap\n- focus → wants to act now, avoid distractions\n- decision → comparing options, unsure what to choose\nReturn ONLY JSON.`
              }
            ]
          },
          {
            role: "user",
            content: [{ type: "input_text", text: input }]
          }
        ],
        text: { format: detectionFormat }
      } as never);

      const parsedJson = parseJson(getText(response));
      const parsed = z.object({ mode: guidedModeSchema }).safeParse(parsedJson);
      if (!parsed.success) {
        throw new GuidedModelError(parsed.error.issues[0]?.message ?? "Mode detection validation failed");
      }

      return parsed.data.mode;
    } catch (error) {
      console.error("[atriae.guided] mode detection failed", { attempt: attempt + 1, error });
      if (attempt === 1) return "clarity";
    }
  }

  return "clarity";
}

function toSummary(mode: GuidedMode, output: GuidedStructuredOutput): string {
  switch (mode) {
    case "clarity":
      return (output as z.infer<typeof claritySchema>).core_problem;
    case "plan":
      return (output as z.infer<typeof planSchema>).goal;
    case "focus":
      return (output as z.infer<typeof focusSchema>).focus_task;
    case "decision":
      return (output as z.infer<typeof decisionSchema>).recommendation;
  }
}

export async function generateGuidedSystemOutput(mode: GuidedMode, input: string) {
  const client = getClient();
  const format = responseFormatByMode[mode];

  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await client.responses.create({
        model,
        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text: `You are Atriae, a structured thinking system. Output JSON only. Do not output prose.\n${modeInstructions[mode]}`
              }
            ]
          },
          {
            role: "user",
            content: [{ type: "input_text", text: input }]
          }
        ],
        text: {
          format: {
            type: "json_schema",
            strict: true,
            name: format.name,
            schema: format.schema
          }
        }
      } as never);

      const parsedJson = parseJson(getText(response));
      const parsed = guidedOutputSchemas[mode].safeParse(parsedJson);
      if (!parsed.success) {
        throw new GuidedModelError(parsed.error.issues[0]?.message ?? "Output validation failed");
      }

      return {
        output: parsed.data,
        summary: toSummary(mode, parsed.data)
      };
    } catch (error) {
      lastError = error;
      if (attempt === 1) {
        throw lastError;
      }
    }
  }

  throw lastError;
}

export function extractActions(mode: GuidedMode, output: GuidedStructuredOutput): string[] {
  const candidates: string[] = [];
  switch (mode) {
    case "clarity":
      candidates.push((output as z.infer<typeof claritySchema>).next_step);
      break;
    case "plan": {
      const plan = output as z.infer<typeof planSchema>;
      candidates.push(plan.first_action, ...plan.steps);
      break;
    }
    case "focus": {
      const focus = output as z.infer<typeof focusSchema>;
      candidates.push(focus.focus_task, `Work for ${focus.duration} on ${focus.focus_task}`, `Stop when: ${focus.definition_of_done}`);
      break;
    }
    case "decision": {
      const decision = output as z.infer<typeof decisionSchema>;
      candidates.push(decision.recommendation, `Decide using: ${decision.criteria[0] ?? "top priority"}`);
      break;
    }
  }

  return candidates
    .map(normalizeAction)
    .filter(isActionable)
    .slice(0, 3);
}
