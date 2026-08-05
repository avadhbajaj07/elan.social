"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Eye, TrendingUp, Sparkles, Smartphone, Loader2, CheckCircle2 } from "lucide-react";

export default function AnalyticsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/social-accounts", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.accounts)) {
          setAccounts(data.accounts);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 font-sans text-xs pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Performance Analytics</h1>
          <p className="text-xs text-slate-500 font-bold mt-1">
            Real-time analytics synced from Blotato social channels.
          </p>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-[#e8f0fe] p-6 rounded-3xl border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <h2 className="text-sm font-black text-slate-900">
            Data-driven performance tracking for your channels
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            Analyze account reach, connected channels, and published content performance.
          </p>
        </div>

        <Link
          href="/dashboard/clients"
          className="bg-slate-950 hover:bg-black text-[#ccff00] text-xs font-black px-4 py-2.5 rounded-xl shadow-md transition-all shrink-0"
        >
          Manage Workspaces →
        </Link>
      </div>

      {/* Real Connected Channels Status */}
      <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-purple-600" />
            Live Connected Channels ({accounts.length})
          </h2>
          <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            Real-time API
          </span>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-slate-400 py-6">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading analytics data...
          </div>
        ) : accounts.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-2">
            <p className="text-xs text-slate-500 font-bold">No social channels connected to Blotato yet.</p>
            <a
              href="https://my.blotato.com/login"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-black text-purple-600 hover:underline block"
            >
              Connect Social Profiles on Blotato →
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {accounts.map((acc, idx) => (
              <div key={idx} className="p-4 rounded-2xl border-2 border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900 text-xs">{acc.username || acc.account_name}</span>
                  <span className="text-[10px] bg-purple-100 text-purple-800 font-black px-2 py-0.5 rounded-full capitalize">
                    {acc.platform}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-slate-500 font-bold">Status:</span>
                  <span className="text-emerald-600 font-black flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-3">
          <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Users className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-black text-slate-900">Connected Accounts</h3>
          <div className="text-2xl font-black text-slate-900">{accounts.length}</div>
          <p className="text-slate-500 text-[11px]">Channels authenticated and ready for scheduling.</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-3">
          <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Eye className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-black text-slate-900">API Dispatch Status</h3>
          <div className="text-2xl font-black text-emerald-600">Active</div>
          <p className="text-slate-500 text-[11px]">Blotato V2 REST API endpoint operational.</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-3">
          <div className="w-9 h-9 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-black text-slate-900">Supported Platforms</h3>
          <div className="text-2xl font-black text-slate-900">9 Channels</div>
          <p className="text-slate-500 text-[11px]">Instagram, TikTok, Facebook, LinkedIn, X, Threads & more.</p>
        </div>
      </div>
    </div>
  );
}
