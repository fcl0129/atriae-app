import { sendEmail } from "@/lib/email/mailer";
import { renderDigestForProfile } from "@/lib/digests/rendering/engine";
import type { DigestRepository } from "@/lib/digests/repository";
import type { DigestRun, UserDigestProfile } from "@/lib/digests/types";

const MAX_RETRIES = 3;

function isTransientError(message: string) {
  const normalized = message.toLowerCase();
  return normalized.includes("timeout") || normalized.includes("tempor") || normalized.includes("try again") || /\b4\d\d\b/.test(normalized);
}

function resolveRecipient(profile: UserDigestProfile) {
  const personalization = (profile.digest_config.personalization ?? {}) as Record<string, unknown>;
  const email = personalization.deliveryEmail;
  return typeof email === "string" && email.includes("@") ? email : null;
}

async function markRunFailed(repository: DigestRepository, run: DigestRun, error: unknown) {
  const reason = error instanceof Error ? error.message : String(error);
  const attempts = Number((run.delivery_meta?.retryCount as number | undefined) ?? 0) + 1;
  const transient = isTransientError(reason);
  const shouldRetry = transient && attempts <= MAX_RETRIES;

  console.error("[digests][delivery][failed]", {
    runId: run.id,
    profileId: run.profile_id,
    attempts,
    transient,
    reason,
  });

  await repository.updateRun(run.id, {
    status: "failed",
    error_message: reason,
    completed_at: shouldRetry ? null : new Date().toISOString(),
    delivery_meta: {
      ...(run.delivery_meta ?? {}),
      retryCount: attempts,
      willRetry: shouldRetry,
      nextAttemptAt: shouldRetry ? new Date(Date.now() + attempts * 5 * 60_000).toISOString() : null,
      lastFailureAt: new Date().toISOString(),
    },
  });
}

export async function deliverRun(repository: DigestRepository, run: DigestRun) {
  try {
    await repository.updateRun(run.id, {
      status: "rendering",
      started_at: run.started_at ?? new Date().toISOString(),
    });

    const profile = await repository.getProfileById(run.profile_id);
    if (!profile) throw new Error(`Profile ${run.profile_id} not found.`);

    const render = await renderDigestForProfile(profile, { now: new Date(run.scheduled_for) });

    await repository.updateRun(run.id, {
      status: "sending",
      subject_line: render.subjectLine,
      preview_line: render.previewLine,
      render_payload: render.payload,
      error_message: null,
    });

    const to = resolveRecipient(profile);
    if (!to) throw new Error("Missing personalization.deliveryEmail for digest recipient.");

    const sent = await sendEmail({
      to,
      subject: render.subjectLine,
      html: render.html,
      text: render.text,
    });

    if (!sent.ok) {
      throw new Error(sent.error);
    }

    await repository.updateRun(run.id, {
      status: "sent",
      completed_at: new Date().toISOString(),
      error_message: null,
      delivery_meta: {
        ...(run.delivery_meta ?? {}),
        retryCount: Number((run.delivery_meta?.retryCount as number | undefined) ?? 0),
        messageId: sent.messageId,
        deliveredAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    await markRunFailed(repository, run, error);
  }
}
