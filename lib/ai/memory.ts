import OpenAI from "openai";
import { z } from "zod";

import { assertOpenAIKey } from "@/lib/env/openai";
import {
  dailySummarySchema,
  memoryBlockTypeSchema,
  type MemoryBlock,
  type MemoryDailySummary,
  type MemorySourceType
} from "@/lib/memory/types";
import {
  ModelOutputError,
  ModelValidationError,
  OpenAIConfigError,
  OpenAIRequestError,
  OpenAITimeoutError
} from "@/lib/ai/intelligence";

export type StructuredMemoryBlock = Pick<MemoryBlock, "block_type" | "title" | "summary" | "content" | "importance" | "tags">;

type MemoryStructuringInput = {
  source_type: MemorySourceType;
  title?: string | null;
  text: string;
  occurred_at: string;
};

type DailyMemorySummaryInput = {
  date: string;
  blocks: Array<Pick<MemoryBlock, "block_type" | "title" | "summary" | "content" | "importance" | "tags" | "occurred_at">>;
};

type OpenAIErrorMeta = {
  status?: number;
  code?: string;
  type?: string;
};

const primaryModel = process.env.OPENAI_MEMORY_MODEL?.trim() || process.env.OPENAI_INTELLIGENCE_MODEL?.trim() || "gpt-4.1-mini";
const fallbackModels = Array.from(new Set([primaryModel, "gpt-4o-mini"]));
const requestTimeoutMs = 25_000;

const generatedMemoryBlocksSchema = dailySummarySchema.pick({ decisions: true, people: true, follow_ups: true }).extend({
  blocks: z
    .array(
      z.object({
        block_type: memoryBlockTypeSchema,
        title: z.string().trim().min(1).max(120),
        summary: z.string().trim().min(1).max(700),
        content: z.string().trim().nullable(),
        importance: z.number().int().min(1).max(5),
        tags: z.array(z.string().trim().min(1).max(32)).max(8)
      })
    )
    .min(1)
    .max(18)
});

type GeneratedMemoryBlocks = {
  blocks: StructuredMemoryBlock[];
  decisions: string[];
  people: string[];
  follow_ups: string[];
};

function buildIngestSystemPrompt() {
  return `You are Atriae Memory, a private memory structuring layer for a calm editorial personal system.

Your job:
- Classify user-provided text into useful memory blocks.
- Extract decisions, follow-ups/tasks, and people explicitly mentioned.
- Produce concise summaries in a steady, human voice.
- Preserve privacy and factual boundaries.

Rules:
- Return JSON only matching the required schema.
- Never invent facts, names, dates, or commitments that are not in the input.
- If something is uncertain, phrase it as uncertain or omit it.
- Prefer fewer, higher-signal blocks over noisy fragmentation.
- Use importance 1-5 where 5 is unusually important and 2 is normal.
- Tags should be short lowercase labels without # symbols.
- Avoid hype, therapy language, or corporate productivity clichés.`;
}

function buildDailySummarySystemPrompt() {
  return `You are Atriae Memory, creating a private daily memory summary from saved memory blocks.

Output requirements:
- Return JSON only matching the required schema.
- Create a calm concise title and narrative.
- Extract decisions, open loops, people, and follow-ups only from the provided blocks.
- Never invent details or assume unstated intent.
- Keep the tone quiet, editorial, and useful for returning to the day later.`;
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timeoutId: NodeJS.Timeout | null = null;

  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timeoutId = setTimeout(() => reject(new OpenAITimeoutError()), timeoutMs);
      })
    ]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

let openaiClient: OpenAI | null = null;

function getOpenAIClient() {
  if (openaiClient) return openaiClient;

  try {
    openaiClient = new OpenAI({ apiKey: assertOpenAIKey() });
  } catch (error) {
    if (error instanceof Error && error.message.includes("OPENAI_API_KEY")) {
      throw new OpenAIConfigError();
    }
    throw error;
  }

  return openaiClient;
}

function extractJsonText(response: unknown): string {
  if (!response || typeof response !== "object") {
    throw new ModelOutputError("OpenAI returned an empty payload");
  }

  const directOutputText = (response as { output_text?: unknown }).output_text;
  if (typeof directOutputText === "string" && directOutputText.trim()) {
    return directOutputText.trim();
  }

  const output = (response as { output?: unknown }).output;
  if (Array.isArray(output)) {
    for (const item of output) {
      if (!item || typeof item !== "object") continue;
      const content = (item as { content?: unknown }).content;
      if (!Array.isArray(content)) continue;

      for (const chunk of content) {
        if (!chunk || typeof chunk !== "object") continue;
        const text = (chunk as { text?: unknown }).text;
        if (typeof text === "string" && text.trim()) {
          return text.trim();
        }
      }
    }
  }

  throw new ModelOutputError("OpenAI returned no text output");
}

function safeParseJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    const fencedMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (!fencedMatch?.[1]) {
      throw new ModelOutputError("Model output was not valid JSON");
    }

    try {
      return JSON.parse(fencedMatch[1].trim());
    } catch {
      throw new ModelOutputError("Model output could not be parsed as JSON");
    }
  }
}

