"use client";

import { useState } from "react";
import Link from "next/link";
import { INITIAL_POSTS, PostItem } from "@/lib/mockData";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  PlusCircle,
  Clock,
  CheckCircle2,
  ExternalLink,
  Sparkles
} from "lucide-react";

export default function CalendarPage() {
  const [posts, setPosts] = useState<PostItem[]>(INITIAL_POSTS);
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<string>("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"month" | "week">("month");

  // Sample calendar days (August 2026)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  const filteredPosts = posts.filter((p) => {
    const platformMatch = selectedPlatformFilter === "all" || p.platforms.includes(selectedPlatformFilter as any);
    const statusMatch = selectedStatusFilter === "all" || p.status === selectedStatusFilter;
    return platformMatch && statusMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-blue-400" /> Multi-Channel Content Calendar
          </h1>
          <p className="text-xs text-slate-400">
            Schedule, drag-and-drop, and monitor upcoming social posts across all client channels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex items-center gap-1 text-xs">
            <button
              onClick={() => setViewMode("month")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === "month" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Month View
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === "week" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Week View
            </button>
          </div>

          <Link
            href="/dashboard/composer"
            className="gradient-brand text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/20"
          >
            <PlusCircle className="w-4 h-4" /> Schedule Post
          </Link>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 font-semibold text-slate-300">
            <Filter className="w-4 h-4 text-blue-400" /> Filter By:
          </div>

          {/* Platform Filter */}
          <select
            value={selectedPlatformFilter}
            onChange={(e) => setSelectedPlatformFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-1.5 font-medium"
          >
            <option value="all">All Networks (IG, TikTok, FB, LinkedIn, GMB)</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="facebook">Facebook</option>
            <option value="linkedin">LinkedIn</option>
            <option value="gmb">Google Business</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-1.5 font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="published">Published</option>
          </select>
        </div>

        {/* Month Navigation Header */}
        <div className="flex items-center gap-3 font-bold text-sm text-white">
          <button className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span>August 2026</span>
          <button className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid View */}
      <div className="glass-panel p-4 rounded-3xl border border-slate-800 overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-2 pb-3 border-b border-slate-800 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2 pt-3">
            {daysInMonth.slice(0, 28).map((day) => {
              // Check if posts fall on this day
              const dayPosts = filteredPosts.filter((p) => {
                const dateObj = new Date(p.scheduled_time);
                return dateObj.getDate() === day;
              });

              return (
                <div
                  key={day}
                  className={`min-h-[110px] p-2 rounded-2xl border transition-all flex flex-col justify-between ${
                    day === 4
                      ? "bg-blue-950/30 border-blue-500/50 shadow-md shadow-blue-500/10"
                      : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-mono font-bold ${day === 4 ? "text-blue-400" : "text-slate-400"}`}>
                      {day}
                    </span>
                    {day === 4 && (
                      <span className="text-[9px] bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded">
                        Today
                      </span>
                    )}
                  </div>

                  {/* Scheduled Posts on this day */}
                  <div className="space-y-1.5 my-1">
                    {dayPosts.map((post) => (
                      <div
                        key={post.id}
                        className={`p-1.5 rounded-xl border text-[10px] space-y-1 ${
                          post.status === "approved"
                            ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                            : post.status === "pending_approval"
                            ? "bg-amber-950/60 border-amber-500/40 text-amber-300"
                            : "bg-blue-950/60 border-blue-500/40 text-blue-300"
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span className="truncate max-w-[80px]">{post.caption.slice(0, 18)}...</span>
                          <span className="text-[8px] uppercase font-mono">{post.platforms[0]}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-[9px] text-slate-500 text-right font-medium">
                    {dayPosts.length > 0 ? `${dayPosts.length} post` : "+ Add"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
