import { NextResponse } from "next/server";

const BLOTATO_BASE_URL = "https://backend.blotato.com/v2";

/**
 * POST /api/posts
 * Publishes or schedules a post via Blotato API.
 *
 * Blotato required fields (confirmed from live API):
 * - post.accountId
 * - post.content.platform
 * - post.content.mediaUrls  (array, can be empty [])
 * - post.target.targetType  (same as platform)
 *
 * Optional fields:
 * - post.content.text
 * - scheduledTime           (ISO 8601, top-level NOT inside post)
 * - useNextFreeSlot         (boolean, top-level)
 * - post.additionalPosts    (for threads/twitter threads)
 */
export async function POST(request: Request) {
  const apiKey =
    process.env.BLOTATO_API_KEY ||
    "blt_xf24o9kuR/K6NKt6wDQ+c1Snut78GOX41jiqMJO5P7U=";

  if (!apiKey || apiKey === "placeholder") {
    return NextResponse.json(
      { success: false, error: "BLOTATO_API_KEY is not configured on the server." },
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
    blotatoAccountIds,   // array of Blotato account IDs
    platform,           // e.g. "instagram"
    caption,
    mediaUrls = [],
    postType = "single", // single | carousel | video | reel | story | text
    scheduledTime,
    useNextFreeSlot = false,
    publishNow = false,
    // Thread/Twitter thread support
    additionalPosts = [],
    // Platform-specific
    firstCommentText,   // Instagram: post a first comment after publishing
  } = body;

  if (!blotatoAccountIds || blotatoAccountIds.length === 0) {
    return NextResponse.json({ success: false, error: "No accounts selected." }, { status: 400 });
  }

  // Carousel needs at least 2 images
  if (postType === "carousel" && mediaUrls.length < 2) {
    return NextResponse.json(
      { success: false, error: "Carousel requires at least 2 image URLs." },
      { status: 400 }
    );
  }

  const results: any[] = [];
  const errors: string[] = [];

  for (const accountId of blotatoAccountIds) {
    try {
      // Determine platform for this account
      const accountPlatform = platform || "instagram";

      // Build target object according to Blotato API specs per platform
      let targetObj: any = { targetType: accountPlatform };

      if (accountPlatform === "tiktok") {
        targetObj = {
          targetType: "tiktok",
          privacyLevel: body.privacyLevel || "PUBLIC_TO_EVERYONE",
          disabledComments: body.disabledComments ?? false,
          disabledDuet: body.disabledDuet ?? false,
          disabledStitch: body.disabledStitch ?? false,
          isBrandedContent: body.isBrandedContent ?? false,
          isYourBrand: body.isYourBrand ?? false,
          isAiGenerated: body.isAiGenerated ?? false,
        };
      } else if (accountPlatform === "youtube") {
        targetObj = {
          targetType: "youtube",
          title: body.youtubeTitle || body.title || caption?.slice(0, 95) || "New Video",
          privacyStatus: body.privacyStatus || "public",
          shouldNotifySubscribers: body.shouldNotifySubscribers ?? true,
        };
        if (body.madeForKids !== undefined) targetObj.madeForKids = body.madeForKids;
      } else if (accountPlatform === "pinterest") {
        targetObj = {
          targetType: "pinterest",
          boardId: body.boardId || "default",
        };
        if (body.pinTitle || body.title) targetObj.title = body.pinTitle || body.title;
        if (body.pinLink || body.link) targetObj.link = body.pinLink || body.link;
      } else if (accountPlatform === "linkedin") {
        targetObj = {
          targetType: "linkedin",
        };
        if (body.visibility) targetObj.visibility = body.visibility;
        if (body.link) targetObj.link = body.link;
      } else if (accountPlatform === "instagram") {
        targetObj = {
          targetType: "instagram",
        };
        if (postType === "story" || body.mediaType === "story") {
          targetObj.mediaType = "story";
        }
        if (body.locationId || body.locationTag) {
          targetObj.locationId = body.locationId || body.locationTag;
        }
      }

      // Build the Blotato payload - exact structure required by their API
      const blotatoPayload: any = {
        post: {
          accountId: String(accountId),
          content: {
            platform: accountPlatform,
            text: caption || "",
            mediaUrls: Array.isArray(mediaUrls) ? mediaUrls : [],
          },
          target: targetObj,
        },
      };

      // Add thread posts (for Twitter/Bluesky/Threads chaining)
      if (additionalPosts && additionalPosts.length > 0) {
        blotatoPayload.post.additionalPosts = additionalPosts;
      }

      // First comment (Instagram feature)
      if (firstCommentText && accountPlatform === "instagram") {
        blotatoPayload.post.firstComment = { text: firstCommentText };
      }

      // Scheduling — MUST be top-level, NOT inside post object
      if (!publishNow) {
        if (useNextFreeSlot) {
          blotatoPayload.useNextFreeSlot = true;
        } else if (scheduledTime) {
          blotatoPayload.scheduledTime = new Date(scheduledTime).toISOString();
        }
      }

      const res = await fetch(`${BLOTATO_BASE_URL}/posts`, {
        method: "POST",
        headers: {
          "blotato-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blotatoPayload),
      });

      const responseText = await res.text();
      let responseData: any = {};
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = { raw: responseText };
      }

      if (res.ok) {
        results.push({
          accountId,
          success: true,
          postSubmissionId: responseData.postSubmissionId || responseData.id,
          status: responseData.status || (publishNow ? "published" : "scheduled"),
          blotatoResponse: responseData,
        });
      } else {
        const errMsg = responseData.message || responseData.error || `HTTP ${res.status}`;
        errors.push(`Account ${accountId}: ${errMsg}`);
        results.push({ accountId, success: false, error: errMsg, blotatoResponse: responseData });
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
          : useNextFreeSlot
          ? `Added to next free slot for ${totalCount} account(s)!`
          : `Scheduled for ${totalCount} account(s) successfully!`
        : `Posted to ${successCount}/${totalCount} accounts. ${errors.length} failed.`,
    results,
    errors: errors.length > 0 ? errors : undefined,
    scheduledTime: !publishNow ? scheduledTime : undefined,
  });
}
