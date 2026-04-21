import OpenAI from "openai";
import type { ResponseCreateParamsBase } from "openai/resources/responses/responses";
import { NextResponse } from "next/server";
import { z } from "zod";

import { assertOpenAIKey } from "@/lib/env/openai";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const requestSchema = z.object({
  input: z.string().trim().min(1).max(3000),
  mode: z.enum(["learn", "plan", "focus", "organize"]).optional()
});

const TOOL_DEFS: ResponseCreateParamsBase["tools"] = [
  {
    type: "function",
    strict: true,
    name: "get_user_profile",
    description: "Get the authenticated user's profile and preferences.",
    parameters: { type: "object", properties: {}, additionalProperties: false }
  },
  {
    type: "function",
    strict: true,
    name: "get_learning_topics",
    description: "List the authenticated user's learning topics.",
    parameters: { type: "object", properties: {}, additionalProperties: false }
  },
  {
    type: "function",
    strict: true,
    name: "create_learning_topic",
    description: "Create a new learning topic.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string" },
        pace: { type: "string" },
        resources_count: { type: "integer", minimum: 0 },
        progress: { type: "integer", minimum: 0, maximum: 100 }
      },
      required: ["name"],
      additionalProperties: false
    }
  },
  {
    type: "function",
    strict: true,
    name: "get_rituals",
    description: "List the authenticated user's rituals.",
    parameters: { type: "object", properties: {}, additionalProperties: false }
  },
  {
    type: "function",
    strict: true,
    name: "create_ritual",
    description: "Create a ritual for the authenticated user.",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string" },
        cadence: { type: "string" },
        prompt: { type: "string" }
      },
      required: ["title"],
      additionalProperties: false
    }
  },
  {
    type: "function",
    strict: true,
    name: "complete_ritual",
    description: "Record a ritual completion check-in.",
    parameters: {
      type: "object",
      properties: {
        ritual_id: { type: "string", format: "uuid" }
      },
      required: ["ritual_id"],
      additionalProperties: false
    }
  },
  {
    type: "function",
    strict: true,
    name: "update_profile_preferences",
    description: "Update display name and morning reminder preferences.",
    parameters: {
      type: "object",
      properties: {
        display_name: { type: "string" },
        morning_ritual_reminder: { type: "string" }
      },
      additionalProperties: false
    }
  }
];

type ResponseFunctionCallItem = {
  type: "function_call";
  call_id: string;
  name: string;
  arguments: string;
};

type ResponseMessageItem = {
  type: "message";
  content?: Array<{ type?: string; text?: string }>;
};

type OpenAIResponse = {
  id?: string;
  output_text?: string;
  output?: Array<ResponseFunctionCallItem | ResponseMessageItem | { type?: string }>;
};

async function executeTool(supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>, userId: string, call: { name: string; arguments: string }) {
  const args = call.arguments ? JSON.parse(call.arguments) : {};

  switch (call.name) {
    case "get_user_profile": {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
      if (error) throw error;
      return data;
    }
    case "get_learning_topics": {
      const { data, error } = await supabase.from("learning_topics").select("*").eq("user_id", userId).order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    }
    case "create_learning_topic": {
      const { data, error } = await supabase
        .from("learning_topics")
        .insert({
          user_id: userId,
          name: String(args.name ?? "").trim(),
          pace: args.pace ? String(args.pace) : null,
          resources_count: Number.isInteger(args.resources_count) ? args.resources_count : 0,
          progress: Number.isInteger(args.progress) ? args.progress : 0
        })
        .select("*")
        .single();
      if (error) throw error;
      return data;
    }
    case "get_rituals": {
      const { data, error } = await supabase.from("rituals").select("*").eq("user_id", userId).order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    }
    case "create_ritual": {
      const { data, error } = await supabase
        .from("rituals")
        .insert({
          user_id: userId,
          title: String(args.title ?? "").trim(),
          cadence: args.cadence ? String(args.cadence) : null,
          prompt: args.prompt ? String(args.prompt) : null
        })
        .select("*")
        .single();
      if (error) throw error;
      return data;
    }
    case "complete_ritual": {
      const { data, error } = await supabase
        .from("ritual_checkins")
        .insert({ user_id: userId, ritual_id: String(args.ritual_id) })
        .select("*")
        .single();
      if (error) throw error;
      return data;
    }
    case "update_profile_preferences": {
      const updates: Record<string, string> = {};
      if (typeof args.display_name === "string") updates.display_name = args.display_name;
      if (typeof args.morning_ritual_reminder === "string") updates.morning_ritual_reminder = args.morning_ritual_reminder;
      const { data, error } = await supabase.from("profiles").update(updates).eq("id", userId).select("*").single();
      if (error) throw error;
      return data;
    }
    default:
      throw new Error(`Unsupported tool: ${call.name}`);
  }
}

function isFunctionCallItem(item: ResponseFunctionCallItem | ResponseMessageItem | { type?: string }): item is ResponseFunctionCallItem {
  return item.type === "function_call";
}

function isMessageItem(item: ResponseFunctionCallItem | ResponseMessageItem | { type?: string }): item is ResponseMessageItem {
  return item.type === "message";
}

function extractText(response: OpenAIResponse) {
  if (typeof response.output_text === "string" && response.output_text.length > 0) {
    return response.output_text;
  }

  const messages = (response.output ?? []).filter(isMessageItem);
  for (const msg of messages) {
    for (const part of msg.content ?? []) {
      if (part.type === "output_text" && typeof part.text === "string") return part.text;
      if (part.type === "text" && typeof part.text === "string") return part.text;
    }
  }

  return "I couldn't generate a complete response just now. Please try once more.";
}

const SYSTEM_INSTRUCTION = `You are the Atriae assistant.
Tone: calm, structured, reflective, concise, and practical.
Never be generic, chirpy, or pseudo-therapeutic.
Never fabricate data. If state is missing, say so clearly.
Prefer grounded recommendations based on current user profile, learning topics, and rituals.
If proposing actions, keep them lightweight and specific.`;

export async function POST(request: Request) {
  try {
    const parsed = requestSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const apiKey = assertOpenAIKey();
    const client = new OpenAI({ apiKey });

    const supabase = await createServerSupabaseClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let response = (await client.responses.create({
      model: "gpt-5.1",
      instructions: SYSTEM_INSTRUCTION,
      input: [{ role: "user", content: `Mode: ${parsed.data.mode ?? "general"}\n\n${parsed.data.input}` }],
      tools: TOOL_DEFS
    })) as OpenAIResponse;

    for (let loop = 0; loop < 8; loop += 1) {
      const toolCalls = (response.output ?? []).filter(isFunctionCallItem);
      if (toolCalls.length === 0) {
        break;
      }
      if (!response.id) {
        throw new Error("OpenAI response missing id for tool continuation.");
      }

      const toolOutputs = await Promise.all(
        toolCalls.map(async (call) => {
          const output = await executeTool(supabase, user.id, call);
          return {
            type: "function_call_output",
            call_id: call.call_id,
            output: JSON.stringify(output)
          };
        })
      );

      response = (await client.responses.create({
        model: "gpt-5.1",
        previous_response_id: response.id,
        input: toolOutputs
      })) as OpenAIResponse;
    }

    return NextResponse.json({ text: extractText(response) });
  } catch (error) {
    if (error instanceof Error && error.message.includes("OPENAI_API_KEY is required")) {
      return NextResponse.json({ error: "Server misconfiguration: OPENAI_API_KEY is missing." }, { status: 500 });
    }

    const message = error instanceof Error ? error.message : "Unknown assistant error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
