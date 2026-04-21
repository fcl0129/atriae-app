import OpenAI from "openai";
import { NextResponse } from "next/server";
import { z } from "zod";

import { assertOpenAIKey } from "@/lib/env/openai";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const requestSchema = z.object({
  input: z.string().trim().min(1).max(3000),
  mode: z.enum(["learn", "plan", "focus", "organize"]).optional()
});

function fallbackResponse(input: string) {
  return `You wrote: "${input}"\n\nAtriae is not connected to its intelligence layer yet.\n\nInstead, try to:
- Break this into one clear next action
- Decide what matters most today
- Remove one distraction`
}

export async function POST(request: Request) {
  try {
    const parsed = requestSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    let apiKey: string | null = null;

    try {
      apiKey = assertOpenAIKey();
    } catch {
      return NextResponse.json({ text: fallbackResponse(parsed.data.input) });
    }

    const client = new OpenAI({ apiKey });

    const supabase = await createServerSupabaseClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await client.responses.create({
      model: "gpt-5.1",
      input: parsed.data.input
    });

    return NextResponse.json({ text: response.output_text ?? "" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown assistant error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
