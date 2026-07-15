export function toUserFriendlyError(err: unknown, contextFallback: string): string {
  const message = err instanceof Error ? err.message : String(err ?? '');
  const lower = message.toLowerCase();

  if (!message) return contextFallback;

  console.error('[UserFriendlyError]', err);

  if (/networkerror|failed to fetch|network error|load failed|fetch failed|enetreset|econnrefused|enotfound|typeerror/i.test(lower)) {
    return 'A network error occurred. Please check your internet connection and try again.';
  }
  if (/unauthorized|unauthenticated|session expired|invalid api key/i.test(lower)) {
    return 'Your session has expired. Please sign out and sign back in.';
  }
  if (/not found|doesn'?t exist|no longer available/i.test(lower)) {
    return 'The requested item could not be found. It may have been deleted.';
  }
  if (/timeout|timed out|abort/i.test(lower)) {
    return 'The request timed out. Please try again.';
  }
  if (/rate_limit|quota|too many requests|429/i.test(lower)) {
    return 'You\'ve reached a usage limit. Please wait a moment and try again.';
  }
  if (/parse|invalid json|malformed/i.test(lower)) {
    return 'Something went wrong processing the response. Please try again.';
  }

  return contextFallback;
}
