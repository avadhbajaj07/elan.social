/**
 * Blotato REST API Helper Client
 * Base URL: https://backend.blotato.com/v2
 * Auth Header: blotato-api-key: <YOUR_API_KEY>
 */

const BLOTATO_BASE_URL = "https://backend.blotato.com/v2";

export interface BlotatoAccount {
  id: string;
  platform: string;
  name: string;
  username?: string;
  avatarUrl?: string;
  connected: boolean;
}

export interface BlotatoPublishPayload {
  accountId: string;
  platform: string;
  caption: string;
  mediaUrls: string[];
  scheduledTime?: string;
}

export interface BlotatoPostResponse {
  id: string;
  status: "scheduled" | "published" | "failed";
  scheduledTime?: string;
  createdAt: string;
  errorMessage?: string;
}

export const getBlotatoApiKey = (): string | null => {
  return process.env.BLOTATO_API_KEY || null;
};

/**
 * Fetch connected social accounts from Blotato
 */
export async function getBlotatoAccounts(apiKey?: string): Promise<BlotatoAccount[]> {
  const key = apiKey || getBlotatoApiKey();
  if (!key) {
    console.warn("Blotato API key not set. Returning mock connected accounts.");
    return [
      { id: "blotato_ig_alps", platform: "instagram", name: "Alps Haute Horlogerie", username: "@alps_watches", connected: true },
      { id: "blotato_li_alps", platform: "linkedin", name: "Alps Watchmakers S.A.", username: "company/alps-watches", connected: true },
      { id: "blotato_tt_alps", platform: "tiktok", name: "Alps Luxury Crafts", username: "@alpswatches_official", connected: true },
      { id: "blotato_ig_lumiere", platform: "instagram", name: "Bistro Lumière Paris", username: "@bistro_lumiere_paris", connected: true },
      { id: "blotato_fb_lumiere", platform: "facebook", name: "Bistro Lumière Paris", username: "fb.com/bistrolumiereparis", connected: true },
    ];
  }

  try {
    const res = await fetch(`${BLOTATO_BASE_URL}/users/me/accounts`, {
      method: "GET",
      headers: {
        "blotato-api-key": key,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Blotato accounts fetch failed: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data.accounts || data;
  } catch (error) {
    console.error("Error fetching Blotato accounts:", error);
    throw error;
  }
}

/**
 * Publish or Schedule a post via Blotato API
 * Includes header blotato-api-key and rate-limit retry handling
 */
export async function publishPostViaBlotato(
  payload: BlotatoPublishPayload,
  apiKey?: string,
  retryCount = 0
): Promise<BlotatoPostResponse> {
  const key = apiKey || getBlotatoApiKey();

  if (!key) {
    console.log("Simulating Blotato post dispatch for account:", payload.accountId);
    // Simulate latency
    await new Promise((r) => setTimeout(r, 600));
    return {
      id: `blot_sim_${Date.now()}`,
      status: payload.scheduledTime ? "scheduled" : "published",
      scheduledTime: payload.scheduledTime,
      createdAt: new Date().toISOString(),
    };
  }

  const body = {
    post: {
      accountId: payload.accountId,
      content: {
        text: payload.caption,
        mediaUrls: payload.mediaUrls,
        platform: payload.platform,
      },
      target: { targetType: payload.platform },
    },
    ...(payload.scheduledTime ? { scheduledTime: payload.scheduledTime } : {}),
  };

  try {
    const res = await fetch(`${BLOTATO_BASE_URL}/posts`, {
      method: "POST",
      headers: {
        "blotato-api-key": key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // Handle 429 Rate Limit (30 req/min limit)
    if (res.status === 429 && retryCount < 3) {
      const delay = Math.pow(2, retryCount + 1) * 1000;
      console.warn(`Blotato rate limit hit. Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return publishPostViaBlotato(payload, key, retryCount + 1);
    }

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Blotato publish API error (${res.status}): ${errText}`);
    }

    const responseData = await res.json();
    return {
      id: responseData.id || `blot_${Date.now()}`,
      status: responseData.status || "published",
      scheduledTime: responseData.scheduledTime,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Failed to publish post via Blotato:", error);
    throw error;
  }
}

/**
 * Fetch Post Analytics from Blotato API
 */
export async function getBlotatoPostAnalytics(blotatoPostId: string, apiKey?: string) {
  const key = apiKey || getBlotatoApiKey();
  if (!key) {
    return {
      views: Math.floor(Math.random() * 5000) + 1200,
      likes: Math.floor(Math.random() * 800) + 150,
      comments: Math.floor(Math.random() * 60) + 10,
      shares: Math.floor(Math.random() * 40) + 5,
      reach: Math.floor(Math.random() * 4000) + 1000,
    };
  }

  try {
    const res = await fetch(`${BLOTATO_BASE_URL}/posts/${blotatoPostId}/analytics`, {
      headers: { "blotato-api-key": key },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error fetching Blotato post analytics:", error);
    return null;
  }
}

/**
 * Generate Faceless Video or Quote Card via Blotato Templates
 */
export async function generateVideoFromTemplate(
  topic: string,
  style: "quote_card" | "tweet_card" | "slideshow" | "faceless_reels",
  apiKey?: string
) {
  const key = apiKey || getBlotatoApiKey();
  if (!key) {
    return {
      success: true,
      videoUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&auto=format&fit=crop&q=80",
      caption: `✨ Viral short video on "${topic}" generated with ${style} layout!`,
    };
  }

  try {
    const res = await fetch(`${BLOTATO_BASE_URL}/videos/from-templates`, {
      method: "POST",
      headers: {
        "blotato-api-key": key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic, style }),
    });

    if (!res.ok) {
      throw new Error(`Blotato template video generation failed: ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Blotato Video Template Error:", err);
    throw err;
  }
}
