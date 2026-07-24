# ApplyAI — Full Project Summary

> AI-powered job application tracker. Organize applications, upload & parse resumes with AI, extract job descriptions, and get agentic resume tailoring suggestions with real-time score tracking.

**URLs:** Production — N/A (local dev at `http://localhost:3000`)  
**Package Manager:** Bun 1.3.14  
**Framework:** Next.js 16.2 (App Router)  
**Language:** TypeScript 5.9 (strict mode)  
**Styling:** Tailwind CSS v4 (alpha) + CSS custom properties design system  
**Database:** Convex (serverless DB, accessed via Server Actions + `convex/nextjs`)  
**Auth:** Clerk v7 (JWT-based, with Convex integration)

---

## Tech Stack

### Production Dependencies

| Package | Version | Purpose |
|---|---|---|
| `next` | ^16.2.10 | Framework — App Router, API routes, Turbopack bundler |
| `react` / `react-dom` | 19.2.6 | UI library |
| `@clerk/nextjs` | ^7.3.7 | Auth — sign-in/sign-up components, middleware, JWT |
| `convex` | ^1.42.1 | Database — queries, mutations, Server Action integration |
| `ai` | ^6.0.184 | Vercel AI SDK — `generateObject()` + `generateText()` for structured LLM calls |
| `@ai-sdk/groq` | ^3.0.39 | Groq provider — `llama-3.3-70b-versatile` inference |
| `@ai-sdk/google` | latest | Google Gemini provider — configurable via `AI_PROVIDER` env var |
| `zod` | ^4.4.3 | Schema validation — LLM output parsing, API contracts |
| `zustand` | ^5.0.13 | Client state — analysis session store (chat, parsed resume, edits, scores) |
| `framer-motion` | ^12.38.0 | Animation — page transitions, modals, SVG score reveals |
| `lucide-react` | ^1.14.0 | Icons |
| `@tanstack/react-query` | ^5.x | Server state — data fetching, caching, optimistic updates |
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
├── proxy.ts                     # Next.js middleware — Clerk route protection
│
├── agent/                       # AI / LLM integration layer
│   ├── types.ts                 # Zod schemas + TypeScript types (SessionBlueprint, AgentTask, ResumeSection, JdExtract, etc.)
│   ├── config.ts                # AI provider + model configuration (reads AI_PROVIDER, AI_MODEL env vars)
│   ├── prompts.ts               # System prompts + prompt builders for resume parser & JD extractor
│   ├── errors.ts                # normalizeAiError() — maps LLM/network errors to user-friendly strings
│   └── provider.ts              # parseResume() + extractJd() — provider-agnostic LLM calls (Groq or Google)
│
├── app/
│   ├── layout.tsx               # Root layout: ClerkProvider > ConvexClientProvider > ThemeProvider, fonts
│   ├── page.tsx                 # Landing page (composes all landing sections)
│   ├── actions/
│   │   ├── users.ts             # storeUserAction() — Convex user sync server action
│   │   └── applications.ts      # Server Actions — list, getAnalysis, add, update, delete via convex/nextjs
│   ├── api/
│   │   └── plan/
│   │       ├── parse-resume/
│   │       │   └── route.ts     # POST /api/plan/parse-resume — AI resume parsing (Clerk auth protected)
│   │       └── extract-jd/
│   │           └── route.ts     # POST /api/plan/extract-jd — AI JD extraction (Clerk auth protected)
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
│   │   │   ├── ApplicationsBoard.tsx         # Board layout with search + filter
│   │   │   ├── AddApplicationModal.tsx       # Add/edit application modal (multi-step)
│   │   │   ├── JobCard.tsx                   # Individual application card
│   │   │   ├── SearchFilterBar.tsx           # Search + status filter bar
│   │   │   ├── AnalysisLoadingOverlay.tsx    # Full-screen AI loading overlay with phase animation
│   │   │   └── match-analysis/               # Analysis detail components
│   │   │       ├── AnalysisPageClient.tsx    # Analysis orchestrator — wires hooks, queries, state
│   │   │       ├── AgentChatPanel.tsx        # Chat timeline, step indicators, input bar
│   │   │       ├── AnalysisSidebar.tsx       # Score ring, readiness tier, tailoring roadmap
│   │   │       ├── AnalysisRightSidebar.tsx  # Resume preview + JD breakdown tabs
│   │   │       ├── ApprovalCard.tsx          # Fidelity approval card (re-parse / continue)
│   │   │       ├── MissingInfoCard.tsx       # Missing fields form card
│   │   │       ├── DiffCard.tsx              # Edit proposal diff card (before/after)
│   │   │       ├── ChatInputBar.tsx          # Chat input + suggestion chips
│   │   │       └── ApplyAiIcon.tsx           # App icon avatar component
│   │   └── resume-templates/
│   │       ├── ResumeTemplates.tsx, ResumeCard.tsx, AddResumeModal.tsx, EditResumeModal.tsx
│   └── landing/                      # 10 landing page sections + UI sub-components
│
├── hooks/
│   ├── useApplications.ts       # TanStack React Query — CRUD for job applications
│   ├── useApplicationForm.ts    # Form state for add/edit job modal
│   ├── useApplicationSearch.ts  # Memoized search + status filter
│   ├── useForm.ts               # Generic form state hook
│   ├── useParseResumeStep.ts    # Step 1: resume upload, AI parsing, fidelity auto-approve
│   ├── useExtractJdStep.ts      # Step 2: JD extraction, role/company auto-fill
│   ├── useChatSync.ts           # Syncs Zustand chatMessages to Convex via Server Actions
│   ├── useResumes.ts            # TanStack React Query — CRUD for resume templates
│   ├── useResumeForm.ts         # Form state for add/edit resume modal
│   └── useSubmitApplication.ts  # Handles add/update job submission and post-action routing
│
├── stores/
│   └── useAnalysisStore.ts      # Zustand store — analysis session state (chat messages, parsed resume, JD extract, edit history, scores, UI flags)
│
├── providers/
│   ├── ConvexClientProvider.tsx  # ConvexProviderWithClerk wrapper
│   └── ThemeProvider.tsx         # Light/dark theme context + localStorage
│
├── types/
│   └── index.ts                 # App-level types (JobApplication, Resume, ComparisonResult alias)
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
| `POST /api/plan/parse-resume` | API | Protected | AI resume parsing — calls Groq or Google Gemini |
| `POST /api/plan/extract-jd` | API | Protected | AI JD extraction — calls Groq or Google Gemini |

