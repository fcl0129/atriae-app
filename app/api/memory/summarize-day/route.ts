import { NextResponse } from "next/server";
import { z, ZodError } from "zod";

import {
  ModelOutputError,
  ModelValidationError,
  OpenAIConfigError,
  OpenAIRequestError,
  OpenAITimeoutError
} from "@/lib/ai/intelligence";
import { summarizeMemoryDay } from "@/lib/ai/memory";
import { SUPABASE_PUBLIC_ENV_ERROR } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const summarizeDayRequestSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
});

type MemorySummaryErrorCode =
  | "SUPABASE_CONFIG_MISSING"
  | "SESSION_MISSING"
  | "INVALID_INPUT"
  | "SUMMARY_SAVE_FAILED"
  | "OPENAI_CONFIG_MISSING"
  | "OPENAI_TIMEOUT"
  | "OPENAI_REQUEST_FAILED"
  | "MODEL_OUTPUT_MALFORMED"
  | "MODEL_OUTPUT_INVALID"
  | "UNKNOWN_SERVER_ERROR";

function getRequestId() {
  return typeof crypto?.randomUUID === "function" ? crypto.randomUUID() : `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function jsonError(requestId: string, code: MemorySummaryErrorCode, message: string, status: number, retryable = false) {
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

function getDayBounds(date: string) {
  const start = new Date(`${date}T00:00:00.000Z`);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start: start.toISOString(), end: end.toISOString() };
}

export async function POST(request: Request) {
  const requestId = getRequestId();

  try {
    const rawBody = await request.json().catch(() => ({}));
    const parsed = summarizeDayRequestSchema.safeParse(rawBody);

    if (!parsed.success) {
      return jsonError(requestId, "INVALID_INPUT", "Choose a valid day for Atriae to summarize.", 400);
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

    const date = parsed.data.date ?? new Date().toISOString().slice(0, 10);
    const { start, end } = getDayBounds(date);

    const { data: blocks, error: blocksError } = await supabase
      .from("memory_blocks")
      .select("*")
      .eq("user_id", user.id)
      .gte("occurred_at", start)
      .lt("occurred_at", end)
      .order("importance", { ascending: false })
      .order("occurred_at", { ascending: true });

    if (blocksError) {
      return jsonError(requestId, "SUMMARY_SAVE_FAILED", "Atriae couldn’t read today’s memory blocks.", 500, true);
    }

    if (!blocks || blocks.length === 0) {
      return NextResponse.json(
        {
          summary: null,
          empty: true,
          message: "No memory blocks are saved for this day yet. Capture a note when you’re ready.",
          request_id: requestId
        },
        { status: 200 }
      );
    }

    const summaryDraft = await summarizeMemoryDay({ date, blocks });

    const { data: summary, error: upsertError } = await supabase
      .from("memory_daily_summaries")
      .upsert(
        {
          user_id: user.id,
          summary_date: date,
          title: summaryDraft.title,
          narrative: summaryDraft.narrative,
          decisions: summaryDraft.decisions,
          open_loops: summaryDraft.open_loops,
          people: summaryDraft.people,
          follow_ups: summaryDraft.follow_ups,
          updated_at: new Date().toISOString()
        },
        { onConflict: "user_id,summary_date" }
      )
      .select("*")
      .single();

    if (upsertError || !summary) {
      return jsonError(requestId, "SUMMARY_SAVE_FAILED", "Atriae created the summary, but couldn’t save it.", 500, true);
    }

    return NextResponse.json({ summary, empty: false, request_id: requestId }, { status: 200 });
  } catch (error) {
    if (error instanceof OpenAIConfigError) {
      return jsonError(requestId, "OPENAI_CONFIG_MISSING", "Add OPENAI_API_KEY before Atriae can summarize memory.", 503);
    }

    if (error instanceof OpenAITimeoutError) {
      return jsonError(requestId, "OPENAI_TIMEOUT", "Atriae Memory is taking longer than expected. Try again.", 504, true);
    }

    if (error instanceof OpenAIRequestError) {
      return jsonError(requestId, "OPENAI_REQUEST_FAILED", mapOpenAIErrorToMessage(error), 502, true);
    }

    if (error instanceof ModelOutputError) {
      return jsonError(requestId, "MODEL_OUTPUT_MALFORMED", "Atriae Memory produced an unexpected summary shape. Try again.", 502, true);
    }

    if (error instanceof ModelValidationError || error instanceof ZodError) {
      return jsonError(requestId, "MODEL_OUTPUT_INVALID", "Atriae Memory generated an incomplete summary. Try again.", 502, true);
    }

    return jsonError(requestId, "UNKNOWN_SERVER_ERROR", "Atriae couldn’t summarize this day yet.", 500, true);
  }
}
