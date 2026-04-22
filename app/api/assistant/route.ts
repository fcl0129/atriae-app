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

function safeJsonText(text: string) {
  return NextResponse.json({ text });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return safeJsonText("Please share one clear thought so Atriae can help you shape it.");
    }

    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return safeJsonText(fallbackResponse(parsed.data.input));
    }
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return safeJsonText("Your session appears to be inactive. Please sign in again.");
    }

    let apiKey: string;

    try {
      apiKey = assertOpenAIKey();
    } catch {
      return safeJsonText(fallbackResponse(parsed.data.input));
    }

    try {
      const modePrefix = parsed.data.mode ? `Mode: ${parsed.data.mode}\n\n` : "";
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-5.1",
          input: `${modePrefix}${parsed.data.input}`
        })
      });

      if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        console.error("OpenAI error response:", response.status, errorBody);
        return safeJsonText(fallbackResponse(parsed.data.input));
      }

      const data = (await response.json().catch(() => null)) as { output_text?: unknown } | null;
      const text = typeof data?.output_text === "string" ? data.output_text.trim() : "";

      return safeJsonText(text || fallbackResponse(parsed.data.input));

    } catch (err) {
      console.error("OpenAI error:", err);

      return safeJsonText(fallbackResponse(parsed.data.input));
    }

  } catch (err) {
    console.error("Assistant fatal error:", err);

    return safeJsonText("Atriae hit a temporary issue, but you can keep moving with one small next step.");
  }
}
