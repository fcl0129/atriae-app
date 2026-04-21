export const DIGEST_MODULE_KEYS = [
  "top_headlines",
  "weather",
  "what_to_wear",
  "calendar_summary",
  "focus_block",
  "learn_something",
  "culture_pick",
  "series_tip",
  "film_tip",
  "book_tip",
  "music_pick",
  "podcast_pick",
  "sunday_reset_checklist",
  "meal_prep_tip",
  "social_nudge",
  "quote_reflection",
  "event_reminder",
  "free_text_custom_block",
] as const;

export type DigestModuleKey = (typeof DIGEST_MODULE_KEYS)[number];

export type RitualType = "ritual" | "brief" | "digest";
export type ProfileStatus = "active" | "paused" | "archived";
export type DigestRunStatus = "queued" | "rendering" | "sending" | "sent" | "failed";

export type DigestCadence = "daily" | "weekly" | "monthly" | "custom";

export interface SchedulingConfig {
  timezone: string;
  cadence: DigestCadence;
  time: string;
  days?: number[];
  dayOfMonth?: number;
  intervalDays?: number;
}

export interface ModuleConfig {
  module: DigestModuleKey;
  enabled?: boolean;
  order?: number;
  settings?: Record<string, unknown>;
}

export interface DigestTemplateConfig {
  voice: "elegant" | "editorial" | "warm" | "polished" | "gentle" | "uplifted" | "clear" | "smart";
  length: "concise" | "standard" | "deep";
  delivery: "email";
  locale?: string;
}

export interface UserDigestConfig extends DigestTemplateConfig {
  includeSourceCredits?: boolean;
  quietHours?: {
    start: string;
    end: string;
  };
  personalization?: Record<string, unknown>;
}

export interface DigestTemplate {
  id: string;
  slug: string;
  display_name: string;
  strapline: string | null;
  description: string | null;
  ritual_type: RitualType;
  is_system: boolean;
  is_active: boolean;
  created_by: string | null;
  scheduling_defaults: SchedulingConfig;
  config: DigestTemplateConfig;
  modules: ModuleConfig[];
  created_at: string;
  updated_at: string;
}

export interface UserDigestProfile {
  id: string;
  user_id: string;
  template_id: string | null;
  title: string;
  status: ProfileStatus;
  timezone: string;
  scheduling_config: SchedulingConfig;
  digest_config: UserDigestConfig;
  module_config: ModuleConfig[];
  last_run_at: string | null;
  next_run_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DigestSource {
  id: string;
  user_id: string;
  profile_id: string | null;
  source_type: string;
  source_label: string;
  source_ref: string | null;
  settings: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DigestRun {
  id: string;
  profile_id: string;
  user_id: string;
  status: DigestRunStatus;
  scheduled_for: string;
  started_at: string | null;
  completed_at: string | null;
  subject_line: string | null;
  preview_line: string | null;
  render_payload: Record<string, unknown>;
  delivery_meta: Record<string, unknown>;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      digest_templates: {
        Row: DigestTemplate;
        Insert: Omit<DigestTemplate, "id" | "created_at" | "updated_at"> &
          Partial<Pick<DigestTemplate, "id" | "created_at" | "updated_at">>;
        Update: Partial<Omit<DigestTemplate, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      user_digest_profiles: {
        Row: UserDigestProfile;
        Insert: Omit<UserDigestProfile, "id" | "created_at" | "updated_at"> &
          Partial<Pick<UserDigestProfile, "id" | "created_at" | "updated_at">>;
        Update: Partial<Omit<UserDigestProfile, "id" | "user_id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      digest_sources: {
        Row: DigestSource;
        Insert: Omit<DigestSource, "id" | "created_at" | "updated_at"> &
          Partial<Pick<DigestSource, "id" | "created_at" | "updated_at">>;
        Update: Partial<Omit<DigestSource, "id" | "user_id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      digest_runs: {
        Row: DigestRun;
        Insert: Omit<DigestRun, "id" | "created_at" | "updated_at"> &
          Partial<Pick<DigestRun, "id" | "created_at" | "updated_at">>;
        Update: Partial<Omit<DigestRun, "id" | "user_id" | "profile_id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      digest_run_status: DigestRunStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
