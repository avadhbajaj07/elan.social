"use client";

import { Megaphone, TrendingUp, DollarSign } from "lucide-react";

export default function AdsPage() {
  return (
    <div className="space-y-6 font-sans text-xs pb-12">
      <div>
        <h1 className="text-2xl font-black text-metricool-dark">Ads Campaigns</h1>
        <p className="text-xs text-slate-500 mt-1">
          Analyze and manage Meta, Google, and TikTok ad campaign performance.
        </p>
      </div>

      <div className="bg-[#e8f0fe] p-6 rounded-2xl border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-900 font-sans">Multi-Platform Ad Tracking</h2>
          <p className="text-xs text-slate-600">Track ROAS, impressions, clicks, and ad spend across Google, Meta, and TikTok.</p>
        </div>

        <button
          onClick={() => alert("Connecting Ad Accounts...")}
          className="bg-metricool-dark text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shrink-0"
        >
          Connect Ad Accounts
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <p className="text-xs font-bold text-slate-500">Meta Ads (Facebook & Instagram)</p>
          <p className="text-3xl font-black text-slate-900">4.2x ROAS</p>
          <p className="text-[11px] text-emerald-600 font-bold">$620 Spend • 14,200 Clicks</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <p className="text-xs font-bold text-slate-500">Google Search & Display Ads</p>
          <p className="text-3xl font-black text-slate-900">3.1x ROAS</p>
          <p className="text-[11px] text-blue-600 font-bold">$410 Spend • 8,900 Clicks</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <p className="text-xs font-bold text-slate-500">TikTok Video Ads</p>
          <p className="text-3xl font-black text-slate-900">2.8x ROAS</p>
          <p className="text-[11px] text-purple-600 font-bold">$180 Spend • 12,400 Views</p>
        </div>
      </div>
    </div>
  );
}
