"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  MessageSquare,
  Calendar,
  Link as LinkIcon,
  Megaphone,
  ChevronDown,
  Sparkles,
  Zap,
  User
} from "lucide-react";
import { ClientProfile } from "@/lib/mockData";

export interface HeaderProps {
  selectedClient: ClientProfile;
}

export default function Header({ selectedClient }: HeaderProps) {
  const pathname = usePathname();

  const tabs = [
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/dashboard/reporting", label: "Reporting", icon: TrendingUp, badge: "New" },
    { href: "/dashboard/inbox", label: "Inbox", icon: MessageSquare },
    { href: "/dashboard/calendar", label: "Planning", icon: Calendar },
    { href: "/dashboard/smartlinks", label: "SmartLinks", icon: LinkIcon },
    { href: "/dashboard/ads", label: "Ads", icon: Megaphone },
  ];

  return (
    <header className="bg-slate-950 text-white h-14 sticky top-0 z-50 px-4 flex items-center justify-between font-sans shadow-lg">
      {/* Left: elan.social Logo Icon & Navigation Tabs */}
      <div className="flex items-center gap-6 overflow-x-auto">
        <Link href="/" className="flex items-center gap-1.5 shrink-0 group">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
            <Sparkles className="w-4 h-4 text-[#ccff00]" />
          </div>
          <span className="text-lg font-black tracking-tight text-white lowercase">
            elan<span className="text-pink-500">.social</span>
          </span>
        </Link>

        {/* Dashboard Tabs */}
        <nav className="flex items-center gap-1 text-xs font-black">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname.startsWith(tab.href);

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                  isActive
                    ? "bg-slate-800 text-[#ccff00] font-black border-b-2 border-[#ccff00]"
                    : "text-slate-300 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#ccff00]" : "text-slate-400"}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-black px-1.5 py-0.2 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right: Upgrade Button & Brand Selector */}
      <div className="flex items-center gap-3 shrink-0">
        <Link
          href="/#pricing"
          className="bg-[#ccff00] text-slate-950 text-xs font-black px-4 py-1.5 rounded-xl shadow-md hover:bg-white transition-all flex items-center gap-1"
        >
          <Zap className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
          <span>Upgrade plan</span>
        </Link>

        {/* Active Client Selector */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-xl text-xs font-black cursor-pointer">
          <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="text-slate-200 max-w-[120px] truncate">{selectedClient.name}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>
    </header>
  );
}
