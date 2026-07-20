# Plan: Three Endpoints under `/api/plan/`

## File Layout

```
src/app/api/plan/
├── parse-resume/route.ts    ← MOVED from /api/parse-resume
├── extract-jd/route.ts      ← NEW
├── analyze-match/route.ts   ← NEW
└── generate-plan/route.ts   ← NEW
```

---

## Step 1: `src/agent/types.ts` — Add 2 new Zod schemas

```ts
export const jdExtractSchema = z.object({
  roleTitle: z.string(),
  mustHaveKeywords: z.array(z.string()).max(10),
  niceToHaveKeywords: z.array(z.string()).max(10),
  seniorityLevel: z.enum(['entry', 'mid', 'senior', 'lead', 'executive']),
  coreResponsibilities: z.array(z.string()).max(5),
  companyContext: z.string(),
  requiredQualifications: z.array(z.string()).max(8),
  preferredQualifications: z.array(z.string()).max(5),
});
export type JdExtract = z.infer<typeof jdExtractSchema>;

export const matchAnalysisSchema = z.object({
  overallScore: z.number().min(0).max(100),
  readinessTier: z.enum(['poor', 'fair', 'good', 'strong']),
  scoreBreakdown: z.object({
    keywordMatch: z.number().min(0).max(100),
    experienceAlignment: z.number().min(0).max(100),
    skillsCoverage: z.number().min(0).max(100),
    educationFit: z.number().min(0).max(100),
  }),
  matchedKeywords: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  strengths: z.array(z.string()),
  gaps: z.array(z.string()),
});
export type MatchAnalysis = z.infer<typeof matchAnalysisSchema>;
```

---

## Step 2: `src/agent/prompts.ts` — Add 3 prompts

- `JD_EXTRACTOR_SYSTEM_PROMPT` — "Extract only what's explicitly stated. Never infer or invent."
- `buildExtractJdPrompt(jdText)` — wraps JD text
- `MATCH_ANALYSIS_SYSTEM_PROMPT` — "Senior resume reviewer. Be strict. Scores should feel earned."
- `buildMatchAnalysisPrompt(parsedResume, jdExtract)` — wraps resume sections + JD extract
- `PLAN_GENERATION_SYSTEM_PROMPT` — "Create prioritized task plan. Quick wins = 1 click. Blockers = user input needed."
- `buildPlanGenerationPrompt(matchAnalysis)` — wraps analysis result

---

## Step 3: `src/agent/provider.ts` — Add 3 provider functions

Each function:
- Takes its specific input
- Uses `generateText({ output: Output.object({ schema: ... }) })` (v7 API)
- Two implementations per function (Groq + Google)
- Dispatched via existing `getAiConfig()`

| Function | Input | Output |
|---|---|---|
| `extractJd(jdText)` | Raw JD text | `JdExtract` |
| `analyzeMatch(parsedResume, jdExtract)` | Resume sections + structured JD | `MatchAnalysis` |
| `generatePlan(matchAnalysis)` | Match analysis | `SessionBlueprint` |

---

## Step 4: 3 new route files

Each follows the same pattern as `parse-resume/route.ts`:
- Clerk auth fallback to API key
- Input validation
- Call provider function
- `normalizeAiError` in catch
- Returns `NextResponse.json(result)`

| Route | Body | Returns |
|---|---|---|
| `POST /api/plan/extract-jd` | `{ jdText }` | `JdExtract` |
| `POST /api/plan/analyze-match` | `{ parsedResume, jdExtract }` | `MatchAnalysis` |
| `POST /api/plan/generate-plan` | `{ matchAnalysis }` | `SessionBlueprint` |

---

## Step 5: Move parse-resume

- Create `src/app/api/plan/parse-resume/route.ts` (same content)
- Delete `src/app/api/parse-resume/route.ts`

---

## Step 6: `src/proxy.ts` — Update matcher

```ts
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/application-board(.*)",
  "/resume-templates(.*)",
  "/api/plan/parse-resume",
  "/api/plan/extract-jd",
  "/api/plan/analyze-match",
  "/api/plan/generate-plan",
]);
```

---

## Step 7: `src/hooks/useParseResumeStep.ts` — Update fetch URL

`'/api/parse-resume'` → `'/api/plan/parse-resume'`

---

## Step 8: `src/stores/useAnalysisStore.ts` — Add store fields

```ts
jdExtract: JdExtract | null;       // persists JD extraction
matchAnalysis: MatchAnalysis | null; // persists match analysis for UI
```

---

## Step 9: `MatchAnalysisDetail.tsx` — Wire the chain

After Step 1 approval, trigger sequential calls with progress messages:

```
Step 1 approved by user
  → POST /api/plan/extract-jd       → "Extracting JD details..."
  → POST /api/plan/analyze-match     → "Analyzing match against job..."
  → POST /api/plan/generate-plan     → "Building your task plan..."
  → initializeSession(result)        → UI renders task list + score + sidebar
```

If any step fails, show a retry button for that specific step only.

---

## No changes needed

- `src/agent/config.ts` — already supports Groq/Google
- `src/agent/errors.ts` — `normalizeAiError` is shared
- `src/types/index.ts` — `ComparisonResult = SessionBlueprint` still works
- Convex — analysis saved via existing `onSaveChanges`
