"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import { learningTopicCreateSchema, learningTopicUpdateSchema } from "@/lib/atriae/types";
import { SUPABASE_PUBLIC_ENV_ERROR } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    throw new Error(SUPABASE_PUBLIC_ENV_ERROR);
  }
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return { supabase, user };
}

type LearnActionResult = { ok: true; message?: string } | { ok: false; error: string };

function toActionError(error: unknown): string {
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? "Please check your input and try again.";
  }
  if (error instanceof Error) {
    if (error.message === "Unauthorized") {
      return "Your session has ended. Please sign in again.";
    }
    if (error.message === SUPABASE_PUBLIC_ENV_ERROR) {
      return "Atriae auth is not configured. Add Supabase public environment variables.";
    }
    return error.message;
  }
  return "Something went wrong. Please try again.";
}

export async function createLearningTopicAction(formData: FormData) {
  try {
    const payload = learningTopicCreateSchema.parse({
      name: formData.get("name"),
      pace: formData.get("pace"),
      resourcesCount: formData.get("resources_count") || 0,
      progress: formData.get("progress") || 0
    });

    const { supabase, user } = await requireUser();

    const { error } = await supabase.from("learning_topics").insert({
      user_id: user.id,
      name: payload.name,
      pace: payload.pace || null,
      resources_count: payload.resourcesCount,
      progress: payload.progress
    });

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/learn");
    revalidatePath("/dashboard");
    return { ok: true, message: "Topic saved." } satisfies LearnActionResult;
  } catch (error) {
    return { ok: false, error: toActionError(error) } satisfies LearnActionResult;
  }
}

export async function updateLearningTopicAction(formData: FormData) {
  try {
    const payload = learningTopicUpdateSchema.parse({
      id: formData.get("id"),
      pace: formData.get("pace") || undefined,
      resourcesCount: formData.get("resources_count") || undefined,
      progress: formData.get("progress") || undefined
    });

    const { supabase, user } = await requireUser();

    const updates: Record<string, unknown> = {};
    if (payload.pace !== undefined) updates.pace = payload.pace;
    if (payload.resourcesCount !== undefined) updates.resources_count = payload.resourcesCount;
    if (payload.progress !== undefined) updates.progress = payload.progress;

    const { error } = await supabase.from("learning_topics").update(updates).eq("id", payload.id).eq("user_id", user.id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/learn");
    revalidatePath("/dashboard");
    return { ok: true, message: "Topic updated." } satisfies LearnActionResult;
  } catch (error) {
    return { ok: false, error: toActionError(error) } satisfies LearnActionResult;
  }
}

export async function deleteLearningTopicAction(topicId: string): Promise<LearnActionResult> {
  try {
    const { supabase, user } = await requireUser();
    const { error } = await supabase.from("learning_topics").delete().eq("id", topicId).eq("user_id", user.id);
    if (error) throw new Error(error.message);
    revalidatePath("/learn");
    revalidatePath("/dashboard");
    return { ok: true, message: "Topic deleted." };
  } catch (error) {
    return { ok: false, error: toActionError(error) };
  }
}

export async function saveLearningBriefAction(input: {
  topicId: string;
  mode: string;
  title: string;
  summary: string;
  sections: Array<{ heading: string; content: string }>;
  nextSteps: string[];
}): Promise<LearnActionResult> {
  try {
    const { supabase, user } = await requireUser();
    const { error } = await supabase.from("learning_briefs").insert({
      user_id: user.id,
      topic_id: input.topicId,
      mode: input.mode,
      title: input.title,
      summary: input.summary,
      sections: input.sections,
      next_steps: input.nextSteps
    });
    if (error) throw new Error(error.message);
    revalidatePath("/learn");
    return { ok: true, message: "Brief saved." };
  } catch (error) {
    return { ok: false, error: toActionError(error) };
  }
}
