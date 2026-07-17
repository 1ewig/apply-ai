# Asad Ali
**Full-Stack Developer**

Sialkot, Punjab, Pakistan • +92 312 335 6061  
asadshahid234@gmail.com • [github.com/1ewig](https://github.com/1ewig) • [asad-dev-five.vercel.app](https://asad-dev-five.vercel.app)

---

### Professional Summary
Full-Stack developer specializing in Next.js and TypeScript. Self-taught, with multiple production applications shipped from scratch — covering multi-tenant architecture, payment orchestration, and multi-LLM AI pipelines. Writes modular, type-safe code focused on security and performance.

---

### Technical Skills

* **Programming Languages:** TypeScript, JavaScript, Python, SQL
* **Frontend:** React, Next.js, Zustand, TanStack Query, Tailwind CSS, shadcn/ui, Framer Motion
* **Backend & DB:** Node.js, FastAPI, PostgreSQL, MongoDB, Supabase, Drizzle ORM, Zod
* **AI & LLMs:** OpenAI, Gemini, Vercel AI SDK, Prompt Engineering, Structured JSON Enforcement
* **Cloud & Tools:** AWS, GCP, Vercel, Docker

---

### Projects & Independent Development

#### Independent Full-Stack Developer
*Mid 2025 — Present*

Designed, built, and shipped production-grade, multi-tenant web applications from the ground up, managing system architecture, concurrency control, and security.

#### 1. Aurora (Luxury E-Store & Admin Panel)
*Next.js · React · Tailwind CSS · PostgreSQL (InsForge) · Better Auth · Lemon Squeezy*

* **Payment Orchestration:** Designed a secure Lemon Squeezy checkout workflow using HMAC-SHA256 webhook verification and UNIQUE database constraints to guarantee transaction idempotency. Implemented transactional order creation with SELECT FOR UPDATE row-level locks to manage concurrent stock allocation.
* **N+1 Query Elimination:** Bypassed ORM translation overhead using raw connection pools and PostgreSQL json_agg subqueries to compile relational product details in a single database roundtrip, reducing estimated latency by over 70%.
* **Architecture & Caching Strategy:** Enforced a strict 4-layer unidirectional flow (Server Page → Client Container → Hook/Store → Presentational Component) across ~196 source files, paired with Next.js 16 'use cache' with 300–600s revalidation and cacheTag targeted invalidation to serve product and content data with zero server roundtrips on repeat visits.

#### 2. Break It Down (AI Task Architect)
*Next.js · Supabase · Groq & Gemini · Motion · Zustand*

* **Asymmetric Dual-LLM Pipeline:** Built a resilient task generation system using two distinct SDK paths — Groq via generateText with automated fallback to Gemini via generateObject with native schema enforcement — maintaining identical output contracts across both providers. Integrated an adaptive prompt engine that dynamically adjusts step granularity and tone based on user energy levels.
* **Optimistic Cache Mutations:** Implemented TanStack Query optimistic updates with context-captured rollback, eliminating perceived network latency across all task and step mutations.
* **Production AI Guardrails:** Constructed a multi-layer output pipeline — custom JSON sanitizer for malformed LLM responses, Zod runtime schema enforcement for structural validity, and typed error classification (SyntaxError→502, ZodError→502, generic→500) — preventing hallucinated or broken AI output from reaching users.

#### 3. ApplyAI (Job Tracker & Resume Tailoring Workspace)
*Next.js · Convex · Clerk · Groq Llama 3.3 · Zod · Framer Motion*

* **Reactive Synchronization:** Built a reactive serverless database architecture using Convex WebSockets to enable instant database-to-client updates and live job board tracking.
* **Accelerated CV Tailoring:** Created an automated AI analysis pipeline using Groq Llama 3.3 and Zod to generate structured JSON comparisons and keyword suggestions in under one second.
* **Multi-Tenant Integrity:** Enforced user data isolation at the schema query level by validating Clerk JWT handshakes directly inside Convex serverless contexts.

---

### Education & Languages

* **ICom** — Intermediate in Commerce, BISE Sialkot
* **Next.js Development** — Scrimba • Coursework Completed, Self-Directed
* **Spoken Languages:** English (Professional), Urdu (Native)