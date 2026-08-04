import { NextResponse } from "next/server";

// GET /api/auth/connect/[platform]?clientId=xxx
// Direct In-App OAuth Redirect for Instagram, TikTok, Facebook, LinkedIn, YouTube, Twitter
export async function GET(
  request: Request,
  { params }: { params: { platform: string } }
) {
  const { searchParams } = new URL(request.url);
  const platform = params.platform.toLowerCase();
  const clientId = searchParams.get("clientId") || "default-client";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://elan-social.vercel.app";
  const callbackUrl = `${siteUrl}/api/auth/callback/${platform}?clientId=${clientId}`;

  const blotatoKey = process.env.BLOTATO_API_KEY || "";

  // Direct Blotato White-Label OAuth Connection Endpoint
  const blotatoConnectUrl = `https://backend.blotato.com/v2/oauth/connect?platform=${platform}&client_id=${clientId}&redirect_url=${encodeURIComponent(
    callbackUrl
  )}&api_key=${blotatoKey}`;

  // Redirect client directly to Instagram/Meta OAuth dialog
  return NextResponse.redirect(blotatoConnectUrl);
}
