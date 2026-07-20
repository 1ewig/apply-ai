# ApplyAI — Full Project Summary

> AI-powered job application tracker. Organize applications, upload & parse resumes with AI, and get agentic resume tailoring suggestions.

**URLs:** Production — N/A (local dev at `http://localhost:3000`)  
**Package Manager:** Bun 1.3.14  
**Framework:** Next.js 16.2 (App Router)  
**Language:** TypeScript 5.9 (strict mode)  
**Styling:** Tailwind CSS v4 (alpha) + CSS custom properties design system  
**Database:** Convex (reactive serverless DB with real-time WebSocket sync)  
**Auth:** Clerk v7 (JWT-based, with Convex integration)

---

## Tech Stack

### Production Dependencies

| Package | Version | Purpose |
|---|---|---|
| `next` | ^16.2.10 | Framework — App Router, API routes, Turbopack bundler |
| `react` / `react-dom` | 19.2.6 | UI library |
| `@clerk/nextjs` | ^7.3.7 | Auth — sign-in/sign-up components, middleware, JWT |
| `convex` | ^1.42.1 | Database — reactive queries, mutations, real-time sync |
| `ai` | ^6.0.184 | Vercel AI SDK — `generateObject()` for structured LLM calls |
| `@ai-sdk/groq` | ^3.0.39 | Groq provider — `llama-3.3-70b-versatile` inference |
| `@ai-sdk/google` | latest | Google Gemini provider — configurable via `AI_PROVIDER` env var |
| `zod` | ^4.4.3 | Schema validation — LLM output parsing, API contracts |
| `zustand` | ^5.0.13 | Client state — analysis loading phases UI store |
| `framer-motion` | ^12.38.0 | Animation — page transitions, modals, SVG score reveals |
| `lucide-react` | ^1.14.0 | Icons |
| `clsx` | 2.1.1 | Conditional class construction |
| `tailwind-merge` | 3.4.0 | Tailwind class deduplication |

### Dev Dependencies

| Package | Version | Purpose |
|---|---|---|
| `tailwindcss` | ^4.0.0-alpha.33 | Utility-first CSS |
| `@tailwindcss/postcss` | ^4.0.0-alpha.33 | PostCSS integration for Tailwind v4 |
| `postcss` | ^8.4.0 | CSS processing pipeline |
| `typescript` | 5.9.3 | Type checking |

---

## Project Structure

