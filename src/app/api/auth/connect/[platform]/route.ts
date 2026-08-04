import { NextResponse } from "next/server";

// GET /api/auth/connect/[platform]?clientId=xxx
export async function GET(
  request: Request,
  { params }: { params: { platform: string } }
) {
  const { searchParams } = new URL(request.url);
  const platform = params.platform.toLowerCase();
  const clientId = searchParams.get("clientId") || "default-client";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://elan-social.vercel.app";
  const callbackUrl = `${siteUrl}/api/auth/callback/${platform}?clientId=${encodeURIComponent(clientId)}`;

  // Meta / Facebook OAuth App ID (Fallback to Meta Graph API dialog or Direct Callback)
  const metaAppId = process.env.META_APP_ID || process.env.FACEBOOK_APP_ID;

  if (metaAppId && (platform === "instagram" || platform === "facebook")) {
    const metaOAuthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${metaAppId}&redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&scope=instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement`;

    return NextResponse.redirect(metaOAuthUrl);
  }

  // Redirect directly to callback with simulated auth or Blotato web auth
  return NextResponse.redirect(
    `${callbackUrl}&account_id=acc_${platform}_${Date.now()}&username=@${platform}_${clientId.replace(/[^a-z0-9]/g, "")}&name=${encodeURIComponent(
      `${platform.toUpperCase()} Profile (${clientId})`
    )}`
  );
}
