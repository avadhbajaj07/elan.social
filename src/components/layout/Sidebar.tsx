"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Plus,
  FileText,
  Settings,
  TrendingUp,
  Sparkles,
  RefreshCw,
  Check,
  AlertCircle,
  ExternalLink,
  X,
  Share2,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { ClientProfile } from "@/lib/mockData";

export interface SidebarProps {
  clients: ClientProfile[];
  selectedClient: ClientProfile;
  onSelectClient: (client: ClientProfile) => void;
}

interface ConnectedAccount {
  id: string;
  platform: string;
  username: string;
  account_name: string;
  avatar_url?: string;
  connected: boolean;
}

const PLATFORM_META: Record<string, { icon: string; label: string; color: string }> = {
  instagram: { icon: "📷", label: "Instagram", color: "text-pink-700 bg-pink-50 border-pink-200" },
  facebook: { icon: "📘", label: "Facebook", color: "text-blue-700 bg-blue-50 border-blue-200" },
  tiktok: { icon: "🎵", label: "TikTok", color: "text-slate-900 bg-slate-100 border-slate-300" },
  youtube: { icon: "▶", label: "YouTube", color: "text-red-700 bg-red-50 border-red-200" },
  linkedin: { icon: "💼", label: "LinkedIn", color: "text-indigo-700 bg-indigo-50 border-indigo-200" },
  twitter: { icon: "𝕏", label: "X / Twitter", color: "text-slate-900 bg-slate-100 border-slate-300" },
};

