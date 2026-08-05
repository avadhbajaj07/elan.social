// Production Data Types & Initial Empty/Live Default States for elan.social

export interface ClientProfile {
  id: string;
  name: string;
  slug: string;
  logo: string;
  avatar_url?: string;
  email?: string;
  phone?: string;
  industry?: string;
  timeZone: string;
  // These are the Blotato account IDs mapped to this client
  blotatoAccountIds: string[];
  connectedPlatforms: ("instagram" | "tiktok" | "facebook" | "linkedin" | "youtube" | "threads" | "twitter")[];
  stats: {
    totalFollowers: number;
    followerGrowth: number;
    monthlyImpressions: number;
    postsThisMonth: number;
  };
  notes?: string;
  createdAt: string;
}

export interface Post {
  id: string;
  clientId: string;
  title: string;
  caption: string;
  mediaUrls: string[];
  mediaType: "image" | "video" | "carousel";
  platforms: ("instagram" | "tiktok" | "facebook" | "linkedin" | "youtube" | "threads" | "twitter")[];
  // Blotato account IDs to publish to (one per platform)
  blotatoAccountIds?: string[];
  scheduledTime: string;
  status: "draft" | "pending_approval" | "approved" | "rejected" | "scheduled" | "published" | "failed";
  approvalToken?: string;
  feedbackReason?: string;
  createdAt: string;
  metrics?: {
    impressions?: number;
    reach?: number;
    likes?: number;
    comments?: number;
    shares?: number;
  };
}

export interface SocialComment {
  id: string;
  platform: "instagram" | "facebook" | "tiktok" | "linkedin" | "twitter";
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  commentText: string;
  createdAt: string;
  postTitle?: string;
  status: "unresolved" | "replied" | "ignored";
  replyText?: string;
}

export interface BlotatoAccount {
  id: string;
  platform: string;
  username: string;
  account_name: string;
  avatar_url?: string;
  connected: boolean;
  blotato_account_id: string;
}

// Default empty state — clients are created/managed at runtime
export const INITIAL_CLIENTS: ClientProfile[] = [];

// Initial Empty Posts Array
export const INITIAL_POSTS: Post[] = [];

// Initial Empty Comments Array
export const INITIAL_COMMENTS: SocialComment[] = [];

export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  price: number;
  popular?: boolean;
  features: string[];
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For creators and solo managers",
    price: 29,
    features: [
      "Up to 5 Social Profiles",
      "Unlimited Scheduled Posts",
      "Visual Calendar & Composer",
      "Blotato Auto-Publishing",
      "Basic Analytics Reports",
    ],
  },
  {
    id: "agency",
    name: "Agency Pro",
    tagline: "For growing marketing agencies & teams",
    price: 89,
    popular: true,
    features: [
      "Up to 20 Social Profiles",
      "Unlimited Client Workspaces",
      "1-Click Client Approval Portal",
      "Blotato REST API Integration",
      "Unified Social Inbox",
      "White-Label PDF Reports",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "For large brand networks",
    price: 249,
    features: [
      "Unlimited Profiles & Workspaces",
      "Dedicated Blotato Rate Limits",
      "Custom SmartLinks Bio Sites",
      "Custom Domain Approvals",
      "Priority 24/7 SLA Support",
    ],
  },
];

// LocalStorage key for persisting clients client-side
export const CLIENTS_STORAGE_KEY = "elan_clients_v2";

export function loadClientsFromStorage(): ClientProfile[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CLIENTS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ClientProfile[];
  } catch {
    return [];
  }
}

export function saveClientsToStorage(clients: ClientProfile[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
  } catch {
    // ignore
  }
}
