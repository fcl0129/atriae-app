import { NextResponse } from "next/server";

import {
  detectMode,
  extractActions,
  generateGuidedSystemOutput,
  GuidedModelError,
  guidedRunRequestSchema,
  type GuidedMode
} from "@/lib/ai/guided-system";
import { SUPABASE_PUBLIC_ENV_ERROR } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function getTitle(mode: GuidedMode, input: string) {
  const preview = input.trim().replace(/\s+/g, " ").slice(0, 72);
  return `${mode}: ${preview}${preview.length >= 72 ? "…" : ""}`;
}

function hasStrongModeSignal(input: string, mode: GuidedMode) {
  const text = input.toLowerCase();
  const signalMap: Record<GuidedMode, RegExp> = {
    clarity: /\b(confused|overwhelmed|unclear|stuck|messy|can't think|not sure what matters)\b/,
    plan: /\b(plan|roadmap|steps|schedule|timeline|sequence|organize)\b/,
    focus: /\b(focus|distraction|start now|ship|execute|deep work|commit)\b/,
    decision: /\b(decide|choice|choose|option|tradeoff|pros and cons|which one)\b/
  };
  return signalMap[mode].test(text);
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
      return NextResponse.json({ error: SUPABASE_PUBLIC_ENV_ERROR }, { status: 503 });
    }

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { input } = parsed.data;
    let mode = parsed.data.mode;
    let sessionId = parsed.data.sessionId;
    let modeAutoDetected = false;
    let previousMode: GuidedMode | null = null;

    if (sessionId) {
      const { data: existingSession, error: sessionError } = await supabase
        .from("sessions")
        .select("id, mode")
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

      previousMode = existingSession.mode as GuidedMode;
    } else {
      if (!mode) {
        mode = await detectMode(input);
        modeAutoDetected = true;
      }

      const { data: createdSession, error: createError } = await supabase
        .from("sessions")
        .insert({ user_id: user.id, mode, title: getTitle(mode, input) })
        .select("id, mode")
        .single();

      if (createError || !createdSession) {
        console.error("[atriae.run] session create failed", createError);
        return NextResponse.json({ error: "Failed to create session." }, { status: 500 });
      }

      sessionId = createdSession.id;
      previousMode = createdSession.mode as GuidedMode;
    }

    if (!mode) {
      if (!previousMode) {
        mode = await detectMode(input);
      } else {
        const detectedMode = await detectMode(input);
        mode = hasStrongModeSignal(input, detectedMode) ? detectedMode : previousMode;
      }
      modeAutoDetected = true;
    } else if (sessionId && previousMode && mode !== previousMode) {
      modeAutoDetected = false;
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
      .update({ mode, updated_at: new Date().toISOString() })
      .eq("id", sessionId)
      .eq("user_id", user.id);

    if (sessionUpdateError) {
      console.error("[atriae.run] session update failed", sessionUpdateError);
    }

    return NextResponse.json({ sessionId, mode, output: generated.output, modeAutoDetected }, { status: 200 });
  } catch (error) {
    console.error("[atriae.run] request failed", error);

    if (error instanceof GuidedModelError) {
      return NextResponse.json({ error: "Could not generate structured output. Please retry." }, { status: 502 });
    }

    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
