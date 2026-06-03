# ApplyAI

> A production-grade, full-stack AI job application tracker & resume tailoring workspace.
> Built with Next.js 15, React 19, Convex, Clerk, Groq Llama 3.3 70b, Zod, Zustand, Tailwind v4, and Framer Motion.

ApplyAI helps job seekers organize their pipelines, manage resume templates, and leverage deep LLM evaluations to tailor their CV to target job descriptions in real time.

---

## Stack

```
┌──────────────────────────────────────────────────────────────┐
│                     Next.js 15 (App Router)                  │
│  React 19 · Tailwind v4 · Framer Motion · Lucide Icons      │
└──┬────────────────────────┬──────────────────┬───────────────┘
   │                        │                  │
   │  [Auth Handshake]     │                  │
   ▼                        ▼                  ▼
┌─────────────┐   ┌──────────────────┐   ┌──────────────┐
│  Clerk v7   │   │ Convex Serverless│   │  Zustand     │
│  (Auth)     │◄──┤ DB + WebSockets  │   │  (Client     │
│             │   │ (reactive sync)  │   │   State)     │
└─────────────┘   └────────┬─────────┘   └──────────────┘
                           │
                   [Structured LLM Call]
                           ▼
                ┌───────────────────────┐
                │   Vercel AI SDK       │
                │   @ai-sdk/groq        │
                │   → Zod v4 Validation │
                └───────────┬───────────┘
                            │
                ┌───────────▼───────────┐
                │  Groq LPU Inference   │
                │  Llama 3.3 70b        │
                └───────────────────────┘
```

### Why This Stack

- **Next.js 15 + React 19** — App Router, Server Components, API routes, Middleware-level access protection, optimized asset pipeline, seamless Vercel deployment.
- **Clerk v7** — Zero-boilerplate auth with pre-built components (SignIn, SignUp, UserButton), JWT integration with Convex, and middleware route protection.
- **Convex** — Reactive serverless database with persistent WebSocket sync. UI updates instantly when data changes — no polling, no manual refetches.
- **Groq + Llama 3.3 70b** — LPU-accelerated inference generates deep structured resume analysis in under a second.
- **Zod v4** — Validates and type-checks every LLM JSON response at the API boundary, ensuring type safety end-to-end.
- **Zustand** — Lightweight client state for analysis loading phases and UI orchestration.
- **Tailwind v4 + CSS Custom Properties** — Utility-first styling with design tokens and 3-tier dark mode (explicit class, system preference, FOUC-prevention script).
- **Framer Motion** — Page transitions, modal enter/exit animations, sidebar slide-in, scroll reveal.

---

## Features

- **Dark Mode** — Full light/dark theme with localStorage persistence, system preference detection, and a blocking inline script that prevents flash of unstyled content (FOUC). Toggle in both the landing navbar and dashboard sidebar.

- **Kanban Applications Board** — Grid-based pipeline (Wishlist, Applied, Interviewing, Offer, Rejected) with real-time status transitions, search/filter, and match score badges.

- **AI Resume Analysis** — Evaluates your resume against a job description and returns:
  - **Match Score & Fit Level** — Numerical score (0–100) with breakdown across technical skills, experience, keyword match, and seniority fit.
  - **Score Breakdown** — Radar-ready sub-scores for each dimension.
  - **Keyword Coverage** — Categorized matched/missing keywords with importance levels and context.
  - **Strengths & Gaps** — Direct comparison highlighting achievements and missing credentials.
  - **Bullet Rewrites** — Side-by-side original vs. suggested text with professional rationale.
  - **Structure Suggestions** — Section-level recommendations (summary, experience, education, etc.) with priority.
  - **Skill Roadmap** — Prioritized skill recommendations with learning resources.
  - **Action Items** — Critical/recommended/optional next steps with impact and effort estimates.
  - **ATS Check** — ATS compatibility score with formatting issues and severity warnings.
  - **Cover Letter Draft** — Generated 2–3 paragraph cover letter.
  - **Interview Coach** — Role-specific questions with strategy advice and difficulty ratings.

- **Analysis Diff** — When re-analyzing an application, shows a diff between the previous and new result, highlighting what changed.

- **Side-by-Side 3-Column Tailoring Workspace** — Left panel for application metadata and resume selection, center panel for editing resume copy, right panel for the target job description.

- **Multi-Resume Template Manager** — Create, edit, and store multiple resume versions. Mark a default for auto-loading into the tailoring workspace.

---

## Security

- **Clerk Middleware** — Protects `/dashboard/*`, `/application-board/*`, `/resume-templates/*`, and `/api/compare` behind authentication.
- **API Key Fallback** — The `/api/compare` endpoint can be called without a Clerk session by passing an `x-api-key` header matching the `API_KEY` env var (optional).
- **JWT Verification** — Convex validates incoming WebSocket handshakes against Clerk's JWT issuer for zero unauthorized data access.
- **Multi-Tenant Isolation** — Every database query filters by Clerk user ID (`ctx.auth.getUserIdentity()`), preventing cross-user leakage.
- **Zod Validation** — All LLM output is validated and sanitized through Zod schemas before reaching the database or UI.

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm (or Bun 1.0+)
- Accounts: [Clerk](https://clerk.com), [Groq](https://console.groq.com), [Convex](https://convex.dev)

### 1. Clone and Install

```bash
git clone https://github.com/1ewig/apply-ai.git
cd apply-ai
bun install
```

### 2. Environment Setup

Copy `.env.example` to `.env.local` and fill in your credentials:

| Variable | Source |
|---|---|
| `GROQ_API_KEY` | [Groq Console](https://console.groq.com) → API Keys |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | [Clerk Dashboard](https://dashboard.clerk.com) → API Keys |
| `CLERK_SECRET_KEY` | Same |
| `CLERK_JWT_ISSUER_DOMAIN` | Clerk Dashboard → Configure → JWT Templates → Convex template → Issuer |
| `NEXT_PUBLIC_CONVEX_URL` | Printed by `npx convex dev` |
| `NEXT_PUBLIC_CONVEX_SITE_URL` | Printed by `npx convex dev` |

### 3. Start Convex

```bash
npx convex dev
```

This deploys the backend functions and prints your Convex URLs.

### 4. Run Dev Server

```bash
bun run dev
```

Open `http://localhost:3000`.

---

## Deployment

See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for a step-by-step guide covering Clerk production setup, Convex deployment, environment variables, and Vercel hosting.

---

## License

MIT
