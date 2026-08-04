import { NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { getBlotatoPostAnalytics } from "@/lib/blotato";

export async function GET(req: Request) {
  try {
    if (isSupabaseConfigured()) {
      const { data: publishedPosts } = await supabaseAdmin
        .from("posts")
        .select("id, blotato_post_id, platforms")
        .eq("status", "published")
        .not("blotato_post_id", "is", null);

      for (const post of publishedPosts || []) {
        const metrics = await getBlotatoPostAnalytics(post.blotato_post_id);
        if (metrics) {
          await supabaseAdmin.from("post_analytics").insert({
            post_id: post.id,
            platform: post.platforms?.[0] || "instagram",
            views_count: metrics.views || 0,
            likes_count: metrics.likes || 0,
            comments_count: metrics.comments || 0,
            shares_count: metrics.shares || 0,
            reach_count: metrics.reach || 0,
            raw_metrics: metrics,
            snapshot_at: new Date().toISOString(),
          });
        }
      }
    }

    return NextResponse.json({ success: true, timestamp: new Date().toISOString() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
