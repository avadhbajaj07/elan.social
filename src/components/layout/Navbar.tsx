"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, X, ArrowRight, FileText, Calendar as CalendarIcon, BarChart3, Link as LinkIcon, MessageSquare, Layers, Sparkles, BookOpen, Newspaper, GraduationCap, Zap } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<"product" | "social" | "metrischool" | null>(null);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200/80 font-sans shadow-sm">
      {/* Top Rainbow Announcement Bar */}
      <div className="bg-elan-hero text-white text-xs font-bold py-2.5 px-4 text-center relative overflow-hidden flex items-center justify-center gap-2">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-elan-rainbow" />
        <span className="truncate">
          🔥 <strong>elan.social v2.5</strong>: Manage all social media channels, client approvals & publishing in one place
        </span>
        <ArrowRight className="w-4 h-4 text-[#ccff00] inline shrink-0 animate-pulse" />
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo: elan.social */}
          <Link href="/" className="flex items-center gap-1.5 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-[#ccff00]" />
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-black tracking-tight text-slate-900 font-sans lowercase">
                elan
              </span>
              <span className="text-2xl font-black text-pink-600">.social</span>
            </div>
          </Link>

          {/* Center Links (Interactive Mega-Menu Dropdowns) */}
          <div className="hidden md:flex items-center gap-8 text-base font-extrabold text-slate-800">
            
            {/* 1. Product Mega Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("product")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1.5 py-5 hover:text-pink-600 transition-colors">
                <span>Product</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeDropdown === "product" ? "rotate-180 text-pink-600" : ""}`} />
              </button>

              {/* Product Mega Menu Content */}
              {activeDropdown === "product" && (
                <div className="absolute left-0 top-full w-[680px] bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 grid grid-cols-3 gap-6 text-xs animate-in fade-in duration-150">
                  {/* Reporting Column */}
                  <div className="space-y-3">
                    <p className="font-black text-purple-700 uppercase text-xs tracking-wider flex items-center gap-1.5 bg-purple-50 p-2 rounded-xl border border-purple-100">
                      <FileText className="w-4 h-4 text-purple-600" /> Reporting
                    </p>
                    <div className="space-y-2 font-bold">
                      <Link href="/dashboard/reporting" className="block text-slate-700 hover:text-purple-600">elan Studio</Link>
                      <Link href="/dashboard/reporting" className="block text-slate-700 hover:text-purple-600">Campaign Dashboard</Link>
                      <Link href="/dashboard/reporting" className="block text-slate-700 hover:text-purple-600">Executive PDF/PPT Reports</Link>
                      <Link href="/dashboard/reporting" className="block text-slate-700 hover:text-purple-600">Hashtag Tracker</Link>
                    </div>
                  </div>

                  {/* Planner & Execution Column */}
                  <div className="space-y-3">
                    <p className="font-black text-blue-700 uppercase text-xs tracking-wider flex items-center gap-1.5 bg-blue-50 p-2 rounded-xl border border-blue-100">
                      <CalendarIcon className="w-4 h-4 text-blue-600" /> Planner & execution
                    </p>
                    <div className="space-y-2 font-bold">
                      <Link href="/dashboard/calendar" className="block text-slate-700 hover:text-blue-600">Visual Content Calendar</Link>
                      <Link href="/dashboard/composer" className="block text-slate-700 hover:text-blue-600">1-Click Client Approvals</Link>
                      <Link href="/dashboard/smartlinks" className="block text-slate-700 hover:text-blue-600">SmartLinks (Link-in-Bio)</Link>
                      <Link href="/dashboard/inbox" className="block text-slate-700 hover:text-blue-600">Unified Social Inbox</Link>
                    </div>
                  </div>

                  {/* Measure & Grow Column */}
                  <div className="space-y-3">
                    <p className="font-black text-emerald-700 uppercase text-xs tracking-wider flex items-center gap-1.5 bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                      <BarChart3 className="w-4 h-4 text-emerald-600" /> Measure & Grow
                    </p>
                    <div className="space-y-2 font-bold">
                      <Link href="/dashboard/analytics" className="block text-slate-700 hover:text-emerald-600">Community Analytics</Link>
                      <Link href="/dashboard/ads" className="block text-slate-700 hover:text-emerald-600">Ads Tracking</Link>
                      <Link href="/dashboard/settings" className="block text-slate-700 hover:text-emerald-600">Blotato API Integrations</Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Social Media Mega Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("social")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1.5 py-5 hover:text-pink-600 transition-colors">
                <span>Social Media</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeDropdown === "social" ? "rotate-180 text-pink-600" : ""}`} />
              </button>

              {/* Social Media Mega Menu Content */}
              {activeDropdown === "social" && (
                <div className="absolute left-0 top-full w-[540px] bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 grid grid-cols-3 gap-4 text-xs animate-in fade-in duration-150">
                  <div className="space-y-2.5 font-extrabold">
                    <Link href="/dashboard/composer" className="block p-2 bg-pink-50 hover:bg-pink-100 rounded-xl text-pink-700">📷 Instagram</Link>
                    <Link href="/dashboard/composer" className="block p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-900">🎵 TikTok</Link>
                    <Link href="/dashboard/composer" className="block p-2 bg-red-50 hover:bg-red-100 rounded-xl text-red-700">▶ YouTube</Link>
                    <Link href="/dashboard/composer" className="block p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-900">🧵 Threads</Link>
                  </div>

                  <div className="space-y-2.5 font-extrabold">
                    <Link href="/dashboard/composer" className="block p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-900">𝕏 Twitter / X</Link>
                    <Link href="/dashboard/composer" className="block p-2 bg-purple-50 hover:bg-purple-100 rounded-xl text-purple-700">👾 Twitch</Link>
                    <Link href="/dashboard/composer" className="block p-2 bg-amber-50 hover:bg-amber-100 rounded-xl text-amber-800">📍 Google Business</Link>
                    <Link href="/dashboard/composer" className="block p-2 bg-sky-50 hover:bg-sky-100 rounded-xl text-sky-700">🦋 Bluesky</Link>
                  </div>

                  <div className="space-y-2.5 font-extrabold">
                    <Link href="/dashboard/composer" className="block p-2 bg-blue-50 hover:bg-blue-100 rounded-xl text-blue-700">📘 Facebook</Link>
                    <Link href="/dashboard/composer" className="block p-2 bg-rose-50 hover:bg-rose-100 rounded-xl text-rose-700">📍 Pinterest</Link>
                    <Link href="/dashboard/composer" className="block p-2 bg-indigo-50 hover:bg-indigo-100 rounded-xl text-indigo-700">💼 LinkedIn</Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/#pricing" className="hover:text-pink-600 transition-colors">
              Pricing
            </Link>

            <Link href="/dashboard/clients" className="hover:text-pink-600 transition-colors">
              Agencies
            </Link>

            {/* 3. Metrischool / Academy Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("metrischool")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1.5 py-5 hover:text-pink-600 transition-colors">
                <span>Academy</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeDropdown === "metrischool" ? "rotate-180 text-pink-600" : ""}`} />
              </button>

              {/* Academy Dropdown */}
              {activeDropdown === "metrischool" && (
                <div className="absolute right-0 top-full w-[600px] bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 grid grid-cols-3 gap-6 text-xs animate-in fade-in duration-150">
                  <div className="space-y-2">
                    <p className="font-black text-slate-900 uppercase text-xs tracking-wider flex items-center gap-1 bg-orange-50 p-2 rounded-xl border border-orange-100">
                      <GraduationCap className="w-4 h-4 text-orange-500" /> Courses
                    </p>
                    <div className="space-y-1.5 text-slate-700 font-bold">
                      <p className="hover:text-pink-600 cursor-pointer">elan.social Certification</p>
                      <p className="hover:text-pink-600 cursor-pointer">Social Growth School</p>
                      <p className="hover:text-pink-600 cursor-pointer">YouTube Ads Bootcamp</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="font-black text-slate-900 uppercase text-xs tracking-wider flex items-center gap-1 bg-blue-50 p-2 rounded-xl border border-blue-100">
                      <BookOpen className="w-4 h-4 text-blue-500" /> Resources
                    </p>
                    <div className="space-y-1.5 text-slate-700 font-bold">
                      <p className="hover:text-pink-600 cursor-pointer">Tutorials</p>
                      <p className="hover:text-pink-600 cursor-pointer">Studies & Benchmarks</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="font-black text-slate-900 uppercase text-xs tracking-wider flex items-center gap-1 bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                      <Newspaper className="w-4 h-4 text-emerald-500" /> News
                    </p>
                    <div className="space-y-1.5 text-slate-700 font-bold">
                      <p className="hover:text-pink-600 cursor-pointer">Blog</p>
                      <p className="hover:text-pink-600 cursor-pointer">Newsletter</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-full border-2 border-slate-900 text-slate-900 text-xs font-black hover:bg-slate-900 hover:text-white transition-all"
            >
              Login
            </Link>

            <Link
              href="/dashboard"
              className="bg-slate-950 hover:bg-black text-[#ccff00] text-xs font-black px-6 py-2.5 rounded-full shadow-lg hover:scale-105 transition-all"
            >
              Sign up free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-2xl bg-slate-100 text-slate-900 font-bold"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-5 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-3 text-base font-black text-slate-900">
            <Link href="/dashboard" className="py-2 text-pink-600 flex items-center gap-1">
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/dashboard/calendar" className="py-2">
              Planner & Calendar
            </Link>
            <Link href="/dashboard/analytics" className="py-2">
              Analytics & Reports
            </Link>
            <Link href="/dashboard/inbox" className="py-2">
              Unified Social Inbox
            </Link>
            <Link href="/dashboard/smartlinks" className="py-2">
              SmartLinks
            </Link>
            <Link href="/#pricing" className="py-2">
              Pricing
            </Link>
            <div className="pt-2 flex items-center gap-3">
              <Link href="/login" className="flex-1 text-center py-3 border-2 border-slate-900 rounded-full text-xs font-black text-slate-900">
                Login
              </Link>
              <Link
                href="/dashboard"
                className="flex-1 text-center py-3 bg-slate-950 text-[#ccff00] rounded-full text-xs font-black"
              >
                Sign up free
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
