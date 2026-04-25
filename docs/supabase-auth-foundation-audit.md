# Supabase auth foundation audit (Atriae)

## Framework + app structure

- Next.js App Router on v15 with React 19 and `@supabase/ssr`.
- Auth/session enforcement is handled in root `middleware.ts` for private routes.
- Supabase clients are split into browser, server, and middleware helpers under `lib/supabase/*`.

## Auth/session risks found

1. Login/signup magic-link redirects were pointing directly to app routes, without a code-exchange callback route.
   - This breaks App Router SSR session establishment for email-link flows.
2. Environment-variable naming was mixed (`PUBLISHABLE_KEY` preferred in docs/UI, `ANON_KEY` treated as fallback), which causes easy Vercel misconfiguration.
3. Digests area was not included in middleware-protected routes.
4. Existing migrations contained duplicate profile foundation files:
   - `20260421_create_profiles_auth.sql`
   - `20260421000000_create_profiles_auth.sql`

## Required Atriae tables/fields referenced by app code

- `profiles`: `id`, `display_name`, `morning_ritual_reminder`, `email`
- `dashboard_views`: `id`, `user_id`, `name`, `template_key`, `is_default`, `sort_order`
- `dashboard_widgets`: `id`, `dashboard_view_id`, `widget_type`, `size`, `position`, `settings`, `is_hidden`
- `learning_topics`: `id`, `user_id`, `name`, `pace`, `progress`, `resources_count`
- `learning_briefs`: `id`, `user_id`, `topic_id`, `mode`, `title`, `summary`, `sections`, `next_steps`
- `rituals`: `id`, `user_id`, `title`, `cadence`, `prompt`
- `ritual_checkins`: `id`, `ritual_id`, `user_id`, `completed_at`
- `sessions`: `id`, `user_id`, `mode`, `title`, `updated_at`
- `messages`: `id`, `session_id`, `role`, `content`, `structured_payload`
- `actions`: `id`, `session_id`, `label`, `status`
- Digest-related: `digest_templates`, `user_digest_profiles`, `digest_sources`, `digest_runs`

## Migration repair strategy applied

- Added a single idempotent repair migration:
  - `supabase/migrations/20260425130000_auth_schema_rls_repair.sql`
- It reconciles:
  - core auth trigger/function,
  - required profile columns,
  - stable RLS policy definitions (drop/recreate),
  - non-recursive owner-based policies,
  - required indexes,
  - `touch_updated_at` trigger helper consistency.

## Remote migration mismatch note

If your remote project still includes version `20260421_create_profiles_auth` while local has canonical `20260421000000_create_profiles_auth` (or vice versa), use Supabase migration repair before deploy/push so remote history matches local filenames.
