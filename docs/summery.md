# ApplyAI — Full Project Summary

> AI-powered job application tracker. Organize applications, match resumes, and get AI-driven insights.

**URLs:** Production — N/A (local dev at `http://localhost:3000`)  
**Package Manager:** Bun 1.3.14  
**Framework:** Next.js 16.2 (App Router)  
**Language:** TypeScript 5.9 (strict mode)  
**Styling:** Tailwind CSS v4 (alpha) + CSS custom properties design system  
**Database:** Convex (reactive serverless DB with real-time WebSocket sync)  
**Auth:** Clerk (JWT-based, with Convex integration)

---

## Tech Stack

### Production Dependencies

| Package | Version | Purpose |
|---|---|---|
| `next` | ^16.2.9 | Framework — App Router, API routes, Turbopack bundler |
| `react` / `react-dom` | 19.2.6 | UI library |
| `@clerk/nextjs` | ^7.3.7 | Auth — sign-in/sign-up components, middleware, JWT |
| `convex` | 1.39.1 | Database — reactive queries, mutations, real-time sync |
| `ai` | ^6.0.184 | Vercel AI SDK — `generateText()` for structured LLM calls |
| `@ai-sdk/groq` | ^3.0.39 | Groq provider — `llama-3.3-70b-versatile` inference |
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
├── ai/
│   ├── prompts.ts               # System prompt for Groq Llama 3.3 comparison
│   └── schemas.ts               # Zod schemas for AI response contract
│
├── app/
│   ├── layout.tsx               # Root layout: ClerkProvider > ConvexClientProvider > ThemeProvider, fonts
│   ├── page.tsx                 # Landing page (composes all landing sections)
│   ├── api/compare/route.ts     # POST — Groq LLM comparison endpoint
│   ├── (auth)/
│   │   ├── layout.tsx           # Auth layout (centered card)
│   │   ├── sign-in/page.tsx     # Clerk <SignIn>
│   │   └── sign-up/page.tsx     # Clerk <SignUp>
│   └── (dashboard)/
│       ├── layout.tsx           # Dashboard shell: Sidebar + loading overlay + error toast
│       ├── application-board/
│       │   ├── page.tsx         # Main board: list jobs, add/edit/analyze
│       │   └── [id]/analysis/page.tsx  # AI analysis detail view
│       └── resume-templates/
│           └── page.tsx         # Resume template CRUD
│
├── components/
│   ├── providers/
│   │   ├── ConvexClientProvider.tsx  # ConvexProviderWithClerk wrapper
│   │   └── ThemeProvider.tsx         # Light/dark theme context + localStorage
│   ├── ui/
│   │   ├── Badge.tsx, Button.tsx, Card.tsx  # Primitives
│   ├── dashboard/
│   │   ├── Sidebar.tsx, AnalysisLoadingOverlay.tsx, ErrorToast.tsx
│   ├── application-board/
│   │   ├── ApplicationsBoard.tsx, AddApplicationModal.tsx, JobCard.tsx, SearchFilterBar.tsx
│   │   └── match-analysis/        # 12 sub-components (ScoreRing, KeywordCoverage, etc.)
│   ├── resume-templates/
│   │   ├── ResumeTemplates.tsx, ResumeCard.tsx, AddResumeModal.tsx, EditResumeModal.tsx
│   └── landing/                   # 10 sections + 10 UI sub-components
│
├── hooks/
│   ├── types.ts                 # Shared TS types
│   ├── useAnalysisStore.ts      # Zustand store (loading phases, error state)
│   ├── useRunAnalysis.ts        # Calls /api/compare, manages loading lifecycle
│   ├── useApplications.ts       # Convex reactive queries/mutations for applications
│   ├── useApplicationForm.ts    # Form state for add/edit job modal
│   ├── useApplicationSearch.ts  # Memoized search + status filter
│   ├── useResumes.ts            # Convex reactive queries/mutations for resumes
│   └── useResumeForm.ts         # Form state for add/edit resume modal
│
└── utils/
    ├── cn.ts                    # clsx + tailwind-merge utility
    ├── animations.ts            # Framer Motion variants
    └── useReveal.ts             # IntersectionObserver scroll reveal hook
```

---

## Routes

| Route | Type | Access | Description |
|---|---|---|---|
| `/` | Static | Public | Landing page (Hero, Features, Pricing, etc.) |
| `/sign-in` | Static | Public | Clerk sign-in form |
| `/sign-up` | Static | Public | Clerk sign-up form |
| `/application-board` | Dynamic (client) | Protected | Main job board — list, add, edit, analyze applications |
| `/application-board/[id]/analysis` | Dynamic (client) | Protected | AI analysis detail for a specific application |
| `/resume-templates` | Dynamic (client) | Protected | Resume template CRUD |
| `POST /api/compare` | API | Protected | Groq LLM comparison endpoint |

**Route protection** is handled by `proxy.ts` (Clerk middleware) which guards all `/application-board*`, `/resume-templates*`, and `/api/compare*` paths. Static assets and auth pages are excluded.

---

## Data Flow

### Authentication Flow

```
User → Clerk UI (SignIn/SignUp) → Clerk JWT → ConvexProviderWithClerk
                                                      ↓
                                              Convex WebSocket (authenticated)
                                                      ↓
                                         Convex queries filtered by identity.subject
