import { z } from "zod";

export type AtriaeProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  display_name: string | null;
  morning_ritual_reminder: string | null;
  created_at: string;
};

export type LearningTopic = {
  id: string;
  user_id: string;
  name: string;
  resources_count: number;
  pace: string | null;
  progress: number;
  created_at: string;
};

export type Ritual = {
  id: string;
  user_id: string;
  title: string;
  cadence: string | null;
  prompt: string | null;
  created_at: string;
};

export type RitualCheckin = {
  id: string;
  ritual_id: string;
  user_id: string;
  completed_at: string;
};

export const profilePreferencesSchema = z.object({
  displayName: z.string().trim().min(1).max(80),
  morningRitualReminder: z.string().trim().min(1).max(40)
});

export const learningTopicCreateSchema = z.object({
  name: z.string().trim().min(1).max(120),
  pace: z.string().trim().max(60).optional().or(z.literal("")),
  resourcesCount: z.coerce.number().int().min(0).max(500).default(0),
  progress: z.coerce.number().int().min(0).max(100).default(0)
});

export const learningTopicUpdateSchema = z.object({
  id: z.string().uuid(),
  pace: z.string().trim().max(60).optional(),
  resourcesCount: z.coerce.number().int().min(0).max(500).optional(),
  progress: z.coerce.number().int().min(0).max(100).optional()
});

export const ritualCreateSchema = z.object({
  title: z.string().trim().min(1).max(120),
  cadence: z.string().trim().max(80).optional().or(z.literal("")),
  prompt: z.string().trim().max(300).optional().or(z.literal(""))
});

export const completeRitualSchema = z.object({
  ritualId: z.string().uuid()
});