**Route protection** is handled by `proxy.ts` which guards `/application-board*`, `/resume-templates*`, `/api/plan/parse-resume`, and `/api/plan/extract-jd` via `clerkMiddleware()` + `auth.protect()`. Static assets and auth pages are excluded. Clock skew tolerance is set to 30 seconds (`clockSkewInMs: 30000`).

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
- Server Actions use `auth().getToken({ template: "convex" })` to authenticate Convex calls from Next.js routes

### Data Layer (TanStack React Query + Server Actions)

Application and resume data is fetched via TanStack React Query, which calls Server Actions that use `fetchQuery`/`fetchMutation` from `convex/nextjs`. This is not the reactive Convex hook pattern — data is explicitly fetched and cached on the client.

```
Component → useQuery("applications") → listApplicationsAction (Server Action)
             → fetchQuery(api.applications.list, {}, { token }) → Convex
             → TanStack cache → UI re-render
```

### AI Resume Parsing Flow (Step 1)

```
User opens analysis page for a job
       ↓
useParseResumeStep → POST /api/plan/parse-resume { resumeText }
                              ↓
                     Clerk auth() check
                              ↓
                     agent/provider.ts → parseResume()
                              ↓
                     Groq (llama-3.3-70b-versatile) or Google Gemini
                     via Vercel AI SDK generateObject()
                              ↓
                     Zod-validated ParseResumeResult
                     (includes fidelityScore 0-100 for self-review)
                              ↓
                     Fidelity auto-approve:
                       ≥ 90 → auto-continue to Step 2
                       < 90 → show ApprovalCard for user confirmation
                              ↓
                     Client saves result to Zustand + Convex
```

### AI JD Extraction Flow (Step 2)

```
Triggered by auto-approve (fidelity ≥ 90) or user clicks "Continue" on approval card
       ↓
useExtractJdStep → POST /api/plan/extract-jd { jdText }
                           ↓
                  Clerk auth() check
                           ↓
                  agent/provider.ts → extractJd()
                           ↓
                  Groq or Google Gemini
                  via Vercel AI SDK generateText() + Output.object()
                           ↓
                  Zod-validated JdExtract (roleTitle, keywords, responsibilities, etc.)
                           ↓
                  Auto-fill role/company if empty on the application
                           ↓
                  Client saves result to Zustand + Convex
```

### Database (Convex Schema)

**4 tables:**

1. **`users`** — `clerkId` (indexed), `email`, `name`, `createdAt`
2. **`applications`** — `userId` (indexed), `company`, `role`, `status` (wishlist/applied/interviewing/offer/rejected), `dateApplied`, `url`, `jobDescription`, `matchScore`, `resumeUsed`, `customResumeContent`
3. **`analyses`** — `applicationId` (indexed), `userId` (indexed), `result` (ComparisonResult), `previousResult`, `parsedResume` (array of ResumeSection), `jdExtract` (JdExtract), `chatMessages` (array of ChatMessage), `tailoringStage` (idle/parsing_resume/step1_complete/extracting_jd/ready/error), `lastError`, `updatedAt`
4. **`resumes`** — `userId` (indexed), `name`, `content`, `isDefault`, `updatedAt`

