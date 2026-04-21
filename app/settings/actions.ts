"use server";

import { renderTestEmailTemplate } from "@/lib/email/templates";
import { sendEmail, verifySmtpTransport } from "@/lib/email/mailer";

export type SendTestEmailState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialSendTestEmailState: SendTestEmailState = {
  status: "idle",
  message: ""
};

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