function toOpenAIRequestError(error: unknown): OpenAIRequestError {
  if (error instanceof OpenAIRequestError) return error;
  if (error instanceof OpenAITimeoutError || error instanceof OpenAIConfigError) throw error;

  if (error && typeof error === "object") {
    const maybeError = error as {
      message?: unknown;
      status?: unknown;
      code?: unknown;
      type?: unknown;
      error?: { message?: unknown; code?: unknown; type?: unknown };
    };

    const message =
      typeof maybeError.message === "string"
        ? maybeError.message
        : typeof maybeError.error?.message === "string"
          ? maybeError.error.message
          : "Unknown OpenAI request failure";

    return new OpenAIRequestError(message, {
      status: typeof maybeError.status === "number" ? maybeError.status : undefined,
      code:
        typeof maybeError.code === "string"
          ? maybeError.code
          : typeof maybeError.error?.code === "string"
            ? maybeError.error.code
            : undefined,
      type:
        typeof maybeError.type === "string"
          ? maybeError.type
          : typeof maybeError.error?.type === "string"
            ? maybeError.error.type
            : undefined
    } satisfies OpenAIErrorMeta);
  }

  return new OpenAIRequestError("Unknown OpenAI request failure");
}

function shouldRetryWithFallback(error: OpenAIRequestError, model: string) {
  if (model === "gpt-4o-mini") return false;
  const combined = `${error.message} ${error.code ?? ""} ${error.type ?? ""}`.toLowerCase();
  return combined.includes("model") || combined.includes("unsupported") || combined.includes("not found");
}

function memoryBlocksJsonSchema() {
  return {
    type: "object",
    additionalProperties: false,
    properties: {
      blocks: {
        type: "array",
        minItems: 1,
        maxItems: 18,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            block_type: { type: "string", enum: memoryBlockTypeSchema.options },
            title: { type: "string" },
            summary: { type: "string" },
            content: { type: ["string", "null"] },
            importance: { type: "integer", minimum: 1, maximum: 5 },
            tags: { type: "array", maxItems: 8, items: { type: "string" } }
          },
          required: ["block_type", "title", "summary", "content", "importance", "tags"]
        }
      },
      decisions: { type: "array", items: { type: "string" } },
      people: { type: "array", items: { type: "string" } },
      follow_ups: { type: "array", items: { type: "string" } }
    },
    required: ["blocks", "decisions", "people", "follow_ups"]
  };
}

function dailySummaryJsonSchema() {
  return {
    type: "object",
    additionalProperties: false,
    properties: {
      summary_date: { type: "string" },
      title: { type: "string" },
      narrative: { type: "string" },
      decisions: { type: "array", items: { type: "string" } },
      open_loops: { type: "array", items: { type: "string" } },
      people: { type: "array", items: { type: "string" } },
      follow_ups: { type: "array", items: { type: "string" } }
    },
    required: ["summary_date", "title", "narrative", "decisions", "open_loops", "people", "follow_ups"]
  };
}

async function createModelResponse(client: OpenAI, model: string, systemPrompt: string, payload: unknown, schemaName: string, schema: object) {
  return withTimeout(
    client.responses.create({
      model,
      input: [
        { role: "system", content: [{ type: "input_text", text: systemPrompt }] },
        { role: "user", content: [{ type: "input_text", text: JSON.stringify(payload) }] }
      ],
      text: {
        format: {
          type: "json_schema",
          name: schemaName,
          strict: true,
          schema
        }
      }
    } as never),
    requestTimeoutMs
  );
}

async function runMemoryModel(systemPrompt: string, payload: unknown, schemaName: string, schema: object) {
  const client = getOpenAIClient();
  let response: unknown = null;
  let lastRequestError: OpenAIRequestError | null = null;

  for (const model of fallbackModels) {
    try {
      response = await createModelResponse(client, model, systemPrompt, payload, schemaName, schema);
      lastRequestError = null;
      break;
    } catch (error) {
      const normalizedError = toOpenAIRequestError(error);
      lastRequestError = normalizedError;
      if (!shouldRetryWithFallback(normalizedError, model)) throw normalizedError;
    }
  }

  if (lastRequestError) throw lastRequestError;
  return safeParseJson(extractJsonText(response));
}

export async function structureMemoryInput(payload: MemoryStructuringInput): Promise<GeneratedMemoryBlocks> {
  const parsedJson = await runMemoryModel(
    buildIngestSystemPrompt(),
    payload,
    "atriae_memory_blocks",
    memoryBlocksJsonSchema()
  );

  const parsed = generatedMemoryBlocksSchema.safeParse(parsedJson);
  if (!parsed.success) {
    throw new ModelValidationError(parsed.error.issues[0]?.message ?? "Invalid memory blocks response");
  }

  return {
    blocks: parsed.data.blocks.map((block) => ({
      block_type: block.block_type,
      title: block.title.trim(),
      summary: block.summary.trim(),
      content: block.content?.trim() || null,
      importance: block.importance,
      tags: block.tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean).slice(0, 8)
    })),
    decisions: parsed.data.decisions.map((item) => item.trim()).filter(Boolean),
    people: parsed.data.people.map((item) => item.trim()).filter(Boolean),
    follow_ups: parsed.data.follow_ups.map((item) => item.trim()).filter(Boolean)
  };
}

export async function summarizeMemoryDay(payload: DailyMemorySummaryInput): Promise<MemoryDailySummary> {
  const parsedJson = await runMemoryModel(
    buildDailySummarySystemPrompt(),
    payload,
    "atriae_daily_memory_summary",
    dailySummaryJsonSchema()
  );

  const parsed = dailySummarySchema.safeParse(parsedJson);
  if (!parsed.success) {
    throw new ModelValidationError(parsed.error.issues[0]?.message ?? "Invalid daily memory summary response");
  }

  return {
    summary_date: payload.date,
    title: parsed.data.title.trim(),
    narrative: parsed.data.narrative.trim(),
    decisions: parsed.data.decisions.map((item) => item.trim()).filter(Boolean),
    open_loops: parsed.data.open_loops.map((item) => item.trim()).filter(Boolean),
    people: parsed.data.people.map((item) => item.trim()).filter(Boolean),
    follow_ups: parsed.data.follow_ups.map((item) => item.trim()).filter(Boolean)
  };
}
