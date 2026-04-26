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
2. Sign in from `/login` with email + password and land in app.
3. Dashboard bootstrap creates starter dashboard for a new account.
4. Create a learning topic on `/learn`.
5. Save an AI brief from the learning workflow.
6. Create a ritual and complete a ritual check-in on `/rituals`.
7. Open digest screens and settings pages (`/digests`, `/settings`) without runtime errors.

## Expected auth behavior

- Atriae uses email + password authentication only in the `/login` UI.
- Magic links are intentionally disabled in the UI.
- Supabase Email provider must be enabled.
- Supabase "Allow new users to sign up" must be ON.
- For immediate personal use, set Supabase Email provider "Confirm email" to OFF.
- Create-account uses email + password from `/login`.
- If Supabase Email provider "Confirm email" is OFF, new accounts can sign in immediately.
- If Supabase Email provider "Confirm email" is ON, new users must confirm their email before signing in.
- `/auth/confirm` remains available for email confirmation and password reset flows, not normal sign-in.
- `/api/debug/env` is temporary and should stay disabled in production unless explicitly enabled.
