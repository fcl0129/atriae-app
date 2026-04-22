"use server";

import { revalidatePath } from "next/cache";

import { completeRitualSchema, ritualCreateSchema } from "@/lib/atriae/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase is not configured.");
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return { supabase, user };
}

export async function createRitualAction(formData: FormData) {
  const payload = ritualCreateSchema.parse({
    title: formData.get("title"),
    cadence: formData.get("cadence"),
    prompt: formData.get("prompt")
  });

  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("rituals").insert({
    user_id: user.id,
    title: payload.title,
    cadence: payload.cadence || null,
    prompt: payload.prompt || null
  });

  if (error) throw new Error(error.message);

  revalidatePath("/rituals");
  revalidatePath("/dashboard");
}

export async function completeRitualAction(formData: FormData) {
  const payload = completeRitualSchema.parse({ ritualId: formData.get("ritual_id") });

  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("ritual_checkins").insert({
    ritual_id: payload.ritualId,
    user_id: user.id
  });

  if (error) throw new Error(error.message);

  revalidatePath("/rituals");
  revalidatePath("/dashboard");
}
