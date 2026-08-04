"use client";

import { useState } from "react";
import { Users, Eye, TrendingUp, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 font-sans text-xs pb-12">
      <h1 className="text-2xl font-black text-metricool-dark">Analytics</h1>

      {/* Hero Banner (Soft blue tint matching Screenshot 1) */}
      <div className="bg-[#e8f0fe] p-6 rounded-2xl border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <h2 className="text-base font-bold text-slate-900">
            Understand what works and make data-driven decisions
          </h2>
          <p className="text-xs text-slate-600">
            Analyze your community, the reach of your posts and your ad campaigns from a single dashboard.
          </p>
        </div>

        <button
          onClick={() => alert("Connecting social networks...")}
          className="bg-metricool-dark hover:bg-black text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all shrink-0"
        >
          Connect social networks
        </button>
      </div>

      {/* 3 Metricool Analytics Feature Cards matching Screenshot 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: How your community grows */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">How your community grows</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Track the evolution of your followers across all your networks from one place.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500">Audience - Last 30 days</span>
              <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                Growth +12.4%
              </span>
            </div>
            <svg className="w-full h-16 stroke-purple-600 fill-purple-100" viewBox="0 0 100 30">
              <path d="M0,25 Q30,18 60,20 T100,5" strokeWidth="3" fill="none" />
            </svg>
            <div className="pt-2 border-t border-slate-200 flex justify-between">
              <div>
                <p className="text-[10px] text-slate-400">Followers</p>
                <p className="text-lg font-black text-slate-900">69.4K</p>
              </div>
              <span className="text-emerald-600 font-bold text-[10px] self-end">+1.5K this month</span>
            </div>
          </div>
        </div>

        {/* Card 2: The real reach of your posts */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
              <Eye className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">The real reach of your posts</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Discover the reach of your posts on each network and which content performs best.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Top Post Formats</span>
              <span className="text-purple-600 font-bold text-[10px]">124K Reach</span>
            </div>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                  <span>📷 Reel - Behind the scenes</span>
                  <span className="font-mono text-emerald-600">28.4K</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[80%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                  <span>📘 Carousel - Product launch</span>
                  <span className="font-mono text-blue-600">19.1K</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[60%]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Your ad campaigns, at a glance */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Your ad campaigns, at a glance</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Analyze the performance of your ads across all platforms without switching screens.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Ad Return (ROAS)</span>
              <span className="text-purple-600 font-bold text-[10px]">$1.2K Spend</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] p-1.5 bg-white rounded-lg border border-slate-200">
                <span>Summer Sale (Meta Ads)</span>
                <span className="font-mono text-emerald-600 font-extrabold">4.2x ROAS</span>
              </div>
              <div className="flex items-center justify-between text-[11px] p-1.5 bg-white rounded-lg border border-slate-200">
                <span>Brand Awareness (Google Ads)</span>
                <span className="font-mono text-blue-600 font-extrabold">3.1x ROAS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Connection Footer Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900">Connect social networks</h3>
          <p className="text-xs text-slate-500">Connect your accounts to unlock analytics, scheduling and content management.</p>
        </div>

        <button
          onClick={() => alert("Connecting accounts...")}
          className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 hover:border-slate-800"
        >
          Connect social networks
        </button>
      </div>
    </div>
  );
}
