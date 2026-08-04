import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// GET /api/auth/callback/[platform]?code=xxx&clientId=xxx
export async function GET(
  request: Request,
  { params }: { params: { platform: string } }
) {
  const { searchParams } = new URL(request.url);
  const platform = params.platform.toLowerCase();
  const clientId = searchParams.get("clientId") || "client-1";
  const accountId = searchParams.get("account_id") || `acc_${platform}_${Date.now()}`;
  const username = searchParams.get("username") || `@${platform}_brand`;
  const accountName = searchParams.get("name") || `${platform.toUpperCase()} Workspace Account`;

  try {
    if (supabaseAdmin) {
      // Upsert into Supabase `social_accounts` table
      await supabaseAdmin.from("social_accounts").upsert(
        {
          client_id: clientId,
          account_id: accountId,
          platform,
          username,
          account_name: accountName,
          status: "connected",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "account_id" }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://elan-social.vercel.app";
    return NextResponse.redirect(
      `${siteUrl}/dashboard/clients?success=true&connected=${platform}&handle=${encodeURIComponent(username)}`
    );
  } catch (err: any) {
    console.error("OAuth Callback Error:", err);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://elan-social.vercel.app";
    return NextResponse.redirect(
      `${siteUrl}/dashboard/clients?error=${encodeURIComponent(err.message || "Failed to bind account")}`
    );
  }
}
