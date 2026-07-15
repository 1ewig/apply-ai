# ApplyAI — Agent Quick Reference

Full project reference: `docs/summery.md`

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Runtime | **Bun 1.3.14** (not Node/npm/pnpm) |
| Database | Convex (reactive serverless DB, real-time WebSocket sync) |
| Auth | Clerk v7 (`@clerk/nextjs ^7.3.7`) |
| AI | Groq LLaMA 3.3 via Vercel AI SDK `generateText()` |
| Styling | Tailwind CSS v4 alpha + CSS custom properties |
| State | Zustand (UI loading phases) + Convex reactive queries (data) |
| Validation | Zod 4 |
| Animation | Framer Motion 12 |
| Icons | Lucide React |

## Commands (Bun only — do not use npm/pnpm)

- `bun run dev` — Next.js dev server (Turbopack)
- `bun run build` — Production build
- `bun run start` — Production server
- `bun run tsc --noEmit` — Type check
- `npx convex dev` — Convex dev server (in a separate terminal)

## Architecture — Critical Rules

1. **`proxy.ts` is the middleware.** Next.js 16 dropped the mandatory `middleware.ts` filename. The file is at `src/proxy.ts` — **do not rename it to `middleware.ts`**. It protects `/application-board*`, `/resume-templates*`, and `/api/compare*` via `clerkMiddleware()`.

2. **4-layer separation:**
   - `src/app/` — Next.js App Router pages and layouts (server components by default)
   - `src/components/` — Presentational React components (client components when needed)
   - `src/hooks/` — Shared business logic and state (custom hooks, not components)
   - `src/utils/` — Pure utilities (no React): `cn.ts`, `animations.ts`, `userFriendlyErrors.ts`

3. **Clerk auth pages use catch-all routes.** Files at `[[...sign-in]]/page.tsx` and `[[...sign-up]]/page.tsx`. Post-sign-in redirect is `fallbackRedirectUrl="/application-board"` — not `afterSignInUrl` (that prop doesn't exist in Clerk v7).

4. **No comments in JSX/TSX.** Write self-documenting code.

5. **Convex queries are reactive.** No manual refetching needed. Every query/mutation filters by `identity.subject` for multi-tenant isolation.

6. **Path alias:** `@/*` maps to `src/*`.

## Key File Locations

- `src/proxy.ts` — Clerk middleware configuration
- `src/providers/ConvexClientProvider.tsx` — Convex + Clerk integration
- `src/providers/ThemeProvider.tsx` — Light/dark theme context
- `src/utils/userFriendlyErrors.ts` — Raw error to plain English mapping
- `convex/schema.ts` — Database schema (4 tables: users, applications, analyses, resumes)
- `src/index.css` — Global styles, Tailwind v4 `@theme`, light/dark CSS vars

## Environment Variables (required)

`GROQ_API_KEY`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `NEXT_PUBLIC_CLERK_SIGN_IN_URL`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL`, `CLERK_FRONTEND_API_URL`, `NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_CONVEX_SITE_URL`
