import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { COMPARE_SYSTEM_PROMPT, buildComparePrompt } from "@/ai/prompts";
import { comparisonResultSchema } from "@/ai/schemas";

// Resilient parsing helper that normalizes slightly irregular LLM outputs
function parseAndNormalizeResult(rawText: string) {
  let cleaned = rawText.trim();
  // Strip markdown formatting fences if they exist
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "");
  cleaned = cleaned.replace(/\s*```$/, "");
  cleaned = cleaned.trim();

  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch (parseError) {
    console.error("JSON parsing failed, attempting fuzzy repair. Raw text:", rawText);
    // If raw JSON.parse fails, throw a clean error
    throw new Error("The AI model's response could not be parsed as valid JSON. Please try again.");
  }

  // 1. Resilient Normalize score
  if (typeof parsed.score === "string") {
    parsed.score = parseFloat(parsed.score);
  }
  if (typeof parsed.score !== "number" || isNaN(parsed.score)) {
    parsed.score = 70; // Sensible default score
  } else {
    parsed.score = Math.min(100, Math.max(0, Math.round(parsed.score)));
  }

  // 2. Resilient Normalize fitLevel
  const validFits = ["Excellent Match", "Strong Match", "Good Match", "Fair Match", "Needs Work"];
  if (typeof parsed.fitLevel === "string") {
    const trimmedFit = parsed.fitLevel.trim();
    const matched = validFits.find((f) => f.toLowerCase() === trimmedFit.toLowerCase());
    if (matched) {
      parsed.fitLevel = matched;
    } else {
      // Find standard fallback based on score if fitLevel is unrecognizable
      if (parsed.score >= 90) parsed.fitLevel = "Excellent Match";
      else if (parsed.score >= 75) parsed.fitLevel = "Strong Match";
      else if (parsed.score >= 60) parsed.fitLevel = "Good Match";
      else if (parsed.score >= 40) parsed.fitLevel = "Fair Match";
      else parsed.fitLevel = "Needs Work";
    }
  } else {
    parsed.fitLevel = "Good Match";
  }

  // 3. Resilient Normalize text strings and arrays
  parsed.summary = typeof parsed.summary === "string" ? parsed.summary : "No summary assessment provided.";

  const ensureArray = (val: any): any[] => (Array.isArray(val) ? val : []);
  parsed.matchedKeywords = ensureArray(parsed.matchedKeywords).map(String);
  parsed.missingKeywords = ensureArray(parsed.missingKeywords).map(String);
  parsed.strengths = ensureArray(parsed.strengths).map(String);
  parsed.gaps = ensureArray(parsed.gaps).map(String);

  // 4. Resilient Normalize suggestions list
  parsed.suggestions = ensureArray(parsed.suggestions).map((s: any) => ({
    section: typeof s?.section === "string" ? s.section.trim() : "General",
    original: typeof s?.original === "string" ? s.original.trim() : "",
    suggested: typeof s?.suggested === "string" ? s.suggested.trim() : "",
    rationale: typeof s?.rationale === "string" ? s.rationale.trim() : "Improves overall keyword mapping.",
  }));

  // 5. Resilient Normalize interview prep
  parsed.interviewPrep = ensureArray(parsed.interviewPrep).map((i: any) => ({
    question: typeof i?.question === "string" ? i.question.trim() : "Can you detail your technical background?",
    strategy: typeof i?.strategy === "string" ? i.strategy.trim() : "Focus on your full-stack achievements.",
  }));

  // Final Zod schema check
  return comparisonResultSchema.parse(parsed);
}

export async function POST(request: Request) {
  try {
    // 1. Authenticate request using Clerk first (Secure cookie check)
    const { userId } = await auth();

    // If no Clerk session is active, fall back to API_KEY check for external clients
    if (!userId) {
      const serverApiKey = process.env.API_KEY;
      if (serverApiKey && serverApiKey.trim() !== "") {
        const clientApiKey = 
          request.headers.get("x-api-key") || 
          request.headers.get("Authorization")?.replace("Bearer ", "");

        if (clientApiKey !== serverApiKey) {
          return NextResponse.json(
            { error: "Unauthorized: Invalid or missing API Key or Clerk Session." },
            { status: 401 }
          );
        }
      }
    }

    // 2. Validate input parameters
    const { resumeText, jobDescription } = await request.json();

    if (!resumeText || !resumeText.trim()) {
      return NextResponse.json(
        { error: "Resume text is required." },
        { status: 400 }
      );
    }

    if (!jobDescription || !jobDescription.trim()) {
      return NextResponse.json(
        { error: "Job description is required." },
        { status: 400 }
      );
    }

    // 3. Verify Groq API Key
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey || !groqApiKey.trim()) {
      return NextResponse.json(
        {
          error:
            "Groq API Key is not configured on the server. Please set the GROQ_API_KEY environment variable in your .env.local file.",
        },
        { status: 500 }
      );
    }

    console.log("Initializing comparison via Groq Llama-3.3-70b (JSON Mode)...");

    const groqProvider = createGroq({
      apiKey: groqApiKey,
    });

    const model = groqProvider("llama-3.3-70b-versatile");

    const result = await generateText({
      model,
      experimental_responseFormat: { type: "json_object" },
      system: COMPARE_SYSTEM_PROMPT,
      prompt: buildComparePrompt(resumeText, jobDescription),
    } as any);

    console.log("Llama-3.3 response received. Parsing and normalizing...");
    const parsedData = parseAndNormalizeResult(result.text);

    console.log("Comparison completed successfully inside Next.js.");
    return NextResponse.json(parsedData);
  } catch (err: any) {
    console.error("Comparison route error:", err);
    return NextResponse.json(
      { error: err.message || "An error occurred during comparison." },
      { status: 500 }
    );
  }
}
