# Atriaé v1 Foundation

A production-ready foundational setup for **Atriaé**, a calm personal operating system built with Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui conventions, and Supabase scaffolding.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui-compatible structure
- Supabase client scaffold

## Routes

- `/`
- `/login`
- `/dashboard`
- `/learn`
- `/rituals`
- `/settings`

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

- This version focuses on architecture and polished placeholders.
- Feature implementation (auth flows, persisted data, domain logic) should be layered on top next.
