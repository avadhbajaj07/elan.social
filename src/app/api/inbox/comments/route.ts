import { NextResponse } from "next/server";
import { INITIAL_COMMENTS } from "@/lib/mockData";

export async function GET(req: Request) {
  return NextResponse.json({ comments: INITIAL_COMMENTS });
}

export async function POST(req: Request) {
  try {
    const { commentId, replyText } = await req.json();
    if (!commentId || !replyText) {
      return NextResponse.json({ error: "commentId and replyText are required" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      commentId,
      replyText,
      repliedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
