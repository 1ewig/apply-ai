# ApplyAI 🚀

> **A Production-Grade, Full-Stack AI Job Application Tracker & Side-by-Side Resume Tailoring Workspace.**  
> Built with Next.js 15, Clerk v7 (Auth), Convex (Reactive Serverless DB), and Groq Llama 3.3 70b.

ApplyAI is a premium, desktop-grade workspace designed to help job seekers organize their pipelines, manage resume templates, and leverage deep LLM evaluations to tailor their CV specifically to target job description requirements in real-time.

---

## 🛠️ The Ultimate Developer Experience (DX) Stack

This project was built to demonstrate an elite, modern tech stack designed for high velocity, extreme security, and instantaneous real-time responsiveness.

```
┌────────────────────────────────────────────────────────┐
│                   Next.js 15 Client                    │
└───────────┬────────────────────────────────┬───────────┘
            │                                │
    [Auth Handshake]                 [Reactive WebSockets]
            ▼                                ▼
┌───────────────────────┐        ┌───────────────────────┐
│     Clerk v7 Auth     │        │  Convex Serverless DB │
└───────────────────────┘        └───────────┬───────────┘
                                             │
                                     [Structured LLM]
                                             ▼
                                 ┌───────────────────────┐
                                 │ Groq API (Llama-3.3)  │
                                 └───────────────────────┘
```

### Why We Chose This Stack:

*   **Next.js 15 (App Router)**: Transitioning from a single-file Vite client to Next.js unlocks advanced Server Components, optimized image/font asset pipelines, secure API routing, clean Middleware-level access protection, and seamless production hosting.
*   **Clerk v7 (Identity Management)**: The industry gold standard for authentication. It eliminates the security risks of custom auth backends, providing zero-boilerplate, frictionless secure logins, embeddable user buttons, and native user profile custom metadata.
*   **Convex (Reactive Serverless Database)**: Traditional database queries are polling-based or require complex state synchronization (Zustand, Redux). Convex solves this by maintaining a persistent cryptographic WebSocket connection. **When data in the database updates, the UI reactively shifts instantly without a single manual reload or fetch request.**
*   **Groq & Llama-3.3-70b**: Structured AI outputs can be slow on standard APIs. By using Groq's specialized LPU architecture, ApplyAI performs deep JSON resume alignment analysis, keyword matching, and interview coaching generation **in under 1 second**.

---

## ✨ Features

*   **📊 Kanban Applications Board**: A grid-based job application pipeline dashboard supporting real-time status transitions (Wishlist, Applied, Interviewing, Offer, Rejected), complete search filters, and custom match score badges.
*   **📑 Side-by-Side 3-Column Tailoring Workspace**: 
    *   **Column 1**: Application metadata configuration and resume template selection.
    *   **Column 2**: A monospace tailored resume content editor. Selecting a template instantly loads its copy, allowing you to edit and refine your resume wording specifically for this job description.
    *   **Column 3**: Monospace target job description requirements.
*   **🤖 Real-Time Llama AI Match Analysis**: Evaluates your customized resume copy side-by-side against the job post to generate:
    *   *Match Score & Fit Level*: Numerical percentage score and overall alignment category.
    *   *Keyword Sync*: Categorized list of matched and missing keywords.
    *   *Strengths & Gaps*: A transparent comparison highlighting critical achievements and missing credentials.
    *   *Actionable Bullet Rewrites*: Clear, side-by-side edits (*Original vs. Suggested text*) with exact professional rationales.
    *   *Interview Prep Coach*: Personalized interview questions and behavioral strategy advice targeted at your resume's weaknesses.
*   **📁 Multi-Resume Template Manager**: Create, edit, and store multiple versions of your resume. Mark a default template to automatically initialize the tailoring workspace.

---

## 🔒 Edge-Level Security

*   **Cryptographic JWT Verification**: In `convex/auth.config.js`, Convex automatically verifies incoming WebSocket handshakes against Clerk’s public key cryptography, ensuring zero unauthorized data access.
*   **Strict Multi-Tenant Isolation**: Database actions filter user records strictly at the database query level using the un-spoofable Clerk ID (`ctx.auth.getUserIdentity()`), preventing any cross-user data leakage.
*   **Zero Secret Leaks**: All local configurations (`.env.local`, `.clerk/`, and local testing keys) are strongly isolated inside `.gitignore` to guarantee absolute safety before pushing to GitHub.

---

## 🚀 Getting Started

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/1ewig/apply-ai-full-stack.git
cd apply-ai-full-stack
bun install
```

### 2. Environment Setup
1. Copy the example environment template:
   ```bash
   cp .env.example .env.local
   ```
2. Fill in your credentials inside `.env.local`:
   *   `GROQ_API_KEY`: Obtain from [Groq Console](https://console.groq.com).
   *   `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` & `CLERK_SECRET_KEY`: Find in your [Clerk Dashboard](https://dashboard.clerk.com).
   *   `CLERK_JWT_ISSUER_DOMAIN`: The JWT template issuer URL from your Clerk Convex integration settings (e.g., `https://your-issuer.clerk.accounts.dev`).

### 3. Start Convex Database
Initiate the reactive backend server:
```bash
npx convex dev
```
*This command will set up your Convex project and synchronize the schema located in `/convex/schema.ts`.*

### 4. Run the Dev Server
Launch the Next.js development client:
```bash
bun run dev
```
Open `http://localhost:3000` to interact with your workspace locally!

---

## 📄 License

This project is open-source and available under the [MIT License](./LICENSE).
