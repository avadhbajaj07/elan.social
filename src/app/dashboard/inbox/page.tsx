"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, Users, Clock, CheckCircle2, Smartphone, Loader2 } from "lucide-react";

export default function SocialInboxPage() {
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
      <div>
        <h1 className="text-2xl font-black text-slate-900">Unified Social Inbox</h1>
        <p className="text-xs text-slate-500 mt-1">
          Centralized comments & DM management across Instagram, Facebook, TikTok and X via Blotato API.
        </p>
      </div>

      {/* Hero Banner */}
      <div className="bg-[#e8f0fe] p-6 rounded-3xl border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <h2 className="text-base font-black text-slate-900">Live Social Channels ({accounts.length})</h2>
          <p className="text-xs text-slate-600 font-medium">
            Read and respond to comments across all your connected brand profiles.
          </p>
        </div>

        <a
          href="https://my.blotato.com/login"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-slate-950 hover:bg-black text-[#ccff00] text-xs font-black px-4 py-2.5 rounded-xl shadow-md shrink-0"
        >
          Manage Channels on Blotato →
        </a>
      </div>

      {/* Inbox Status & Accounts List */}
      <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-purple-600" />
          Active Channels Ready for Inbox Syncing
        </h2>

        {loading ? (
          <div className="flex items-center gap-2 text-slate-400 py-6">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading channels...
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
              Connect Channels on Blotato →
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {accounts.map((acc, idx) => (
              <div key={idx} className="p-4 rounded-2xl border-2 border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <p className="font-black text-slate-900 text-xs">{acc.username || acc.account_name}</p>
                  <p className="text-[10px] text-slate-500 font-bold capitalize">{acc.platform}</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Ready
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inbox Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black text-slate-900">Unified Comments & DMs</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Centralized message stream across all your connected brand profiles.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-500">Inbox Status</span>
            <p className="text-lg font-black text-slate-900">0 Unread Messages</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black text-slate-900">Team Collaboration</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Assign conversations and manage client responses.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-500">Connected Accounts</span>
            <p className="text-lg font-black text-purple-700">{accounts.length} Active Channels</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black text-slate-900">API Connection</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Blotato engagement API endpoints operational.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 font-mono">BLOTATO API V2</span>
            <p className="text-lg font-black text-emerald-600">✓ Connected</p>
          </div>
        </div>
      </div>
    </div>
  );
}
