import { NextResponse } from "next/server";
import { getBlotatoAccounts } from "@/lib/blotato";
import { supabaseAdmin } from "@/lib/supabase";

// GET /api/social-accounts - Syncs & returns connected social accounts from Blotato & Supabase
export async function GET() {
  try {
    const blotatoAccounts = await getBlotatoAccounts();

    if (supabaseAdmin && blotatoAccounts.length > 0) {
      // Upsert Blotato accounts into Supabase table `social_accounts`
      for (const acc of blotatoAccounts) {
        await supabaseAdmin.from("social_accounts").upsert(
          {
            account_id: acc.id,
            platform: acc.platform,
            username: acc.username || acc.name,
            account_name: acc.name,
            avatar_url: acc.avatarUrl || "",
            status: acc.connected ? "connected" : "expired",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "account_id" }
        );
      }
    }

    return NextResponse.json({
      success: true,
      accounts: blotatoAccounts,
      count: blotatoAccounts.length,
    });
  } catch (error: any) {
    console.error("Error fetching social accounts:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch social accounts", accounts: [] },
      { status: 500 }
    );
  }
}
