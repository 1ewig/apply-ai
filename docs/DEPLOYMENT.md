# Deployment Guide

## Prerequisites

- **Accounts**: [Clerk](https://clerk.com) (free), [Groq](https://console.groq.com) (free), [Convex](https://convex.dev) (free), [Vercel](https://vercel.com) (free)
- **Tools**: Node.js 18+, npm, git

---

## Environment Variables

| Variable | Required | Where to Get It |
|---|---|---|
| `GROQ_API_KEY` | Yes | [Groq Console](https://console.groq.com) → API Keys |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk Dashboard → API Keys |
| `CLERK_SECRET_KEY` | Yes | Clerk Dashboard → API Keys |
| `CLERK_JWT_ISSUER_DOMAIN` | Yes | Clerk Dashboard → Configure → JWT Templates → Convex template → **Issuer** |
| `NEXT_PUBLIC_CONVEX_URL` | Yes | `npx convex deploy` output |
| `NEXT_PUBLIC_CONVEX_SITE_URL` | Yes | `npx convex deploy` output |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | No | Default: `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | No | Default: `/sign-up` |
| `API_KEY` | No | Any random string — allows API-only access to `/api/compare` |

---

## Step-by-Step

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd apply-ai
npm install
```

### 2. Set Up Clerk

1. Go to [Clerk Dashboard](https://dashboard.clerk.com) and create a new application
2. Under **API Keys**, copy `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`
3. Under **Configure → JWT Templates**, click **+ New Template**, select **Convex**, and save
4. Open the Convex template and copy the **Issuer** URL — this is your `CLERK_JWT_ISSUER_DOMAIN`

### 3. Set Up Groq

1. Go to [Groq Console](https://console.groq.com) → API Keys
2. Create a key and copy it as `GROQ_API_KEY`

### 4. Deploy Convex Backend

```bash
npx convex deploy
```

This will:
- Create a Convex project (or prompt you to log in / create one)
- Deploy all functions from the `convex/` directory
- Print `NEXT_PUBLIC_CONVEX_URL` and `NEXT_PUBLIC_CONVEX_SITE_URL`

Copy both URLs from the output.

### 5. Create `.env.local` for local testing

```env
GROQ_API_KEY="gsk_your_groq_key"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_your_clerk_key"
CLERK_SECRET_KEY="sk_test_your_clerk_secret"
CLERK_JWT_ISSUER_DOMAIN="https://your-project.clerk.accounts.dev"
NEXT_PUBLIC_CONVEX_URL="https://your-project.convex.cloud"
NEXT_PUBLIC_CONVEX_SITE_URL="https://your-project.convex.site"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
```

### 6. Deploy to Vercel

**Option A — Vercel Dashboard (recommended):**
1. Push your repo to GitHub
2. Go to [Vercel](https://vercel.com) → Add New Project → Import your repo
3. Framework preset is automatically detected as **Next.js**
4. Add all environment variables from step 5
5. Deploy

**Option B — Vercel CLI:**
```bash
npx vercel --prod
```

Add env vars when prompted, or set them later in the Vercel Dashboard → Project Settings → Environment Variables.

### 7. Configure Clerk Redirect URLs

1. In Clerk Dashboard → Configure → **Redirect URLs**
2. Add your Vercel deployment URL (e.g. `https://your-app.vercel.app`)
3. Under **Sessions**, add:
   - `https://your-app.vercel.app/sign-in`
   - `https://your-app.vercel.app/sign-up`
   - `https://your-app.vercel.app/*`

### 8. Verify

1. Visit your Vercel URL
2. Sign up / sign in with Clerk
3. Upload a resume and job description to test the comparison flow
4. Check the application board, resume templates, and dashboard pages

---

## Updating

### Convex functions
```bash
npx convex deploy
```

### App
Push to your GitHub repo — Vercel auto-deploys the main branch by default.

---

## Troubleshooting

| Problem | Likely Fix |
|---|---|
| Auth fails / "Invalid JWT" | Verify `CLERK_JWT_ISSUER_DOMAIN` matches the Issuer in Clerk's Convex JWT template exactly |
| Convex calls fail with 401 | Check `NEXT_PUBLIC_CONVEX_URL` is the correct deployment URL |
| Clerk login redirects to localhost | Add your Vercel domain to Clerk → Redirect URLs |
| 500 on resume comparison | Verify `GROQ_API_KEY` is set and has quota available |
| API route returns 401 | Either sign in via Clerk, or set `API_KEY` and pass it as `x-api-key` header |