```

- Clerk handles session management and JWT generation
- Convex validates Clerk JWTs via `auth.config.js` (JWT issuer domain)
- Every Convex query/mutation calls `ctx.auth.getUserIdentity()` to isolate user data
- The API route (`/api/compare`) checks Clerk session first, falls back to API key header

### AI Analysis Flow

```
Client (useRunAnalysis) → POST /api/compare { resumeText, jobDescription }
                                    ↓
                          Clerk auth() or API key check
                                    ↓
                          Groq (llama-3.3-70b-versatile) via Vercel AI SDK
                                    ↓
                          generateText() with JSON response format
                                    ↓
                          Parse + normalize + Zod validate
                                    ↓
                          Store in Convex (analyses table, previous preserved)
                                    ↓
                          Client reads via useQuery(api.applications.getAnalysis)
```

### Database (Convex Schema)

**4 tables:**

1. **`users`** — `clerkId` (indexed), `email`, `name`, `createdAt`
2. **`applications`** — `userId` (indexed), `company`, `role`, `status` (wishlist/applied/interviewing/offer/rejected), `dateApplied`, `url`, `jobDescription`, `matchScore`, `resumeUsed`, `customResumeContent`
3. **`analyses`** — `applicationId` (indexed), `userId` (indexed), `result` (full ComparisonResult object), `previousResult`, `updatedAt`
4. **`resumes`** — `userId` (indexed), `name`, `content`, `isDefault`, `updatedAt`

**`ComparisonResult`** is a complex nested type stored in analyses: score, fitLevel, summary, scoreBreakdown, matchedKeywords, missingKeywords, strengths, gaps, suggestions, structureSuggestions, interviewPrep, coverLetterDraft, skillRecommendations, actionItems, atsCheck.

---

## Environment Variables

| Variable | Required | Where Used |
|---|---|---|
| `GROQ_API_KEY` | Yes | API route — Groq LLM inference |
| `CLERK_SECRET_KEY` | Yes | Server — Clerk auth |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Client — Clerk frontend |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Yes | Client — `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Yes | Client — `/sign-up` |
| `CLERK_JWT_ISSUER_DOMAIN` | Yes | Convex auth.config.js |
| `NEXT_PUBLIC_CONVEX_URL` | Yes | Convex client provider |
| `NEXT_PUBLIC_CONVEX_SITE_URL` | Yes | Convex client provider |
| `API_KEY` | No | API route fallback auth |
| `NEXT_PUBLIC_API_KEY` | No | Client-side API key copy |
| `PORT` | No | Server port (default 3000) |

---

## Available Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start Next.js dev server (Turbopack) |
| `bun run build` | Production build (Turbopack) |
| `bun run start` | Start production server |
| `npx convex dev` | Start Convex dev server |
| `npx tsc --noEmit` | Type check |

---

## Key Patterns & Conventions

### Styling
- **Tailwind CSS v4** with PostCSS (`@tailwindcss/postcss`)
- CSS custom properties for theming (`--bg-surface`, `--accent`, `--text-body`, etc.) — defined in `src/index.css`
- Dark mode via CSS class toggle (`.dark`) + inline `<script>` for FOUC prevention
- `cn()` utility (`clsx` + `tailwind-merge`) used in all components for conditional classes
- Google Fonts: Bricolage Grotesque (display), DM Sans (body), JetBrains Mono (code) — loaded via `next/font/google`

### State Management
- **Zustand** — one store (`useAnalysisStore`) for analysis loading UI state
- **Convex reactive queries** (`useQuery`/`useMutation`) — all application data; server is source of truth
- **React local state** — UI concerns (modals, accordions, form inputs)
- **React Context** — `ThemeProvider` for theme toggle

### Auth & Security
- Clerk middleware (`proxy.ts`) protects all routes
- API route authenticates via Clerk `auth()` or API key header fallback
- Every Convex query/mutation filters by `identity.subject` (multi-tenant isolation)
- LLM output validated and normalized by Zod at API boundary
- `poweredByHeader: false` in next.config

### Animation
- Framer Motion — `AnimatePresence`, spring modals, stagger grids, SVG score reveals, accordion transitions
- `useReveal()` hook — IntersectionObserver-based scroll reveal on landing page
- Floating widget animations on hero

### Code Conventions
- **No comments in JSX/TSX** — write self-documenting code
- `'use client'` directive on client components that need hooks or browser APIs
- Server components are the default; only add `'use client'` when needed
- Path alias `@/*` maps to `src/*`
- Convex has its own `tsconfig.json` in `convex/` directory

### Convex Patterns
- Queries are reactive — no manual refetching needed
- When re-analyzing, old result moves to `previousResult` for diff tracking
- User sync: `storeUser()` mutation runs on application board mount

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