```
src/
├── index.css                    # Global styles, Tailwind v4 @theme, CSS vars (light/dark)
├── proxy.ts                     # Next.js proxy (middleware) — Clerk route protection
│
├── agent/                       # AI / LLM integration layer
│   ├── types.ts                 # Zod schemas + TypeScript types (SessionBlueprint, AgentTask, ResumeSection, etc.)
│   ├── config.ts                # AI provider + model configuration (reads AI_PROVIDER, AI_MODEL env vars)
│   ├── prompts.ts               # System prompts + prompt builders for resume parser
│   ├── errors.ts                # normalizeAiError() — maps LLM/network errors to user-friendly strings
│   └── provider.ts              # parseResume() — provider-agnostic LLM call (Groq or Google)
│
├── app/
│   ├── layout.tsx               # Root layout: ClerkProvider > ConvexClientProvider > ThemeProvider, fonts
│   ├── page.tsx                 # Landing page (composes all landing sections)
│   ├── actions/
│   │   ├── users.ts             # storeUserAction() — Convex user sync server action
│   │   └── applications.ts     # getAnalysisAction() — fetch analysis data server action
│   ├── api/
│   │   └── parse-resume/
│   │       └── route.ts         # POST /api/parse-resume — AI resume parsing endpoint (Clerk auth protected)
│   ├── (auth)/
│   │   ├── layout.tsx                   # Auth layout (centered card)
│   │   ├── sign-in/[[...sign-in]]/page.tsx  # Clerk <SignIn> (catch-all)
│   │   └── sign-up/[[...sign-up]]/page.tsx  # Clerk <SignUp> (catch-all)
│   └── (dashboard)/
│       ├── layout.tsx               # Dashboard server layout — metadata
│       ├── DashboardLayoutClient.tsx # Dashboard shell: Sidebar + Toast + mobile header
│       ├── application-board/
│       │   ├── page.tsx             # Main board page (server component, renders ApplicationBoardClient)
│       │   └── [id]/analysis/
│       │       ├── page.tsx         # Analysis page (server component, renders AnalysisLayoutClient)
│       │       └── AnalysisLayoutClient.tsx # Client shell for analysis detail
│       └── resume-templates/
│           └── page.tsx             # Resume template CRUD
│
├── components/
│   ├── ui/
│   │   ├── Badge.tsx, Button.tsx, Card.tsx, ConfirmDialog.tsx  # Primitives
│   ├── (dashboard)/
│   │   ├── Sidebar.tsx              # Navigation sidebar (desktop + mobile)
│   │   ├── Toast.tsx                # Success/error toast notification
│   │   ├── application-board/
│   │   │   ├── ApplicationBoardClient.tsx    # Main board state orchestrator
│   │   │   ├── ApplicationsBoard.tsx         # Kanban-style board layout
│   │   │   ├── AddApplicationModal.tsx       # Add/edit application modal (multi-step with resume step)
│   │   │   ├── JobCard.tsx                   # Individual application card
│   │   │   ├── SearchFilterBar.tsx           # Search + status filter bar
│   │   │   ├── AnalysisLoadingOverlay.tsx    # Full-screen AI loading overlay with phase animation
│   │   │   └── match-analysis/               # Analysis detail components (ScoreRing, KeywordCoverage, etc.)
│   │   └── resume-templates/
│   │       ├── ResumeTemplates.tsx, ResumeCard.tsx, AddResumeModal.tsx, EditResumeModal.tsx
│   └── landing/                      # 10 landing page sections + UI sub-components
│
├── hooks/
│   ├── useApplications.ts       # Convex reactive queries/mutations for job applications
│   ├── useApplicationForm.ts    # Form state for add/edit job modal
│   ├── useApplicationSearch.ts  # Memoized search + status filter
│   ├── useForm.ts               # Generic form state hook
│   ├── useParseResumeStep.ts    # Resume upload, AI parsing step, structured resume state
│   ├── useResumes.ts            # Convex reactive queries/mutations for resumes
│   ├── useResumeForm.ts         # Form state for add/edit resume modal
│   └── useSubmitApplication.ts  # Handles add/update job submission and post-action routing
│
├── stores/
│   └── useAnalysisStore.ts      # Zustand store — loading phases, error/success toast state
│
├── providers/
│   ├── ConvexClientProvider.tsx  # ConvexProviderWithClerk wrapper
│   └── ThemeProvider.tsx         # Light/dark theme context + localStorage
│
├── types/
│   └── index.ts                 # App-level TypeScript types (JobApplication, Resume, ComparisonResult alias)
│
└── utils/
    ├── cn.ts                    # clsx + tailwind-merge utility
    ├── animations.ts            # Framer Motion variants
    └── userFriendlyErrors.ts    # Raw error → plain English mapping
```

---

## Routes

| Route | Type | Access | Description |
|---|---|---|---|
| `/` | Static | Public | Landing page (Hero, Features, Pricing, etc.) |
| `/sign-in/[[...sign-in]]` | Dynamic | Public | Clerk sign-in form (catch-all) |
| `/sign-up/[[...sign-up]]` | Dynamic | Public | Clerk sign-up form (catch-all) |
| `/application-board` | Static + Client | Protected | Main job board — list, add, edit applications |
| `/application-board/[id]/analysis` | Dynamic | Protected | AI analysis detail for a specific application |
| `/resume-templates` | Static + Client | Protected | Resume template CRUD |
| `POST /api/parse-resume` | API | Protected | AI resume parsing endpoint — calls Groq or Google Gemini |

**Route protection** is handled by `proxy.ts` (Clerk middleware) which guards `/application-board*`, `/resume-templates*`, and `/api/parse-resume` via `clerkMiddleware()` + `auth.protect()`. Static assets and auth pages are excluded. Clock skew tolerance is set to 30 seconds (`clockSkewInMs: 30000`).

