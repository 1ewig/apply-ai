---

# ApplyAi — Product & Engineering Documentation
### Agentic Resume Tailoring Platform | v1.0

---

## 1. Product Vision

ApplyAi is an agentic resume tailoring platform. It is not a resume scanner, a score report, or a chatbot. It is the first product that behaves like a senior career coach and IDE agent combined — one that reads your resume, reads the job description, builds its own plan, and walks you through every fix until your resume is genuinely ready to submit.

The core premise is that the resume optimization market is full of tools that throw reports at users. They score, they highlight, they list problems. None of them sit with the user and finish the job. ApplyAi finishes the job.

The product experience is built around one governing principle: **the agent drives, the user steers.** The agent creates the task plan, proposes every change, and decides when a section is good enough. The user approves, rejects, or redirects — but never stares at a blank field wondering what to do next.

---

## 2. Market Position

The resume tool market is large, established, and largely stagnant in its UX thinking. The key players are Jobscan (keyword matching, $50/month), Teal (job tracking + resume builder, $29–39/month), Resume Worded (writing quality feedback, $49/month), Rezi (ATS compliance formatting), and Enhancv (visual + substance analysis). All of them share the same fundamental flaw: they produce a report and leave the user alone with it.

The critical gaps ApplyAi is built to own are:

**Nobody finishes the job.** Every competitor ends at the report. ApplyAi ends at a submitted-ready resume.

**Rewrites feel robotic.** Competitor AI rewrites produce generic language that sounds like every other AI-assisted applicant. ApplyAi shows before/after diffs and gives the user tuning controls so the output still sounds like them.

**Pricing punishes the unemployed.** $50/month is a real burden for someone between jobs. ApplyAi offers a pay-per-job option that removes subscription pressure at the moment of highest need.

**No tool combines all four analysis modes.** Keyword matching, ATS parsing simulation, bullet rewriting, and narrative/career story analysis are all separate products today. ApplyAi unifies them in a single guided session.

**The one-line positioning:** *"The only resume tool that walks you through your fix, not just your score."*

---

## 3. The Agentic Architecture — How It Thinks

### 3.1 The Mental Model

ApplyAi does not use a hardcoded step-by-step flow. The agent generates the structure. Two different resumes against two different JDs produce two entirely different task plans. This is the product's core differentiator — the plan feels personal because it is.

The agent follows a deliberate loop that mirrors what makes IDE agents like Cursor feel like collaborators rather than tools:

```
Analyze → Plan → Reason aloud → Propose diff → Await approval → Apply → Update state → Next task
```

Every step in this loop is visible to the user. The agent never acts silently.

### 3.2 The Planning Call — Session Initialization

The moment a user submits their resume and job description, a single structured `generateObject` call runs in the background during the loading screen. This is not a conversation. It is a one-shot analysis that produces the complete session blueprint.

This call outputs:
- An overall match score
- A resume readiness tier (poor / fair / good / strong)
- A prioritized task list with section assignments, severity levels, estimated click counts, and flags for tasks that require missing user information
- A compressed JD extract (role title, must-have keywords, nice-to-have keywords, seniority level, core responsibilities, company context in one line)
- A list of quick wins — tasks solvable in a single click
- A list of blockers — tasks the agent cannot complete without user input

By the time the user sees the agent interface, the task plan is already built. There is no wait after onboarding.

### 3.3 Agent Tools

The agent operates through explicit tool calls, not freeform text generation. This is architecturally important. Tool calls produce structured, predictable outputs that the UI can render as purpose-built components rather than parsing raw text.

**Read tools:**
- `getResumeSection` — retrieves the current content of a specific section
- `getJobDescription` — retrieves the full JD or a focused part of it (used sparingly, as the JD extract covers most needs)

**Write tools:**
- `proposeEdit` — proposes a single section or line-level change with before content, after content, reasoning, and estimated score impact
- `proposeMultipleEdits` — proposes a batch of related changes under a single title, with individual accept/reject per item and an accept-all option
- `highlightJDKeyword` — flags a missing keyword in the right panel's JD view for visual reference

**Information tools:**
- `requestUserInput` — asks the user for a specific missing piece of information, always accompanied by fast-reply chips so typing is optional

