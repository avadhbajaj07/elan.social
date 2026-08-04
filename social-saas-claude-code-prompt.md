# PROMPT FOR CLAUDE CODE: Build European Social Media SaaS

## 🎯 Goal & Architecture
Build a multi-tenant, white-labeled Social Media Management & Client Approval SaaS tailored for European SMBs and agencies (Switzerland, Germany, France, EU).

- **Frontend**: Next.js 14/15 (App Router, TypeScript, Tailwind CSS, Shadcn UI, Lucide React).
- **Database & Auth**: Supabase PostgreSQL (EU Frankfurt `eu-central-1` region) with Row-Level Security (RLS) **enforced on every tenant-scoped table** — see schema below.
- **Payments**: Stripe Billing (Subscriptions in EUR € and CHF, Stripe Checkout, Stripe Webhooks, Billing Portal).
- **Email Notifications**: Resend API (Sending 1-click post approval emails to clients).
- **Social Media Publishing API**: Blotato REST API (`https://backend.blotato.com/v2`). Auth is via the `blotato-api-key: YOUR_API_KEY` header — **not** `Authorization: Bearer`.
- **Analytics**: pulled from Blotato's Analytics API (`GET /v2/analytics`, `GET /v2/posts/{id}/analytics`) and stored as snapshots in our own DB for unlimited history. Metrics currently only populate for Twitter/X, Instagram, Facebook, Threads, and Bluesky — **LinkedIn, TikTok, YouTube, Pinterest analytics are not available from Blotato yet**, show these as "coming soon" in the UI, don't silently omit them.
- **Social Inbox**: Instagram & Facebook comments/DMs read + reply, via Blotato's Comments API.
- **Publish-status Webhooks**: Blotato can notify our backend on publish success/failure instead of relying purely on cron polling.
- **AI Video/Graphics Templates**: Blotato's viral-post/faceless-video templates (`/v2/videos/from-templates`) for auto-generating slideshows, quote cards, and tweet cards from a topic/prompt.
- **Automation Cron**: Vercel Cron Jobs (`vercel.json`) running daily at `07:00 UTC`. Note: this is 08:00 CET in winter / 09:00 CEST in summer for Switzerland — don't hardcode "9 AM Swiss time" in UI copy.
- **AI Content Engine**: Gemini API / OpenAI API (Generating captions, hashtags, and translations in French, German, Italian, and English).

---

## 📁 1. Project Directory Structure

```
social-saas/
├── supabase/
│   └── schema.sql
├── vercel.json
├── .env.example
└── src/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── (auth)/
    │   │   ├── login/page.tsx
    │   │   └── signup/page.tsx
    │   ├── dashboard/
    │   │   ├── page.tsx
    │   │   ├── calendar/page.tsx
    │   │   ├── clients/page.tsx
    │   │   ├── analytics/page.tsx
    │   │   ├── inbox/page.tsx
    │   │   └── settings/page.tsx
    │   ├── approval/[token]/page.tsx
    │   └── api/
    │       ├── cron/publish/route.ts
    │       ├── cron/analytics-sync/route.ts
    │       ├── webhooks/stripe/route.ts
    │       ├── webhooks/blotato/route.ts
    │       ├── posts/create/route.ts
    │       ├── posts/approve/route.ts
    │       ├── blotato/accounts/route.ts
    │       ├── inbox/comments/route.ts
    │       └── content/video-templates/route.ts
    ├── lib/
    │   ├── supabase.ts
    │   ├── blotato.ts
    │   ├── stripe.ts
    │   ├── resend.ts
    │   └── ai.ts
    └── components/
        ├── ui/
        ├── Navbar.tsx
        ├── Sidebar.tsx
        ├── CalendarView.tsx
        ├── PostCard.tsx
        └── ClientForm.tsx
```

---

## 🗄️ 2. Supabase SQL Schema (`supabase/schema.sql`)

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Clients Table (European Client Profiles)
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    country VARCHAR(100) DEFAULT 'Switzerland',
    currency VARCHAR(10) DEFAULT 'EUR' CHECK (currency IN ('EUR', 'CHF')),
    preferred_language VARCHAR(20) DEFAULT 'fr' CHECK (preferred_language IN ('fr', 'de', 'en', 'it')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Social Accounts Table (Maps clients to Blotato account IDs)
CREATE TABLE IF NOT EXISTS public.social_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('instagram', 'tiktok', 'gmb', 'facebook', 'linkedin', 'youtube')),
    blotato_account_id VARCHAR(255) NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(client_id, platform, blotato_account_id)
);

-- 3. Posts Table (Content, Schedules & Publishing Status)
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    social_account_id UUID REFERENCES public.social_accounts(id) ON DELETE SET NULL,
    caption TEXT NOT NULL,
    hashtags TEXT[],
    media_urls TEXT[] DEFAULT '{}',
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending_approval' CHECK (status IN ('draft', 'pending_approval', 'approved', 'published', 'failed')),
    blotato_post_id VARCHAR(255),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Approval Tokens Table (1-Click Client Approval via Resend)
CREATE TABLE IF NOT EXISTS public.approval_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE, -- generate with crypto.randomBytes(32).toString('hex'), never sequential
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_posts_publishing ON public.posts (status, scheduled_time);

