# UI Integration Notes

_Last updated: 2026-04-21_

## 1) Current stack audit (safe for UI integration)

- **Next.js app structure:** App Router layout is present under `app/` with route segments and a root layout (`app/layout.tsx`).
- **TypeScript setup:** Strict TypeScript is enabled in `tsconfig.json` and path alias `@/*` is configured.
- **Tailwind setup:** Tailwind is configured via `tailwind.config.ts`, PostCSS is present, and global styles live in `app/globals.css`.
- **shadcn compatibility:** `components.json` exists and points to shadcn-compatible aliases and Tailwind config.
- **Utility function:** `lib/utils.ts` exports `cn()` using `clsx` + `tailwind-merge`.
- **Default component folders:** `components/ui` already exists for primitives; `components/layout` exists for layout-level components.

## 2) Folder conventions for upcoming UI work

Use these conventions going forward:

- `components/ui/*` → reusable, presentation-focused primitives and imported shadcn-style UI pieces.
- `components/sections/*` → route/page section blocks (especially landing/marketing sections) composed from `components/ui` and existing layout wrappers.
- `components/layout/*` → structural shell/layout helpers (keep existing usage).

A `components/sections/` folder has been added to make section-level integration explicit while preserving current behavior.

## 3) Dependency decisions

- **Animation library chosen for this repo right now:** _None currently installed/used in code_.
- **Standard for upcoming animation work:** Prefer **framer-motion** when animation is first introduced, unless a different animation library is already introduced and adopted before that PR.
- **Installed now:** No new dependencies were installed because safe required dependencies already exist:
  - `lucide-react` ✅ already present.
  - `tailwind-merge` ✅ already present (and used by `cn`).
  - No existing motion library to standardize yet, so no animation dependency was added preemptively.

## 4) Risk notes (avoid direct integration without review)

- Components tied to auth/data/session flows (e.g., dashboard/settings/login pages and Supabase-bound flows) should not be replaced directly during UI-only integration.
- Prefer wrapper/composition changes over editing business/data logic in page-level route files.
- Keep visual integration changes isolated to `components/ui` and `components/sections` first, then adopt incrementally in routes.
