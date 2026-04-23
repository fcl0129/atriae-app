import OpenAI from "openai";
import { z } from "zod";

import { assertOpenAIKey } from "@/lib/env/openai";

export const guidedModeSchema = z.enum(["clarity", "plan", "focus", "decision"]);
export type GuidedMode = z.infer<typeof guidedModeSchema>;

export const guidedRunRequestSchema = z.object({
  sessionId: z.string().uuid().optional(),
  mode: guidedModeSchema,
  input: z.string().trim().min(1).max(4000)
});

const claritySchema = z.object({
  core_problem: z.string().trim().min(1),
  what_matters: z.array(z.string().trim().min(1)),
  what_doesnt_matter: z.array(z.string().trim().min(1)),
  next_step: z.string().trim().min(1)
});

const planSchema = z.object({
  goal: z.string().trim().min(1),
  steps: z.array(z.string().trim().min(1)),
  timeline: z.string().trim().min(1),
  first_action: z.string().trim().min(1)
});

const focusSchema = z.object({
  focus_task: z.string().trim().min(1),
  ignore: z.array(z.string().trim().min(1)),
  duration: z.string().trim().min(1),
  definition_of_done: z.string().trim().min(1)
});

const decisionSchema = z.object({
  options: z.array(z.string().trim().min(1)),
  criteria: z.array(z.string().trim().min(1)),
  risks: z.array(z.string().trim().min(1)),
  recommendation: z.string().trim().min(1),
  reasoning: z.string().trim().min(1)
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
        next_step: { type: "string" }
      },
      required: ["core_problem", "what_matters", "what_doesnt_matter", "next_step"]
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
        first_action: { type: "string" }
      },
      required: ["goal", "steps", "timeline", "first_action"]
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
        definition_of_done: { type: "string" }
      },
      required: ["focus_task", "ignore", "duration", "definition_of_done"]
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
        reasoning: { type: "string" }
      },
      required: ["options", "criteria", "risks", "recommendation", "reasoning"]
    }
  }
};

const modeInstructions: Record<GuidedMode, string> = {
  clarity: `CLARITY MODE\nReturn JSON with: core_problem, what_matters[], what_doesnt_matter[], next_step.\nIdentify the real issue, remove noise, and keep it concise and sharp.`,
  plan: `PLAN MODE\nReturn JSON with: goal, steps[], timeline, first_action.\nCreate a practical sequence with concrete action order.`,
  focus: `FOCUS MODE\nReturn JSON with: focus_task, ignore[], duration, definition_of_done.\nNarrow attention and define a crisp execution boundary.`,
  decision: `DECISION MODE\nReturn JSON with: options[], criteria[], risks[], recommendation, reasoning.\nCompare tradeoffs and produce a grounded recommendation.`
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
  switch (mode) {
    case "clarity":
      return [(output as z.infer<typeof claritySchema>).next_step];
    case "plan": {
      const plan = output as z.infer<typeof planSchema>;
      return [plan.first_action, ...plan.steps].filter(Boolean);
    }
    case "focus":
      return [(output as z.infer<typeof focusSchema>).focus_task];
    case "decision":
      return [(output as z.infer<typeof decisionSchema>).recommendation];
  }
}
