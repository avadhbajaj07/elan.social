import { NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { publishPostViaBlotato } from "@/lib/blotato";

export async function GET(req: Request) {
  // Verify Cron Secret header for security
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized cron execution" }, { status: 401 });
  }

  try {
    const nowIso = new Date().toISOString();
    let publishedCount = 0;
    let failedCount = 0;

    if (isSupabaseConfigured()) {
      // Query approved posts due for publishing
      const { data: postsToPublish, error: fetchErr } = await supabaseAdmin
        .from("posts")
        .select("*, social_accounts(*)")
        .eq("status", "approved")
        .lte("scheduled_time", nowIso);

      if (fetchErr) throw fetchErr;

      for (const post of postsToPublish || []) {
        try {
          const blotatoAccountId = post.social_accounts?.blotato_account_id || "default_acc";
          const res = await publishPostViaBlotato({
            accountId: blotatoAccountId,
            platform: post.platforms?.[0] || "instagram",
            caption: `${post.caption} ${post.hashtags?.join(" ")}`,
            mediaUrls: post.media_urls || [],
          });

          await supabaseAdmin
            .from("posts")
            .update({
              status: "published",
              blotato_post_id: res.id,
              error_message: null,
            })
            .eq("id", post.id);

          publishedCount++;
        } catch (err: any) {
          failedCount++;
          await supabaseAdmin
            .from("posts")
            .update({
              status: "failed",
              error_message: err.message || "Failed to publish via Blotato API",
            })
            .eq("id", post.id);
        }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: nowIso,
      published: publishedCount,
      failed: failedCount,
      message: `Vercel Cron Publisher executed at 07:00 UTC. ${publishedCount} published, ${failedCount} failed.`,
    });
  } catch (err: any) {
    console.error("Cron publish runner error:", err);
    return NextResponse.json({ error: err.message || "Cron publish failed" }, { status: 500 });
  }
}