The agent reasons out loud before every tool call. It does not just produce a diff. It says why the change matters for this specific JD, then the diff card appears. This is the difference between a tool and a mentor.

### 3.4 The Human-in-the-Loop Layer

AI SDK 7 provides human-in-the-loop control with a `needsApproval` flag, requiring no custom code. ApplyAi uses this at the `proposeEdit` and `proposeMultipleEdits` tool level. Every change the agent wants to make to the resume is an approval event. The agent cannot write to the document unilaterally. This is both a trust design decision and a product quality decision — users who approve changes understand and own the result.

For session durability, the `WorkflowAgent` from `@ai-sdk/workflow` handles long-running agent execution, with state persisted to durable storage between steps so agents survive deploys, process restarts, and interruptions. This means a user who closes the tab mid-session can return and pick up exactly where they left off.

---

## 4. The Interface Architecture

### 4.1 Three-Panel Layout

The application shell is a fixed three-panel layout that persists throughout the entire agent session.

**Left sidebar (22% width) — The Agent Task List**
This is the primary navigation and progress surface. It shows the agent-generated task list with live status updates, the overall match score with an animated counter, and session controls. It is not a static menu. It is a live document the agent writes to and updates as work progresses.

**Center panel (50–72% width) — The Agent Chat**
This is the primary interaction surface. It contains the conversation history between the user and the agent, all diff cards, score update events, and the input field. It is not a generic chatbox. It has a message type system that renders different components for different events.

**Right panel (28% width, two modes) — The Document Reference Panel**
This panel contains the live resume document and the JD reference. It has two modes: overlay (default, slides in on top of the center panel) and pinned (permanently visible, shrinks the center panel). When edits are accepted in the center panel, they appear in the right panel's live resume with an animated yellow highlight that fades to white. The right panel is the ground truth — it shows the resume getting better in real time.

### 4.2 Left Sidebar — Task List Detail

The task list uses a clear visual language:
- Pulsing blue dot — currently active task
- Empty circle — pending
- Green check with strikethrough — completed
- Spinning indicator — agent working
- Warning flag — needs user input before agent can proceed
- Grey strikethrough — skipped by user

Under every active task, the sidebar shows an estimated click count. "2 clicks left" is a psychological commitment device. Users do not abandon tasks at 2 clicks left. This number is honest — it is calculated from the actual number of pending diff cards in the current task, with a hard cap of 5 per task.

The sidebar also shows:
- Overall score with animated progress bar
- Count of applied edits today
- Count of pending edits awaiting approval
- Undo last edit button (Cmd+Z also works globally)
- Skip all medium-priority tasks shortcut
- Export resume button (gated behind auth)

### 4.3 Center Panel — Message Type System

The chat does not render plain user/assistant message pairs. It has a purpose-built message type system:

- `user` — the user's text input
- `agent-thinking` — streaming reasoning, rendered in italic muted text while the agent is working through tool calls
- `agent-text` — standard agent response
- `diff-card` — the before/after approval UI (the primary interactive component)
- `diff-batch` — multiple related diffs grouped under one title
- `tool-call` — a subtle action pill showing what the agent is currently reading (e.g., "Checking Experience section...")
- `score-update` — celebratory event showing score change (e.g., "Experience: 48 → 71")
- `system-event` — quiet confirmation of applied or rejected changes
- `user-input-request` — structured ask with fast-reply chips

While the agent is reasoning and calling tools, the chat shows a live thinking state with each tool call rendering as a line that ticks in progressively. This is not a spinner. It communicates what the agent is actually doing.

### 4.4 The Diff Card — Primary Interactive Component

The diff card is the most important component in the product. Every design and engineering decision about the diff card should be treated with the same seriousness as the core AI logic.

**Anatomy of a diff card:**
- Section label and edit type (e.g., "Experience — Bullet Point Edit")
- Estimated score impact shown as a +N badge
- A one-line reasoning statement explaining why this change helps for this JD
- Before content block (read-only, in muted styling)
- After content block (the proposed new text, with JD keyword tags highlighted inline)
- Action row: Accept / Reject / Edit / Retry

