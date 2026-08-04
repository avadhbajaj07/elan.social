import { NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { blotatoPostId, status, errorMessage } = payload;

    if (blotatoPostId && isSupabaseConfigured()) {
      await supabaseAdmin
        .from("posts")
        .update({
          status: status === "SUCCESS" ? "published" : "failed",
          error_message: errorMessage || null,
        })
        .eq("blotato_post_id", blotatoPostId);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
