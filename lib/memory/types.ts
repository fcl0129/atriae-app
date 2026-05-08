import { z } from "zod";

export const memorySourceTypeSchema = z.enum(["manual_note", "voice_note", "meeting", "email", "calendar", "import"]);
export const memoryBlockTypeSchema = z.enum([
  "summary",
  "decision",
  "task",
  "person",
  "meeting",
  "idea",
  "question",
  "follow_up",
  "reference"
]);

export const memoryIngestRequestSchema = z.object({
  source_type: memorySourceTypeSchema,
  title: z.string().trim().max(140).optional(),
  text: z.string().trim().min(1, "Atriae needs a note to remember.").max(16_000),
  occurred_at: z.string().datetime().optional()
});

export const memoryBlockSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  source_id: z.string().uuid().nullable(),
  block_type: memoryBlockTypeSchema,
  title: z.string().trim().min(1),
  summary: z.string().trim().min(1),
  content: z.string().nullable(),
  importance: z.number().int().min(1).max(5),
  tags: z.array(z.string()),
  occurred_at: z.string(),
  created_at: z.string()
});

export const memorySourceSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  source_type: memorySourceTypeSchema,
  title: z.string().nullable(),
  occurred_at: z.string(),
  metadata: z.record(z.string(), z.unknown()),
  created_at: z.string()
});

export const dailySummarySchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid().optional(),
  summary_date: z.string(),
  title: z.string().trim().min(1),
  narrative: z.string().trim().min(1),
  decisions: z.array(z.string()),
  open_loops: z.array(z.string()),
  people: z.array(z.string()),
  follow_ups: z.array(z.string()),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
});

export const memoryIngestResponseSchema = z.object({
  source: memorySourceSchema,
  blocks: z.array(memoryBlockSchema)
});

export type MemorySource = z.infer<typeof memorySourceSchema>;
export type MemoryBlock = z.infer<typeof memoryBlockSchema>;
export type MemoryDailySummary = z.infer<typeof dailySummarySchema>;
export type MemoryIngestRequest = z.infer<typeof memoryIngestRequestSchema>;
export type MemoryIngestResponse = z.infer<typeof memoryIngestResponseSchema>;
export type MemorySourceType = z.infer<typeof memorySourceTypeSchema>;
export type MemoryBlockType = z.infer<typeof memoryBlockTypeSchema>;
