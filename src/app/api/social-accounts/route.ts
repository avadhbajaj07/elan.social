import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const BLOTATO_BASE_URL = "https://backend.blotato.com/v2";

/**
 * GET /api/social-accounts
 * Fetches real connected accounts from Blotato API and syncs to Supabase.
 */
export async function GET() {
  const apiKey =
    process.env.BLOTATO_API_KEY ||
    "blt_xf24o9kuR/K6NKt6wDQ+c1Snut78GOX41jiqMJO5P7U=";

  if (!apiKey || apiKey === "placeholder") {
    return NextResponse.json({
      success: false,
      error: "BLOTATO_API_KEY is not configured on the server.",
      accounts: [],
      setup_required: true,
    });
  }

  try {
    // Fetch real connected accounts from Blotato
    const res = await fetch(`${BLOTATO_BASE_URL}/users/me/accounts`, {
      method: "GET",
      headers: {
        "blotato-api-key": apiKey,
        "Content-Type": "application/json",
      },
      // Disable caching so we always get fresh data
      cache: "no-store",
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Blotato API error:", res.status, errText);

      if (res.status === 401) {
        return NextResponse.json({
          success: false,
          error: "Invalid Blotato API Key. Please check your BLOTATO_API_KEY environment variable.",
          accounts: [],
          setup_required: true,
        });
      }

      return NextResponse.json({
        success: false,
        error: `Blotato API error: ${res.status} ${res.statusText}`,
        accounts: [],
      });
    }

    const data = await res.json();
    // Blotato returns { items: [...] } — confirmed from live API response
    const rawAccounts: any[] = Array.isArray(data)
      ? data
      : (data.items || data.accounts || data.data || []);

    // Normalize accounts to our format
    // Blotato fields: { id, platform, username, fullname }
    const accounts = rawAccounts.map((acc: any) => ({
      id: acc.id || acc.accountId,
      platform: (acc.platform || acc.type || "unknown").toLowerCase(),
      username: acc.username || acc.handle || acc.fullname || "Unknown",
      account_name: acc.fullname || acc.name || acc.displayName || acc.username || "Unknown",
      avatar_url: acc.avatarUrl || acc.avatar || acc.picture || "",
      connected: acc.connected !== false, // default to true if field missing
      blotato_account_id: acc.id || acc.accountId,
    }));

    // Sync to Supabase if admin client is available
    if (supabaseAdmin && accounts.length > 0) {
      for (const acc of accounts) {
        try {
          await supabaseAdmin.from("social_accounts").upsert(
            {
              account_id: acc.id,
              platform: acc.platform,
              username: acc.username,
              account_name: acc.account_name,
              avatar_url: acc.avatar_url,
              status: acc.connected ? "connected" : "expired",
              blotato_account_id: acc.blotato_account_id,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "account_id" }
          );
        } catch (dbErr) {
          console.warn("Failed to sync account to Supabase:", acc.id, dbErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      accounts,
      count: accounts.length,
      synced_at: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error fetching social accounts from Blotato:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch social accounts from Blotato",
        accounts: [],
      },
      { status: 500 }
    );
  }
}
