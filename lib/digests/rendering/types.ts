import type { DigestModuleKey, ModuleConfig, UserDigestProfile } from "@/lib/digests/types";

export type DigestLayoutKey = "editorial_light" | "structured_brief" | "soft_reset";

export interface ModuleSourcePayload {
  sourceType: string;
  sourceLabel: string;
  sourceRef?: string;
  payload: Record<string, unknown>;
}

export interface NormalizedDigestModule {
  key: DigestModuleKey;
  title: string;
  kicker?: string;
  summary: string;
  bullets: string[];
  cta?: { label: string; href: string };
  sourcePayload: ModuleSourcePayload;
}

export interface DigestRenderContext {
  profile: UserDigestProfile;
  runDate: Date;
  locale: string;
  voice: UserDigestProfile["digest_config"]["voice"];
  length: UserDigestProfile["digest_config"]["length"];
  preview: boolean;
}

export interface DigestRenderResult {
  subjectLine: string;
  previewLine: string;
  html: string;
  text: string;
  layout: DigestLayoutKey;
  modules: NormalizedDigestModule[];
  sources: ModuleSourcePayload[];
  payload: Record<string, unknown>;
}

export interface ResolvedModule {
  key: DigestModuleKey;
  config: ModuleConfig;
}

export interface DigestRenderOptions {
  preview?: boolean;
  now?: Date;
  forceLayout?: DigestLayoutKey;
  moduleOverrides?: Partial<Record<DigestModuleKey, Record<string, unknown>>>;
}