**On Accept:**
The card gets a green border flash. A checkmark animates in. The right panel's live resume instantly updates the changed line with a yellow highlight that fades to white over 1.5 seconds. The section score in the sidebar ticks up. The overall score in the header animates to the new value. A `score-update` event posts to the chat.

**On Reject:**
The card collapses with a brief red flash. The agent immediately responds — it never goes silent after a rejection. The response acknowledges the rejection and offers a direction: try a different angle, adjust the tone, or move on. Rejection is always a conversation, never a dead end. This is the most important UX rule in the entire product.

**On Edit:**
The After content block becomes an inline editable textarea. The user modifies the suggestion. An "Accept Edited Version" button appears. The edited version is passed back into the agent's context so subsequent suggestions reflect the user's preferences.

**On Retry:**
A tone selector appears inline below the diff card: More Formal / More Casual / More Technical / Shorter. One click triggers a regeneration of only that diff. The original diff card is replaced by the new one.

**Batch diff cards** group related changes under a single header with an Accept All option. Individual items within a batch can still be accepted or rejected separately.

### 4.5 The Input Field

The input field is not a plain textarea. It is an intelligent command surface:

- **`@` mentions** — typing `@experience` focuses the agent on that section immediately. The agent acknowledges the redirect and pivots.
- **`/` slash commands** — `/rewrite summary`, `/check ats`, `/compare jd`, `/undo`, `/skip`, `/export` are all valid commands the agent understands and acts on
- **Fast-reply chips** — when the agent asks a question or requests input, pre-built reply options appear above the input field. These handle the majority of user input cases without requiring typing.
- **Voice input** — triggers transcription via the AI SDK's stable `transcribe` API. Especially important for mobile users.

---

## 5. The Handholding System — Guardrails Without Rails

The most important design tension in the product is between openness (agent feels powerful and flexible) and structure (user finishes their resume without getting lost). These are the rules that resolve that tension.

### Rule 1 — The Agent Always Starts

After the task plan loads, the agent immediately begins Task 1 without waiting for a user prompt. It states what it is working on, why it matters for this JD, and posts the first diff card. The user's first action is always an approval decision, never a blank prompt.

### Rule 2 — Three Diffs Per Task Maximum

Each task has a hard cap of three proposed diffs. If a section has ten problems, the agent addresses the three with the highest impact on the specific JD match. The remaining issues are logged as a new medium-priority "Polish Pass" task appended to the bottom of the task list. Users see visible progress fast and nothing feels overwhelming.

### Rule 3 — User Input Is Always Specific and Chipped

When the agent needs information that is not in the resume — a metric, a URL, a missing credential — it asks for exactly one thing at a time. The ask is phrased conversationally and accompanied by fast-reply chips that cover the most common answers. Typing is optional. The agent can generate a strong output from a chip selection alone.

### Rule 4 — The Good Enough Gate

After three accepted diffs in a section, or when the section score crosses a pre-calculated threshold for this JD's requirements, the agent surfaces a completion prompt:

> "Your Summary is now strong enough to pass ATS for this role. Move on or keep refining?"

Two buttons: Move to Next Task / Keep Refining. This gives users explicit permission to stop. Most will take it. The agent decides when good enough is reached — that decision itself is a product feature.

### Rule 5 — Section Jumping Is Always Available

At any point the user can type `@skills` or `/jump experience` and the agent pivots. The current task is paused, saved to pending, and the agent begins the jumped-to section. This keeps the product feeling powerful and flexible even while the default flow is guided.

---

## 6. Context Window Strategy

### 6.1 The Three-Layer Model

Every agent request is assembled from three context layers with a total target budget of approximately 4,000 input tokens per request.

**Layer 1 — Permanent System Prompt (~800 tokens)**
This layer never changes and is sent with every request. It contains the agent's persona and behavioral rules, output format specifications for every tool, the diff card schema, task completion criteria, the rejected edits anti-repeat policy, and the good-enough threshold logic.

**Layer 2 — Session Context (~1,500 tokens, hard cap)**
This layer is dynamically assembled before each request and always included. It contains the current resume state as a structured sections object (not the raw resume text), the JD extract (not the full JD), the current task plan with statuses, and the rejected edits log as a compact array of section-scoped identifiers.

