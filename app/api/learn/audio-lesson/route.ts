import { NextResponse } from "next/server";
import { z } from "zod";

import { assertOpenAIKey } from "@/lib/env/openai";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const requestSchema = z.object({
  topic: z.string().trim().min(2).max(180),
  pace: z.string().trim().max(80).nullable().optional()
});

const responseSchema = z.object({
  title: z.string(),
  duration_minutes: z.number().int().min(3).max(8),
  intro: z.string(),
  segments: z.array(z.object({ title: z.string(), body: z.string() })).min(2).max(5),
  reflection_prompt: z.string()
});

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: { message: "Please provide a valid topic." } }, { status: 400 });
  }
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: { message: "Atriae auth is not configured yet. Please complete Supabase setup and retry." } }, { status: 503 });
  }
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: { message: "Your session has ended. Please sign in again." } }, { status: 401 });
  }

  try {
    const apiKey = assertOpenAIKey();
    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey });

    const completion = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: "You write calm, structured mini audio lessons for Atriae. Keep language clear, grounded, and concise." }]
        },
        {
          role: "user",
          content: [{ type: "input_text", text: `Create a 5-minute private lesson script for topic: ${parsed.data.topic}. Pace: ${parsed.data.pace ?? "steady"}.` }]
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "audio_lesson",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            required: ["title", "duration_minutes", "intro", "segments", "reflection_prompt"],
            properties: {
              title: { type: "string" },
              duration_minutes: { type: "number" },
              intro: { type: "string" },
              segments: {
                type: "array",
                minItems: 2,
                maxItems: 5,
                items: {
                  type: "object",
                  additionalProperties: false,
                  required: ["title", "body"],
                  properties: { title: { type: "string" }, body: { type: "string" } }
                }
              },
              reflection_prompt: { type: "string" }
            }
          }
        }
      }
    } as never);

    const output = completion.output_text ? JSON.parse(completion.output_text) : null;
    const lesson = responseSchema.parse(output);

    return NextResponse.json({ ...lesson, audio_url: null, audio_available: false }, { status: 200 });
  } catch {
    return NextResponse.json(
      {
        error: {
          message: "Atriae couldn't generate the audio lesson right now. Please try again in a moment, or use the text brief actions above."
        }
      },
      { status: 503 }
    );
  }
}
