# Python Integration Plan — ApplyAI

## Goal

Offload AI processing (PDF/DOCX parsing + Groq LLM calls) from TypeScript to Python, deployed alongside Next.js on Vercel as a hybrid project.

---

## Architecture

```
Frontend (Next.js)         TS Proxy (Clerk Auth)       Python (FastAPI on Vercel)
┌──────────────┐           ┌──────────────────┐        ┌──────────────────────────┐
│ useAnalysis   │──POST──▶│ /api/compare      │──fetch─▶│ /api/ai                  │
│ fetch()       │          │ Clerk auth ✓       │   /api/ai │ - JSON: {resumeText, JD} │
│ JSON or file  │          │ → proxies to Python│        │ - Multipart: file + JD   │
└──────────────┘           └──────────────────┘        │ - PDF → PyMuPDF         │
                                                        │ - DOCX → python-docx    │
                                                        │ - Call Groq LLM          │
                                                        │ - Return structured JSON │
                                                        └──────────────────────────┘
                                                                    │
                                                              GROQ_API_KEY
                                                          (Vercel env var)
```

## Key Decisions

| Decision | Choice | Rationale |
|---|---|---|
| TS upstream route | Keep `/api/compare` as proxy | Clerk Edge middleware protects it; proxies to Python |
| Python framework | FastAPI + Mangum | Structured, extensible, self-documenting |
| File storage | In-memory only | File → text extraction → discard. No persistent storage |
| Auth on Python route | None (internal call) | TS proxy validates Clerk auth; server-to-server call needs no auth |
| GROQ_API_KEY | Vercel env var (automatic) | Set once in Vercel dashboard, injected into both runtimes |
| Python accepts text too | Yes | JSON mode handles the existing "paste resume" flow |
| Local dev fallback | No fallback | Hard error if Python is unreachable — developer must run both |

## File Changes

### CREATE: `api/ai.py`

FastAPI app with two input modes:

1. **JSON mode**: `{ resumeText, jobDescription }` → call Groq → return comparison JSON
2. **Multipart mode**: `file` (PDF/DOCX) + `jobDescription` → extract text → call Groq → return JSON

Logic:
- Detect file type by extension
- `.pdf` → `fitz.open(io.BytesIO(content))` → extract text per page
- `.docx` → `Document(io.BytesIO(content))` → extract paragraphs
- Unsupported type → 400 error
- Call Groq: `groq.Groq(api_key=os.environ["GROQ_API_KEY"]).chat.completions.create(...)`
- Response format: same schema as `comparisonResultSchema` in `src/ai/schemas.ts`
- Export `handler = Mangum(app)` for Vercel ASGI adapter

### CREATE: `api/requirements.txt`

```
fastapi==0.115.12
mangum==0.19.0
python-multipart==0.0.20
groq==0.19.0
PyMuPDF==1.25.3
python-docx==1.1.2
python-dotenv==1.1.0
uvicorn==0.34.1
```

### CREATE: `vercel.json`

```json
{
  "functions": {
    "api/ai.py": {
      "runtime": "python3.9",
      "memory": 512
    }
  }
}
```

### MODIFY: `src/app/api/compare/route.ts`

- Keep Clerk `auth()` + API key fallback (unchanged)
- Remove `@ai-sdk/groq` import and `generateText` call
- Replace with `fetch()` to Python:

```ts
const pythonUrl = process.env.PYTHON_API_URL
  || (process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : '')
  || '';

const url = pythonUrl ? `${pythonUrl}/api/ai` : '/api/ai';

const pythonRes = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ resumeText, jobDescription }),
});

if (!pythonRes.ok) {
  const err = await pythonRes.json().catch(() => ({ error: 'Python upstream error' }));
  return NextResponse.json(err, { status: pythonRes.status });
}

const data = await pythonRes.json();
return NextResponse.json(data);
```

- If Python unreachable → returns 502 (no fallback to direct Groq)

### MODIFY: `.env.example`

Add:
```
# Python AI service URL (for local dev — default http://localhost:8000)
PYTHON_API_URL=http://localhost:8000
```

Note: `GROQ_API_KEY` is shared automatically on Vercel. No separate key needed for Python.

## Files With NO Changes

| File | Reason |
|---|---|
| `src/hooks/useAnalysis.ts` | Still calls `/api/compare` — transparent to frontend |
| `src/middleware.ts` | Still protects `/api/compare` |
| `src/ai/prompts.ts` | TS prompts file removed from active path; Python will have equivalent |
| `src/ai/schemas.ts` | TS validation removed from API path; Python returns equivalent schema |

## Local Development Workflow

```bash
# Terminal 1 — Next.js (port 3000)
npm run dev

# Terminal 2 — Python FastAPI (port 8000)
cd api
python -m venv .venv
.venv\Scripts\Activate    # Windows
pip install -r requirements.txt
# Create api/.env with GROQ_API_KEY=your_key_here
uvicorn ai:app --port 8000 --reload

# Open http://localhost:3000
```

For Python env vars locally, create `api/.env`:
```
GROQ_API_KEY=gsk_your_key_here
```

Python reads it via `python-dotenv` + `os.environ.get("GROQ_API_KEY")`.

## Production Deployment (Vercel)

1. Push repo — Vercel auto-detects Next.js + `api/ai.py` (Python)
2. Set env vars in Vercel project dashboard:
   - `GROQ_API_KEY` — shared by both runtimes
   - `API_KEY` — existing app API key (if used)
   - `CLERK_SECRET_KEY` — existing Clerk key
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — existing Clerk key
   - `NEXT_PUBLIC_API_KEY` — existing app API key (if used)
3. No custom build commands or `vercel.json` overrides needed beyond the functions config

## Future Extensions

- **More file formats**: Add `.txt`, `.rtf`, `.odt` parsers in `api/ai.py`
- **Batch comparison**: Python can handle multiple files in one request
- **RAG / vector search**: Python's ecosystem (LangChain, llama-index) makes this natural
- **Python-only endpoints**: Add separate Py routes under `api/` for other AI tasks
- **WebSocket streaming**: Python can stream Groq responses via SSE through the TS proxy
