"use client";

import { useState, useEffect } from "react";
import { Key, CheckCircle2, RefreshCw, Smartphone, ShieldCheck, Zap, Plus, ExternalLink, Globe, HelpCircle, ArrowRight } from "lucide-react";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("blt_xf24o9kuR/K6NKt6wDQ+c1Snut78GOX41jiqMJO5P7U=");
  const [loading, setLoading] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState<any[]>([]);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [showIGGuide, setShowIGGuide] = useState(false);

  const fetchAccounts = async () => {
    setLoading(true);
    setSyncStatus(null);
    try {
      const res = await fetch("/api/social-accounts");
      const data = await res.json();
      if (data.success) {
        setConnectedAccounts(data.accounts || []);
        setSyncStatus(`Successfully synced ${data.count || 0} connected account(s) from Blotato!`);
      } else {
        setSyncStatus(`Status: ${data.error || "Ready to connect accounts"}`);
      }
    } catch (err: any) {
      setSyncStatus("Ready to connect accounts via Blotato API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div className="space-y-8 font-sans text-xs pb-12">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Brand & API Settings</h1>
        <p className="text-sm text-slate-600 font-bold mt-1">
          Manage your Blotato REST API key and connect your social media profiles across Instagram, TikTok, Facebook, LinkedIn, YouTube, and Twitter.
        </p>
      </div>

      {/* 1. Step-by-Step Instagram & Social Connection Guide */}
      <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#ccff00]" />
            <h2 className="text-xl font-black">How to Connect Instagram & Social Media</h2>
          </div>
          <button
            onClick={() => setShowIGGuide(!showIGGuide)}
            className="bg-white/20 hover:bg-white/30 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4 text-[#ccff00]" />
            <span>{showIGGuide ? "Hide Guide" : "Instagram Connection Guide"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold">
          <div className="bg-white/10 p-5 rounded-2xl border border-white/20 space-y-2">
            <span className="bg-[#ccff00] text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">Step 1</span>
            <p className="text-base font-black text-white">1. Switch Instagram to Professional</p>
            <p className="text-purple-100 font-medium">Meta requires your Instagram account to be a <strong>Business</strong> or <strong>Creator</strong> account linked to a Facebook Page.</p>
          </div>

          <div className="bg-white/10 p-5 rounded-2xl border border-white/20 space-y-2">
            <span className="bg-[#ccff00] text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">Step 2</span>
            <p className="text-base font-black text-white">2. Connect inside Blotato</p>
            <p className="text-purple-100 font-medium">Open your Blotato dashboard at <a href="https://app.blotato.com" target="_blank" rel="noreferrer" className="underline font-bold text-[#ccff00]">app.blotato.com</a> &gt; <strong>Accounts</strong> &gt; <strong>Add Instagram</strong>.</p>
          </div>

          <div className="bg-white/10 p-5 rounded-2xl border border-white/20 space-y-2">
            <span className="bg-[#ccff00] text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">Step 3</span>
            <p className="text-base font-black text-white">3. Click "Sync Accounts"</p>
            <p className="text-purple-100 font-medium">Once authorized in Blotato, click <strong>"Sync Accounts"</strong> below. Your Instagram profile will immediately show up in elan.social!</p>
          </div>
        </div>

        {/* Detailed Instagram Connection Guide Toggleable */}
        {showIGGuide && (
          <div className="bg-slate-950 text-white p-6 rounded-2xl border border-purple-400 space-y-3 animate-in fade-in duration-200">
            <h4 className="text-base font-black text-[#ccff00] flex items-center gap-2">
              📷 Detailed Instagram Connection Steps
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-xs text-slate-200 font-medium leading-relaxed">
              <li>Open Instagram app on your phone &gt; Settings &gt; Account type &gt; <strong>Switch to Professional Account</strong> (Business or Creator).</li>
              <li>Link your Instagram Business Account to a <strong>Facebook Page</strong>.</li>
              <li>Log in to Blotato at <a href="https://app.blotato.com" target="_blank" className="text-[#ccff00] underline font-bold">app.blotato.com</a> using your account.</li>
              <li>Click <strong>"Connect Social Account"</strong> &gt; Select <strong>Instagram</strong> &gt; Complete Facebook OAuth login popup.</li>
              <li>Return here to <strong>elan.social</strong> and click <strong>"Sync Accounts"</strong>!</li>
            </ol>
          </div>
        )}
      </div>

      {/* 2. Blotato REST API Key Configuration */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Key className="w-5 h-5 text-purple-600" /> Blotato API Key (Production)
            </h3>
            <p className="text-xs text-slate-500 font-bold">
              Blotato REST API handles multi-platform post publishing, rate limit backoff, and analytics retrieval.
            </p>
          </div>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full uppercase flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Active Key
          </span>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-black text-slate-700 block">Active API Key</label>
          <div className="flex gap-3">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-mono font-bold"
            />
            <button
              onClick={fetchAccounts}
              disabled={loading}
              className="bg-slate-950 hover:bg-black text-[#ccff00] font-black text-xs px-5 py-2.5 rounded-xl shadow transition-all flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "Syncing..." : "Sync Accounts"}</span>
            </button>
          </div>
          {syncStatus && (
            <p className="text-xs font-black text-purple-700 pt-1">{syncStatus}</p>
          )}
        </div>
      </div>

      {/* 3. Connected Social Channels List */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-blue-600" /> Connected Social Profiles
            </h3>
            <p className="text-xs text-slate-500 font-bold mt-1">
              Social accounts currently connected to your Blotato workspace.
            </p>
          </div>

          <a
            href="https://app.blotato.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Connect Social Account in Blotato <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {connectedAccounts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connectedAccounts.map((acc, idx) => (
              <div key={idx} className="p-4 rounded-2xl border-2 border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-950 text-white flex items-center justify-center font-bold text-base">
                    {acc.platform?.[0]?.toUpperCase() || "S"}
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-xs">{acc.name || acc.username || "Social Account"}</p>
                    <p className="text-[10px] text-slate-500 font-bold capitalize">{acc.platform}</p>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full">
                  Connected
                </span>
              </div>
            ))}
          </div>
        ) : (
          /* Clean Empty State when no social accounts are linked yet */
          <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-purple-100 text-purple-600 mx-auto flex items-center justify-center font-black text-2xl">
              📱
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-black text-slate-900">No Social Media Accounts Linked Yet</h4>
              <p className="text-xs text-slate-500 font-bold max-w-md mx-auto">
                Connect your Instagram Business, TikTok, Facebook Page, LinkedIn, or YouTube channel inside Blotato, then click Sync Accounts below.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href="https://app.blotato.com"
                target="_blank"
                rel="noreferrer"
                className="bg-pink-600 hover:bg-pink-700 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow transition-all inline-flex items-center gap-1.5"
              >
                1. Connect Instagram in Blotato <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={fetchAccounts}
                className="bg-slate-950 hover:bg-black text-[#ccff00] font-black text-xs px-5 py-2.5 rounded-xl shadow transition-all inline-flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> 2. Sync Accounts to elan.social
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
