import { NextResponse } from "next/server";

const BLOTATO_BASE_URL = "https://backend.blotato.com/v2";

/**
 * GET /api/automations
 * Fetches all DM & Comment automations from Blotato.
 */
export async function GET() {
  const apiKey =
    process.env.BLOTATO_API_KEY ||
    "blt_xf24o9kuR/K6NKt6wDQ+c1Snut78GOX41jiqMJO5P7U=";

  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: "BLOTATO_API_KEY is not configured." },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(`${BLOTATO_BASE_URL}/dm-automations`, {
      headers: {
        "blotato-api-key": apiKey,
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: data.message || "Failed to fetch automations." },
        { status: res.status }
      );
    }

    const items = data.items || data.automations || (Array.isArray(data) ? data : []);

    return NextResponse.json({
      success: true,
      automations: items,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/automations
 * Creates a new Instagram comment keyword auto-DM automation flow on Blotato.
 */
export async function POST(request: Request) {
  const apiKey =
    process.env.BLOTATO_API_KEY ||
    "blt_xf24o9kuR/K6NKt6wDQ+c1Snut78GOX41jiqMJO5P7U=";

  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: "BLOTATO_API_KEY is not configured." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const {
      accountId,
      keyword = "JWT",
      keywords,
      name,
      dmMessage,
      buttonTitle,
      buttonUrl,
      commentReply,
    } = body;

    if (!accountId) {
      return NextResponse.json(
        { success: false, error: "Target Account ID is required." },
        { status: 400 }
      );
    }

    if (!dmMessage) {
      return NextResponse.json(
        { success: false, error: "DM Message text is required." },
        { status: 400 }
      );
    }

    const kwList = Array.isArray(keywords)
      ? keywords
      : [keyword, keyword.toLowerCase(), keyword.toUpperCase()].filter(
          (v, i, a) => a.indexOf(v) === i
        );

    const buttons = [];
    if (buttonTitle && buttonUrl) {
      buttons.push({
        title: buttonTitle,
        type: "url",
        url: buttonUrl,
      });
    }

    const blotatoPayload: any = {
      name: name || `Auto-DM for keyword "${kwList[0]}"`,
      platform: "instagram",
      accountId: String(accountId),
      trigger: {
        type: "comment-received",
        keywords: kwList,
      },
      target: {
        targetType: "instagram",
      },
      dmMessage,
      buttons,
    };

    if (commentReply) {
      blotatoPayload.commentReply = commentReply;
    }

    // Step 1: Create flow
    const createRes = await fetch(`${BLOTATO_BASE_URL}/dm-automations`, {
      method: "POST",
      headers: {
        "blotato-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(blotatoPayload),
    });

    const createData = await createRes.json();

    if (!createRes.ok) {
      return NextResponse.json(
        {
          success: false,
          error: createData.message || "Failed to create DM automation flow.",
        },
        { status: createRes.status }
      );
    }

    const flowId = createData.flow?.id || createData.id;

    // Step 2: Publish / Activate flow if created
    if (flowId) {
      try {
        await fetch(`${BLOTATO_BASE_URL}/dm-automations/${flowId}`, {
          method: "PATCH",
          headers: {
            "blotato-api-key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ patch: { isActive: true } }),
        });
      } catch {
        /* silent fallback */
      }
    }

    return NextResponse.json({
      success: true,
      automation: createData.flow || createData,
      message: `🎉 Auto-DM automation for keyword "${kwList[0]}" created and activated!`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/automations
 * Toggles active status or updates an existing DM automation flow.
 */
export async function PATCH(request: Request) {
  const apiKey =
    process.env.BLOTATO_API_KEY ||
    "blt_xf24o9kuR/K6NKt6wDQ+c1Snut78GOX41jiqMJO5P7U=";

  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: "BLOTATO_API_KEY is not configured." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { flowId, isActive } = body;

    if (!flowId) {
      return NextResponse.json(
        { success: false, error: "Flow ID is required." },
        { status: 400 }
      );
    }

    const res = await fetch(`${BLOTATO_BASE_URL}/dm-automations/${flowId}`, {
      method: "PATCH",
      headers: {
        "blotato-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ patch: { isActive } }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: data.message || "Failed to update automation." },
        { status: res.status }
      );
    }

    return NextResponse.json({
      success: true,
      automation: data.flow || data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}
