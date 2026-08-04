import { NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { token, action, clientFeedback } = await req.json();

    if (!token || !action) {
      return NextResponse.json({ error: "Token and action are required" }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      // Fetch token record
      const { data: tokenData, error: tokenErr } = await supabaseAdmin
        .from("approval_tokens")
        .select("*, posts(*)")
        .eq("token", token)
        .single();

      if (tokenErr || !tokenData) {
        return NextResponse.json({ error: "Invalid or expired approval link" }, { status: 404 });
      }

      if (tokenData.used_at) {
        return NextResponse.json({ error: "This approval link has already been used." }, { status: 400 });
      }

      const newStatus = action === "approve" ? "approved" : "draft";

      // Update post status
      const { error: updateErr } = await supabaseAdmin
        .from("posts")
        .update({
          status: newStatus,
          error_message: action === "reject" ? `Client Requested Revision: ${clientFeedback}` : null,
        })
        .eq("id", tokenData.post_id);

      if (updateErr) throw updateErr;

      // Mark token as used
      await supabaseAdmin.from("approval_tokens").update({ used_at: new Date().toISOString() }).eq("id", tokenData.id);

      return NextResponse.json({ success: true, status: newStatus });
    }

    // Mock mode response
    return NextResponse.json({
      success: true,
      status: action === "approve" ? "approved" : "draft",
      message: action === "approve" ? "Post approved successfully!" : "Revision feedback sent to your agency.",
    });
  } catch (err: any) {
    console.error("Post approval error:", err);
    return NextResponse.json({ error: err.message || "Failed to process post approval" }, { status: 500 });
  }
}
