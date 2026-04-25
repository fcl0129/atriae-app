# Supabase migration history repair (Atriae)

## What was wrong

Supabase branch deploy compares **remote migration versions** from `supabase_migrations.schema_migrations` with the filenames under `supabase/migrations/`.

This repository had a legacy migration named:

- `20260421_create_profiles_auth.sql`

That filename uses an 8-digit date prefix (`20260421`) instead of Supabase's canonical 14-digit migration version format (`YYYYMMDDHHMMSS`).

In practice, this can cause migration-history drift between environments:

- one environment records/applies `20260421` (legacy style), while
- another workflow expects/discovers only canonical timestamped migration versions.

That mismatch is a common cause of:

> `Remote migration versions not found in local migrations directory`

## What was changed

To make migration discovery and history reconciliation safer, we added a canonical timestamped copy of the same migration:

- `supabase/migrations/20260421000000_create_profiles_auth.sql`

The original legacy file was intentionally preserved:

- `supabase/migrations/20260421_create_profiles_auth.sql`

Keeping both files is production-safe here because this migration is idempotent (`create table if not exists`, `drop ... if exists`, `create or replace function`), so reapplication does not drop user data.

## Why this is safer than a destructive reset/baseline

A full baseline reset would require rewriting migration history and potentially forcing resets in active environments.

For Atriae, preserving existing objects and data assumptions is safer. This approach:

- keeps existing migration chain intact,
- adds canonical compatibility for Supabase deploy tooling,
- avoids destructive schema resets.

## Command/workflow to use next

Run this from the repo root after linking your project:

```bash
# 1) See local vs remote versions
supabase migration list --linked

# 2) If you still see remote-only versions, repair by marking them as reverted
# (replace <VERSION> with each remote-only migration version)
supabase migration repair --status reverted <VERSION> --linked

# 3) Push canonical/local migrations
supabase db push --linked
```

After migration history is repaired, make sure this reconciliation migration is also applied:

- `supabase/migrations/20260425130000_auth_schema_rls_repair.sql`

### How to choose `<VERSION>` safely

Only repair versions that are:

- present in **Remote** column,
- absent in **Local** column,
- and known to be legacy/renamed equivalents (not new intended schema changes).

If unsure, stop and compare SQL history before repairing.

## Manual Supabase dashboard step (only if CLI repair is blocked)

If your CI or local environment cannot run `supabase migration repair`, do one of:

1. Re-run deploy from a machine with Supabase CLI access (recommended).
2. In Supabase Dashboard, verify the branch/project migration timeline and identify remote-only versions before retrying deploy.

Do **not** delete live tables/functions to silence migration-version errors.