**Layer 3 — Conversation Window (~1,200 tokens)**
This layer uses a sliding window with smart compression. The last eight messages of the active task are included in full. Completed tasks are compressed to a single one-line summary system message. Skipped tasks are dropped entirely. This means token count stays roughly constant regardless of how long the session has been running.

### 6.2 The JD Compression Strategy

The full job description can be 2,000+ tokens. It is stored in Supabase and extracted once at session initialization. The JD extract — role title, up to ten must-have keywords, up to ten nice-to-have keywords, seniority level, five core responsibilities, one-line company context — costs approximately 200 tokens and covers the vast majority of agent reasoning needs. The full JD is only retrieved when the agent explicitly calls `getJobDescription()`, which is rare.

### 6.3 The Resume State Strategy

Raw resume text is never re-sent to the LLM after initialization. The agent always works from a structured sections object that reflects the current accepted state. The original resume is stored in Supabase and used only for the initial analysis call and for the before/after export comparison.

### 6.4 The Rejected Edits Log

Every rejected diff is logged as a compact section-scoped identifier (e.g., `exp:bullet-2`, `summary:opener`). This log is included in every subsequent request. Without it, agents re-suggest rejected edits — and nothing breaks user trust faster than an agent that does not remember being told no.

### 6.5 Session Persistence

Sessions are stored in Supabase with the complete resume state, task plan, edit history, and compressed conversation summary. If a user returns after two or more hours of inactivity, the session is rehydrated with a single context-efficient call. The agent greets them with a brief status recap and picks up from the current task. The user never loses progress.

### 6.6 Model Allocation

Not every call needs the most capable model. Cost is managed by routing intelligently:

| Call Type | Model | Reason |
|---|---|---|
| Initial task plan generation | GPT-4o | Quality critical, runs once |
| Diff proposals | GPT-4o | Quality critical, user-facing |
| JD extraction | GPT-4o-mini | Structured extraction, low complexity |
| User input parsing | GPT-4o-mini | Intent classification, low stakes |
| Score recalculation | Local algorithm | No LLM needed |
| Good-enough gate | Rule-based | No LLM needed |

---

## 7. Full Technology Stack

### 7.1 Core Stack

| Layer | Technology | Role |
|---|---|---|
| Framework | Next.js 16 (App Router) | RSC, streaming, API routes |
| AI SDK | Vercel AI SDK 7 | Agent loop, tool calls, streaming, approvals |
| Database | Supabase | Auth, session storage, resume storage, file storage |
| Server state | TanStack Query | API caching, optimistic updates |
| Client state | Zustand | Agent session store, resume state machine |
| Validation | Zod | AI output schemas, form validation, tool parameter schemas |
| Styling | Tailwind CSS + shadcn/ui | Component library, design system |
| Deployment | Vercel | Edge functions, Workflows for durable agent execution |

### 7.2 AI SDK 7 Features in Use

AI SDK 7 adds production-oriented agent features including reasoning control, typed tool context, runtime context, WorkflowAgent durability, approvals, telemetry, lifecycle events, and realtime voice support. ApplyAi uses the following specifically:

- **`generateObject` with Zod schemas** — for the initial task plan generation
- **`streamText` with tools** — for the main agent conversation loop
- **`WorkflowAgent`** — for durable session execution that survives tab closes and reconnects
- **`needsApproval` flag** — for the human-in-the-loop diff approval system
- **`transcribe`** — for voice input in the chat field
- **`maxSteps`** — to allow multi-step tool use within a single agent turn
- **Memory Tool** — to store and retrieve information across the conversation through a memory file directory

The agent loop primitive in the SDK adds first-class autonomous-loop support — multi-step planning, stop conditions, and tool sequencing — without requiring an additional orchestration framework.

### 7.3 Supporting Libraries

