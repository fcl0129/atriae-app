# Atriae Production Smoke Test

## Required Vercel environment variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (compatibility fallback only)
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only)
- `OPENAI_API_KEY` (server-side only)
- `DIGEST_CRON_SECRET` (if scheduled digest cron is enabled)
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM_EMAIL`
- `SMTP_FROM_NAME`

## Required Supabase Auth redirect URLs

- `https://atriae.com/auth/confirm`
- `https://www.atriae.com/auth/confirm`
- `https://*.vercel.app/auth/confirm`

## Pre-deploy commands

```bash
npm run typecheck
npm run lint
npm run build
supabase migration list --linked
supabase db push --linked
```

## Manual smoke tests

1. Create account from `/login`, confirm email, and land in app.
2. Magic link login from `/login`, confirm email, and land in app.
3. Dashboard bootstrap creates starter dashboard for a new account.
4. Create a learning topic on `/learn`.
5. Save an AI brief from the learning workflow.
6. Create a ritual and complete a ritual check-in on `/rituals`.
7. Open digest screens and settings pages (`/digests`, `/settings`) without runtime errors.

## Expected auth behavior

- Password sign-in works directly from `/login`.
- Create-account and magic-link email flows redirect to `/auth/confirm`.
- `/auth/confirm` exchanges `code` for a server-side session and redirects to the requested in-app path.
- `/api/debug/env` is temporary and should stay disabled in production unless explicitly enabled.
