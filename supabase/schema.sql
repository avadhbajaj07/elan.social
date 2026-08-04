-- Supabase PostgreSQL Schema for SocialPulse (Metricool Competitor SaaS)
-- EU Region: eu-central-1 (Frankfurt)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Clients Table (European Client & Brand Profiles)
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    country VARCHAR(100) DEFAULT 'Switzerland',
    currency VARCHAR(10) DEFAULT 'EUR' CHECK (currency IN ('EUR', 'CHF')),
    preferred_language VARCHAR(20) DEFAULT 'fr' CHECK (preferred_language IN ('fr', 'de', 'en', 'it')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Social Accounts Table (Maps client platforms to Blotato account IDs)
CREATE TABLE IF NOT EXISTS public.social_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('instagram', 'tiktok', 'gmb', 'facebook', 'linkedin', 'youtube', 'threads', 'bluesky')),
    blotato_account_id VARCHAR(255) NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(client_id, platform, blotato_account_id)
);

-- 3. Posts Table (Content, Multi-Platform Schedules & Publishing Status)
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    social_account_id UUID REFERENCES public.social_accounts(id) ON DELETE SET NULL,
    platforms VARCHAR(50)[] DEFAULT '{}',
    caption TEXT NOT NULL,
    hashtags TEXT[] DEFAULT '{}',
    media_urls TEXT[] DEFAULT '{}',
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending_approval' CHECK (status IN ('draft', 'pending_approval', 'approved', 'published', 'failed')),
    blotato_post_id VARCHAR(255),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for Vercel Cron Publisher query performance
CREATE INDEX IF NOT EXISTS idx_posts_publishing ON public.posts (status, scheduled_time);

-- 4. Approval Tokens Table (1-Click Client Approval via Resend email links)
CREATE TABLE IF NOT EXISTS public.approval_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Post Analytics Table (Snapshots pulled from Blotato Analytics API)
CREATE TABLE IF NOT EXISTS public.post_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    reach_count INTEGER DEFAULT 0,
    raw_metrics JSONB,
    snapshot_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_post_analytics_post ON public.post_analytics (post_id, snapshot_at DESC);

-- 6. Social Comments Table (Instagram & Facebook comments/DMs via Blotato Comments API)
CREATE TABLE IF NOT EXISTS public.social_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    social_account_id UUID NOT NULL REFERENCES public.social_accounts(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('instagram', 'facebook')),
    blotato_comment_id VARCHAR(255) NOT NULL,
    author_name VARCHAR(255),
    author_avatar TEXT,
    comment_text TEXT NOT NULL,
    replied BOOLEAN DEFAULT FALSE,
    reply_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(social_account_id, blotato_comment_id)
);

-- 7. Auto-update trigger for updated_at on posts
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_posts_updated_at ON public.posts;
CREATE TRIGGER trg_posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 8. Enable Row-Level Security (RLS) on all tenant-scoped tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_comments ENABLE ROW LEVEL SECURITY;

-- 9. Row-Level Security (RLS) Isolation Policies
DROP POLICY IF EXISTS "Agencies manage own clients" ON public.clients;
CREATE POLICY "Agencies manage own clients" ON public.clients
  FOR ALL USING (agency_id = auth.uid()) WITH CHECK (agency_id = auth.uid());

DROP POLICY IF EXISTS "Agencies manage own social accounts" ON public.social_accounts;
CREATE POLICY "Agencies manage own social accounts" ON public.social_accounts
  FOR ALL USING (
    client_id IN (SELECT id FROM public.clients WHERE agency_id = auth.uid())
  ) WITH CHECK (
    client_id IN (SELECT id FROM public.clients WHERE agency_id = auth.uid())
  );

DROP POLICY IF EXISTS "Agencies manage own posts" ON public.posts;
CREATE POLICY "Agencies manage own posts" ON public.posts
  FOR ALL USING (
    client_id IN (SELECT id FROM public.clients WHERE agency_id = auth.uid())
  ) WITH CHECK (
    client_id IN (SELECT id FROM public.clients WHERE agency_id = auth.uid())
  );

DROP POLICY IF EXISTS "Agencies manage own approval tokens" ON public.approval_tokens;
CREATE POLICY "Agencies manage own approval tokens" ON public.approval_tokens
  FOR ALL USING (
    post_id IN (
      SELECT p.id FROM public.posts p
      JOIN public.clients c ON c.id = p.client_id
      WHERE c.agency_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Agencies manage own post analytics" ON public.post_analytics;
CREATE POLICY "Agencies manage own post analytics" ON public.post_analytics
  FOR ALL USING (
    post_id IN (
      SELECT p.id FROM public.posts p
      JOIN public.clients c ON c.id = p.client_id
      WHERE c.agency_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Agencies manage own social comments" ON public.social_comments;
CREATE POLICY "Agencies manage own social comments" ON public.social_comments
  FOR ALL USING (
    client_id IN (SELECT id FROM public.clients WHERE agency_id = auth.uid())
  ) WITH CHECK (
    client_id IN (SELECT id FROM public.clients WHERE agency_id = auth.uid())
  );
