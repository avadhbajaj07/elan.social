export interface ClientProfile {
  id: string;
  agency_id: string;
  name: string;
  company_name: string;
  email: string;
  country: string;
  avatar_url: string;
  created_at: string;
}

export interface SocialAccount {
  id: string;
  client_id: string;
  platform: "instagram" | "tiktok" | "gmb" | "facebook" | "linkedin" | "youtube" | "threads" | "bluesky";
  blotato_account_id: string;
  account_name: string;
  handle: string;
  avatar_url: string;
  followers: number;
  connected_at: string;
}

export interface PostItem {
  id: string;
  client_id: string;
  social_account_id?: string;
  platforms: Array<"instagram" | "tiktok" | "gmb" | "facebook" | "linkedin" | "youtube" | "threads" | "bluesky">;
  caption: string;
  hashtags: string[];
  media_urls: string[];
  scheduled_time: string;
  status: "draft" | "pending_approval" | "approved" | "published" | "failed";
  blotato_post_id?: string;
  error_message?: string;
  created_at: string;
  approval_token?: string;
}

export interface CommentItem {
  id: string;
  client_id: string;
  social_account_id: string;
  platform: "instagram" | "facebook" | "tiktok" | "gmb" | "linkedin";
  blotato_comment_id: string;
  author_name: string;
  author_avatar: string;
  comment_text: string;
  replied: boolean;
  reply_text?: string;
  created_at: string;
}

export interface AnalyticsSnapshot {
  id: string;
  post_id: string;
  platform: string;
  views_count: number;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  reach_count: number;
  engagement_rate: number;
  snapshot_at: string;
}

export const INITIAL_CLIENTS: ClientProfile[] = [
  {
    id: "client-1",
    agency_id: "agency-admin",
    name: "Alps Haute Horlogerie",
    company_name: "Alps Watchmakers S.A.",
    email: "marketing@alps-watches.com",
    country: "Switzerland",
    avatar_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&auto=format&fit=crop&q=80",
    created_at: "2026-01-15T08:00:00Z"
  },
  {
    id: "client-2",
    agency_id: "agency-admin",
    name: "Bistro Lumière Paris",
    company_name: "Lumière Hospitality Group",
    email: "contact@bistrolumiere.fr",
    country: "France",
    avatar_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=150&auto=format&fit=crop&q=80",
    created_at: "2026-02-10T10:00:00Z"
  },
  {
    id: "client-3",
    agency_id: "agency-admin",
    name: "Zurich Fintech Lab",
    company_name: "Zurich Fintech AG",
    email: "social@zurichfintech.io",
    country: "Switzerland",
    avatar_url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&auto=format&fit=crop&q=80",
    created_at: "2026-03-01T09:30:00Z"
  }
];

export const INITIAL_ACCOUNTS: SocialAccount[] = [
  {
    id: "acc-1",
    client_id: "client-1",
    platform: "instagram",
    blotato_account_id: "blotato_ig_alps",
    account_name: "Alps Haute Horlogerie",
    handle: "@alps_watches",
    avatar_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&auto=format&fit=crop&q=80",
    followers: 48200,
    connected_at: "2026-01-16T10:00:00Z"
  },
  {
    id: "acc-2",
    client_id: "client-1",
    platform: "linkedin",
    blotato_account_id: "blotato_li_alps",
    account_name: "Alps Watchmakers S.A.",
    handle: "company/alps-watches",
    avatar_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&auto=format&fit=crop&q=80",
    followers: 12500,
    connected_at: "2026-01-16T10:05:00Z"
  },
  {
    id: "acc-3",
    client_id: "client-1",
    platform: "tiktok",
    blotato_account_id: "blotato_tt_alps",
    account_name: "Alps Luxury Crafts",
    handle: "@alpswatches_official",
    avatar_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&auto=format&fit=crop&q=80",
    followers: 94300,
    connected_at: "2026-01-18T14:20:00Z"
  },
  {
    id: "acc-4",
    client_id: "client-2",
    platform: "instagram",
    blotato_account_id: "blotato_ig_lumiere",
    account_name: "Bistro Lumière Paris",
    handle: "@bistro_lumiere_paris",
    avatar_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=150&auto=format&fit=crop&q=80",
    followers: 23100,
    connected_at: "2026-02-11T11:00:00Z"
  },
  {
    id: "acc-5",
    client_id: "client-2",
    platform: "facebook",
    blotato_account_id: "blotato_fb_lumiere",
    account_name: "Bistro Lumière Paris",
    handle: "fb.com/bistrolumiereparis",
    avatar_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=150&auto=format&fit=crop&q=80",
    followers: 18400,
    connected_at: "2026-02-11T11:05:00Z"
  }
];

