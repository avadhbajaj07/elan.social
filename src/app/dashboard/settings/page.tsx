"use client";

import { useState } from "react";
import { Settings, ShieldCheck, Key, CreditCard, Sparkles, Building2, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [blotatoKey, setBlotatoKey] = useState("blot_live_eu_987654321");
  const [stripeSaved, setStripeSaved] = useState(false);
  const [agencyName, setAgencyName] = useState("Apex Agency Europe");
  const [whitelabelDomain, setWhitelabelDomain] = useState("approval.apex-agency.ch");

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-400" /> Agency Settings & API Configurations
        </h1>
        <p className="text-xs text-slate-400">
          Manage your Blotato REST API keys, Stripe billing tier, and client approval portal whitelabeling.
        </p>
      </div>

      {/* 1. Blotato REST API Settings */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Blotato Social Media API Connection</h2>
          </div>
          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            v2 REST Connected
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Blotato is used for direct multi-channel publishing, analytics snapshotting, and social inbox moderation. Requests are authenticated using the <code className="bg-slate-900 px-1.5 py-0.5 rounded text-blue-400 font-mono">blotato-api-key</code> header.
        </p>

        <div className="space-y-1.5 text-xs">
          <label className="font-bold text-slate-200">Blotato API Key:</label>
          <div className="flex gap-2">
            <input
              type="password"
              value={blotatoKey}
              onChange={(e) => setBlotatoKey(e.target.value)}
              className="flex-1 glass-input rounded-xl px-3.5 py-2 text-white font-mono"
            />
            <button
              onClick={() => alert("Blotato API Key verified successfully!")}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl"
            >
              Verify & Save Key
            </button>
          </div>
        </div>
      </div>

      {/* 2. Agency Whitelabeling Settings */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Building2 className="w-5 h-5 text-purple-400" />
          <h2 className="text-base font-bold text-white">Whitelabeling & Client Approval Domain</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-200">Agency Brand Name:</label>
            <input
              type="text"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              className="w-full glass-input rounded-xl px-3.5 py-2 text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-200">Custom Approval Domain:</label>
            <input
              type="text"
              value={whitelabelDomain}
              onChange={(e) => setWhitelabelDomain(e.target.value)}
              className="w-full glass-input rounded-xl px-3.5 py-2 text-white font-mono"
            />
          </div>
        </div>
      </div>

      {/* 3. Stripe Subscription Billing */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">Stripe Subscription Plan</h2>
          </div>
          <span className="bg-blue-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
            Agency Pro Plan (€89/mo)
          </span>
        </div>

        <p className="text-xs text-slate-300">
          Your agency subscription renews on <strong>September 1, 2026</strong>. Multi-currency invoices are issued in EUR (€) or CHF (₣).
        </p>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => alert("Opening Stripe Billing Portal...")}
            className="gradient-brand text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20"
          >
            Manage Billing & Payment Methods
          </button>
        </div>
      </div>
    </div>
  );
}
