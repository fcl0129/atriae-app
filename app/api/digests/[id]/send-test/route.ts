import { NextResponse } from "next/server";

import { DigestRepository } from "@/lib/digests/repository";
import { isValidEmail, redactSmtpError } from "@/lib/digests/validation";
import { renderDigestForProfile } from "@/lib/digests/rendering/engine";
import { sendEmail } from "@/lib/email/mailer";
import { createSupabaseServiceClient } from "@/lib/supabase";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createSupabaseServiceClient();
  const auth = await db.auth.getUser(token);
  if (auth.error || !auth.data.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { to?: string };
  const to = body.to?.trim();
  if (!to || !isValidEmail(to)) {
    return NextResponse.json({ error: "A valid test recipient is required." }, { status: 400 });
  }

  const repository = new DigestRepository(db);
  const profile = await repository.getProfileById(id);

  if (!profile || profile.user_id !== auth.data.user.id) {
    return NextResponse.json({ error: "Digest not found." }, { status: 404 });
  }

  const render = await renderDigestForProfile(profile, { preview: true });
  const mail = await sendEmail({
    to,
    subject: `[Test] ${render.subjectLine}`,
    html: render.html,
    text: render.text,
  });

  if (!mail.ok) {
    const safeError = redactSmtpError(mail.error);
    console.error("[digests][send-test][smtp-failure]", { profileId: profile.id, message: mail.error, safeError });
    return NextResponse.json({ error: safeError }, { status: 502 });
  }

  return NextResponse.json({ ok: true, messageId: mail.messageId });
}
