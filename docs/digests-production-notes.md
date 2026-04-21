# Curated Digests production notes

## Delivery and retry behavior

- Scheduled runs are deduplicated by `(profile_id, scheduled_for)` in Postgres.
- Cron now **claims** each run atomically (`queued`/`failed` -> `rendering`) before delivery to reduce duplicate sends during overlapping cron invocations.
- Failed sends store retry metadata in `digest_runs.delivery_meta`:
  - `retryCount`
  - `willRetry`
  - `nextAttemptAt`
  - `lastFailureAt`

## SMTP safety

- Raw SMTP failures are logged server-side.
- User-facing API responses return sanitized SMTP error messages to avoid leaking hostnames, auth configuration, or provider internals.
- If SMTP env is missing, users receive a generic configuration message.

## UI expectations

- Digest activation/testing expects `digest_config.personalization.deliveryEmail` to be configured.
- Builder validates:
  - digest name
  - internal label
  - valid IANA timezone
  - valid delivery email
  - at least one enabled module

## Historical run rendering

- `digest_runs.render_payload` stores rendered HTML/text snapshots at send time.
- Digest detail/history pages should always prefer run snapshots over template/profile data so historical previews remain stable even after template edits.