| Library | Purpose |
|---|---|
| `pdf-parse` | Extract text from uploaded PDF resumes |
| `mammoth.js` | Extract text from DOCX resumes |
| `react-dropzone` | Drag-and-drop resume upload |
| `framer-motion` | Score reveal animations, diff card transitions, sidebar state |
| `@react-pdf/renderer` | Generate the final optimized resume as a downloadable PDF |
| `diff-match-patch` | Compute and display character-level diffs in the before/after view |
| `react-hook-form` | Forms (signup, settings) |
| `recharts` | Score visualization, keyword gap chart |
| `Stripe` | Subscriptions and pay-per-analysis payments |
| `Resend + React Email` | Transactional emails (signup, session recap, export link) |
| `Sonner` | Toast notifications |
| `Upstash Redis` | Rate limiting per user tier |
| `@ai-sdk/otel` | Agent telemetry and observability |

---

## 8. Data Architecture

### 8.1 Core Entities

**Users**
Standard auth entity via Supabase Auth. Stores tier (free / pro / teams), usage counters for rate limiting, and Stripe customer ID.

**Sessions**
The central entity. One session = one resume + one JD analysis. Stores the original resume text, the structured sections object in its current state, the JD extract, the full task plan, the edit history as an ordered log, the rejected edits log, the conversation summary, and the current overall score. Sessions are linked to a user and optionally to a saved job.

**Edits**
An immutable log of every proposed, accepted, rejected, and user-modified edit. Each edit record stores the session ID, section key, before content, after content, reasoning, score impact, and resolution status. This log powers the undo system and the edit history view.

**Jobs**
Saved job postings. Stores the raw JD text, the JD extract, company name, role title, and application status. One job can link to multiple sessions (resume iterations over time).

**Exports**
Records of generated resume PDFs. Stores the session ID, the resume state snapshot at time of export, and the file reference in Supabase Storage.

### 8.2 The Edit History & Undo System

Every accepted edit is appended to the session's edit history. Cmd+Z triggers an undo that reverts the most recent accepted edit — both in the Zustand store and in Supabase. The undo operation also recalculates the affected section score and the overall score. The agent is notified of the undo via a system message so it does not re-propose something the user has un-done.

---

## 9. The Onboarding & Monetization Gate

### 9.1 Value-First Onboarding

The product never asks for signup before showing value. The upload screen takes a resume and a JD. The agent analysis runs. The task plan is revealed. The user begins working through diffs. All of this happens unauthenticated.

The signup gate appears at the moment of highest user investment: when they attempt to download the optimized resume, save their session, or access the job tracker. At this point they have spent 5–10 minutes, accepted multiple diffs, watched their score climb, and are holding a resume they want. Conversion at this gate is structurally very high.

### 9.2 Pricing Tiers

**Free**
One full analysis session per month. Full agent experience including all diff cards and score updates. Download and export gated. Session expires after 48 hours if not saved.

**Pro — $12/month or $99/year**
Unlimited analysis sessions. Resume download and PDF export. Session persistence and return. Job tracker for managing multiple applications. Cover letter generation (natural upsell after resume completion — the agent offers it at the export screen).

**Pay-Per-Analysis — $4.99 per session**
Full Pro experience for one session. No subscription. Targeted at users who need one great resume for one specific role. Converts well to Pro after the first successful use.

**Teams — $49/month**
Career coaches managing multiple clients. White-label PDF export. Bulk session management. Client-facing progress reports.

### 9.3 The Cover Letter Upsell

After a resume session reaches export quality, the agent offers: *"Your resume is ready. Want me to write a tailored cover letter for this role? It takes about 2 minutes."* This is a one-click decision with near-100% context already available. It is the highest-converting upsell in the product because the timing is perfect and the marginal effort for the user is near zero.

---

## 10. Agentic UX Principles — The Design Rules

These principles govern every interface decision in the product. Any proposed feature or component should be evaluated against them.

The teams shipping successful agent products in 2026 treat the interface as the accountability layer between user intent and autonomous action, not an afterthought applied after the model works. ApplyAi is built with this as its founding design principle.

**1. Planning Visibility**
Planning visibility means the user sees the agent's intended action sequence before execution begins. The task list in the left sidebar is this. The user always knows what the agent is going to work on next.

**2. Tool-Use Disclosure**
Every time the agent reads a section of the resume or the JD, a subtle action pill appears in the chat. The agent never works invisibly. Well-designed patterns make agent behavior predictable and explainable — users can understand what the system is doing, why it is acting, and when human intervention is needed, building trust over time.

