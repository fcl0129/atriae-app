import { z } from "zod";

import { DIGEST_MODULE_KEYS } from "@/lib/digests/types";

export const schedulingConfigSchema = z
  .object({
    timezone: z.string().min(1),
    cadence: z.enum(["daily", "weekly", "monthly", "custom"]),
    time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
    days: z.array(z.number().int().min(0).max(6)).optional(),
    dayOfMonth: z.number().int().min(1).max(31).optional(),
    intervalDays: z.number().int().min(1).max(90).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.cadence === "weekly" && (!value.days || value.days.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["days"],
        message: "Weekly schedules require at least one day.",
      });
    }

    if (value.cadence === "monthly" && !value.dayOfMonth) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dayOfMonth"],
        message: "Monthly schedules require a dayOfMonth.",
      });
    }

    if (value.cadence === "custom" && (!value.days || value.days.length === 0) && !value.intervalDays) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["days"],
        message: "Custom schedules require days or intervalDays.",
      });
    }
  });

export const moduleConfigSchema = z.object({
  module: z.enum(DIGEST_MODULE_KEYS),
  enabled: z.boolean().default(true),
  order: z.number().int().min(0).optional(),
  settings: z.record(z.string(), z.unknown()).default({}),
});

const baseDigestConfigSchema = z.object({
  voice: z.enum(["elegant", "editorial", "warm", "polished", "gentle", "uplifted", "clear", "smart"]),
  length: z.enum(["concise", "standard", "deep"]),
  delivery: z.literal("email"),
  locale: z.string().optional(),
});

export const digestTemplateConfigSchema = baseDigestConfigSchema;

export const userDigestConfigSchema = baseDigestConfigSchema.extend({
  includeSourceCredits: z.boolean().optional(),
  quietHours: z
    .object({
      start: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
      end: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
    })
    .optional(),
  personalization: z.record(z.string(), z.unknown()).optional(),
});

export const digestTemplateSchema = z.object({
  slug: z.string().min(2),
  display_name: z.string().min(2),
  strapline: z.string().optional(),
  description: z.string().optional(),
  ritual_type: z.enum(["ritual", "brief", "digest"]),
  scheduling_defaults: schedulingConfigSchema,
  config: digestTemplateConfigSchema,
  modules: z.array(moduleConfigSchema).min(1),
});

export const userDigestProfileSchema = z.object({
  template_id: z.string().uuid().nullable().optional(),
  title: z.string().min(2),
  timezone: z.string().min(1),
  status: z.enum(["active", "paused", "archived"]).default("active"),
  scheduling_config: schedulingConfigSchema,
  digest_config: userDigestConfigSchema,
  module_config: z.array(moduleConfigSchema),
});


export const digestTemplateInsertSchema = digestTemplateSchema.extend({
  created_by: z.string().uuid().nullable().optional(),
  is_system: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

export const userDigestProfileInsertSchema = userDigestProfileSchema.extend({
  user_id: z.string().uuid(),
});

export type SchedulingConfigInput = z.infer<typeof schedulingConfigSchema>;
export type ModuleConfigInput = z.infer<typeof moduleConfigSchema>;
export type DigestTemplateConfigInput = z.infer<typeof digestTemplateConfigSchema>;
export type UserDigestConfigInput = z.infer<typeof userDigestConfigSchema>;
