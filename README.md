# Atriaé v1 Foundation

A production-ready foundation for **Atriaé**, a calm personal operating system built with Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui conventions, and Supabase scaffolding.

## Stack

- Next.js (App Router + typed routes)
- TypeScript (strict mode)
- Tailwind CSS with CSS variable tokens
- shadcn/ui-compatible structure
- Supabase client scaffold
- Vercel-ready config

## Routes

- `/`
- `/login`
- `/dashboard`
- `/learn`
- `/rituals`
- `/settings`

## Project structure

- `app/` → route entries and global layout
- `components/layout/` → shell, hero, and page scaffolding
- `components/ui/` → reusable UI primitives
- `lib/design/` → Atriaé design tokens
- `lib/supabase/` → Supabase environment and client scaffolding
- `lib/email/` → SMTP transport + template rendering utilities
- `lib/env/` → shared environment variable validation helpers

## Run locally

```bash
npm install
npm run dev
```

## Environment

Copy `.env.example` to `.env.local` and add:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`


### Vercel environment variables

In Vercel Project Settings -> Environment Variables, add:

- `OPENAI_API_KEY` (Production, Preview, Development)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM_EMAIL`
- `SMTP_FROM_NAME`

Atriae intelligence runs through `POST /api/intelligence` server-side. Never expose `OPENAI_API_KEY` to the browser or commit it to the repository.

### App-level SMTP env vars (Atriae product emails)

These variables are used by Atriae server-side email actions for product emails (digests, reminders, notifications, and test messages):

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM_EMAIL`
- `SMTP_FROM_NAME`

## SMTP architecture notes

Atriae uses **SMTP only** and separates responsibility in two layers:

1. **Supabase Auth emails**
   - Configure SMTP in Supabase Dashboard → Authentication → Email settings.
   - Supabase sends auth-specific mail (magic links, OTP, invites, password reset) through that SMTP provider.

2. **Atriae product emails**
   - Configure the app-level `SMTP_*` variables in your runtime (`.env.local`, Vercel, etc.).
   - Atriae uses `lib/email/mailer.ts` for product-generated emails and operational test sends from `/settings`.

Keeping these two configurations aligned avoids sender mismatch and deliverability issues.

## Notes

- This v1 focuses on architecture, visual consistency, and polished placeholders.
- Auth flows, data models, and business logic are intentionally deferred for next iterations.



## Curated digest providers

Digest modules now use provider abstractions so integrations can be swapped without touching UI components:

- Calendar: `mock`, `google` (integration-ready), `outlook` (integration-ready)
- Weather: `mock`, `open_meteo`
- Headlines: `mock`, `newsapi`
- Recommendations (culture/series/music/podcast): `mock`, `tmdb` (integration-ready), `spotify` (integration-ready), `listen_notes` (integration-ready)

Set provider mode with `DIGEST_*_PROVIDER` environment variables. Keep provider keys in runtime secrets (`.env.local`, Vercel env vars, etc.) and never hardcode credentials in module renderers.

## Curated digest automation

- Trigger scheduled digest orchestration with `POST /api/internal/digests/cron` (optionally secured by `DIGEST_CRON_SECRET` using `x-cron-secret`).
- Job flow: select due profiles (`next_run_at <= now`) -> create unique queued run per `profile_id + scheduled_for` -> render -> send via SMTP -> transition run status through `queued`, `rendering`, `sending`, `sent` / `failed`.
- Retry metadata is persisted in `digest_runs.delivery_meta` (`retryCount`, `nextAttemptAt`) for transient SMTP failures.
- Manual preview delivery is available at `POST /api/digests/:id/send-test` and upcoming send projections at `GET /api/digests/:id/upcoming`.
