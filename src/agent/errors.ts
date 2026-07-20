const PATTERNS: [RegExp, string][] = [
  [/is not found for API version/i, "The selected AI model is not available with the current provider. Check your AI_MODEL and AI_PROVIDER environment variables."],
  [/API_KEY_INVALID|API key not valid|unauthorized/i, "Invalid API key. Check your provider's API key in the .env.local file."],
  [/safety|blocked|SAFETY/i, "The request was blocked by the AI provider's safety filters. Try rephrasing your input or using a different model."],
  [/rate_limit|quota_exceeded|insufficient_quota|429/i, "API rate limit or quota exceeded. Please wait a moment and try again."],
  [/timed out|timeout|abort/i, "The request timed out. Please try again."],
  [/fetch failed|networkerror|network error|Failed to fetch/i, "A network error occurred. Check your internet connection and try again."],
];

export function normalizeAiError(error: unknown): string {
  if (!error) return "An unexpected error occurred during analysis. Please try again.";

  const message = typeof error === "string" ? error : error instanceof Error ? error.message : String(error);

  for (const [pattern, friendly] of PATTERNS) {
    if (pattern.test(message)) return friendly;
  }

  return message;
}
