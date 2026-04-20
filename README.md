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

## Run locally

```bash
npm install
npm run dev
```

## Environment

Copy `.env.example` to `.env.local` and add:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Notes

- This v1 focuses on architecture, visual consistency, and polished placeholders.
- Auth flows, data models, and business logic are intentionally deferred for next iterations.
