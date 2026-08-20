"use client";

import { useState, useEffect } from "react";
import { BlotatoAccount, loadClientsFromStorage, ClientProfile } from "@/lib/mockData";
import {
  Zap,
  MessageSquare,
  Send,
  Plus,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Sparkles,
  Link as LinkIcon,
  ToggleLeft,
  ToggleRight,
  Hash,
  ShieldCheck,
  Bot,
} from "lucide-react";

interface DMAutomation {
  id: string;
  name: string;
  platform: string;
  accountId: string;
  isActive: boolean;
  publishedVersionId?: string;
  trigger?: {
    type: string;
    keywords?: string[];
    isActive?: boolean;
  };
  dmMessage?: string;
  commentReply?: string;
  buttons?: Array<{ title: string; type: string; url: string }>;
  createdAt?: string;
}

export default function AutomationsPage() {
  const [blotatoAccounts, setBlotatoAccounts] = useState<BlotatoAccount[]>([]);
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<BlotatoAccount | null>(null);

  // Automations list
  const [automations, setAutomations] = useState<DMAutomation[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [keyword, setKeyword] = useState("JWT");
  const [name, setName] = useState("JWT Keyword Auto-DM");
  const [dmMessage, setDmMessage] = useState(
    "Hey! Thanks for commenting on dotnet_interview_community. Here is your complete JWT Authentication & Security Guide for .NET!"
  );
  const [buttonTitle, setButtonTitle] = useState("Download JWT Guide 🚀");
  const [buttonUrl, setButtonUrl] = useState("https://elan-social.vercel.app");
  const [commentReply, setCommentReply] = useState(
    "Sent you a DM with the JWT guide! 📩 Check your inbox."
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  // Load clients & blotato accounts
  useEffect(() => {
    const loadedClients = loadClientsFromStorage();
    setClients(loadedClients);

    fetchAccounts();
    fetchAutomations();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await fetch("/api/social-accounts", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.accounts)) {
        setBlotatoAccounts(data.accounts);
        // Default to dotnet_interview_community (account 64131) or first Instagram account
        const insta =
          data.accounts.find((a: BlotatoAccount) => a.id === "64131") ||
          data.accounts.find((a: BlotatoAccount) => a.platform === "instagram") ||
          data.accounts[0];
        if (insta) setSelectedAccount(insta);
      }
    } catch {
      /* silent */
    }
  };

  const fetchAutomations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/automations", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.automations)) {
        setAutomations(data.automations);
      }
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAutomation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount) {
      setResult({ success: false, message: "Please select an Instagram account." });
      return;
    }

    if (!keyword.trim()) {
      setResult({ success: false, message: "Keyword is required (e.g. JWT)." });
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      const res = await fetch("/api/automations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountId: selectedAccount.id,
          name: name || `${keyword.toUpperCase()} Keyword Auto-DM`,
          keyword: keyword.trim(),
          keywords: [keyword.trim(), keyword.trim().toLowerCase(), keyword.trim().toUpperCase()],
          dmMessage: dmMessage.trim(),
          buttonTitle: buttonTitle.trim(),
          buttonUrl: buttonUrl.trim(),
          commentReply: commentReply.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResult({
          success: true,
          message: data.message || `🎉 Auto-DM for keyword "${keyword}" is now LIVE!`,
        });
        fetchAutomations();
      } else {
        setResult({
          success: false,
          message: data.error || "Failed to create auto-DM automation.",
        });
      }
    } catch (err: any) {
      setResult({ success: false, message: err.message || "Network error." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (auto: DMAutomation) => {
    const newStatus = !auto.isActive;
    try {
      const res = await fetch("/api/automations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flowId: auto.id,
          isActive: newStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAutomations((prev) =>
          prev.map((a) => (a.id === auto.id ? { ...a, isActive: newStatus } : a))
        );
      }
    } catch {
      /* silent */
    }
  };

  return (
    <div className="space-y-6 font-sans text-xs pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Zap className="w-7 h-7 text-purple-600 animate-pulse" />
            Instagram Comment Auto-DM & Keyword Automation
          </h1>
          <p className="text-xs text-slate-500 font-bold mt-1">
            Automatically reply to comments & send DMs with links whenever someone comments keywords like <span className="bg-purple-100 text-purple-900 px-1.5 py-0.5 rounded font-black">"JWT"</span> on Instagram!
          </p>
        </div>

        <button
          onClick={fetchAutomations}
          disabled={loading}
          className="bg-white border-2 border-slate-200 hover:border-purple-500 text-slate-800 font-black px-4 py-2.5 rounded-2xl shadow-sm transition-all flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 text-purple-600 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Rules</span>
        </button>
      </div>

      {/* Grid: Creator & Active Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ─── LEFT COLUMN: Create New Keyword Automation (7 cols) ─── */}
        <div className="lg:col-span-7 space-y-5">
          <form
            onSubmit={handleCreateAutomation}
            className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-600" />
                Create Instagram Comment Keyword Rule
              </h2>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Meta Compliant
              </span>
            </div>

            {/* Target Instagram Account */}
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-700">Target Instagram Account</label>
              <select
                value={selectedAccount?.id || ""}
                onChange={(e) => {
                  const acc = blotatoAccounts.find((a) => a.id === e.target.value);
                  if (acc) setSelectedAccount(acc);
                }}
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-black outline-none"
              >
                {blotatoAccounts
                  .filter((a) => a.platform === "instagram")
                  .map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      📷 @{acc.username} (Account ID: {acc.id})
                    </option>
                  ))}
              </select>
            </div>

            {/* Keyword */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-700 flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5 text-purple-600" /> Comment Keyword Trigger *
                </label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g. JWT or GUIDE"
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:border-purple-500 rounded-xl px-3.5 py-2 text-xs font-black text-slate-900 outline-none uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-700">Automation Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rule Name"
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:border-purple-500 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-bold outline-none"
                />
              </div>
            </div>

            {/* DM Message */}
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-700 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> Direct Message (DM) Sent to User *
              </label>
              <textarea
                rows={3}
                value={dmMessage}
                onChange={(e) => setDmMessage(e.target.value)}
                placeholder="Message text sent directly to user's DMs..."
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-purple-500 rounded-xl p-3 text-xs text-slate-900 outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Action Button Link */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-purple-50/60 p-3.5 rounded-2xl border border-purple-200">
              <div className="space-y-1">
                <label className="text-[11px] font-black text-purple-900 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Button Title in DM
                </label>
                <input
                  type="text"
                  value={buttonTitle}
                  onChange={(e) => setButtonTitle(e.target.value)}
                  placeholder="e.g. Download JWT Guide 🚀"
                  className="w-full bg-white border-2 border-purple-200 focus:border-purple-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black text-purple-900 flex items-center gap-1">
                  <LinkIcon className="w-3.5 h-3.5 text-purple-600" /> Destination URL Link
                </label>
                <input
                  type="url"
                  value={buttonUrl}
                  onChange={(e) => setButtonUrl(e.target.value)}
                  placeholder="https://elan-social.vercel.app"
                  className="w-full bg-white border-2 border-purple-200 focus:border-purple-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                />
              </div>
            </div>

            {/* Public Comment Reply */}
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-700">Public Comment Reply (Optional)</label>
              <input
                type="text"
                value={commentReply}
                onChange={(e) => setCommentReply(e.target.value)}
                placeholder="e.g. Sent you a DM with the JWT guide! 📩 Check your inbox."
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-purple-500 rounded-xl px-3.5 py-2 text-xs text-slate-900 outline-none"
              />
            </div>

            {/* Results */}
            {result && (
              <div
                className={`p-3.5 rounded-2xl border-2 text-xs font-black flex items-center gap-2 ${
                  result.success
                    ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                    : "bg-red-50 border-red-300 text-red-700"
                }`}
              >
                {result.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                {result.message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-slate-950 hover:bg-black disabled:opacity-50 text-[#ccff00] font-black py-3.5 rounded-2xl shadow-xl flex items-center justify-center gap-2 text-xs transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Activating Keyword Rule...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-[#ccff00]" /> Activate "{keyword.toUpperCase()}" Auto-DM Rule Live
                </>
              )}
            </button>
          </form>
        </div>

        {/* ─── RIGHT COLUMN: Active Rules List (5 cols) ─── */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-600" /> Active Keyword Automations ({automations.length})
              </h2>
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />}
            </div>

            {loading ? (
              <div className="text-center py-8 text-slate-400 font-bold">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-purple-600" />
                Fetching active rules...
              </div>
            ) : automations.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-2">
                <Bot className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-black text-slate-700 text-xs">No active automations yet</p>
                <p className="text-[10px] text-slate-400 font-bold">
                  Create your first keyword rule on the left to start sending auto-DMs!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {automations.map((auto) => {
                  const keywords = auto.trigger?.keywords || ["JWT"];
                  const account = blotatoAccounts.find((a) => a.id === auto.accountId);
                  return (
                    <div
                      key={auto.id}
                      className={`p-4 rounded-2xl border-2 transition-all space-y-3 ${
                        auto.isActive
                          ? "bg-slate-900 text-white border-slate-800 shadow-md"
                          : "bg-slate-50 text-slate-600 border-slate-200 opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 truncate pr-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                          <h3 className="font-black text-xs truncate">
                            {auto.name || "Keyword Auto-DM"}
                          </h3>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleStatus(auto)}
                          className="flex items-center gap-1 text-[11px] font-black hover:opacity-80 transition-opacity"
                        >
                          {auto.isActive ? (
                            <ToggleRight className="w-7 h-7 text-[#ccff00]" />
                          ) : (
                            <ToggleLeft className="w-7 h-7 text-slate-400" />
                          )}
                        </button>
                      </div>

                      {/* Keywords */}
                      <div className="flex flex-wrap gap-1">
                        {keywords.map((kw) => (
                          <span
                            key={kw}
                            className="bg-purple-500/20 text-purple-300 font-black px-2 py-0.5 rounded-md text-[10px] border border-purple-500/30"
                          >
                            #{kw}
                          </span>
                        ))}
                        <span className="text-[10px] text-slate-400 font-bold ml-auto">
                          @{account?.username || "dotnet_interview_community"}
                        </span>
                      </div>

                      {/* Message Preview */}
                      {auto.dmMessage && (
                        <p className="text-[11px] text-slate-300 line-clamp-2 italic bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                          "{auto.dmMessage}"
                        </p>
                      )}

                      {/* Buttons */}
                      {auto.buttons && auto.buttons.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {auto.buttons.map((btn, idx) => (
                            <a
                              key={idx}
                              href={btn.url}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-purple-600 hover:bg-purple-700 text-white font-black px-2.5 py-1 rounded-lg text-[10px] flex items-center gap-1 transition-colors"
                            >
                              <LinkIcon className="w-3 h-3" /> {btn.title}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