**3. Rejection Is a Conversation**
This rule is non-negotiable. Every rejected diff must be followed by an agent response that acknowledges the rejection and offers a path forward. Agentic AI UX must assume that errors, misalignment, or changing user priorities will occur — interfaces should therefore provide clear and accessible ways to pause, modify, undo, or reverse AI actions.

**4. Goal-First, Tutorial-Never**
Traditional onboarding teaches users where buttons are. Agentic onboarding asks users what they want to accomplish — instead of showing a product tour, it asks the user to define their goal, then lets the agent demonstrate its value immediately by working toward it. ApplyAi's onboarding is two fields and one button.

**5. Progressive Trust**
Progressive delegation lets the user's own approval history set the pace of autonomy expansion — the system earns permission through demonstrated reliability rather than demanding it at launch. In practical terms: after a user has accepted five diffs without modification, the product can offer an "Auto-Apply" mode for low-risk changes like formatting and punctuation.

**6. The Right Panel Is Ground Truth**
The live resume in the right panel is always the authoritative view of the document. Every accepted change appears there immediately. The user must always be able to see their resume getting better. That visual feedback is the core motivation loop.

---

## 11. Quality Standards

**Parsing Quality**
If the resume parser misreads the document, trust is gone before the agent speaks a word. PDF and DOCX extraction must handle multi-column layouts, table-based formatting, graphical resumes, and non-standard section headers. Edge cases must be caught and surfaced gracefully — if a section cannot be parsed, the agent asks the user to paste it manually rather than failing silently.

**Score Integrity**
The score must feel earned. If every session ends at 95/100 regardless of the starting point or the quality of edits, users will not trust it and will not share it. The scoring algorithm must be meaningfully strict, transparent in its criteria, and consistent across comparable resumes.

**Speed**
The analysis must feel fast. Initial task plan generation should complete within the loading animation window. Per-task agent responses including tool calls should stream within two seconds of the user's last action. Parallel tool calls are used wherever the agent is reading multiple sections. A session that feels slow loses users before the first diff card.

**Telemetry**
Instrument everything — track tokens, errors, and latency from day one. The gap between a prototype and a production AI app is mostly engineering discipline: rate limiting, error handling, cost monitoring, and security. Every agent session logs token consumption, tool call counts, diff acceptance rates, session completion rates, and time-to-export.

---

## 12. Build Sequence

The recommended build order prioritizes getting the core agent loop working and observable before building surrounding features.

**Phase 1 — The Core Loop**
Build the resume + JD intake screen. Build the `generateObject` task plan call with the full Zod schema. Build the Zustand session store with resume state, task state, edit history, and rejected edits log. Build the agent API route with the tool definitions and streaming. Build the diff card component in all states. Connect accept/reject to the store and verify state updates correctly.

**Phase 2 — The Interface Shell**
Build the three-panel layout. Build the left sidebar task list with live status updates. Build the center panel message type system. Build the right panel with overlay and pinned modes. Build the live resume renderer with diff highlights. Wire the overall score counter to the session store.

**Phase 3 — The Smart Input**
Build the `@` mention system for section focus. Build the `/` slash command parser. Build the fast-reply chip component. Add voice input via the `transcribe` API.

**Phase 4 — Persistence & Auth**
Build Supabase session storage. Build the auth gate at the export action. Build session rehydration for returning users. Build the edit history view and Cmd+Z undo.

**Phase 5 — Monetization**
Build Stripe integration for Pro subscription and pay-per-analysis. Build the export PDF generation via `@react-pdf/renderer`. Build the cover letter upsell flow. Build the job tracker for Pro users.

**Phase 6 — Polish & Scale**
Build the Teams tier and white-label export. Add telemetry via `@ai-sdk/otel`. Add rate limiting via Upstash Redis. Harden the parser for edge-case resume formats. Add the Progressive Trust auto-apply mode for high-confidence low-risk edits.

---

*This document is the single source of truth for the ApplyAi v1.0 build. Every product, design, and engineering decision made during development should reference back to the principles and specifications defined here.*