export default function Sidebar({ clients, selectedClient, onSelectClient }: SidebarProps) {
  const pathname = usePathname();
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [setupRequired, setSetupRequired] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchAccounts = useCallback(async (showSpinner = false) => {
    if (showSpinner) setSyncing(true);
    setError(null);

    try {
      const res = await fetch("/api/social-accounts", { cache: "no-store" });
      const data = await res.json();

      if (data.setup_required) {
        setSetupRequired(true);
        setAccounts([]);
      } else if (data.success && Array.isArray(data.accounts)) {
        setAccounts(data.accounts.filter((a: ConnectedAccount) => a.connected));
        setSetupRequired(false);
      } else {
        setError(data.error || "Could not load accounts");
        setAccounts([]);
      }
    } catch {
      setError("Network error. Check your connection.");
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleSync = () => fetchAccounts(true);

  const copyOnboardingLink = () => {
    const link = `${window.location.origin}/connect/${selectedClient?.slug || "my-brand"}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Group accounts by platform
  const connectedPlatforms = new Set(accounts.map((a) => a.platform.toLowerCase()));

  const ALL_PLATFORMS = ["instagram", "facebook", "tiktok", "youtube", "linkedin", "twitter"];

  return (
    <>
      <aside className="w-60 bg-white border-r border-slate-200 flex flex-col h-[calc(100vh-3.5rem)] fixed top-14 left-0 z-40 font-sans text-xs">
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1 group">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
              <Sparkles className="w-4 h-4 text-[#ccff00]" />
            </div>
            <span className="text-xl font-black text-slate-900 lowercase">
              elan<span className="text-pink-600">.social</span>
            </span>
          </Link>
        </div>

        {/* Client Workspace Selector */}
        <div className="p-3 border-b border-slate-200 bg-slate-50 space-y-1">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Active Client Workspace
            </span>
            <Link
              href="/dashboard/clients"
              className="text-[10px] font-black text-purple-600 hover:underline"
            >
              Manage →
            </Link>
          </div>

          <div className="relative">
            <select
              value={selectedClient?.id || ""}
              onChange={(e) => {
                const target = clients.find((c) => c.id === e.target.value);
                if (target) onSelectClient(target);
              }}
              className="w-full bg-white border-2 border-slate-200 rounded-xl px-3 py-2 text-xs font-black text-slate-900 focus:outline-none focus:border-purple-500 cursor-pointer truncate shadow-sm"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  🏢 {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Tab */}
        <div className="p-3 border-b border-slate-200">
          <Link
            href="/dashboard"
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl font-black transition-all ${
              pathname === "/dashboard"
                ? "bg-slate-950 text-[#ccff00] shadow-md"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-[#ccff00]" />
            <span>Summary</span>
          </Link>
        </div>

        {/* Connected Accounts Section (Filtered for Selected Client) */}
        <div className="p-3 border-b border-slate-200 space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              {selectedClient?.name ? `${selectedClient.name} Accounts` : "Connected Accounts"}
            </span>
            <button
              onClick={handleSync}
              disabled={syncing}
              title="Refresh accounts"
              className="text-slate-400 hover:text-purple-600 transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${syncing ? "animate-spin text-purple-600" : ""}`} />
            </button>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-4 text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
              <span className="text-[11px]">Loading accounts...</span>
            </div>
          )}

          {/* Setup required — Blotato API key missing */}
          {!loading && setupRequired && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-2">
              <div className="flex items-center gap-1.5 text-amber-700">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span className="font-black text-[11px]">Blotato key not set</span>
              </div>
              <p className="text-[10px] text-amber-600 leading-relaxed">
                Add your <code className="font-mono bg-amber-100 px-1 rounded">BLOTATO_API_KEY</code> to connect social accounts.
              </p>
              <a
                href="https://my.blotato.com/login"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] font-black text-amber-700 hover:text-amber-900"
              >
                Get API Key <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          )}

          {/* Error state */}
          {!loading && error && !setupRequired && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-2 text-[10px] text-red-600 font-bold">
              {error}
            </div>
          )}

          {/* Connected accounts list — Strictly Filtered for Active Client */}
          {!loading && !setupRequired && !error && (
            <div className="space-y-1.5">
              {(() => {
                const assignedIds = selectedClient?.blotatoAccountIds || [];
                const clientAccounts = assignedIds.length > 0
                  ? accounts.filter((a) => assignedIds.includes(a.id))
                  : accounts; // Fallback if no specific assignment

                if (clientAccounts.length === 0) {
                  return (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center space-y-1">
                      <p className="text-[11px] text-slate-500 font-bold">
                        No accounts linked to {selectedClient?.name || "this client"}
                      </p>
                      <Link
                        href="/dashboard/clients"
                        className="text-[10px] font-black text-purple-600 hover:underline block"
                      >
                        + Assign Accounts →
                      </Link>
                    </div>
                  );
                }

                return clientAccounts.map((acc) => {
                  const meta = PLATFORM_META[acc.platform.toLowerCase()] || {
                    icon: "📱",
                    label: acc.platform,
                    color: "text-slate-700 bg-slate-50 border-slate-200",
                  };
                  return (
                    <div
                      key={acc.id}
                      className={`flex items-center justify-between p-2 rounded-xl border ${meta.color}`}
                    >
                      <div className="flex items-center gap-2 truncate pr-1">
                        <span className="text-sm shrink-0">{meta.icon}</span>
                        <span className="font-black text-[11px] truncate">
                          {acc.username || acc.account_name}
                        </span>
                      </div>
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  );
                });
              })()}
            </div>
          )}

          {/* Add Account Button */}
          {!loading && (
            <button
              onClick={() => setShowModal(true)}
              className="w-full text-center border-2 border-slate-900 text-slate-900 font-black py-2 rounded-xl transition-all text-xs mt-1 hover:bg-slate-950 hover:text-[#ccff00] shadow-sm flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add social account
            </button>
          )}
        </div>

        {/* Sub-Navigation Links */}
        <div className="p-3 space-y-1.5 flex-1 overflow-y-auto">
          <Link
            href="/dashboard/reporting"
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all ${
              pathname.startsWith("/dashboard/reporting")
                ? "bg-purple-100 text-purple-900 font-extrabold"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span>Reporting</span>
            </div>
            <span className="text-[9px] bg-purple-200 text-purple-800 font-black px-1.5 py-0.5 rounded-full">
              New
            </span>
          </Link>

          <Link
            href="/dashboard/analytics"
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl font-bold transition-all ${
              pathname.startsWith("/dashboard/analytics")
                ? "bg-blue-100 text-blue-900 font-extrabold"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Reports</span>
          </Link>

          <Link
            href="/dashboard/settings"
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl font-bold transition-all ${
              pathname.startsWith("/dashboard/settings")
                ? "bg-slate-200 text-slate-900 font-extrabold"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Settings className="w-4 h-4 text-slate-600" />
            <span>Brand settings</span>
          </Link>
        </div>
      </aside>

      {/* How to Connect Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl border-2 border-slate-900 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b-2 border-slate-100 bg-gradient-to-r from-pink-500 to-purple-600">
              <div>
                <h3 className="text-lg font-black text-white">Connect Social Accounts</h3>
                <p className="text-purple-100 text-xs font-bold mt-0.5">
                  Powered by Blotato — no app review needed
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-950 text-[#ccff00] flex items-center justify-center font-black text-sm shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-slate-900 text-sm">Log in to Blotato</h4>
                  <p className="text-slate-500 text-xs font-bold mt-1 leading-relaxed">
                    Log in to Blotato, then go to <strong>Settings → Social Accounts</strong> to connect Instagram, Facebook, TikTok, LinkedIn, or YouTube.
                  </p>
                  <a
                    href="https://my.blotato.com/login"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-slate-950 text-[#ccff00] font-black text-xs rounded-xl hover:bg-slate-800 transition-all"
                  >
                    Open Blotato <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="border-t border-slate-100" />

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-950 text-[#ccff00] flex items-center justify-center font-black text-sm shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-slate-900 text-sm">Sync Accounts Here</h4>
                  <p className="text-slate-500 text-xs font-bold mt-1 leading-relaxed">
                    After connecting on Blotato, click the button below to pull your connected accounts into elan.social.
                  </p>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      fetchAccounts(true);
                    }}
                    disabled={syncing}
                    className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl transition-all disabled:opacity-60"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
                    {syncing ? "Syncing..." : "Sync My Accounts"}
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-100" />

              {/* Step 3 - Client onboarding link */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-black text-sm shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-slate-900 text-sm">Send Link to Your Client</h4>
                  <p className="text-slate-500 text-xs font-bold mt-1 leading-relaxed">
                    Share this onboarding link so your client can connect their own accounts directly.
                  </p>
                  <button
                    onClick={copyOnboardingLink}
                    className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 border-2 border-slate-900 text-slate-900 hover:bg-slate-950 hover:text-[#ccff00] font-black text-xs rounded-xl transition-all"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Copied!
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" /> Copy Client Link
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Platforms supported */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                  Platforms supported via Blotato
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(PLATFORM_META).map(([key, meta]) => (
                    <span
                      key={key}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] font-bold ${meta.color}`}
                    >
                      {meta.icon} {meta.label}
                      {connectedPlatforms.has(key) && (
                        <Check className="w-3 h-3 text-emerald-600 ml-0.5" />
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
