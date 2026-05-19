import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";

const groqApiKey = process.env.GROQ_API_KEY;
if (!groqApiKey) {
  console.error("Please set GROQ_API_KEY environment variable.");
  process.exit(1);
}

const groqProvider = createGroq({
  apiKey: groqApiKey,
});

const model = groqProvider("llama-3.3-70b-versatile");

try {
  console.log("Testing generateText with llama-3.3-70b-versatile and JSON Mode...");
  const response = await generateText({
    model,
    experimental_responseFormat: { type: "json_object" },
    system: "You are a helpful assistant. You MUST respond with a raw JSON object containing the fields: 'success' (boolean) and 'message' (string).",
    prompt: "Say hello and return success true in JSON format.",
  } as any);
  
  console.log("Raw Response text:", response.text);
  const parsed = JSON.parse(response.text);
  console.log("Parsed JSON:", parsed);
} catch (err: any) {
  console.error("Failed with generateText and JSON Mode:", err.message);
}
