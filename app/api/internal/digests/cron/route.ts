import { NextResponse } from "next/server";

import { deliverRun } from "@/lib/digests/delivery";
import { computeNextRunAt } from "@/lib/digests/scheduling";
import { DigestRepository } from "@/lib/digests/repository";
import { createSupabaseServiceClient } from "@/lib/supabase";

function isAuthorized(request: Request) {
  const secret = process.env.DIGEST_CRON_SECRET;
  if (!secret) {
    return true;
  }

  const header = request.headers.get("x-cron-secret");
  return header === secret;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const nowIso = now.toISOString();
  const repository = new DigestRepository(createSupabaseServiceClient());

  const dueProfiles = await repository.listDueProfiles(nowIso, 100);
  let queued = 0;
  let duplicateSkipped = 0;

  for (const profile of dueProfiles) {
    const scheduledFor = profile.next_run_at ?? nowIso;

    console.info("[digests][scheduler][selected]", {
      profileId: profile.id,
      scheduledFor,
      cadence: profile.scheduling_config.cadence,
    });

    try {
      await repository.createRun({
        profile_id: profile.id,
        user_id: profile.user_id,
        status: "queued",
        scheduled_for: scheduledFor,
        started_at: null,
        completed_at: null,
        subject_line: null,
        preview_line: null,
        render_payload: {
          trigger: "scheduled",
        },
        delivery_meta: {
          retryCount: 0,
        },
        error_message: null,
      });
      queued += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.toLowerCase().includes("duplicate") || message.includes("23505")) {
        duplicateSkipped += 1;
      } else {
        throw error;
      }
    }

    const after = new Date(scheduledFor);
    after.setMinutes(after.getMinutes() + 1);

    const nextRunAt = computeNextRunAt(profile.scheduling_config, after);

    await repository.updateUserProfile(profile.id, {
      last_run_at: scheduledFor,
      next_run_at: nextRunAt.toISOString(),
    });
  }

  const dueRuns = await repository.listRunsForDelivery(nowIso, 100);
  let sent = 0;
  let failed = 0;

  for (const run of dueRuns) {
    const before = run.status;
    await deliverRun(repository, run);
    const updated = await repository.getRunById(run.id);
    if (!updated) continue;

    if (updated.status === "sent") sent += 1;
    if (updated.status === "failed" && before !== "failed") failed += 1;
  }

  return NextResponse.json({
    ok: true,
    scannedProfiles: dueProfiles.length,
    queued,
    duplicateSkipped,
    processedRuns: dueRuns.length,
    sent,
    failed,
    now: nowIso,
  });
}
