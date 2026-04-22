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
import { createServerSupabaseClient } from "@/lib/supabase/server";

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

type ErrorBody = {
  error: {
    code: IntelligenceErrorCode;
    message: string;
    retryable: boolean;
  };
  request_id: string;
};

function getRequestId() {
  return typeof crypto?.randomUUID === "function"
    ? crypto.randomUUID()
    : `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function jsonError(
  requestId: string,
  code: IntelligenceErrorCode,
  message: string,
  status: number,
  retryable = false
) {
  return NextResponse.json<ErrorBody>(
    {
      error: { code, message, retryable },
      request_id: requestId
    },
    { status }
  );
}

function toSafeError(error: unknown) {
  if (error instanceof Error) {
    return { name: error.name, message: error.message };
  }

  return { value: String(error) };
}

function truncateInputForLog(input: unknown) {
  if (typeof input !== "string") return null;
  const compact = input.trim().replace(/\s+/g, " ");
  return `${compact.slice(0, 80)}${compact.length > 80 ? "…" : ""}`;
}

function logIntelligenceError(
  requestId: string,
  stage: string,
  detail: Record<string, unknown>,
  error?: unknown
) {
  console.error("[intelligence] failure", {
    requestId,
    stage,
    ...detail,
    ...(error ? { error: toSafeError(error) } : {})
  });
}

export async function POST(request: Request) {
  const requestId = getRequestId();
  let inputPreview: string | null = null;
  let inputLength: number | null = null;

  try {
    const rawBody = await request.json().catch(() => null);
    const parsed = intelligenceRequestSchema.safeParse(rawBody);

    if (!parsed.success) {
      logIntelligenceError(requestId, "request_validation", {
        hasBody: Boolean(rawBody),
        issues: parsed.error.issues.length
      });
      return jsonError(
        requestId,
        "INVALID_INPUT",
        "Please enter a thought or question so Atriae can help shape it.",
        400,
        false
      );
    }

    inputPreview = truncateInputForLog(parsed.data.input);
    inputLength = parsed.data.input.length;

    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      logIntelligenceError(requestId, "supabase_config", {
        hasUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
        hasAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
        mode: parsed.data.mode,
        inputLength
      });
      return jsonError(
        requestId,
        "SUPABASE_CONFIG_MISSING",
        "Atriae configuration is incomplete. Please set Supabase environment variables.",
        503,
        false
      );
    }

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      logIntelligenceError(requestId, "auth", {
        authError: authError?.message ?? null,
        userIdPresent: Boolean(user?.id),
        mode: parsed.data.mode,
        inputLength
      });
      return jsonError(
        requestId,
        "SESSION_MISSING",
        "Your session has ended. Please sign in and try again.",
        401,
        false
      );
    }

    const result: IntelligenceResponse = await generateIntelligenceResponse(parsed.data);
    return NextResponse.json({ ...result, request_id: requestId }, { status: 200 });
  } catch (error) {
    if (error instanceof OpenAIConfigError) {
      logIntelligenceError(requestId, "openai_config", { hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY), inputLength }, error);
      return jsonError(
        requestId,
        "OPENAI_CONFIG_MISSING",
        "Atriae intelligence is not configured. Add OPENAI_API_KEY in the server environment.",
        503,
        false
      );
    }

    if (error instanceof OpenAITimeoutError) {
      logIntelligenceError(requestId, "openai_timeout", { inputLength }, error);
      return jsonError(
        requestId,
        "OPENAI_TIMEOUT",
        "Atriae is taking longer than expected right now. Please try again in a moment.",
        504,
        true
      );
    }

    if (error instanceof OpenAIRequestError) {
      logIntelligenceError(requestId, "openai_request", { inputLength }, error);
      return jsonError(
        requestId,
        "OPENAI_REQUEST_FAILED",
        "Atriae couldn’t reach intelligence services right now. Please retry shortly.",
        502,
        true
      );
    }

    if (error instanceof ModelOutputError) {
      logIntelligenceError(requestId, "model_parse", { inputLength }, error);
      return jsonError(
        requestId,
        "MODEL_OUTPUT_MALFORMED",
        "Atriae produced an unexpected format this time. Please try again.",
        502,
        true
      );
    }

    if (error instanceof ModelValidationError || error instanceof ZodError) {
      logIntelligenceError(requestId, "model_validation", { inputLength }, error);
      return jsonError(
        requestId,
        "MODEL_OUTPUT_INVALID",
        "Atriae generated an incomplete response. Please retry.",
        502,
        true
      );
    }

    logIntelligenceError(
      requestId,
      "unknown",
      {
        inputPreview,
        inputLength
      },
      error
    );

    return jsonError(
      requestId,
      "UNKNOWN_SERVER_ERROR",
      "Atriae couldn’t shape this request right now. Please try again.",
      500,
      true
    );
  }
}
