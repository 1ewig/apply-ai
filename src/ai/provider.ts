import { getAiConfig } from './config';
import { COMPARE_SYSTEM_PROMPT, buildComparePrompt } from './prompts';
import { comparisonResultSchema } from './schemas';
import type { ComparisonResult } from './schemas';

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

export function parseAndNormalizeResult(rawText: string): ComparisonResult {
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

  return comparisonResultSchema.parse(parsed);
}

async function compareWithGroq(resumeText: string, jobDescription: string, model: string): Promise<ComparisonResult> {
  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey || !groqApiKey.trim()) {
    throw new Error(
      "Groq API Key is not configured on the server. Please set the GROQ_API_KEY environment variable in your .env.local file."
    );
  }

  const { createGroq } = await import('@ai-sdk/groq');
  const { generateText } = await import('ai');

  const groqProvider = createGroq({ apiKey: groqApiKey });

  const result = await generateText({
    model: groqProvider(model),
    responseFormat: { type: "json_object" },
    system: COMPARE_SYSTEM_PROMPT,
    prompt: buildComparePrompt(resumeText, jobDescription),
  } as any);

  return parseAndNormalizeResult(result.text);
}

async function compareWithGoogle(resumeText: string, jobDescription: string, model: string): Promise<ComparisonResult> {
  const googleApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!googleApiKey || !googleApiKey.trim()) {
    throw new Error(
      "Google AI API Key is not configured. Please set the GOOGLE_GENERATIVE_AI_API_KEY environment variable in your .env.local file."
    );
  }

  const { google } = await import('@ai-sdk/google');
  const { generateText } = await import('ai');

  const result = await generateText({
    model: google(model),
    responseFormat: { type: "json_object" },
    system: COMPARE_SYSTEM_PROMPT,
    prompt: buildComparePrompt(resumeText, jobDescription),
  } as any);

  const parsed = JSON.parse(result.text);
  return comparisonResultSchema.parse(parsed);
}

export async function compareResume(resumeText: string, jobDescription: string): Promise<ComparisonResult> {
  const config = getAiConfig();

  switch (config.provider) {
    case 'google':
      return compareWithGoogle(resumeText, jobDescription, config.model);
    case 'groq':
    default:
      return compareWithGroq(resumeText, jobDescription, config.model);
  }
}
