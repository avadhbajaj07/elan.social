"use client";

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
  User
} from "lucide-react";
import { ClientProfile } from "@/lib/mockData";

export interface SidebarProps {
  clients: ClientProfile[];
  selectedClient: ClientProfile;
  onSelectClient: (client: ClientProfile) => void;
}

export default function Sidebar({ clients, selectedClient, onSelectClient }: SidebarProps) {
  const pathname = usePathname();

  const socialNetworks = [
    { name: "Instagram", bg: "bg-pink-50 text-pink-700 border-pink-200", icon: "📷" },
    { name: "Facebook", bg: "bg-blue-50 text-blue-700 border-blue-200", icon: "📘" },
    { name: "TikTok", bg: "bg-slate-100 text-slate-900 border-slate-300", icon: "🎵" },
    { name: "YouTube", bg: "bg-red-50 text-red-700 border-red-200", icon: "▶" },
    { name: "LinkedIn", bg: "bg-indigo-50 text-indigo-700 border-indigo-200", icon: "💼", highlighted: true },
  ];

  return (
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
          {socialNetworks.map((net) => (
            <div
              key={net.name}
              className={`flex items-center justify-between p-2 rounded-xl border transition-all ${net.bg}`}
            >
              <div className="flex items-center gap-2 font-black text-slate-900">
                <span className="text-sm">{net.icon}</span>
                <span>{net.name}</span>
              </div>

              <button className="w-5 h-5 rounded-full border border-slate-400 flex items-center justify-center text-slate-700 hover:bg-white transition-colors">
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => alert("Connecting social networks...")}
          className="w-full text-center border-2 border-slate-900 text-slate-900 font-extrabold py-2 rounded-xl transition-all text-xs mt-2 hover:bg-slate-900 hover:text-white"
        >
          + More connections
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

        <div className="flex items-center gap-2 px-3 py-2.5 text-slate-700 font-bold hover:bg-slate-100 rounded-xl cursor-pointer">
          <Hash className="w-4 h-4 text-amber-600" />
          <span>Hashtag Tracker</span>
        </div>

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
  );
}
