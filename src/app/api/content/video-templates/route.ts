import { NextResponse } from "next/server";
import { generateVideoFromTemplate } from "@/lib/blotato";

export async function POST(req: Request) {
  try {
    const { topic, style } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const result = await generateVideoFromTemplate(topic, style || "faceless_reels");
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Template generation failed" }, { status: 500 });
  }
}
