import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { parseResume } from "@/ai/provider";
import { normalizeAiError } from "@/ai/errors";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      const serverApiKey = process.env.API_KEY;
      const clientApiKey =
        request.headers.get("x-api-key") ||
        request.headers.get("Authorization")?.replace("Bearer ", "");

      const isApiKeyValid = serverApiKey && serverApiKey.trim() !== "" && clientApiKey === serverApiKey;

      if (!isApiKeyValid) {
        return NextResponse.json(
          { error: "Unauthorized: Invalid or missing API Key or Clerk Session." },
          { status: 401 }
        );
      }
    }

    const { resumeText } = await request.json();

    if (!resumeText || !resumeText.trim()) {
      return NextResponse.json(
        { error: "Resume text is required." },
        { status: 400 }
      );
    }

    const result = await parseResume(resumeText);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Parse resume route error:", err);
    return NextResponse.json(
      { error: normalizeAiError(err) },
      { status: 500 }
    );
  }
}
