export type AiProvider = 'groq' | 'google';

export interface AiConfig {
  provider: AiProvider;
  model: string;
}

const DEFAULT_GROQ_MODEL = 'llama-3.3-70b-versatile';
const DEFAULT_GOOGLE_MODEL = 'gemini-3.5-flash-lite';

export function getAiConfig(): AiConfig {
  const provider = (process.env.AI_PROVIDER as AiProvider) || 'groq';
  const model = process.env.AI_MODEL || (provider === 'google' ? DEFAULT_GOOGLE_MODEL : DEFAULT_GROQ_MODEL);

  return { provider, model };
}
