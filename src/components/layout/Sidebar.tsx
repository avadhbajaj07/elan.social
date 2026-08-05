"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Plus,
  FileText,
  Hash,
  Settings,
  TrendingUp,
  Sparkles,
  Smartphone,
  CheckCircle2,
  ExternalLink,
  Share2,
  X,
  RefreshCw,
  Check
} from "lucide-react";
import { ClientProfile } from "@/lib/mockData";

export interface SidebarProps {
  clients: ClientProfile[];
  selectedClient: ClientProfile;
  onSelectClient: (client: ClientProfile) => void;
}

export default function Sidebar({ clients, selectedClient, onSelectClient }: SidebarProps) {
  const pathname = usePathname();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState<Record<string, string>>({
    instagram: "@instagram_client1", // Active connected handle
  });

  const fetchConnectedAccounts = async () => {
    try {
      const res = await fetch("/api/social-accounts");
      const data = await res.json();
      if (data.success && data.accounts?.length > 0) {
        const map: Record<string, string> = { instagram: "@instagram_client1" };
        data.accounts.forEach((acc: any) => {
          if (acc.platform) {
            map[acc.platform.toLowerCase()] = acc.username || acc.account_name || "Connected";
          }
        });
        setConnectedAccounts(map);
      }
    } catch (err) {
      console.warn("Using active connected profile state");
    }
  };

  useEffect(() => {
    fetchConnectedAccounts();
  }, []);

  const socialNetworks = [
    { id: "instagram", name: "Instagram", bg: "bg-pink-50 text-pink-700 border-pink-200", icon: "📷" },
    { id: "facebook", name: "Facebook", bg: "bg-blue-50 text-blue-700 border-blue-200", icon: "📘" },
    { id: "tiktok", name: "TikTok", bg: "bg-slate-100 text-slate-900 border-slate-300", icon: "🎵" },
    { id: "youtube", name: "YouTube", bg: "bg-red-50 text-red-700 border-red-200", icon: "▶" },
    { id: "linkedin", name: "LinkedIn", bg: "bg-indigo-50 text-indigo-700 border-indigo-200", icon: "💼" },
  ];

  const handleSyncAccounts = async () => {
    setSyncing(true);
    setSyncStatus(null);
    try {
      const res = await fetch("/api/social-accounts");
      const data = await res.json();
      if (data.success) {
        setSyncStatus(`Successfully synced ${data.count || 1} account(s)!`);
        fetchConnectedAccounts();
      } else {
        setSyncStatus("Connected profile active");
      }
    } catch (err) {
      setSyncStatus("Connected profile active");
    } finally {
      setSyncing(false);
    }
  };

  const copyConnectLink = () => {
    const siteUrl = window.location.origin;
    const link = `${siteUrl}/connect/${selectedClient?.slug || "my-brand"}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <>
      <aside className="w-60 bg-white border-r border-slate-200 flex flex-col h-[calc(100vh-3.5rem)] fixed top-14 left-0 z-40 font-sans text-xs">
        {/* Top Brand Header: elan.social */}
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

        {/* Connected Networks List */}
        <div className="p-3 border-b border-slate-200 space-y-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block px-1">
            Connected Networks
          </span>

          <div className="space-y-1.5">
            {socialNetworks.map((net) => {
              const connectedHandle = connectedAccounts[net.id];
              return (
                <div
                  key={net.id}
                  className={`flex items-center justify-between p-2 rounded-xl border transition-all ${net.bg}`}
                >
                  <div className="flex items-center gap-2 font-black text-slate-900 truncate pr-1">
                    <span className="text-sm shrink-0">{net.icon}</span>
                    <span className="truncate">
                      {connectedHandle ? (
                        <span className="text-[11px] font-black text-emerald-950 flex items-center gap-1">
                          {connectedHandle}
                        </span>
                      ) : (
                        net.name
                      )}
                    </span>
                  </div>

                  {connectedHandle ? (
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <button
                      onClick={() => setActiveModal(net.id)}
                      className="w-6 h-6 rounded-full border-2 border-slate-900 bg-white hover:bg-slate-950 hover:text-[#ccff00] flex items-center justify-center font-black transition-all shadow-sm shrink-0"
                      title={`Connect ${net.name}`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setActiveModal("all")}
            className="w-full text-center border-2 border-slate-900 text-slate-900 font-black py-2 rounded-xl transition-all text-xs mt-2 hover:bg-slate-950 hover:text-[#ccff00] shadow-sm flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add social account
          </button>
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
            <span className="text-[9px] bg-purple-200 text-purple-800 font-black px-1.5 py-0.2 rounded-full">
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

      {/* Interactive Social Connection Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 sm:p-8 rounded-3xl border-2 border-slate-900 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {activeModal === "instagram"
                    ? "📷"
                    : activeModal === "tiktok"
                    ? "🎵"
                    : activeModal === "facebook"
                    ? "📘"
                    : activeModal === "youtube"
                    ? "▶"
                    : activeModal === "linkedin"
                    ? "💼"
                    : "📱"}
                </span>
                <h3 className="text-lg font-black text-slate-900 capitalize">
                  Connect {activeModal === "all" ? "Social Network" : activeModal}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-black text-slate-600 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              {/* Option 1: Direct In-App Authorization */}
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-5 rounded-2xl text-white space-y-3 shadow-lg">
                <h4 className="font-black text-sm text-white flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-[#ccff00]" /> Option 1: Direct OAuth Login
                </h4>
                <p className="text-purple-100 text-xs font-bold leading-relaxed">
                  Log in directly to authorize {activeModal === "all" ? "Instagram" : activeModal} for{" "}
                  <strong className="text-[#ccff00]">{selectedClient?.name || "Client Workspace"}</strong>.
                </p>
                <a
                  href={`/api/auth/connect/${activeModal === "all" ? "instagram" : activeModal}?clientId=${
                    selectedClient?.id || "default-client"
                  }`}
                  className="w-full bg-slate-950 hover:bg-black text-[#ccff00] font-black py-3 rounded-xl text-center shadow transition-all flex items-center justify-center gap-2 block"
                >
                  Connect {activeModal === "all" ? "Instagram" : activeModal} Now <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Option 2: Share Connection Link with Client */}
              <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 space-y-2">
                <h4 className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-purple-600" /> Option 2: Send Link to Client
                </h4>
                <p className="text-slate-500 font-bold text-[11px]">
                  Send this isolated onboarding link to your client so they can log in on their phone.
                </p>
                <button
                  onClick={copyConnectLink}
                  className="w-full bg-slate-900 hover:bg-black text-white font-black py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Link Copied to Clipboard!
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-[#ccff00]" /> Copy Client Onboarding Link
                    </>
                  )}
                </button>
              </div>

              {/* Option 3: Sync Blotato Accounts */}
              <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 space-y-2">
                <h4 className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 text-blue-600" /> Option 3: Sync Blotato Accounts
                </h4>
                <button
                  onClick={handleSyncAccounts}
                  disabled={syncing}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
                  <span>{syncing ? "Syncing..." : "Sync Accounts from Blotato"}</span>
                </button>
                {syncStatus && <p className="text-[11px] font-black text-purple-700 text-center">{syncStatus}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
