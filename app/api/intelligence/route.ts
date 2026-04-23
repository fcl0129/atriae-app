import { NextResponse } from "next/server";
import { ZodError } from "zod";

import {
  generateIntelligenceResponse,
  intelligenceRequestSchema,
  ModelOutputError,
  ModelValidationError,
  OpenAIConfigError,
  OpenAIRequestError,
  OpenAITimeoutError,
  type IntelligenceResponse
} from "@/lib/ai/intelligence";
import { SUPABASE_PUBLIC_ENV_ERROR } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

type IntelligenceErrorCode =
  | "SUPABASE_CONFIG_MISSING"
  | "SESSION_MISSING"
  | "INVALID_INPUT"
  | "OPENAI_CONFIG_MISSING"
  | "OPENAI_TIMEOUT"
  | "OPENAI_REQUEST_FAILED"
  | "MODEL_OUTPUT_MALFORMED"
  | "MODEL_OUTPUT_INVALID"
  | "UNKNOWN_SERVER_ERROR";

function getRequestId() {
  return typeof crypto?.randomUUID === "function"
    ? crypto.randomUUID()
    : `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function jsonError(requestId: string, code: IntelligenceErrorCode, message: string, status: number, retryable = false) {
  return NextResponse.json(
    {
      error: { code, message, retryable },
      request_id: requestId
    },
    { status }
  );
}

function mapOpenAIErrorToMessage(error: OpenAIRequestError) {
  const msg = (error.message || "").toLowerCase();

  if (msg.includes("rate") || error.code === "rate_limit_exceeded") {
    return "Atriae is receiving a lot of requests right now. Please try again shortly.";
  }

  if (msg.includes("api key") || msg.includes("unauthorized")) {
    return "Atriae intelligence is not correctly configured. Please check the API key.";
  }

  if (msg.includes("model")) {
    return "Atriae is adjusting its model configuration. Please retry in a moment.";
  }

  return "Atriae couldn’t reach intelligence services right now. Please retry shortly.";
}

export async function POST(request: Request) {
  const requestId = getRequestId();

  try {
    const rawBody = await request.json().catch(() => null);
    const parsed = intelligenceRequestSchema.safeParse(rawBody);

    if (!parsed.success) {
      return jsonError(requestId, "INVALID_INPUT", "Please enter a thought so Atriae can shape it.", 400);
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
      return jsonError(requestId, "SESSION_MISSING", "Your session has ended. Please sign in again.", 401);
    }

    const result: IntelligenceResponse = await generateIntelligenceResponse(parsed.data);
    return NextResponse.json({ ...result, request_id: requestId }, { status: 200 });
  } catch (error) {
    if (error instanceof OpenAIConfigError) {
      return jsonError(requestId, "OPENAI_CONFIG_MISSING", "Add OPENAI_API_KEY in your environment.", 503);
    }

    if (error instanceof OpenAITimeoutError) {
      return jsonError(requestId, "OPENAI_TIMEOUT", "Atriae is taking longer than expected. Try again.", 504, true);
    }

    if (error instanceof OpenAIRequestError) {
      return jsonError(requestId, "OPENAI_REQUEST_FAILED", mapOpenAIErrorToMessage(error), 502, true);
    }

    if (error instanceof ModelOutputError) {
      return jsonError(requestId, "MODEL_OUTPUT_MALFORMED", "Atriae produced an unexpected format. Try again.", 502, true);
    }

    if (error instanceof ModelValidationError || error instanceof ZodError) {
      return jsonError(requestId, "MODEL_OUTPUT_INVALID", "Atriae generated an incomplete response. Try again.", 502, true);
    }

    return jsonError(requestId, "UNKNOWN_SERVER_ERROR", "Atriae couldn’t process this request.", 500, true);
  }
}
