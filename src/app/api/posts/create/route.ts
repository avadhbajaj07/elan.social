import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendClientApprovalEmail } from "@/lib/resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { clientName, clientEmail, platforms, caption, hashtags, mediaUrls, scheduledTime, status } = body;

    if (!caption || !scheduledTime) {
      return NextResponse.json({ error: "Missing required post parameters" }, { status: 400 });
    }

    const postId = `post_${Date.now()}`;
    const token = crypto.randomBytes(32).toString("hex");

    let approvalUrl = "";
    if (status === "pending_approval" && clientEmail) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      approvalUrl = `${baseUrl}/approval/${token}`;

      // Dispatch 1-click approval email
      await sendClientApprovalEmail({
        clientEmail,
        clientName: clientName || "Valued Client",
        postTitle: caption.slice(0, 80) + "...",
        approvalUrl,
        scheduledTime: new Date(scheduledTime).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" }),
        platforms: platforms || ["instagram"],
      });
    }

    const createdPost = {
      id: postId,
      client_id: body.clientId || "client-1",
      platforms: platforms || ["instagram"],
      caption,
      hashtags: hashtags || [],
      media_urls: mediaUrls || [],
      scheduled_time: scheduledTime,
      status: status || "pending_approval",
      created_at: new Date().toISOString(),
      approval_token: token,
      approval_url: approvalUrl,
    };

    return NextResponse.json({ success: true, post: createdPost });
  } catch (err: any) {
    console.error("Error creating post:", err);
    return NextResponse.json({ error: err.message || "Failed to create post" }, { status: 500 });
  }
}
