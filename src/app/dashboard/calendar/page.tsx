"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar as CalendarIcon, Plus, Filter, Search, Clock, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

export default function CalendarPage() {
  const [posts, setPosts] = useState<any[]>([]);

  return (
    <div className="space-y-6 font-sans text-xs pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Visual Content Calendar</h1>
          <p className="text-sm text-slate-600 font-bold mt-1">
            Organize, schedule, and auto-publish content across Instagram, TikTok, Facebook, LinkedIn, and YouTube.
          </p>
        </div>

        <Link
          href="/dashboard/composer"
          className="bg-slate-950 hover:bg-black text-[#ccff00] font-black text-xs px-5 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> Create New Post
        </Link>
      </div>

      {/* Calendar Navigation Bar */}
      <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 border border-slate-300 rounded-xl px-3 py-1.5 font-black text-slate-900 gap-2">
            <button className="p-1 hover:text-purple-600"><ChevronLeft className="w-4 h-4" /></button>
            <span>February 2026</span>
            <button className="p-1 hover:text-purple-600"><ChevronRight className="w-4 h-4" /></button>
          </div>

          <span className="bg-purple-100 text-purple-800 text-xs font-black px-3 py-1 rounded-full uppercase">
            This Week
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search scheduled posts..."
              className="bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 font-bold"
            />
          </div>

          <button className="p-2 bg-slate-100 border border-slate-300 rounded-xl text-slate-700 hover:border-slate-900">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Posts Calendar Grid / Empty State */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-7 gap-3 text-center">
          {/* Days Grid */}
        </div>
      ) : (
        /* Clean Zero-State when no posts are scheduled */
        <div className="bg-white p-12 rounded-3xl border-2 border-slate-200 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-purple-100 text-purple-600 mx-auto flex items-center justify-center font-black text-3xl">
            📅
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-xl font-black text-slate-900">No Scheduled Posts Yet</h3>
            <p className="text-xs text-slate-500 font-bold">
              Your content calendar is currently empty. Start by creating a new post and scheduling it for your social channels.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/dashboard/composer"
              className="inline-flex items-center gap-2 bg-slate-950 hover:bg-black text-[#ccff00] font-black text-sm px-6 py-3.5 rounded-2xl shadow-xl transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" /> Schedule Your First Post →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
