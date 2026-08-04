"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Smartphone, CheckCircle2, ArrowRight, ShieldCheck, Lock, ExternalLink } from "lucide-react";

export default function ClientConnectPortal({ params }: { params: { token: string } }) {
  const [connecting, setConnecting] = useState<string | null>(null);

  const clientName = params.token ? params.token.replace(/-/g, " ").toUpperCase() : "CLIENT BRAND";

  const platforms = [
    { id: "instagram", name: "Instagram Business / Creator", icon: "📷", bg: "from-pink-500 to-rose-600", text: "Connect Instagram" },
    { id: "tiktok", name: "TikTok Business", icon: "🎵", bg: "from-slate-900 to-black", text: "Connect TikTok" },
    { id: "facebook", name: "Facebook Page", icon: "📘", bg: "from-blue-600 to-indigo-700", text: "Connect Facebook" },
    { id: "linkedin", name: "LinkedIn Page", icon: "💼", bg: "from-indigo-600 to-blue-800", text: "Connect LinkedIn" },
    { id: "youtube", name: "YouTube Channel", icon: "▶", bg: "from-red-600 to-rose-700", text: "Connect YouTube" },
    { id: "twitter", name: "Twitter / X Profile", icon: "𝕏", bg: "from-slate-950 to-slate-900", text: "Connect Twitter / X" },
  ];

  const handleConnect = (platformId: string) => {
    setConnecting(platformId);
    window.location.href = `/api/auth/connect/${platformId}?clientId=${encodeURIComponent(params.token)}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col justify-between selection:bg-[#ccff00] selection:text-slate-950">
      {/* Navbar */}
      <header className="border-b border-slate-800 p-4 flex items-center justify-between max-w-5xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-1.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
            <Sparkles className="w-4.5 h-4.5 text-[#ccff00]" />
          </div>
          <span className="text-xl font-black lowercase text-white">
            elan<span className="text-pink-500">.social</span>
          </span>
        </Link>
        <span className="text-xs bg-slate-900 text-slate-400 font-extrabold px-3 py-1 rounded-full border border-slate-800 flex items-center gap-1">
          <Lock className="w-3 h-3 text-emerald-400" /> Secure Client Portal
        </span>
      </header>

      {/* Main Connection Box */}
      <main className="max-w-2xl mx-auto px-4 py-12 text-center space-y-8 w-full">
        <div className="space-y-3">
          <span className="bg-[#ccff00] text-slate-950 font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-wider">
            Client Social Onboarding
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Connect Social Channels to <span className="text-pink-500">{clientName}</span>
          </h1>
          <p className="text-slate-400 text-sm font-bold max-w-lg mx-auto leading-relaxed">
            Authorized connection portal for {clientName}. Click below to log in and grant scheduling permissions for your brand profiles.
          </p>
        </div>

        {/* Platforms Connect Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {platforms.map((plat) => (
            <button
              key={plat.id}
              onClick={() => handleConnect(plat.id)}
              disabled={connecting === plat.id}
              className={`bg-gradient-to-r ${plat.bg} p-5 rounded-2xl font-black text-sm text-white shadow-xl hover:scale-[1.02] transition-all flex items-center justify-between border border-white/10`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{plat.icon}</span>
                <div className="text-left">
                  <p className="font-black text-sm">{plat.text}</p>
                  <p className="text-[10px] text-white/70 font-medium">{plat.name}</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-white/80" />
            </button>
          ))}
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-xs text-slate-400 font-medium space-y-2 text-left">
          <p className="font-extrabold text-white text-xs flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Privacy & Security Guarantee
          </p>
          <p>
            Your login credentials are encrypted directly through Meta / TikTok / LinkedIn official OAuth servers. Your password is never stored or shared with anyone.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 p-6 text-center text-xs text-slate-500 font-bold">
        <p>© 2026 elan.social Client Portal. Powered by Blotato REST API Engine.</p>
      </footer>
    </div>
  );
}
