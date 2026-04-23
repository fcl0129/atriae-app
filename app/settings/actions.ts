"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { profilePreferencesSchema } from "@/lib/atriae/types";
import { SUPABASE_PUBLIC_ENV_ERROR } from "@/lib/env";
import { sendEmail, verifySmtpTransport } from "@/lib/email/mailer";
import { renderTestEmailTemplate } from "@/lib/email/templates";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type SendTestEmailState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialSendTestEmailState: SendTestEmailState = {
  status: "idle",
  message: ""
};

export type SavePreferencesState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialSavePreferencesState: SavePreferencesState = {
  status: "idle",
  message: ""
};

export async function savePreferencesAction(
  _prevState: SavePreferencesState,
  formData: FormData
): Promise<SavePreferencesState> {
  const parsed = profilePreferencesSchema.safeParse({
    displayName: formData.get("display_name"),
    morningRitualReminder: formData.get("morning_ritual_reminder")
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid profile preferences." };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { status: "error", message: SUPABASE_PUBLIC_ENV_ERROR };
  }
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "error", message: "You need to sign in again." };
  }

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    display_name: parsed.data.displayName,
    morning_ritual_reminder: parsed.data.morningRitualReminder
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/settings");
  revalidatePath("/dashboard");

  return { status: "success", message: "Preferences saved." };
}

export async function logoutAction() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    redirect("/");
  }
  await supabase.auth.signOut();
  redirect("/");
}

export async function sendTestEmailAction(
  _prevState: SendTestEmailState,
  formData: FormData
): Promise<SendTestEmailState> {
  const to = String(formData.get("to") ?? "").trim();

  if (!to) {
    return {
      status: "error",
      message: "Enter a recipient email address first."
    };
  }

  const verifyResult = await verifySmtpTransport();
  if (!verifyResult.ok) {
    return {
      status: "error",
      message: `SMTP connection failed: ${verifyResult.error}`
    };
  }

  const template = renderTestEmailTemplate(to);
  const result = await sendEmail({
    to,
    subject: "Atriae SMTP test",
    html: template.html,
    text: template.text
  });

  if (!result.ok) {
    return {
      status: "error",
      message: `Could not send email: ${result.error}`
    };
  }

  return {
    status: "success",
    message: `Test email sent to ${to}. Message ID: ${result.messageId}`
  };
}
