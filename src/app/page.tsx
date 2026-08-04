"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { PRICING_PLANS } from "@/lib/mockData";
import { formatCurrency } from "@/lib/stripe";
import {
  Calendar,
  BarChart3,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Share2,
  ChevronDown,
  Search,
  Filter,
  MoreVertical,
  Sliders,
  ShieldCheck,
  Check,
  Smartphone,
  Eye,
  ThumbsUp,
  Users,
  Zap,
  Star,
  Send,
  Layers
} from "lucide-react";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"Planning" | "Analytics" | "Reporting" | "Inbox">("Planning");
  const [singleTab, setSingleTab] = useState<"planning" | "analytics" | "inbox" | "reporting">("planning");

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#ccff00] selection:text-slate-950">
      {/* 1. Top Navbar */}
      <Navbar />

      {/* 2. Vibrant Hero Section */}
      <section className="relative pt-36 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8 overflow-hidden">
        {/* Colorful Background Ribbon Graphics */}
        <div className="absolute -left-20 top-60 w-80 h-40 bg-elan-stripes-pink opacity-90 -rotate-12 rounded-3xl pointer-events-none -z-10 hidden lg:block shadow-2xl" />
        <div className="absolute -right-24 top-64 w-96 h-48 bg-elan-stripes-lime opacity-90 rotate-12 rounded-full pointer-events-none -z-10 hidden lg:block shadow-2xl" />

        {/* Hero Main Heading (Larger Font Size) */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-950 tracking-tight max-w-5xl mx-auto leading-[1.06]">
          Everything flows better when your content, data, and team are all in <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">elan.social</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-700 font-bold max-w-2xl mx-auto leading-relaxed">
          Plan, measure, and manage it all in one tool that saves time and gives you full control over your social media.
        </p>

        {/* Primary CTA Button */}
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center bg-slate-950 hover:bg-black text-[#ccff00] font-black text-xl px-10 py-4.5 rounded-2xl shadow-2xl transition-all hover:scale-105"
          >
            Create your free account →
          </Link>
        </div>

        {/* Partner Logos */}
        <div className="pt-4 space-y-3">
          <p className="text-sm font-black text-slate-500 tracking-wide uppercase">
            Google, Pinterest, Meta, LinkedIn and X partner
          </p>

          <div className="flex items-center justify-center gap-6 text-2xl font-black text-slate-800">
            <span className="text-blue-600">G</span>
            <span className="text-cyan-600">∞</span>
            <span className="text-red-500">P</span>
            <span className="text-blue-700">in</span>
            <span className="text-black">𝕏</span>
          </div>
        </div>

        {/* elan.social Application Interactive Dashboard Mockup */}
        <div className="mt-12 max-w-6xl mx-auto bg-white rounded-3xl border-2 border-slate-900 shadow-2xl overflow-hidden text-left relative">
          
          {/* App Dark Top Navbar */}
          <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-8 text-base font-extrabold">
              <button
                onClick={() => setActiveTab("Analytics")}
                className={`flex items-center gap-2 pb-1 transition-all ${
                  activeTab === "Analytics"
                    ? "text-[#ccff00] font-black border-b-2 border-[#ccff00]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <BarChart3 className="w-4.5 h-4.5 text-purple-400" /> Analytics
              </button>

              <button
                onClick={() => setActiveTab("Reporting")}
                className={`flex items-center gap-2 pb-1 transition-all ${
                  activeTab === "Reporting"
                    ? "text-[#ccff00] font-black border-b-2 border-[#ccff00]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <TrendingUp className="w-4.5 h-4.5 text-emerald-400" /> Reporting
              </button>

              <button
                onClick={() => setActiveTab("Inbox")}
                className={`flex items-center gap-2 pb-1 transition-all ${
                  activeTab === "Inbox"
                    ? "text-[#ccff00] font-black border-b-2 border-[#ccff00]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <MessageSquare className="w-4.5 h-4.5 text-pink-400" /> Inbox
              </button>

              <button
                onClick={() => setActiveTab("Planning")}
                className={`flex items-center gap-2 pb-1 transition-all ${
                  activeTab === "Planning"
                    ? "text-[#ccff00] font-black border-b-2 border-[#ccff00]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Calendar className="w-4.5 h-4.5 text-blue-400" /> Planning
              </button>

              <span className="text-slate-400 hover:text-white cursor-pointer hidden md:inline">SmartLinks</span>
              <span className="text-slate-400 hover:text-white cursor-pointer hidden md:inline">Ads</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 p-0.5">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Planning Sub-Header Controls */}
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-6 text-base font-black">
                <span className="text-slate-900 border-b-2 border-slate-900 pb-1 cursor-pointer">
                  Calendar
                </span>
                <span className="text-slate-500 hover:text-slate-900 cursor-pointer">List</span>
                <span className="text-slate-500 hover:text-slate-900 cursor-pointer">Autolists</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-sm text-slate-900"
                  />
                </div>

                <div className="flex items-center bg-white border border-slate-300 rounded-xl px-3.5 py-1.5 font-bold text-slate-800">
                  This week
                </div>

                <div className="flex items-center bg-white border border-slate-300 rounded-xl px-3 py-1.5 font-black text-slate-800 gap-2">
                  <span>&lt;</span>
                  <span>Feb - Mar</span>
                  <span>&gt;</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 bg-white border border-slate-300 rounded-xl text-slate-700">
                  <Filter className="w-4 h-4" />
                </button>
                <button className="p-2 bg-white border border-slate-300 rounded-xl text-slate-700">
                  <MoreVertical className="w-4 h-4" />
                </button>
                <div className="flex items-center bg-white border border-slate-300 rounded-xl px-3.5 py-1.5 font-bold text-slate-800 gap-2">
                  <span>Best times</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Days Grid Area with Floating Widgets */}
          <div className="p-6 relative bg-white min-h-[380px]">
            <div className="grid grid-cols-5 gap-4 text-center">
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
                <p className="text-xs font-bold text-slate-400 uppercase">MON</p>
                <p className="text-xl font-black text-slate-900">03</p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
                <p className="text-xs font-bold text-slate-400 uppercase">TUE</p>
                <p className="text-xl font-black text-slate-900">04</p>
              </div>

              {/* WED 05 Highlighted Pastel Pink Day Card */}
              <div className="border-2 border-pink-400 rounded-2xl p-4 bg-pink-100 relative overflow-hidden shadow-md">
                <p className="text-xs font-black text-pink-700 uppercase">WED</p>
                <p className="text-xl font-black text-pink-950">05</p>
                <div className="mt-2 bg-white p-2.5 rounded-xl border border-pink-300 text-xs text-left font-bold text-pink-950 shadow-sm">
                  📷 IG Reel Scheduled (18:30)
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
                <p className="text-xs font-bold text-slate-400 uppercase">THU</p>
                <p className="text-xl font-black text-slate-900">06</p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
                <p className="text-xs font-bold text-slate-400 uppercase">FRI</p>
                <p className="text-xl font-black text-slate-900">07</p>
              </div>
            </div>

            {/* Floating Left Widget: Followers Line Chart */}
            <div className="absolute left-6 bottom-6 bg-white rounded-2xl p-4 border-2 border-slate-900 shadow-2xl space-y-2 w-60 animate-float-slow">
              <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
                <span>Followers</span>
              </div>
              <p className="text-2xl font-black text-slate-950">312.43m</p>
              <svg className="w-full h-10 stroke-pink-600 fill-pink-100" viewBox="0 0 100 30">
                <path d="M0,25 Q25,10 50,18 T100,5" strokeWidth="3" fill="none" />
              </svg>
            </div>

            {/* Floating Right Widget: Social Inbox Drawer */}
            <div className="absolute right-6 top-8 bg-white rounded-2xl p-4 border-2 border-slate-900 shadow-2xl w-76 space-y-3">
              <div className="flex items-center justify-between text-sm pb-2 border-b border-slate-100 text-slate-700 font-bold">
                <span>𝕏</span>
                <span>🧵</span>
                <span>in</span>
                <span>P</span>
                <span>🎵</span>
                <span>fb</span>
                <span>📷</span>
                <span>▶</span>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search conversation..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-2 py-1.5 text-xs text-slate-800"
                />
              </div>

              <span className="text-xs font-black text-slate-400 uppercase block">Unresolved</span>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                    className="w-8 h-8 rounded-full border-2 border-pink-500 object-cover"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-slate-900 text-xs">Susan Beltman</span>
                    <span className="text-[10px] text-slate-500 truncate">Everything ready! We have already...</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80"
                    className="w-8 h-8 rounded-full border-2 border-amber-400 object-cover"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-slate-900 text-xs">Gabri Smith</span>
                    <span className="text-[10px] text-slate-500 truncate">Send me please the link to the live...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Supported Networks Ticker */}
      <section className="py-10 bg-slate-950 text-white text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-2xl font-black">
          <span className="text-pink-500 flex items-center gap-1.5">📷 Instagram</span>
          <span className="text-[#ccff00] flex items-center gap-1.5">🎵 TikTok</span>
          <span className="text-blue-400 flex items-center gap-1.5">📘 Facebook</span>
          <span className="text-indigo-400 flex items-center gap-1.5">💼 LinkedIn</span>
          <span className="text-amber-400 flex items-center gap-1.5">📍 Google Business</span>
          <span className="text-red-500 flex items-center gap-1.5">▶ YouTube</span>
          <span className="text-purple-400 flex items-center gap-1.5">👾 Twitch</span>
          <span className="text-emerald-400 flex items-center gap-1.5">🎧 Spotify</span>
        </div>
      </section>

      {/* 4. VIBRANT COLORFUL FEATURE GRID CARDS */}

      {/* Card 1: Vibrant Magenta Pink Card */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="elan-card-pink rounded-3xl p-8 sm:p-14 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="bg-white/20 text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-wider">
              Planning & Approvals
            </span>
            <h3 className="text-3xl sm:text-5xl font-black leading-tight">
              Schedule once. Auto-publish everywhere. Get 1-click client approvals.
            </h3>
            <p className="text-pink-100 text-lg leading-relaxed font-bold">
              No more manual logins. Preview Instagram Reels, TikTok videos, and LinkedIn posts live before scheduling. Clients approve in 1 click without passwords.
            </p>
            <Link
              href="/dashboard/composer"
              className="inline-flex items-center gap-2 bg-slate-950 text-[#ccff00] font-black text-lg px-8 py-4 rounded-2xl shadow-xl hover:scale-105 transition-all"
            >
              Try Composer Now →
            </Link>
          </div>

          <div className="lg:col-span-6 bg-white text-slate-900 p-6 rounded-2xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-black text-base text-slate-900">Visual Feed Preview</span>
              <span className="bg-pink-100 text-pink-700 text-xs font-black px-3 py-1 rounded-full uppercase">
                IG + TikTok + LinkedIn
              </span>
            </div>
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Card 2 & 3: Electric Lime & Deep Purple Cards */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Electric Lime Card */}
          <div className="elan-card-lime p-8 sm:p-12 rounded-3xl shadow-2xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="bg-slate-950 text-[#ccff00] text-xs font-black px-4 py-1.5 rounded-full uppercase">
                Automated Publishing Engine
              </span>
              <h3 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Direct Multi-Channel Publishing via Blotato REST API
              </h3>
              <p className="text-slate-900 text-base font-bold leading-relaxed">
                Connect your social accounts once. Automated daily background cron jobs handle video & image publishing with rate limit protection.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border-2 border-slate-950 space-y-3 shadow-xl">
              <div className="flex items-center justify-between text-base font-black text-slate-900">
                <span>Publish Engine</span>
                <span className="text-emerald-600 font-black">99.8% On-Time</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs p-3 bg-slate-50 rounded-xl font-bold border border-slate-200">
                  <span>Instagram Reel</span>
                  <span className="font-mono text-emerald-600 font-black">✓ Published (09:00)</span>
                </div>
                <div className="flex items-center justify-between text-xs p-3 bg-slate-50 rounded-xl font-bold border border-slate-200">
                  <span>TikTok Video</span>
                  <span className="font-mono text-blue-600 font-black">✓ Published (09:00)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Deep Purple Card */}
          <div className="elan-card-purple p-8 sm:p-12 rounded-3xl shadow-2xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="bg-[#ccff00] text-slate-950 text-xs font-black px-4 py-1.5 rounded-full uppercase">
                Real-Time Analytics
              </span>
              <h3 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Track reach, impressions, and ROI across every channel
              </h3>
              <p className="text-purple-100 text-base font-bold leading-relaxed">
                Consolidated performance metrics automatically updated from your social media profiles.
              </p>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-purple-400 space-y-3 shadow-2xl">
              <div className="flex items-center justify-between text-base font-black text-purple-200">
                <span>Monthly Impressions</span>
                <span className="text-[#ccff00] font-black">418,200</span>
              </div>
              <svg className="w-full h-16 stroke-[#ccff00] fill-[#ccff00]/10" viewBox="0 0 100 30">
                <path d="M0,28 Q20,20 40,25 T70,10 T100,2" strokeWidth="3" fill="none" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Card 4: Sky Blue Container with Feature Tabs */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="elan-card-blue rounded-3xl p-8 sm:p-14 shadow-2xl space-y-8">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              All management tools in a single tab
            </h2>
            <p className="text-sky-100 text-base font-bold">
              Switch seamlessly between planning, analytics, comment inbox, and reporting.
            </p>
          </div>

          <div className="flex justify-center gap-3 flex-wrap">
            {(["planning", "analytics", "inbox", "reporting"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setSingleTab(t)}
                className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                  singleTab === t
                    ? "bg-slate-950 text-[#ccff00] shadow-xl scale-105"
                    : "bg-white text-slate-900 hover:bg-slate-100"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8 text-slate-900 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <h3 className="text-3xl font-black text-slate-950 capitalize">
                {singleTab} Module
              </h3>
              <p className="text-slate-700 text-base font-bold leading-relaxed">
                Streamline your workflow with specialized features designed for speed, clarity, and client collaboration.
              </p>
              <Link
                href={`/dashboard/${singleTab === "planning" ? "calendar" : singleTab}`}
                className="inline-flex items-center gap-2 bg-slate-950 text-[#ccff00] font-black text-base px-7 py-3.5 rounded-xl shadow-lg"
              >
                Open {singleTab} in Dashboard →
              </Link>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200 text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-slate-950 text-[#ccff00] mx-auto flex items-center justify-center font-bold">
                <Sparkles className="w-7 h-7" />
              </div>
              <p className="font-black text-lg text-slate-900 capitalize">{singleTab} Live View</p>
              <p className="text-xs text-slate-500 font-bold">Connected to your social accounts</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Dark Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              Everything you need in the dashboard
            </h2>
            <p className="text-slate-300 text-base font-bold">
              Transparent plans tailored for freelancers, growing agencies, and global brand portfolios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`bg-slate-900 p-8 rounded-3xl border-2 flex flex-col justify-between relative transition-all ${
                  plan.popular ? "border-[#ccff00] shadow-2xl scale-[1.02]" : "border-slate-800"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#ccff00] text-slate-950 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                    Most Popular for Agencies
                  </span>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-black text-white">{plan.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{plan.tagline}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold text-white">
                      {formatCurrency(plan.price)}
                    </span>
                    <span className="text-slate-400 text-xs font-medium">/month</span>
                  </div>

                  <div className="border-t border-slate-800 pt-4 space-y-3 text-xs text-slate-300 font-bold">
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-[#ccff00] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8">
                  <Link
                    href="/dashboard"
                    className="w-full py-4 rounded-full text-base font-black flex items-center justify-center gap-2 bg-[#ccff00] text-slate-950 hover:bg-white transition-all shadow-xl"
                  >
                    Get Started Now <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Dark Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800 text-xs font-sans">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          <div className="col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-1.5">
              <span className="text-2xl font-black text-white lowercase">elan</span>
              <span className="text-2xl font-black text-pink-600">.social</span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm font-medium">
              All-in-one social media management & 1-click client approval platform for agencies, creators, and brands.
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-extrabold text-white uppercase tracking-wider text-xs">Product</p>
            <p className="hover:text-white cursor-pointer font-medium">Planner & Calendar</p>
            <p className="hover:text-white cursor-pointer font-medium">Analytics & Reports</p>
            <p className="hover:text-white cursor-pointer font-medium">Unified Social Inbox</p>
            <p className="hover:text-white cursor-pointer font-medium">SmartLinks</p>
          </div>

          <div className="space-y-2">
            <p className="font-extrabold text-white uppercase tracking-wider text-xs">Social Media</p>
            <p className="hover:text-white cursor-pointer font-medium">Instagram Management</p>
            <p className="hover:text-white cursor-pointer font-medium">TikTok Scheduler</p>
            <p className="hover:text-white cursor-pointer font-medium">LinkedIn Publishing</p>
            <p className="hover:text-white cursor-pointer font-medium">Google Business</p>
          </div>

          <div className="space-y-2">
            <p className="font-extrabold text-white uppercase tracking-wider text-xs">Company</p>
            <p className="hover:text-white cursor-pointer font-medium">About Us</p>
            <p className="hover:text-white cursor-pointer font-medium">Privacy Policy</p>
            <p className="hover:text-white cursor-pointer font-medium">Terms of Service</p>
            <p className="hover:text-white cursor-pointer font-medium">Contact Support</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p>© 2026 elan.social SaaS Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="bg-slate-900 text-slate-300 px-3 py-1 rounded-full text-[10px] font-bold">
              G2 High Performer 2026
            </span>
            <span className="bg-slate-900 text-slate-300 px-3 py-1 rounded-full text-[10px] font-bold">
              Capterra Best Value
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
