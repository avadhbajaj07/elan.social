import { NextResponse } from "next/server";

/**
 * GET /api/auth/connect/[platform]
 *
 * This endpoint redirects to Blotato's social account management page.
 * Blotato handles all OAuth flows internally — no separate Meta/TikTok app needed.
 *
 * To connect Instagram (or any platform):
 * 1. Log into my.blotato.com
 * 2. Go to Settings > Social Accounts
 * 3. Click "Login with Instagram" (or your platform)
 * 4. Come back and sync accounts via /api/social-accounts
 */
export async function GET(
  request: Request,
  { params }: { params: { platform: string } }
) {
  const platform = params.platform.toLowerCase();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://elan-social.vercel.app";

  // Redirect to Blotato's social account connection page
  // Blotato handles the OAuth — user connects there, we sync via API key
  const blotatoConnectUrl = "https://my.blotato.com/login";

  return NextResponse.redirect(blotatoConnectUrl);
}
