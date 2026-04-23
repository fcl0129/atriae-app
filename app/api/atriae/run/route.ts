import { NextResponse } from "next/server";

import {
  extractActions,
  generateGuidedSystemOutput,
  GuidedModelError,
  guidedRunRequestSchema,
  type GuidedMode
} from "@/lib/ai/guided-system";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function getTitle(mode: GuidedMode, input: string) {
  const preview = input.trim().replace(/\s+/g, " ").slice(0, 72);
  return `${mode}: ${preview}${preview.length >= 72 ? "…" : ""}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = guidedRunRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
    }

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { mode, input } = parsed.data;
    let sessionId = parsed.data.sessionId;

    if (sessionId) {
      const { data: existingSession, error: sessionError } = await supabase
        .from("sessions")
        .select("id")
        .eq("id", sessionId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (sessionError) {
        console.error("[atriae.run] session lookup failed", sessionError);
        return NextResponse.json({ error: "Failed to load session." }, { status: 500 });
      }

      if (!existingSession) {
        return NextResponse.json({ error: "Session not found." }, { status: 404 });
      }
    } else {
      const { data: createdSession, error: createError } = await supabase
        .from("sessions")
        .insert({ user_id: user.id, mode, title: getTitle(mode, input) })
        .select("id")
        .single();

      if (createError || !createdSession) {
        console.error("[atriae.run] session create failed", createError);
        return NextResponse.json({ error: "Failed to create session." }, { status: 500 });
      }

      sessionId = createdSession.id;
    }

    const { error: userMessageError } = await supabase.from("messages").insert({
      session_id: sessionId,
      role: "user",
      content: input,
      structured_payload: null
    });

    if (userMessageError) {
      console.error("[atriae.run] user message insert failed", userMessageError);
      return NextResponse.json({ error: "Failed to save user message." }, { status: 500 });
    }

    const generated = await generateGuidedSystemOutput(mode, input);

    const { error: assistantMessageError } = await supabase.from("messages").insert({
      session_id: sessionId,
      role: "assistant",
      content: generated.summary,
      structured_payload: generated.output
    });

    if (assistantMessageError) {
      console.error("[atriae.run] assistant message insert failed", assistantMessageError);
      return NextResponse.json({ error: "Failed to save assistant message." }, { status: 500 });
    }

    const actions = extractActions(mode, generated.output)
      .map((item) => item.trim())
      .filter(Boolean);

    if (actions.length > 0) {
      const { error: actionError } = await supabase
        .from("actions")
        .insert(actions.map((label) => ({ session_id: sessionId, label })));

      if (actionError) {
        console.error("[atriae.run] action insert failed", actionError);
      }
    }

    const { error: sessionUpdateError } = await supabase
      .from("sessions")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", sessionId)
      .eq("user_id", user.id);

    if (sessionUpdateError) {
      console.error("[atriae.run] session update failed", sessionUpdateError);
    }

    return NextResponse.json({ sessionId, mode, output: generated.output }, { status: 200 });
  } catch (error) {
    console.error("[atriae.run] request failed", error);

    if (error instanceof GuidedModelError) {
      return NextResponse.json({ error: "Could not generate structured output. Please retry." }, { status: 502 });
    }

    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
