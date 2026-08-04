"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, RefreshCw, Smartphone, Calendar, MessageSquare, TrendingUp, Sparkles, ArrowRight, Zap } from "lucide-react";

export default function DashboardOverview() {
  const [connectedAccounts, setConnectedAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/social-accounts")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setConnectedAccounts(data.accounts || []);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8 font-sans text-xs pb-12">
      {/* Top Welcome Banner */}
      <div className="bg-slate-950 text-white p-8 rounded-3xl border-2 border-slate-800 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <span className="bg-[#ccff00] text-slate-950 font-black text-xs px-3.5 py-1 rounded-full uppercase">
            elan.social Dashboard
          </span>
          <h1 className="text-3xl font-black text-white">Welcome to your Social Command Center</h1>
          <p className="text-sm text-slate-300 font-bold max-w-xl">
            Schedule posts, get 1-click client approvals, and track performance across Instagram, TikTok, Facebook, LinkedIn, and YouTube.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10 shrink-0">
          <Link
            href="/dashboard/composer"
            className="bg-[#ccff00] text-slate-950 font-black text-xs px-5 py-3 rounded-2xl shadow-lg hover:bg-white transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create New Post
          </Link>
        </div>
      </div>

      {/* Social Accounts Status Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-purple-600" /> Connected Social Profiles
            </h2>
            <p className="text-xs text-slate-500 font-bold">
              {connectedAccounts.length > 0
                ? `${connectedAccounts.length} social channels connected to Blotato API.`
                : "No social channels connected yet."}
            </p>
          </div>

          <Link
            href="/dashboard/settings"
            className="bg-slate-950 hover:bg-black text-[#ccff00] font-black text-xs px-4 py-2.5 rounded-xl shadow transition-all flex items-center gap-1.5"
          >
            + Connect Social Channel
          </Link>
        </div>

        {connectedAccounts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {connectedAccounts.map((acc, idx) => (
              <div key={idx} className="p-4 rounded-2xl border-2 border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-950 text-white flex items-center justify-center font-bold">
                    {acc.platform?.[0]?.toUpperCase() || "S"}
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-xs">{acc.name || acc.username}</p>
                    <p className="text-[10px] text-slate-500 font-bold capitalize">{acc.platform}</p>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full">
                  Connected
                </span>
              </div>
            ))}
          </div>
        ) : (
          /* Clean Empty State */
          <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-3">
            <p className="text-xs text-slate-600 font-bold">
              Connect your social profiles (Instagram, TikTok, Facebook, LinkedIn, YouTube) to start auto-publishing and tracking analytics.
            </p>
            <Link
              href="/dashboard/settings"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow transition-all"
            >
              Connect Social Media Channels →
            </Link>
          </div>
        )}
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link href="/dashboard/composer" className="bg-pink-50 border-2 border-pink-200 hover:border-pink-500 p-6 rounded-3xl shadow-sm space-y-3 transition-all">
          <div className="w-10 h-10 rounded-2xl bg-pink-500 text-white flex items-center justify-center font-bold">
            <Plus className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-pink-950">Post Composer</h3>
          <p className="text-xs text-pink-800 font-bold">Draft multi-platform posts and generate 1-click client approval links.</p>
        </Link>

        <Link href="/dashboard/calendar" className="bg-blue-50 border-2 border-blue-200 hover:border-blue-500 p-6 rounded-3xl shadow-sm space-y-3 transition-all">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-blue-950">Content Calendar</h3>
          <p className="text-xs text-blue-800 font-bold">Visual drag & drop calendar for scheduled posts across all channels.</p>
        </Link>

        <Link href="/dashboard/inbox" className="bg-purple-50 border-2 border-purple-200 hover:border-purple-500 p-6 rounded-3xl shadow-sm space-y-3 transition-all">
          <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-purple-950">Unified Inbox</h3>
          <p className="text-xs text-purple-800 font-bold">Manage comments and DMs across Instagram, Facebook, and TikTok.</p>
        </Link>

        <Link href="/dashboard/analytics" className="bg-emerald-50 border-2 border-emerald-200 hover:border-emerald-500 p-6 rounded-3xl shadow-sm space-y-3 transition-all">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-emerald-950">Analytics & Reports</h3>
          <p className="text-xs text-emerald-800 font-bold">Community growth, reach, impressions, and executive PDF reports.</p>
        </Link>
      </div>
    </div>
  );
}
