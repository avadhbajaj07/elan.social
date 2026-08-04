"use client";

import { FileText, Layers, Sparkles, BarChart2, Hash, ArrowRight } from "lucide-react";

export default function ReportingPage() {
  return (
    <div className="space-y-6 font-sans text-xs pb-12">
      <div>
        <h1 className="text-2xl font-black text-metricool-dark">Reporting</h1>
        <p className="text-xs text-slate-500 mt-1">
          Turn your data into reports or dashboards ready to analyze, share, or present to your clients.
        </p>
      </div>

      {/* Top Banner */}
      <div className="bg-[#e8f0fe] p-6 rounded-2xl border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-900">Your brand reporting workspace</h2>
          <p className="text-xs text-slate-600">Connect social networks or switch brands to start generating PDF/PPT reports.</p>
        </div>

        <button
          onClick={() => alert("Connecting social networks...")}
          className="bg-metricool-dark text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shrink-0"
        >
          Connect social networks
        </button>
      </div>

      {/* 4 Reporting Feature Cards matching Screenshot 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Reports */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Reports</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Generate pre-designed reports with data from the social networks you choose for a specific period. Customize them with your logo and export as PDF or PPT.
            </p>
          </div>

          <button
            onClick={() => alert("Generating PDF Report...")}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs border border-slate-300"
          >
            Create report
          </button>
        </div>

        {/* Card 2: Campaign dashboards */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Campaign dashboards</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Group content by campaign or topic, manually or automatically. Analyze their combined performance to measure the real impact.
            </p>
          </div>

          <button
            onClick={() => alert("Upgrade your plan for Campaign Dashboards")}
            className="w-full py-2 bg-metricool-lime text-metricool-dark font-extrabold rounded-xl text-xs shadow-sm"
          >
            Upgrade your plan
          </button>
        </div>

        {/* Card 3: Metricool Studio */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Metricool Studio</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Create custom views without technical skills. Choose which charts, metrics, and insights to display for one brand or multiple.
            </p>
          </div>

          <button
            onClick={() => alert("Upgrade your plan for Metricool Studio")}
            className="w-full py-2 bg-metricool-lime text-metricool-dark font-extrabold rounded-xl text-xs shadow-sm"
          >
            Upgrade your plan
          </button>
        </div>

        {/* Card 4: Looker Studio */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <BarChart2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Looker Studio</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Connect your data to Looker Studio and build dashboards with complete freedom in design, structure, and visualization.
            </p>
          </div>

          <button
            onClick={() => alert("Connecting to Looker Studio...")}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs border border-slate-300"
          >
            Connect Looker Studio
          </button>
        </div>
      </div>

      {/* Hashtag Tracker Box matching Screenshot 2 */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Hash className="w-5 h-5 text-purple-600" />
          <h3 className="text-sm font-bold text-slate-900">Hashtag Tracker</h3>
        </div>
        <p className="text-xs text-slate-600">
          Monitor and analyze the use of a hashtag on X or Instagram and get data on its performance.
        </p>

        <button
          onClick={() => alert("Hashtag tracker details...")}
          className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 hover:border-slate-800"
        >
          More information
        </button>
      </div>
    </div>
  );
}
