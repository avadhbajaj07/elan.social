import { NextResponse } from "next/server";
import { generateAICaption } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topic, tone, language, platform } = body;

    if (!topic) {
      return NextResponse.json({ error: "Topic is required for AI generation" }, { status: 400 });
    }

    const result = await generateAICaption({
      topic,
      tone: tone || "viral",
      language: language || "en",
      platform: platform || "instagram",
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("AI Generation Error:", err);
    return NextResponse.json({ error: err.message || "Failed to generate AI content" }, { status: 500 });
  }
}
