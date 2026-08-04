"use client";

import Link from "next/link";
import { useState } from "react";
import {
  INITIAL_POSTS,
  INITIAL_CLIENTS,
  INITIAL_ACCOUNTS,
  INITIAL_COMMENTS,
  PostItem
} from "@/lib/mockData";
import {
  Calendar,
  Sparkles,
  Users,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  ArrowUpRight,
  Send,
  ExternalLink,
  Share2,
  TrendingUp,
  MessageSquare
} from "lucide-react";

export default function OverviewDashboardPage() {
  const [posts, setPosts] = useState<PostItem[]>(INITIAL_POSTS);

  const pendingApprovalCount = posts.filter((p) => p.status === "pending_approval").length;
  const approvedCount = posts.filter((p) => p.status === "approved").length;
  const publishedCount = posts.filter((p) => p.status === "published").length;

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner */}
      <div className="bg-metricool-dark text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-metricool-lime/20 text-metricool-lime text-xs font-extrabold border border-metricool-lime/30">
            Agency Workspace Ready
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, Agency Admin 👋
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            You have <span className="text-metricool-lime font-bold">{pendingApprovalCount} post pending client approval</span> and <span className="text-emerald-400 font-bold">{approvedCount} post queued for automatic Blotato publishing</span>.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <Link
            href="/dashboard/composer"
            className="bg-metricool-lime text-metricool-dark text-xs font-black px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2 hover:bg-white transition-all"
          >
            <PlusCircle className="w-4 h-4" /> Create New Post
          </Link>

          <Link
            href="/dashboard/calendar"
            className="bg-slate-800 text-white text-xs font-bold px-4 py-3 rounded-2xl border border-slate-700 flex items-center gap-2 hover:bg-slate-700 transition-all"
          >
            <Calendar className="w-4 h-4 text-blue-400" /> Open Calendar
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Pending Approvals</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-black text-amber-600">{pendingApprovalCount}</p>
          <p className="text-[11px] text-slate-600 font-medium">1-Click Email Sent to Client</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Approved & Queued</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-emerald-600">{approvedCount}</p>
          <p className="text-[11px] text-slate-600 font-medium">Ready for Automated Publish</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Published Posts</span>
            <Share2 className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-3xl font-black text-blue-600">{publishedCount}</p>
          <p className="text-[11px] text-slate-600 font-medium">Published across channels</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Connected Accounts</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-3xl font-black text-purple-600">{INITIAL_ACCOUNTS.length}</p>
          <p className="text-[11px] text-slate-600 font-medium">Across Client Workspaces</p>
        </div>
      </div>

      {/* Main Grid: Scheduled Posts List & Social Inbox Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-metricool-dark flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" /> Upcoming Scheduled Posts
            </h2>
            <Link
              href="/dashboard/calendar"
              className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
            >
              View Full Calendar <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-14 h-14 rounded-xl bg-slate-900 overflow-hidden border border-slate-200 shrink-0">
                    <img
                      src={post.media_urls[0]}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {post.platforms.map((p) => (
                        <span
                          key={p}
                          className="bg-slate-100 text-slate-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase"
                        >
                          {p}
                        </span>
                      ))}

                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full capitalize ${
                          post.status === "approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : post.status === "pending_approval"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {post.status.replace("_", " ")}
                      </span>
                    </div>

                    <p className="text-xs text-slate-800 font-medium line-clamp-2 leading-relaxed">
                      {post.caption}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {new Date(post.scheduled_time).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {post.approval_token && (
                    <Link
                      href={`/approval/${post.approval_token}`}
                      target="_blank"
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Client Approval Link
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Social Inbox Preview & Client Workspaces */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-metricool-dark flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-600" /> Social Inbox (Latest)
              </h3>
              <Link href="/dashboard/inbox" className="text-xs text-purple-600 font-bold hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {INITIAL_COMMENTS.map((comm) => (
                <div key={comm.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={comm.author_avatar} className="w-6 h-6 rounded-full object-cover" />
                      <span className="font-bold text-slate-900">{comm.author_name}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase font-mono">{comm.platform}</span>
                  </div>
                  <p className="text-slate-700 text-[11px]">"{comm.comment_text}"</p>
                  {comm.replied ? (
                    <span className="text-[10px] text-emerald-600 font-bold block">✓ Replied</span>
                  ) : (
                    <span className="text-[10px] text-amber-600 font-bold block">● Needs Reply</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-metricool-dark flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" /> Client Workspaces
            </h3>

            <div className="space-y-2.5">
              {INITIAL_CLIENTS.map((client) => (
                <div key={client.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <img src={client.avatar_url} className="w-8 h-8 rounded-lg object-cover" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{client.name}</p>
                      <p className="text-[10px] text-slate-500">{client.company_name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
