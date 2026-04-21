import type { SupabaseClient } from "@supabase/supabase-js";

import {
  digestTemplateInsertSchema,
  userDigestProfileInsertSchema,
} from "@/lib/digests/schemas";
import type { Database, DigestRun, DigestTemplate, UserDigestProfile } from "@/lib/digests/types";

export class DigestRepository {
  constructor(private readonly db: SupabaseClient<Database>) {}

  async listTemplates() {
    const client = this.db as any;
    const { data, error } = await client
      .from("digest_templates")
      .select("*")
      .eq("is_active", true)
      .order("display_name", { ascending: true });

    if (error) throw error;
    return data ?? [];
  }

  async createTemplate(input: Database["public"]["Tables"]["digest_templates"]["Insert"]) {
    const parsed = digestTemplateInsertSchema.parse(input);
    const client = this.db as any;
    const { data, error } = await client
      .from("digest_templates")
      .insert(parsed)
      .select("*")
      .single();

    if (error) throw error;
    return data as DigestTemplate;
  }

  async createUserProfile(input: Database["public"]["Tables"]["user_digest_profiles"]["Insert"]) {
    const parsed = userDigestProfileInsertSchema.parse(input);

    const client = this.db as any;
    const { data, error } = await client
      .from("user_digest_profiles")
      .insert(parsed)
      .select("*")
      .single();

    if (error) throw error;
    return data as UserDigestProfile;
  }

  async listUserProfiles(userId: string) {
    const client = this.db as any;
    const { data, error } = await client
      .from("user_digest_profiles")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  }

  async updateUserProfile(
    profileId: string,
    updates: Database["public"]["Tables"]["user_digest_profiles"]["Update"],
  ) {
    const client = this.db as any;
    const { data, error } = await client
      .from("user_digest_profiles")
      .update(updates)
      .eq("id", profileId)
      .select("*")
      .single();

    if (error) throw error;
    return data as UserDigestProfile;
  }

  async createRun(input: Database["public"]["Tables"]["digest_runs"]["Insert"]) {
    const client = this.db as any;
    const { data, error } = await client
      .from("digest_runs")
      .insert(input)
      .select("*")
      .single();

    if (error) throw error;
    return data as DigestRun;
  }

  async listRunsForProfile(profileId: string) {
    const client = this.db as any;
    const { data, error } = await client
      .from("digest_runs")
      .select("*")
      .eq("profile_id", profileId)
      .order("scheduled_for", { ascending: false });

    if (error) throw error;
    return data ?? [];
  }
}
