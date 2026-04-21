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
      return NextResponse.json({ text: "Invalid input." });
    }

    const supabase = await createServerSupabaseClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ text: "Please log in again." });
    }

    let apiKey: string;

    try {
      apiKey = assertOpenAIKey();
    } catch {
      return NextResponse.json({
        text: fallbackResponse(parsed.data.input)
      });
    }

    try {
      const client = new OpenAI({ apiKey });

      const response = await client.responses.create({
        model: "gpt-5.1",
        input: parsed.data.input
      });

      return NextResponse.json({
        text: response.output_text ?? fallbackResponse(parsed.data.input)
      });

    } catch (err) {
      console.error("OpenAI error:", err);

      return NextResponse.json({
        text: fallbackResponse(parsed.data.input)
      });
    }

  } catch (err) {
    console.error("Assistant fatal error:", err);

    return NextResponse.json({
      text: "Something went wrong, but you can keep going."
    });
  }
}
