"use server";

import { revalidatePath } from "next/cache";

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

export async function createLearningTopicAction(formData: FormData) {
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
}

export async function updateLearningTopicAction(formData: FormData) {
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
}
