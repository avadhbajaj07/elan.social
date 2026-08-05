"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Layers, Sparkles, BarChart2, Hash, ExternalLink, Printer, CheckCircle2 } from "lucide-react";

export default function ReportingPage() {
  const [accounts, setAccounts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/social-accounts", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.accounts)) {
          setAccounts(data.accounts);
        }
      })
      .catch(() => {});
  }, []);

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-sans text-xs pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Executive Client Reports</h1>
          <p className="text-xs text-slate-500 mt-1 font-bold">
            Generate and export white-label social performance reports for your clients.
          </p>
        </div>

        <button
          onClick={handlePrintReport}
          className="bg-slate-950 hover:bg-black text-[#ccff00] font-black text-xs px-4 py-2.5 rounded-xl shadow transition-all flex items-center gap-1.5"
        >
          <Printer className="w-4 h-4" /> Export PDF / Print Report
        </button>
      </div>

      {/* Top Banner */}
      <div className="bg-[#e8f0fe] p-6 rounded-3xl border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-base font-black text-slate-900">Connected Accounts in Report ({accounts.length})</h2>
          <p className="text-xs text-slate-600 font-medium">
            Live Blotato social channels included in executive client reporting.
          </p>
        </div>

        <Link
          href="/dashboard/clients"
          className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow shrink-0"
        >
          Select Client Workspace →
        </Link>
      </div>

      {/* Connected Accounts List */}
      {accounts.length > 0 && (
        <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-sm space-y-3">
          <h3 className="font-black text-slate-900 text-xs">Included Social Channels:</h3>
          <div className="flex flex-wrap gap-2">
            {accounts.map((acc, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-black flex items-center gap-2">
                <span>{acc.username || acc.account_name}</span>
                <span className="text-[10px] text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full capitalize">{acc.platform}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4 Reporting Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Executive PDF Reports */}
        <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black text-slate-900">Executive PDF Reports</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Export professional white-label reports with channel activity and performance metrics.
            </p>
          </div>

          <button
            onClick={handlePrintReport}
            className="w-full py-2.5 bg-slate-950 hover:bg-black text-[#ccff00] font-black rounded-xl text-xs transition-all flex items-center justify-center gap-1"
          >
            <Printer className="w-3.5 h-3.5" /> Export PDF Report
          </button>
        </div>

        {/* Card 2: Campaign Dashboards */}
        <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black text-slate-900">Campaign Workspaces</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Group content by client campaigns and evaluate reach across social channels.
            </p>
          </div>

          <Link
            href="/dashboard/clients"
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black rounded-xl text-xs border border-slate-300 text-center block"
          >
            Client Workspaces
          </Link>
        </div>

        {/* Card 3: Client Portal */}
        <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black text-slate-900">Client Portal Links</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Generate 1-click shareable report portals for your clients.
            </p>
          </div>

          <Link
            href="/dashboard/clients"
            className="w-full py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-black rounded-xl text-xs border border-purple-200 text-center block"
          >
            Copy Client Portal Links
          </Link>
        </div>

        {/* Card 4: Blotato REST API */}
        <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <BarChart2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black text-slate-900">Blotato API Logs</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Inspect raw API request logs and response submissions in Blotato API dashboard.
            </p>
          </div>

          <a
            href="https://my.blotato.com/login"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black rounded-xl text-xs border border-slate-300 text-center flex items-center justify-center gap-1"
          >
            Blotato Dashboard <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
