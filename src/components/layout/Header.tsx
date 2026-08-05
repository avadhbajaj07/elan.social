"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  User,
  LogOut,
  ShieldCheck
} from "lucide-react";
import { ClientProfile } from "@/lib/mockData";
import { useAuth } from "@/lib/auth-context";

export interface HeaderProps {
  selectedClient: ClientProfile;
}

export default function Header({ selectedClient }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, isConfigured } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const agencyName = user?.user_metadata?.agency_name || "Apex Media Studio";
  const userEmail = user?.email || "agency@apex-media.eu";

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const tabs = [
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/dashboard/reporting", label: "Reporting", icon: TrendingUp, badge: "New" },
    { href: "/dashboard/inbox", label: "Inbox", icon: MessageSquare },
    { href: "/dashboard/calendar", label: "Planning", icon: Calendar },
    { href: "/dashboard/smartlinks", label: "SmartLinks", icon: LinkIcon },
    { href: "/dashboard/ads", label: "Ads", icon: Megaphone },
  ];

  return (
    <header className="bg-slate-950 text-white h-14 sticky top-0 z-50 px-4 flex items-center justify-between font-sans shadow-lg border-b border-slate-800">
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

      {/* Right: Upgrade Button, Client Selector, & User Auth Profile */}
      <div className="flex items-center gap-3 shrink-0 relative">
        <Link
          href="/#pricing"
          className="bg-[#ccff00] text-slate-950 text-xs font-black px-3.5 py-1.5 rounded-xl shadow-md hover:bg-white transition-all flex items-center gap-1"
        >
          <Zap className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
          <span>Upgrade</span>
        </Link>

        {/* User Auth Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            <div className="w-6 h-6 rounded-full gradient-brand flex items-center justify-center text-white font-extrabold text-[10px]">
              {agencyName.slice(0, 2).toUpperCase()}
            </div>
            <div className="text-left hidden md:block">
              <div className="text-slate-200 font-black truncate max-w-[110px] leading-none">{agencyName}</div>
              <div className="text-[10px] text-slate-400 font-medium truncate max-w-[110px] leading-tight">{userEmail}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-12 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-xs space-y-1">
              <div className="px-3 py-2 border-b border-slate-800">
                <div className="font-extrabold text-white text-xs">{agencyName}</div>
                <div className="text-[10px] text-slate-400 truncate">{userEmail}</div>
                <div className="mt-1 flex items-center gap-1 text-[9px] text-emerald-400 font-bold">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>{isConfigured ? "Supabase Auth Active" : "Demo Mode Active"}</span>
                </div>
              </div>

              <Link
                href="/dashboard/settings"
                onClick={() => setShowProfileMenu(false)}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-white transition-colors"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Account Settings</span>
              </Link>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-500/10 text-red-400 hover:text-red-300 rounded-xl transition-colors text-left font-bold"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

