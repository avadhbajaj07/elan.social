// Production Data Types & Initial Empty/Live Default States for elan.social

export interface ClientProfile {
  id: string;
  name: string;
  slug: string;
  logo: string;
  avatar_url?: string;
  email?: string;
  timeZone: string;
  connectedPlatforms: ("instagram" | "tiktok" | "facebook" | "linkedin" | "youtube" | "threads" | "twitter")[];
  stats: {
    totalFollowers: number;
    followerGrowth: number;
    monthlyImpressions: number;
    postsThisMonth: number;
  };
}

export interface Post {
  id: string;
  clientId: string;
  title: string;
  caption: string;
  mediaUrls: string[];
  mediaType: "image" | "video" | "carousel";
  platforms: ("instagram" | "tiktok" | "facebook" | "linkedin" | "youtube" | "threads" | "twitter")[];
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

// Initial Empty Client Workspaces (Clean state ready for real connected accounts)
export const INITIAL_CLIENTS: ClientProfile[] = [
  {
    id: "client-1",
    name: "My Social Brand",
    slug: "my-brand",
    logo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    email: "brand@elan.social",
    timeZone: "America/New_York",
    connectedPlatforms: ["instagram", "tiktok", "facebook", "linkedin", "youtube"],
    stats: {
      totalFollowers: 0,
      followerGrowth: 0,
      monthlyImpressions: 0,
      postsThisMonth: 0,
    },
  },
];

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