**Key types:**
- **`ComparisonResult`** (alias for `SessionBlueprint`): `overallScore`, `readinessTier`, `tasks` (array of `AgentTask`), `quickWins`, `blockers` — does NOT contain `parsedResume`
- **`ResumeSection`**: `heading`, `content` (GFM-markdown formatted text)
- **`JdExtract`**: `roleTitle`, `companyName`, `mustHaveKeywords`, `niceToHaveKeywords`, `seniorityLevel`, `coreResponsibilities`, `companyContext`, `requiredQualifications`, `preferredQualifications`
- **`ChatMessage`**: `id`, `role` (user/assistant/system), `content`, `type`, `metaJson` (stringified polymorphic meta)

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
| `API_KEY` | No | `/api/plan/*` fallback auth for automated/server callers |

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
- **Zustand** (`useAnalysisStore`) — full analysis session state: `chatMessages`, `parsedResume`, `resumeSections`, `jdExtract`, `editHistory`, `taskPlan`, `overallScore`, `readinessTier`, `rightSidebarOpen`, `rightSidebarTab`, and loading/error UI state
- **TanStack React Query** — application and resume data fetching via Server Actions; provides caching, optimistic updates, auto-refetch
- **React local state** — UI concerns (modals, accordions, form inputs)
- **React Context** — `ThemeProvider` for theme toggle

### Auth & Security
- **`proxy.ts` vs `middleware.ts`:** Next.js 16 dropped the mandatory `middleware.ts` filename. The file is at `src/proxy.ts` — the intended Next.js 16 convention, **not** a mistake. Do not rename it.
- Clerk middleware (`proxy.ts`) protects `/application-board*`, `/resume-templates*`, `/api/plan/parse-resume`, `/api/plan/extract-jd` via `clerkMiddleware()` + `auth.protect()`
- `clockSkewInMs: 30000` set on `clerkMiddleware()` to tolerate local system clock drift during development
- Auth pages (`/sign-in`, `/sign-up`) are public
- Post-sign-in redirect uses `fallbackRedirectUrl="/application-board"` on `<SignIn>`/`<SignUp>` components (not the deprecated `afterSignInUrl`)
- Every Convex query/mutation filters by `identity.subject` (multi-tenant isolation)
- LLM output validated and normalized by Zod at API boundary via `generateObject()` or `Output.object()`
- `poweredByHeader: false` in `next.config.ts`

### Agent / AI Layer
- All AI logic lives in `src/agent/` — no AI imports outside this folder and `src/app/api/`
- Provider-agnostic: `agent/config.ts` reads `AI_PROVIDER` + `AI_MODEL` env vars to select Groq or Google Gemini
- `agent/types.ts` owns all Zod schemas and TypeScript types for AI data contracts
- `agent/errors.ts` normalizes LLM/network errors to user-facing strings
- `agent/provider.ts` exports `parseResume()` (uses `generateObject`) and `extractJd()` (uses `generateText` + `Output.object`)
- `agent/prompts.ts` contains system prompts for both resume parsing (with fidelity self-review scoring rules) and JD extraction
- **Fidelity Scoring:** Resume parser self-assigns `fidelityScore` (0-100) by comparing output against original text. ≥ 90 auto-approves, < 90 shows approval card for user review. Re-parse always auto-approved.

### Animation
- Framer Motion — `AnimatePresence`, spring modals, stagger grids, SVG score reveals, accordion transitions, chat message entrances
- Floating widget animations on hero

### Code Conventions
- **No comments in JSX/TSX** — write self-documenting code
- `'use client'` directive on client components that need hooks or browser APIs
- Server components are the default; only add `'use client'` when needed
- Path alias `@/*` maps to `src/*`
- Convex has its own `tsconfig.json` in `convex/` directory
- 4-layer separation: `src/app/` → pages, `src/components/` → UI, `src/hooks/` → business logic, `src/utils/` → pure utilities

### Convex Patterns
- **Not reactive on the client** — data is fetched via TanStack React Query + Server Actions (`convex/nextjs` `fetchQuery`/`fetchMutation`), not the Convex React hooks
- When re-analyzing, old result moves to `previousResult` for diff tracking
- User sync: `storeUser()` mutation runs on dashboard mount via `storeUserAction()`

### UX Patterns
- **User-friendly errors:** `toUserFriendlyError()` utility (`src/utils/userFriendlyErrors.ts`) maps raw error messages (network, auth, not-found, timeout, rate-limit, parse) to plain English.
- **Context-specific success messages:** Each operation (save, delete, status update, set default) passes its own success message.
- **Toast auto-dismiss reset:** The 5s auto-dismiss timer resets when the user clicks "retry" (via `interactionCount` state in `Toast.tsx`).
- **Disabled button states:** `Button.tsx` applies `disabled:cursor-not-allowed disabled:opacity-50` with hover/active suppression per variant.
- **Analysis session flow:** 2-step pipeline (parse resume → extract JD) with fidelity-gated auto-approval, natural conversational UX messages, and step indicators in the chat panel header.

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
