import { getAiConfig } from './config';
import { TASK_PLANNER_SYSTEM_PROMPT, buildComparePrompt } from './prompts';
import { sessionBlueprintSchema, SessionBlueprint } from './agent';

async function generateBlueprintWithGroq(
  resumeText: string,
  jobDescription: string,
  model: string
): Promise<SessionBlueprint> {
  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey || !groqApiKey.trim()) {
    throw new Error(
      "Groq API Key is not configured on the server. Please set the GROQ_API_KEY environment variable in your .env.local file."
    );
  }

  const { createGroq } = await import('@ai-sdk/groq');
  const { generateObject } = await import('ai');

  const groqProvider = createGroq({ apiKey: groqApiKey });

  const result = await generateObject({
    model: groqProvider(model),
    schema: sessionBlueprintSchema,
    system: TASK_PLANNER_SYSTEM_PROMPT,
    prompt: buildComparePrompt(resumeText, jobDescription),
  });

  return result.object;
}

async function generateBlueprintWithGoogle(
  resumeText: string,
  jobDescription: string,
  model: string
): Promise<SessionBlueprint> {
  const googleApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!googleApiKey || !googleApiKey.trim()) {
    throw new Error(
      "Google AI API Key is not configured. Please set the GOOGLE_GENERATIVE_AI_API_KEY environment variable in your .env.local file."
    );
  }

  const { google } = await import('@ai-sdk/google');
  const { generateObject } = await import('ai');

  const result = await generateObject({
    model: google(model),
    schema: sessionBlueprintSchema,
    system: TASK_PLANNER_SYSTEM_PROMPT,
    prompt: buildComparePrompt(resumeText, jobDescription),
  });

  return result.object;
}

export async function compareResume(
  resumeText: string,
  jobDescription: string
): Promise<SessionBlueprint> {
  const config = getAiConfig();

  switch (config.provider) {
    case 'google':
      return generateBlueprintWithGoogle(resumeText, jobDescription, config.model);
    case 'groq':
    default:
      return generateBlueprintWithGroq(resumeText, jobDescription, config.model);
  }
}