-- 5. Post Analytics (snapshots pulled from Blotato Analytics API — we keep our own
--    history so retention isn't capped by whatever Blotato retains on their side)
CREATE TABLE IF NOT EXISTS public.post_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    views_count INTEGER,
    likes_count INTEGER,
    comments_count INTEGER,
    shares_count INTEGER,
    reach_count INTEGER,
    raw_metrics JSONB, -- full Blotato metrics payload, platform-specific fields vary
    snapshot_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_post_analytics_post ON public.post_analytics (post_id, snapshot_at DESC);

-- 6. Social Inbox (Instagram/Facebook comments — Blotato does not support
--    comments for other platforms yet)
CREATE TABLE IF NOT EXISTS public.social_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    social_account_id UUID NOT NULL REFERENCES public.social_accounts(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('instagram', 'facebook')),
    blotato_comment_id VARCHAR(255) NOT NULL,
    author_name VARCHAR(255),
    comment_text TEXT,
    replied BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(social_account_id, blotato_comment_id)
);

-- 7. Auto-update `updated_at` on posts
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 8. Row-Level Security (multi-tenant isolation by agency_id)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agencies manage own clients" ON public.clients
  FOR ALL USING (agency_id = auth.uid()) WITH CHECK (agency_id = auth.uid());

CREATE POLICY "Agencies manage own social accounts" ON public.social_accounts
  FOR ALL USING (
    client_id IN (SELECT id FROM public.clients WHERE agency_id = auth.uid())
  ) WITH CHECK (
    client_id IN (SELECT id FROM public.clients WHERE agency_id = auth.uid())
  );

CREATE POLICY "Agencies manage own posts" ON public.posts
  FOR ALL USING (
    client_id IN (SELECT id FROM public.clients WHERE agency_id = auth.uid())
  ) WITH CHECK (
    client_id IN (SELECT id FROM public.clients WHERE agency_id = auth.uid())
  );

-- approval_tokens are accessed by unauthenticated clients via the token itself,
-- so reads/writes to this table should go through a service-role API route
-- (src/app/api/posts/approve/route.ts), never directly from the browser client.
CREATE POLICY "Agencies manage own approval tokens" ON public.approval_tokens
  FOR ALL USING (
    post_id IN (
      SELECT p.id FROM public.posts p
      JOIN public.clients c ON c.id = p.client_id
      WHERE c.agency_id = auth.uid()
    )
  );
```

---

## 🛠️ 3. Key Implementations Required

### A. Blotato API Helper (`src/lib/blotato.ts`)
Implement functions to:
- `getBlotatoAccounts(apiKey: string)` → `GET https://backend.blotato.com/v2/users/me/accounts`
- `publishPostViaBlotato(apiKey: string, payload)` → `POST https://backend.blotato.com/v2/posts`

Both requests must send the header `blotato-api-key: <apiKey>` (not `Authorization: Bearer`). The `/posts` payload shape is:

```json
{
  "post": {
    "accountId": "acc_12345",
    "content": {
      "text": "caption text",
      "mediaUrls": ["https://..."],
      "platform": "instagram"
    },
    "target": { "targetType": "instagram" }
  },
  "scheduledTime": "2026-08-10T09:00:00Z"
}
```
Rate limit: 30 requests/min on `/posts`. Handle 429s with backoff in the cron publisher.

### B. Vercel Cron Publisher (`src/app/api/cron/publish/route.ts`)
- Configured in `vercel.json` with schedule `"0 7 * * *"` (Vercel Cron always runs in UTC).
- Verifies `Authorization: Bearer ${CRON_SECRET}`.
- Queries Supabase (service-role client, bypasses RLS) for posts with `status = 'approved'` and `scheduled_time <= NOW()`.
- Iterates over posts and sends them to Blotato API (`POST /v2/posts`).
- Updates post status in Supabase to `published` (or `failed` with `error_message`).

### C. Client 1-Click Approval System
- When a post is created, generate a cryptographically random token (`crypto.randomBytes(32).toString('hex')`) and store it in `approval_tokens`.
- Use Resend API to send an email to the client containing a link to `/approval/[token]`.
- The `/approval/[token]` page allows the client to view the post preview, media, and click Approve or Request Edit without logging in — this route must use the Supabase service-role key server-side, since the client is unauthenticated.
- Reject expired (`expires_at < NOW()`) or already-used (`used_at IS NOT NULL`) tokens.

### D. Stripe Checkout & Billing Webhooks
Handlers for:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_failed` — mark agency as past-due and (optionally) restrict publishing until resolved.

Support EUR (€) and CHF pricing tiers.

---

## 🔑 4. Environment Variables (`.env.example`)

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Blotato Social Media API Key
BLOTATO_API_KEY=your-blotato-api-key

# Stripe Payments (EUR / CHF)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Resend Email API Key
RESEND_API_KEY=re_xxx

# App Config
CRON_SECRET=your-random-secret
NEXT_PUBLIC_APP_URL=https://your-saas-domain.vercel.app
```

---

## 🚀 Execution Instructions for Claude Code
1. Initialize Next.js project with App Router, TypeScript, and Tailwind CSS.
2. Install dependencies: `@supabase/supabase-js`, `stripe`, `resend`, `lucide-react`, `date-fns`, `clsx`, `tailwind-merge`.
3. Create all API routes and UI pages outlined in the structure above.
4. Apply `supabase/schema.sql`, confirming RLS is enabled (`select * from pg_tables where rowsecurity = true`).
5. Verify TypeScript compilation and ensure clean error handling across all API routes.

### Documentation references
- [Blotato API Reference](https://help.blotato.com/api/start)
- [Vercel Cron Jobs Documentation](https://vercel.com/docs/cron-jobs)
- [Supabase RLS Documentation](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Stripe Checkout Documentation](https://stripe.com/docs)
- [Resend Email Documentation](https://resend.com/docs)
