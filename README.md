# ApplyAI 🚀

> **Full-Stack, AI-Powered Job Application Tracker & Resume Matcher.**  
> Built with React, Zustand, Bun, Hono, and Groq (Llama-3.3-70b).

ApplyAI is a full-stack, desktop-grade workspace designed to help job seekers organize their applications, manage resume templates, and leverage LLMs to optimize their CVs against target job descriptions in real-time.

---

## ✨ Features

*   **📊 Applications Board**: A grid-based job application dashboard supporting full search, status filtering, link management, and custom match score badges.
*   **📁 Resume Templates Manager**: Create, edit, and store multiple versions of your CV. Set a default template to automatically pre-populate your comparison forms.
*   **🤖 AI Resume Match Analysis**: Compares a selected CV against a job description. Powered by the high-speed Groq Llama-3.3-70b model, it evaluates:
    *   **Match Score & Fit Level**: Overall percentage score and fit level (e.g., *Strong Match*, *Needs Work*).
    *   **Keyword Extraction**: Categorized list of matched and missing keywords.
    *   **Strengths & Gaps**: Concise breakdown of how your qualifications line up.
    *   **Actionable Rewrite Suggestions**: Direct, side-by-side bullet point edits showing *Original vs. Suggested* text with rationales.
    *   **Interview Prep**: Dynamic, personalized questions and answering strategies based on identified gaps.
*   **⚡ Zustand State Management**: Persists all applications, resume templates, and match history locally in the browser.
*   **🌐 Unified Hono Backend**: A lightweight backend API powered by Hono running on Bun. It handles LLM structured outputs securely and serves the built single-file frontend static assets.

---

## 🛠️ Tech Stack

### Frontend
*   **Core**: React 19 & TypeScript
*   **Bundler**: Vite 7.3.2 (using `vite-plugin-singlefile` to compile all assets into one highly portable `dist/index.html`)
*   **Styles**: Tailwind CSS v4.0 (modern CSS-first structure)
*   **State Management**: Zustand
*   **Icons**: Lucide React

### Backend
*   **Runtime**: Bun
*   **Framework**: Hono Web Framework
*   **AI Integration**: Vercel AI SDK (`ai`), `@ai-sdk/groq` provider

---

## 🚀 Getting Started

### 1. Installation
Clone the repository and install the dependencies:
```bash
git clone https://github.com/googoomckk/apply-ai.git
cd apply-ai
bun install
```

### 2. Environment Configuration
Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```
Inside `.env.local`, set your Groq API Key:
```env
GROQ_API_KEY="your-groq-api-key-here"
```

### 3. Run Locally (Development Mode)
To run in development mode, start both the frontend and backend servers:

*   **Start the backend server** (listening on `http://localhost:3000`):
    ```bash
    bun run server.ts
    ```
*   **Start the frontend development server** (running on `http://localhost:5173` with Hot Module Replacement):
    ```bash
    bun run dev
    ```

Open `http://localhost:5173` in your browser. The frontend will automatically proxy its API calls to the Bun server on port 3000.

---

## 📦 Production Compilation & Hosting

To compile and serve the entire application as a single-port production server:

1.  **Build the single-file frontend package**:
    ```bash
    bun run build
    ```
    *This generates a single, fully self-contained `index.html` inside `/dist`.*

2.  **Start the production server**:
    ```bash
    bun run server.ts
    ```
    *Hono will serve the static files from `/dist` and resolve client-side single-page app (SPA) routes, exposing the full application on `http://localhost:3000`.*

---

## 📄 License

This project is open-source and available under the [MIT License](./LICENSE).
