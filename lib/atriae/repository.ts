import type { SupabaseClient } from "@supabase/supabase-js";

import type { AtriaeProfile, LearningTopic, Ritual } from "@/lib/atriae/types";

export class AtriaeRepository {
  constructor(private readonly db: SupabaseClient) {}

  async getProfile(userId: string) {
    const { data, error } = await this.db.from("profiles").select("*").eq("id", userId).maybeSingle();
    if (error) throw error;
    return (data ?? null) as AtriaeProfile | null;
  }

  async upsertProfile(profile: Pick<AtriaeProfile, "id" | "display_name" | "morning_ritual_reminder">) {
    const { data, error } = await this.db
      .from("profiles")
      .upsert(profile)
      .select("*")
      .single();

    if (error) throw error;
    return data as AtriaeProfile;
  }

  async listLearningTopics(userId: string) {
    const { data, error } = await this.db
      .from("learning_topics")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as LearningTopic[];
  }

  async listRituals(userId: string) {
    const { data, error } = await this.db.from("rituals").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as Ritual[];
  }
}
