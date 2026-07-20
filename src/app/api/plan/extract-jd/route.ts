import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { extractJd } from "@/agent/provider";
import { normalizeAiError } from "@/agent/errors";

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

    const { jdText } = await request.json();

    if (!jdText || !jdText.trim()) {
      return NextResponse.json(
        { error: "Job description text is required." },
        { status: 400 }
      );
    }

    const result = await extractJd(jdText);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Extract JD route error:", err);
    return NextResponse.json(
      { error: normalizeAiError(err) },
      { status: 500 }
    );
  }
}