---

## Data Flow

### Authentication Flow

```
User → Clerk UI (SignIn/SignUp) → redirect to /application-board
       (fallbackRedirectUrl="/application-board")
       ↓
Clerk JWT → ConvexProviderWithClerk
              ↓
      Convex WebSocket (authenticated)
              ↓
  Convex queries filtered by identity.subject
```

- Clerk handles session management and JWT generation
- `fallbackRedirectUrl="/application-board"` on `<SignIn>`/`<SignUp>` sends users to the dashboard after auth
- Convex validates Clerk JWTs via `auth.config.ts` (`CLERK_FRONTEND_API_URL` as the issuer domain)
- Every Convex query/mutation calls `ctx.auth.getUserIdentity()` to isolate user data

### AI Resume Parsing Flow

```
User uploads PDF/text resume in AddApplicationModal
       ↓
useParseResumeStep → POST /api/parse-resume { resumeText }
                              ↓
                     Clerk auth() check
                              ↓
                     agent/provider.ts → parseResume()
                              ↓
                     Groq (llama-3.3-70b-versatile) or Google Gemini
                     via Vercel AI SDK generateObject()
                              ↓
                     Zod-validated ParsedResumeResult
                              ↓
                     Structured resume sections displayed in sidebar
                     (customResumeContent saved to Convex with application)
```

### Database (Convex Schema)

**4 tables:**

1. **`users`** — `clerkId` (indexed), `email`, `name`, `createdAt`
2. **`applications`** — `userId` (indexed), `company`, `role`, `status` (wishlist/applied/interviewing/offer/rejected), `dateApplied`, `url`, `jobDescription`, `matchScore`, `resumeUsed`, `customResumeContent`
3. **`analyses`** — `applicationId` (indexed), `userId` (indexed), `result` (full ComparisonResult), `previousResult`, `updatedAt`
4. **`resumes`** — `userId` (indexed), `name`, `content`, `isDefault`, `updatedAt`

**`ComparisonResult`** (alias for `SessionBlueprint`) is a complex nested type stored in analyses: `overallScore`, `readinessTier`, `tasks` (array of `AgentTask`), `parsedResume` (array of `ResumeSection`), `quickWins`, `blockers`.

---

## Environment Variables

