import { NextResponse } from "next/server";

const BLOTATO_BASE_URL = "https://backend.blotato.com/v2";

/**
 * POST /api/posts
 * Publishes or schedules a post to one or more Blotato accounts.
 */
export async function POST(request: Request) {
  const apiKey = process.env.BLOTATO_API_KEY;

  if (!apiKey || apiKey === "placeholder") {
    return NextResponse.json(
      { success: false, error: "BLOTATO_API_KEY is not configured." },
      { status: 500 }
    );
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  const {
    blotatoAccountIds,
    caption,
    mediaUrls = [],
    postType = "single",
    scheduledTime,
    publishNow = false,
    platforms = [],
  } = body;

  if (!blotatoAccountIds || blotatoAccountIds.length === 0) {
    return NextResponse.json(
      { success: false, error: "No accounts selected to post to." },
      { status: 400 }
    );
  }

  if (!caption || !caption.trim()) {
    return NextResponse.json(
      { success: false, error: "Caption is required." },
      { status: 400 }
    );
  }

  // Validate carousel
  if (postType === "carousel" && mediaUrls.length < 2) {
    return NextResponse.json(
      { success: false, error: "Carousel requires at least 2 image URLs." },
      { status: 400 }
    );
  }

  const results: any[] = [];
  const errors: string[] = [];

  // Post to each selected Blotato account
  for (const accountId of blotatoAccountIds) {
    try {
      // Build the Blotato post payload
      const blotatoPayload: any = {
        post: {
          accountId: accountId,
          content: {
            text: caption,
          },
        },
      };

      // Add media based on post type
      if (postType === "carousel" && mediaUrls.length >= 2) {
        // Blotato carousel: array of image URLs
        blotatoPayload.post.content.mediaUrls = mediaUrls;
        blotatoPayload.post.content.mediaType = "carousel";
      } else if (mediaUrls && mediaUrls.length > 0) {
        blotatoPayload.post.content.mediaUrls = mediaUrls;
        if (postType === "video") {
          blotatoPayload.post.content.mediaType = "video";
        }
      }

      // Add scheduled time if not posting now
      if (!publishNow && scheduledTime) {
        blotatoPayload.scheduledTime = new Date(scheduledTime).toISOString();
      }

      const res = await fetch(`${BLOTATO_BASE_URL}/posts`, {
        method: "POST",
        headers: {
          "blotato-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blotatoPayload),
      });

      const responseData = await res.json();

      if (res.ok) {
        results.push({
          accountId,
          success: true,
          postId: responseData.id || responseData.postId,
          status: responseData.status || (publishNow ? "published" : "scheduled"),
        });
      } else {
        const errMsg = responseData.message || responseData.error || `HTTP ${res.status}`;
        errors.push(`Account ${accountId}: ${errMsg}`);
        results.push({ accountId, success: false, error: errMsg });
      }
    } catch (err: any) {
      const errMsg = err.message || "Unknown error";
      errors.push(`Account ${accountId}: ${errMsg}`);
      results.push({ accountId, success: false, error: errMsg });
    }
  }

  const successCount = results.filter((r) => r.success).length;
  const totalCount = results.length;

  return NextResponse.json({
    success: successCount > 0,
    message:
      successCount === totalCount
        ? publishNow
          ? `Published to all ${totalCount} account(s) successfully!`
          : `Scheduled for all ${totalCount} account(s) successfully!`
        : `Posted to ${successCount}/${totalCount} accounts. ${errors.length} failed.`,
    results,
    errors: errors.length > 0 ? errors : undefined,
    scheduledTime: !publishNow ? scheduledTime : undefined,
  });
}
