import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { COMPARE_SYSTEM_PROMPT, buildComparePrompt } from "@/ai/prompts";
import { comparisonResultSchema } from "@/ai/schemas";

function ensureArray(val: any): any[] {
  return Array.isArray(val) ? val : [];
}

function normalizeKeywords(keywords: any) {
  return ensureArray(keywords).map((k: any) => {
    if (typeof k === "string") {
      return { keyword: k, category: "other", importance: "preferred", matchContext: "", whyImportant: "" };
    }
    return {
      keyword: typeof k?.keyword === "string" ? k.keyword.trim() : "Unknown",
      category: ["language", "framework", "tool", "domain", "soft_skill", "education", "certification", "other"].includes(k?.category)
        ? k.category : "other",
      importance: ["required", "preferred"].includes(k?.importance) ? k.importance : "preferred",
      matchContext: typeof k?.matchContext === "string" ? k.matchContext.trim() : "",
      whyImportant: typeof k?.whyImportant === "string" ? k.whyImportant.trim() : "",
    };
  });
}

function parseAndNormalizeResult(rawText: string) {
  let cleaned = rawText.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "");
  cleaned = cleaned.replace(/\s*```$/, "");
  cleaned = cleaned.trim();

  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch (parseError) {
    console.error("JSON parsing failed, attempting fuzzy repair. Raw text:", rawText);
    throw new Error("The AI model's response could not be parsed as valid JSON. Please try again.");
  }

  // 1. Score
  if (typeof parsed.score === "string") parsed.score = parseFloat(parsed.score);
  if (typeof parsed.score !== "number" || isNaN(parsed.score)) parsed.score = 70;
  else parsed.score = Math.min(100, Math.max(0, Math.round(parsed.score)));

  // 2. fitLevel
  const validFits = ["Excellent Match", "Strong Match", "Good Match", "Fair Match", "Needs Work"];
  if (typeof parsed.fitLevel === "string") {
    const trimmedFit = parsed.fitLevel.trim();
    const matched = validFits.find((f) => f.toLowerCase() === trimmedFit.toLowerCase());
    if (matched) parsed.fitLevel = matched;
    else {
      if (parsed.score >= 90) parsed.fitLevel = "Excellent Match";
      else if (parsed.score >= 75) parsed.fitLevel = "Strong Match";
      else if (parsed.score >= 60) parsed.fitLevel = "Good Match";
      else if (parsed.score >= 40) parsed.fitLevel = "Fair Match";
      else parsed.fitLevel = "Needs Work";
    }
  } else {
    parsed.fitLevel = "Good Match";
  }

  // 3. Summary
  parsed.summary = typeof parsed.summary === "string" ? parsed.summary : "No summary assessment provided.";

  // 4. Score breakdown
  if (parsed.scoreBreakdown && typeof parsed.scoreBreakdown === "object") {
    const sb = parsed.scoreBreakdown;
    parsed.scoreBreakdown = {
      technicalSkills: typeof sb.technicalSkills === "number" ? Math.min(100, Math.max(0, Math.round(sb.technicalSkills))) : parsed.score,
      experience: typeof sb.experience === "number" ? Math.min(100, Math.max(0, Math.round(sb.experience))) : parsed.score,
      keywordMatch: typeof sb.keywordMatch === "number" ? Math.min(100, Math.max(0, Math.round(sb.keywordMatch))) : parsed.score,
      seniorityFit: typeof sb.seniorityFit === "number" ? Math.min(100, Math.max(0, Math.round(sb.seniorityFit))) : parsed.score,
    };
  }

  // 5. Keywords
  parsed.matchedKeywords = normalizeKeywords(parsed.matchedKeywords);
  parsed.missingKeywords = normalizeKeywords(parsed.missingKeywords);

  // 6. Strengths & gaps
  parsed.strengths = ensureArray(parsed.strengths).map(String);
  parsed.gaps = ensureArray(parsed.gaps).map(String);

  // 7. Suggestions
  parsed.suggestions = ensureArray(parsed.suggestions).map((s: any) => ({
    section: typeof s?.section === "string" ? s.section.trim() : "General",
    original: typeof s?.original === "string" ? s.original.trim() : "",
    suggested: typeof s?.suggested === "string" ? s.suggested.trim() : "",
    rationale: typeof s?.rationale === "string" ? s.rationale.trim() : "Improves overall keyword mapping.",
  }));

  // 8. Structure suggestions
  const validStructureTypes = ["reorder", "add_section", "remove_section", "expand", "condense", "quantify", "reformat"];
  parsed.structureSuggestions = ensureArray(parsed.structureSuggestions).map((s: any) => ({
    type: validStructureTypes.includes(s?.type) ? s.type : "reformat",
    section: typeof s?.section === "string" ? s.section.trim() : "General",
    suggestion: typeof s?.suggestion === "string" ? s.suggestion.trim() : "",
    rationale: typeof s?.rationale === "string" ? s.rationale.trim() : "",
    priority: ["high", "medium", "low"].includes(s?.priority) ? s.priority : "medium",
  }));

  // 9. Interview prep
  const validRounds = ["phone", "technical", "behavioral", "system_design", "onsite", "general"];
  const validDifficulties = ["easy", "medium", "hard"];
  parsed.interviewPrep = ensureArray(parsed.interviewPrep).map((i: any) => ({
    question: typeof i?.question === "string" ? i.question.trim() : "Can you detail your technical background?",
    strategy: typeof i?.strategy === "string" ? i.strategy.trim() : "Focus on your full-stack achievements.",
    round: validRounds.includes(i?.round) ? i.round : "general",
    difficulty: validDifficulties.includes(i?.difficulty) ? i.difficulty : "medium",
  }));

  // 10. Cover letter draft
  parsed.coverLetterDraft = typeof parsed.coverLetterDraft === "string" && parsed.coverLetterDraft.trim()
    ? parsed.coverLetterDraft.trim()
    : "";

  // 11. Skill recommendations
  parsed.skillRecommendations = ensureArray(parsed.skillRecommendations).map((r: any) => ({
    skill: typeof r?.skill === "string" ? r.skill.trim() : "Unknown",
    priority: ["high", "medium", "low"].includes(r?.priority) ? r.priority : "medium",
    reason: typeof r?.reason === "string" ? r.reason.trim() : "",
    learningSuggestion: typeof r?.learningSuggestion === "string" ? r.learningSuggestion.trim() : "",
  }));

  // 12. Action items
  parsed.actionItems = ensureArray(parsed.actionItems).map((a: any) => ({
    priority: ["critical", "recommended", "optional"].includes(a?.priority) ? a.priority : "recommended",
    action: typeof a?.action === "string" ? a.action.trim() : "",
    impact: typeof a?.impact === "string" ? a.impact.trim() : "",
    effort: ["low", "medium", "high"].includes(a?.effort) ? a.effort : "medium",
  }));

  // 13. ATS check
  if (parsed.atsCheck && typeof parsed.atsCheck === "object") {
    const ac = parsed.atsCheck;
    parsed.atsCheck = {
      score: typeof ac.score === "number" ? Math.min(100, Math.max(0, Math.round(ac.score))) : 70,
      issues: ensureArray(ac.issues).map((iss: any) => ({
        severity: ["error", "warning", "info"].includes(iss?.severity) ? iss.severity : "info",
        message: typeof iss?.message === "string" ? iss.message.trim() : "",
        suggestion: typeof iss?.suggestion === "string" ? iss.suggestion.trim() : "",
      })),
      formatting: typeof ac.formatting === "string" ? ac.formatting.trim() : "No formatting assessment provided.",
    };
  }

  // Final Zod schema check
  return comparisonResultSchema.parse(parsed);
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

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