| Variable | Required | Where Used |
|---|---|---|
| `AI_PROVIDER` | No | `agent/config.ts` — `"groq"` or `"google"` (default: `"groq"`) |
| `AI_MODEL` | No | `agent/config.ts` — Override default model for the selected provider |
| `GROQ_API_KEY` | If Groq | `agent/provider.ts` — Groq LLM inference |
| `GOOGLE_GENERATIVE_AI_API_KEY` | If Google | `agent/provider.ts` — Google Gemini inference |
| `CLERK_SECRET_KEY` | Yes | Server — Clerk auth |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Client — Clerk frontend |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Yes | Client — `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Yes | Client — `/sign-up` |
| `CLERK_FRONTEND_API_URL` | Yes | `convex/auth.config.ts` — Clerk issuer domain for JWT validation |
| `NEXT_PUBLIC_CONVEX_URL` | Yes | Convex client provider |
| `NEXT_PUBLIC_CONVEX_SITE_URL` | Yes | Convex client provider |
| `API_KEY` | No | `/api/parse-resume` fallback auth for automated/server callers |
| `PORT` | No | Server port (default 3000) |

---

## Available Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start Next.js dev server (Turbopack) |
| `bun run build` | Production build (Turbopack) |
| `bun run start` | Start production server |
| `npx convex dev` | Start Convex dev server (separate terminal) |
| `bun run tsc --noEmit` | Type check |

---

## Key Patterns & Conventions

### Styling
- **Tailwind CSS v4** with PostCSS (`@tailwindcss/postcss`)
- CSS custom properties for theming (`--bg-surface`, `--accent`, `--text-body`, etc.) — defined in `src/index.css`
- Dark mode via CSS class toggle (`.dark`) + inline `<script>` for FOUC prevention
- `cn()` utility (`clsx` + `tailwind-merge`) used in all components for conditional classes
- Google Fonts: Bricolage Grotesque (display), DM Sans (body), JetBrains Mono (code) — loaded via `next/font/google`

### State Management
- **Zustand** — one store (`useAnalysisStore`) for analysis loading UI state (loading phases, error/success toast)
- **Convex reactive queries** (`useQuery`/`useMutation`) — all application/resume data; server is source of truth
- **React local state** — UI concerns (modals, accordions, form inputs)
- **React Context** — `ThemeProvider` for theme toggle

### Auth & Security
- **`proxy.ts` vs `middleware.ts`:** Next.js 16 dropped the mandatory `middleware.ts` filename. The file is at `src/proxy.ts` — this is the intended Next.js 16 convention, **not** a mistake. Do not rename it.
- Clerk middleware (`proxy.ts`) protects `/application-board*`, `/resume-templates*`, and `/api/parse-resume` via `clerkMiddleware()` + `auth.protect()`
- `clockSkewInMs: 30000` set on `clerkMiddleware()` to tolerate local system clock drift during development
- Auth pages (`/sign-in`, `/sign-up`) are public
- Post-sign-in redirect uses `fallbackRedirectUrl="/application-board"` on the `<SignIn>`/`<SignUp>` components (not the deprecated `afterSignInUrl`)
- Every Convex query/mutation filters by `identity.subject` (multi-tenant isolation)
- LLM output validated and normalized by Zod at API boundary via `generateObject()`
- `poweredByHeader: false` in `next.config.ts`

### Agent / AI Layer
- All AI logic lives in `src/agent/` — no AI imports outside this folder and `src/app/api/`
- Provider-agnostic: `agent/config.ts` reads `AI_PROVIDER` + `AI_MODEL` env vars to select Groq or Google Gemini
- `agent/types.ts` owns all Zod schemas and TypeScript types for AI data contracts
- `agent/errors.ts` normalizes LLM/network errors to user-facing strings
- `agent/provider.ts` exports `parseResume()` — the only LLM call in the system

### Animation
- Framer Motion — `AnimatePresence`, spring modals, stagger grids, SVG score reveals, accordion transitions
- Floating widget animations on hero

### Code Conventions
- **No comments in JSX/TSX** — write self-documenting code
- `'use client'` directive on client components that need hooks or browser APIs
- Server components are the default; only add `'use client'` when needed
- Path alias `@/*` maps to `src/*`
- Convex has its own `tsconfig.json` in `convex/` directory
- 4-layer separation: `src/app/` → pages, `src/components/` → UI, `src/hooks/` → business logic, `src/utils/` → pure utilities

### Convex Patterns
- Queries are reactive — no manual refetching needed
- When re-analyzing, old result moves to `previousResult` for diff tracking
- User sync: `storeUser()` mutation runs on dashboard mount via `storeUserAction()`

### UX Improvements
- **User-friendly errors:** `toUserFriendlyError()` utility (`src/utils/userFriendlyErrors.ts`) maps raw error messages (network, auth, not-found, timeout, rate-limit, parse) to plain English.
- **Context-specific success messages:** Each operation (save, delete, status update, set default) passes its own success message.
- **Toast auto-dismiss reset:** The 5s auto-dismiss timer resets when the user clicks "retry" (via `interactionCount` state in `Toast.tsx`).
- **Disabled button states:** `Button.tsx` applies `disabled:cursor-not-allowed disabled:opacity-50` with hover/active suppression per variant.
- **Mobile sidebar scroll:** Mobile sidebar panel has `overflow-y-auto` for long menu lists.

---

## Next.js Config

```ts
// next.config.ts
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [{ source: "/dashboard", destination: "/application-board", permanent: true }];
  },
};
```

- No custom webpack config (Turbopack default)
- No image domains, no rewrites

---

## TypeScript Config

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "strict": true,
    "noEmit": true,
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", ".next/dev/types/**/*.ts"],
  "exclude": ["node_modules", "convex"]
}
```
