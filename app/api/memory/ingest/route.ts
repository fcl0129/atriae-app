import { NextResponse } from "next/server";
import { ZodError } from "zod";

import {
  ModelOutputError,
  ModelValidationError,
  OpenAIConfigError,
  OpenAIRequestError,
  OpenAITimeoutError
} from "@/lib/ai/intelligence";
import { structureMemoryInput } from "@/lib/ai/memory";
import { SUPABASE_PUBLIC_ENV_ERROR } from "@/lib/env";
import { memoryIngestRequestSchema } from "@/lib/memory/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

type MemoryErrorCode =
  | "SUPABASE_CONFIG_MISSING"
  | "SESSION_MISSING"
  | "INVALID_INPUT"
  | "MEMORY_SAVE_FAILED"
  | "OPENAI_CONFIG_MISSING"
  | "OPENAI_TIMEOUT"
  | "OPENAI_REQUEST_FAILED"
  | "MODEL_OUTPUT_MALFORMED"
  | "MODEL_OUTPUT_INVALID"
  | "UNKNOWN_SERVER_ERROR";

function getRequestId() {
  return typeof crypto?.randomUUID === "function" ? crypto.randomUUID() : `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function jsonError(requestId: string, code: MemoryErrorCode, message: string, status: number, retryable = false) {
  return NextResponse.json({ error: { code, message, retryable }, request_id: requestId }, { status });
}

function mapOpenAIErrorToMessage(error: OpenAIRequestError) {
  const msg = (error.message || "").toLowerCase();

  if (msg.includes("rate") || error.code === "rate_limit_exceeded") {
    return "Atriae Memory is receiving a lot right now. Please try again shortly.";
  }

  if (msg.includes("api key") || msg.includes("unauthorized")) {
    return "Atriae Memory is not correctly configured. Please check the API key.";
  }

  if (msg.includes("model")) {
    return "Atriae Memory is adjusting its model configuration. Please retry in a moment.";
  }

  return "Atriae couldn’t reach memory intelligence right now. Please retry shortly.";
}

export async function POST(request: Request) {
  const requestId = getRequestId();

  try {
    const rawBody = await request.json().catch(() => null);
    const parsed = memoryIngestRequestSchema.safeParse(rawBody);

    if (!parsed.success) {
      return jsonError(requestId, "INVALID_INPUT", "Share a note with Atriae before saving it to Memory.", 400);
    }

    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return jsonError(requestId, "SUPABASE_CONFIG_MISSING", SUPABASE_PUBLIC_ENV_ERROR, 503);
    }

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return jsonError(requestId, "SESSION_MISSING", "Your private memory session has ended. Please sign in again.", 401);
    }

    const occurredAt = parsed.data.occurred_at ?? new Date().toISOString();
    const title = parsed.data.title?.trim() || null;

    const { data: source, error: sourceError } = await supabase
      .from("memory_sources")
      .insert({
        user_id: user.id,
        source_type: parsed.data.source_type,
        title,
        occurred_at: occurredAt,
        metadata: {
          ingest_version: 1,
          text_length: parsed.data.text.length
        }
      })
      .select("*")
      .single();

    if (sourceError || !source) {
      return jsonError(requestId, "MEMORY_SAVE_FAILED", "Atriae couldn’t open a private memory source for this note.", 500, true);
    }

    const structured = await structureMemoryInput({
      source_type: parsed.data.source_type,
      title,
      text: parsed.data.text,
      occurred_at: occurredAt
    });

    const rows = structured.blocks.map((block) => ({
      user_id: user.id,
      source_id: source.id,
      block_type: block.block_type,
      title: block.title,
      summary: block.summary,
      content: block.content,
      importance: block.importance,
      tags: block.tags,
      occurred_at: occurredAt
    }));

    const { data: blocks, error: blocksError } = await supabase.from("memory_blocks").insert(rows).select("*");

    if (blocksError || !blocks) {
      return jsonError(requestId, "MEMORY_SAVE_FAILED", "Atriae shaped the note, but couldn’t save the memory blocks.", 500, true);
    }

    await supabase
      .from("memory_sources")
      .update({
        metadata: {
          ingest_version: 1,
          text_length: parsed.data.text.length,
          block_count: blocks.length,
          decisions: structured.decisions,
          people: structured.people,
          follow_ups: structured.follow_ups
        }
      })
      .eq("id", source.id)
      .eq("user_id", user.id);

    return NextResponse.json({ source, blocks, request_id: requestId }, { status: 201 });
  } catch (error) {
    if (error instanceof OpenAIConfigError) {
      return jsonError(requestId, "OPENAI_CONFIG_MISSING", "Add OPENAI_API_KEY before Atriae can structure memory.", 503);
    }

    if (error instanceof OpenAITimeoutError) {
      return jsonError(requestId, "OPENAI_TIMEOUT", "Atriae Memory is taking longer than expected. Try again.", 504, true);
    }

    if (error instanceof OpenAIRequestError) {
      return jsonError(requestId, "OPENAI_REQUEST_FAILED", mapOpenAIErrorToMessage(error), 502, true);
    }

    if (error instanceof ModelOutputError) {
      return jsonError(requestId, "MODEL_OUTPUT_MALFORMED", "Atriae Memory produced an unexpected shape. Try again.", 502, true);
    }

    if (error instanceof ModelValidationError || error instanceof ZodError) {
      return jsonError(requestId, "MODEL_OUTPUT_INVALID", "Atriae Memory generated incomplete blocks. Try again.", 502, true);
    }

    return jsonError(requestId, "UNKNOWN_SERVER_ERROR", "Atriae couldn’t save this memory yet.", 500, true);
  }
}
