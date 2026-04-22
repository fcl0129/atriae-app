import { NextResponse } from "next/server";
import { ZodError } from "zod";

import {
  generateIntelligenceResponse,
  intelligenceRequestSchema,
  type IntelligenceResponse
} from "@/lib/ai/intelligence";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type ErrorBody = {
  error: string;
};

function jsonError(message: string, status: number) {
  return NextResponse.json<ErrorBody>({ error: message }, { status });
}

function sanitizeForLog(value: unknown) {
  if (!value || typeof value !== "object") return value;
  const clone = { ...(value as Record<string, unknown>) };
  if (typeof clone.input === "string") {
    clone.input = `${clone.input.slice(0, 120)}${clone.input.length > 120 ? "…" : ""}`;
  }
  return clone;
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return jsonError("Atriae is temporarily unavailable. Please try again shortly.", 503);
    }

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return jsonError("Your session has ended. Please sign in and try again.", 401);
    }

    const rawBody = await request.json().catch(() => null);
    const parsed = intelligenceRequestSchema.safeParse(rawBody);

    if (!parsed.success) {
      return jsonError("Please enter a thought or question so Atriae can help shape it.", 400);
    }

    const result: IntelligenceResponse = await generateIntelligenceResponse(parsed.data);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return jsonError("Atriae generated an invalid response. Please retry in a moment.", 502);
    }

    console.error("/api/intelligence failure", sanitizeForLog(error));
    return jsonError("Atriae couldn’t shape this request right now. Please try again.", 500);
  }
}
