import { z } from 'zod';
import { getAiConfig } from './config';
import {
  RESUME_PARSER_SYSTEM_PROMPT,
  buildParseResumePrompt,
  JD_EXTRACTOR_SYSTEM_PROMPT,
  buildExtractJdPrompt,
} from './prompts';
import {
  resumeSectionSchema,
  ResumeSection,
  jdExtractSchema,
  JdExtract,
} from './types';

const missingInfoItemSchema = z.object({
  field: z.string(),
  description: z.string(),
  severity: z.enum(['critical', 'warning']),
});

export interface MissingInfoItem {
  field: string;
  description: string;
  severity: 'critical' | 'warning';
}

export interface ParseResumeResult {
  parsedResume: ResumeSection[];
  missingInfo: MissingInfoItem[];
  requiresInput: boolean;
  fidelityScore: number;
}

const parseResumeResponseSchema = z.object({
  parsedResume: z.array(resumeSectionSchema),
  missingInfo: z.array(missingInfoItemSchema).default([]),
  requiresInput: z.boolean().default(false),
  fidelityScore: z.number().min(0).max(100),
});

async function parseResumeWithGroq(
  resumeText: string,
  model: string
): Promise<ParseResumeResult> {
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
    schema: parseResumeResponseSchema,
    system: RESUME_PARSER_SYSTEM_PROMPT,
    prompt: buildParseResumePrompt(resumeText),
  });

  return result.object;
}

async function parseResumeWithGoogle(
  resumeText: string,
  model: string
): Promise<ParseResumeResult> {
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
    schema: parseResumeResponseSchema,
    system: RESUME_PARSER_SYSTEM_PROMPT,
    prompt: buildParseResumePrompt(resumeText),
  });

  return result.object;
}

export async function parseResume(
  resumeText: string
): Promise<ParseResumeResult> {
  const config = getAiConfig();

  switch (config.provider) {
    case 'google':
      return parseResumeWithGoogle(resumeText, config.model);
    case 'groq':
    default:
      return parseResumeWithGroq(resumeText, config.model);
  }
}

async function extractJdWithGroq(
  jdText: string,
  model: string
): Promise<JdExtract> {
  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey || !groqApiKey.trim()) {
    throw new Error(
      "Groq API Key is not configured on the server. Please set the GROQ_API_KEY environment variable in your .env.local file."
    );
  }

  const { createGroq } = await import('@ai-sdk/groq');
  const { generateText, Output } = await import('ai');

  const groqProvider = createGroq({ apiKey: groqApiKey });

  const result = await generateText({
    model: groqProvider(model),
    output: Output.object({ schema: jdExtractSchema }),
    system: JD_EXTRACTOR_SYSTEM_PROMPT,
    prompt: buildExtractJdPrompt(jdText),
  });

  return result.output;
}

async function extractJdWithGoogle(
  jdText: string,
  model: string
): Promise<JdExtract> {
  const googleApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!googleApiKey || !googleApiKey.trim()) {
    throw new Error(
      "Google AI API Key is not configured. Please set the GOOGLE_GENERATIVE_AI_API_KEY environment variable in your .env.local file."
    );
  }

  const { google } = await import('@ai-sdk/google');
  const { generateText, Output } = await import('ai');

  const result = await generateText({
    model: google(model),
    output: Output.object({ schema: jdExtractSchema }),
    system: JD_EXTRACTOR_SYSTEM_PROMPT,
    prompt: buildExtractJdPrompt(jdText),
  });

  return result.output;
}

export async function extractJd(jdText: string): Promise<JdExtract> {
  const config = getAiConfig();

  switch (config.provider) {
    case 'google':
      return extractJdWithGoogle(jdText, config.model);
    case 'groq':
    default:
      return extractJdWithGroq(jdText, config.model);
  }
}
