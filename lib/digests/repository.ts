import type { SupabaseClient } from "@supabase/supabase-js";

import {
  digestTemplateInsertSchema,
  userDigestProfileInsertSchema,
} from "@/lib/digests/schemas";
import type { Database, DigestRun, DigestSource, DigestTemplate, UserDigestProfile } from "@/lib/digests/types";

type PublicTables = Database["public"]["Tables"];
type TableName = keyof PublicTables;

type TableRow<T extends TableName> = PublicTables[T]["Row"];
type TableInsert<T extends TableName> = PublicTables[T]["Insert"];
type TableUpdate<T extends TableName> = PublicTables[T]["Update"];

export class DigestRepository {
  constructor(private readonly db: SupabaseClient<Database>) {}

  private table<T extends TableName>(name: T) {
    return this.db.from(name);
  }

  async listTemplates() {
    const { data, error } = await this.table("digest_templates")
      .select("*")
      .eq("is_active", true)
      .order("display_name", { ascending: true });

    if (error) throw error;
    return (data ?? []) as TableRow<"digest_templates">[];
  }

  async createTemplate(input: TableInsert<"digest_templates">) {
    const parsed = digestTemplateInsertSchema.parse(input);

    const { data, error } = await this.table("digest_templates")
      .insert(parsed as never)
      .select("*")
      .single();

    if (error) throw error;
    return data as DigestTemplate;
  }

  async createUserProfile(input: TableInsert<"user_digest_profiles">) {
    const parsed = userDigestProfileInsertSchema.parse(input);

    const { data, error } = await this.table("user_digest_profiles")
      .insert(parsed as never)
      .select("*")
      .single();

    if (error) throw error;
    return data as UserDigestProfile;
  }

  async listUserProfiles(userId: string) {
    const { data, error } = await this.table("user_digest_profiles")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data ?? []) as TableRow<"user_digest_profiles">[];
  }

  async updateUserProfile(profileId: string, updates: TableUpdate<"user_digest_profiles">) {
    const { data, error } = await this.table("user_digest_profiles")
      .update(updates as never)
      .eq("id", profileId)
      .select("*")
      .single();

    if (error) throw error;
    return data as UserDigestProfile;
  }

  async createRun(input: TableInsert<"digest_runs">) {
    const { data, error } = await this.table("digest_runs")
      .insert(input as never)
      .select("*")
      .single();

    if (error) throw error;
    return data as DigestRun;
  }



  async updateRun(runId: string, updates: TableUpdate<"digest_runs">) {
    const { data, error } = await this.table("digest_runs")
      .update(updates as never)
      .eq("id", runId)
      .select("*")
      .single();

    if (error) throw error;
    return data as DigestRun;
  }

  async createSource(input: TableInsert<"digest_sources">) {
    const { data, error } = await this.table("digest_sources")
      .insert(input as never)
      .select("*")
      .single();

    if (error) throw error;
    return data as DigestSource;
  }

  async createSources(inputs: TableInsert<"digest_sources">[]) {
    if (inputs.length === 0) return [] as DigestSource[];

    const { data, error } = await this.table("digest_sources")
      .insert(inputs as never)
      .select("*");

    if (error) throw error;
    return (data ?? []) as DigestSource[];
  }

  async listRunsForProfile(profileId: string) {
    const { data, error } = await this.table("digest_runs")
      .select("*")
      .eq("profile_id", profileId)
      .order("scheduled_for", { ascending: false });

    if (error) throw error;
    return (data ?? []) as TableRow<"digest_runs">[];
  }
}
