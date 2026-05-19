import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { COMPARE_SYSTEM_PROMPT, buildComparePrompt } from "@/ai/prompts";
import { comparisonResultSchema } from "@/ai/schemas";

// Helper for cleaning LLM responses that might contain markdown fences
function cleanJsonString(str: string): string {
  let cleaned = str.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "");
  cleaned = cleaned.replace(/\s*```$/, "");
  return cleaned.trim();
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

    console.log("Initializing comparison via Groq Llama-3.3-70b inside Next.js Route Handler...");

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

    console.log("Comparison completed successfully inside Next.js.");
    const cleanedText = cleanJsonString(result.text);
    const parsedData = comparisonResultSchema.parse(JSON.parse(cleanedText));
    return NextResponse.json(parsedData);
  } catch (err: any) {
    console.error("Comparison route error:", err);
    return NextResponse.json(
      { error: err.message || "An error occurred during comparison." },
      { status: 500 }
    );
  }
}
