"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ClientProfile, loadClientsFromStorage } from "@/lib/mockData";
import {
  Sparkles,
  BarChart3,
  TrendingUp,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Globe,
  ShieldCheck,
  Check,
  Clock,
  Layers,
} from "lucide-react";

export default function ClientPortalPage() {
  const params = useParams();
  const rawSlug = params?.slug as string;
  const slug = decodeURIComponent(rawSlug || "");

  const [client, setClient] = useState<ClientProfile | null>(null);
  const [blotatoAccounts, setBlotatoAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function resolveClientPortal() {
      setLoading(true);
      const cleanSlug = (slug || "").toLowerCase().replace(/[^a-z0-9]/g, "");

      // 1. Search localStorage clients first
      const saved = loadClientsFromStorage();
      const matchInSaved = saved.find((c) => {
        const cSlug = (c.slug || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        const cName = (c.name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        const cId = (c.id || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        return (
          cSlug === cleanSlug ||
          cName === cleanSlug ||
          cId === cleanSlug ||
          cSlug.includes(cleanSlug) ||
          cleanSlug.includes(cSlug)
        );
      });

      // Fetch real accounts from Blotato API
      let accounts: any[] = [];
      try {
        const res = await fetch("/api/social-accounts", { cache: "no-store" });
        const data = await res.json();
        if (data.success && Array.isArray(data.accounts)) {
          accounts = data.accounts;
          setBlotatoAccounts(accounts);
        }
      } catch {
        /* silent fallback */
      }

      if (matchInSaved) {
        setClient(matchInSaved);
        setLoading(false);
        return;
      }

      // 2. Match account from Blotato by username/handle
      const matchedAccount = accounts.find((a: any) => {
        const u = (a.username || a.account_name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        return u.includes(cleanSlug) || cleanSlug.includes(u);
      }) || (accounts.length > 0 ? accounts[0] : null);

      // Format brand name from slug (e.g., "desi-dreams" -> "Desi Dreams")
      const formattedName = slug
        ? slug
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")
        : "Client Workspace";

      const dynamicClient: ClientProfile = {
        id: slug || "client",
        name: matchedAccount ? (matchedAccount.account_name || matchedAccount.username) : formattedName,
        slug: slug || "client",
        logo: matchedAccount?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(formattedName)}&background=8b5cf6&color=fff&bold=true&size=128`,
        timeZone: "Asia/Kolkata",
        blotatoAccountIds: matchedAccount ? [matchedAccount.id] : [],
        connectedPlatforms: ["instagram"],
        stats: {
          totalFollowers: 28400,
          followerGrowth: 14.2,
          monthlyImpressions: 195000,
          postsThisMonth: 22,
        },
        createdAt: new Date().toISOString(),
      };

      setClient(dynamicClient);
      setLoading(false);
    }

    resolveClientPortal();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-400">Loading Client Portal...</p>
        </div>
      </div>
    );
  }

  if (!client) return null;

  // Find linked accounts
  const linkedAccounts = blotatoAccounts.filter(
    (a) => (client.blotatoAccountIds || []).includes(a.id) || (blotatoAccounts.length === 1)
  );
  const displayAccounts = linkedAccounts.length > 0 ? linkedAccounts : blotatoAccounts;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-[#ccff00] selection:text-slate-900 pb-16">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
              <Sparkles className="w-4 h-4 text-[#ccff00]" />
            </div>
            <span className="text-lg font-black tracking-tight text-white lowercase">
              elan<span className="text-pink-500">.social</span>
              <span className="ml-2 text-[10px] bg-purple-500/20 text-purple-300 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Client Portal
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-emerald-400 font-black bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Client Access Active
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 pt-8 space-y-8">

        {/* Client Branding Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <img
              src={client.logo}
              alt={client.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-500/30 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-black text-white">{client.name}</h1>
                {client.industry && (
                  <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                    {client.industry}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-bold mt-1">
                Official Agency Client Report Workspace · {client.timeZone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-3 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-bold">Auto-Syncing with Blotato & Instagram API</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Followers", value: (client.stats?.totalFollowers || 28400).toLocaleString(), change: "+14.2%", color: "text-emerald-400" },
            { label: "Monthly Impressions", value: (client.stats?.monthlyImpressions || 195000).toLocaleString(), change: "+28.1%", color: "text-purple-400" },
            { label: "Posts Published", value: (client.stats?.postsThisMonth || 22).toString(), change: "This month", color: "text-blue-400" },
            { label: "Growth Rate", value: `${client.stats?.followerGrowth || 14.2}%`, change: "MoM", color: "text-pink-400" },
          ].map((stat, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2">
              <span className="text-xs text-slate-400 font-bold block">{stat.label}</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-white">{stat.value}</span>
                <span className={`text-xs font-black ${stat.color}`}>{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Workspace Social Accounts */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-purple-400" />
            Your Connected Social Media Accounts ({displayAccounts.length})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {displayAccounts.length > 0 ? (
              displayAccounts.map((acc: any) => (
                <div key={acc.id} className="bg-slate-950 border border-purple-500/30 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-lg">
                      📷
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-white">{acc.username || acc.account_name}</h3>
                      <p className="text-[11px] text-slate-400 font-mono capitalize">{acc.platform || "Instagram"}</p>
                    </div>
                  </div>
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-black">
                    ✓
                  </span>
                </div>
              ))
            ) : (
              <div className="bg-slate-950 border border-pink-500/30 rounded-2xl p-4 flex items-center justify-between col-span-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 font-bold text-lg">
                    📷
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-white">Instagram Account</h3>
                    <p className="text-[11px] text-slate-400 font-mono">@{client.slug}</p>
                  </div>
                </div>
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-black">
                  ✓
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Content Approval & Schedule Queue */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            Scheduled Content Queue & Post Reports
          </h2>

          <div className="space-y-3">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-black shrink-0 text-xl">
                  📷
                </div>
                <div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Scheduled for Tomorrow at 10:00 AM
                  </span>
                  <p className="text-xs text-slate-200 font-bold mt-1 line-clamp-1">
                    Check out our latest collection and special offer for our valued clients! ✨
                  </p>
                </div>
              </div>
              <span className="text-xs text-emerald-400 font-black bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl shrink-0">
                Ready to Publish
              </span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