export const INITIAL_POSTS: PostItem[] = [
  {
    id: "post-101",
    client_id: "client-1",
    social_account_id: "acc-1",
    platforms: ["instagram", "linkedin", "tiktok"],
    caption: "Introducing the Royal Tourbillon Alpine Edition 🏔️ Precision engineered in Geneva with a hand-carved sapphire crystal bezel. Available exclusively in selected boutiques.",
    hashtags: ["#LuxuryHorology", "#SwissMade", "#HauteHorlogerie", "#GenevaWatches", "#WatchCollector"],
    media_urls: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80"
    ],
    scheduled_time: "2026-08-10T09:00:00Z",
    status: "approved",
    blotato_post_id: "blot_post_9901",
    created_at: "2026-08-01T10:00:00Z",
    approval_token: "token-alps-tourbillon-approved"
  },
  {
    id: "post-102",
    client_id: "client-1",
    social_account_id: "acc-1",
    platforms: ["instagram", "tiktok"],
    caption: "Behind the artisan workbench: Watchmaker Master Laurent spending 140 hours hand-engraving Geneva stripes onto our in-house automatic calibre. ✨",
    hashtags: ["#Craftsmanship", "#Horology", "#BehindTheScenes", "#Watchmaking"],
    media_urls: [
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80"
    ],
    scheduled_time: "2026-08-12T14:30:00Z",
    status: "pending_approval",
    created_at: "2026-08-03T11:20:00Z",
    approval_token: "token-alps-workbench-pending"
  },
  {
    id: "post-103",
    client_id: "client-2",
    social_account_id: "acc-4",
    platforms: ["instagram", "facebook", "gmb"],
    caption: "Weekend special at Bistro Lumière 🍷 French beef bourguignon slow-cooked for 12 hours. Book your table today!",
    hashtags: ["#BistroParis", "#GastronomieFrancaise", "#ParisFoodie", "#BoeufBourguignon"],
    media_urls: [
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80"
    ],
    scheduled_time: "2026-08-08T11:00:00Z",
    status: "approved",
    created_at: "2026-08-02T15:45:00Z",
    approval_token: "token-bistro-weekend-approved"
  }
];

export const INITIAL_COMMENTS: CommentItem[] = [
  {
    id: "comm-1",
    client_id: "client-1",
    social_account_id: "acc-1",
    platform: "instagram",
    blotato_comment_id: "blot_comm_101",
    author_name: "marcus_watch_collector",
    author_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    comment_text: "What is the water resistance rating on the Alpine Edition Tourbillon?",
    replied: true,
    reply_text: "Hi Marcus! The Alpine Edition features 10 ATM (100 meters) water resistance. 💧",
    created_at: "2026-08-04T12:30:00Z"
  },
  {
    id: "comm-2",
    client_id: "client-1",
    social_account_id: "acc-1",
    platform: "instagram",
    blotato_comment_id: "blot_comm_102",
    author_name: "sophie.geneva",
    author_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    comment_text: "Can I book a private viewing appointment for next Tuesday?",
    replied: false,
    created_at: "2026-08-04T14:15:00Z"
  },
  {
    id: "comm-3",
    client_id: "client-2",
    social_account_id: "acc-4",
    platform: "facebook",
    blotato_comment_id: "blot_comm_103",
    author_name: "Jean-Luc Dubois",
    author_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    comment_text: "Do you have vegan options for the evening menu?",
    replied: false,
    created_at: "2026-08-04T15:50:00Z"
  }
];

export const INITIAL_ANALYTICS: AnalyticsSnapshot[] = [
  {
    id: "ana-1",
    post_id: "post-101",
    platform: "instagram",
    views_count: 14850,
    likes_count: 1240,
    comments_count: 88,
    shares_count: 215,
    reach_count: 12600,
    engagement_rate: 10.4,
    snapshot_at: "2026-08-04T00:00:00Z"
  },
  {
    id: "ana-2",
    post_id: "post-101",
    platform: "facebook",
    views_count: 8900,
    likes_count: 420,
    comments_count: 34,
    shares_count: 52,
    reach_count: 7400,
    engagement_rate: 5.7,
    snapshot_at: "2026-08-04T00:00:00Z"
  }
];

export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  price: number;
  clientsLimit: number;
  socialAccountsLimit: number;
  features: string[];
  popular?: boolean;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Essential social scheduling for solo creators and freelancers.",
    price: 29,
    clientsLimit: 3,
    socialAccountsLimit: 15,
    features: [
      "Up to 3 Client Workspaces",
      "Connect 15 Social Profiles (IG, TikTok, FB, LinkedIn, GMB)",
      "Visual Drag & Drop Calendar",
      "Unlimited Scheduled Posts",
      "Standard Analytics Reports",
      "Email Support"
    ]
  },
  {
    id: "pro",
    name: "Pro Agency",
    tagline: "Complete social management and 1-click client approvals for growing agencies.",
    price: 89,
    clientsLimit: 15,
    socialAccountsLimit: 75,
    features: [
      "Up to 15 Client Workspaces",
      "Connect 75 Social Accounts (All networks)",
      "1-Click Client Approval Email Portal",
      "Blotato Automated Publishing Engine",
      "Unified Social Inbox (Comments & DMs)",
      "White-labeled PDF Executive Reports",
      "Priority 24/7 Support"
    ],
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Custom scale for large agency networks and brand portfolios.",
    price: 249,
    clientsLimit: 100,
    socialAccountsLimit: 500,
    features: [
      "Unlimited Client Workspaces",
      "500+ Connected Social Accounts",
      "Custom Whitelabel Approval Portal Domain",
      "Dedicated Database & Dedicated IP",
      "Custom SLA & Account Manager",
      "Team Roles & Granular Permissions"
    ]
  }
];
