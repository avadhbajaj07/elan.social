"use client";

import { Link as LinkIcon, Sparkles, MousePointer, BarChart2 } from "lucide-react";

export default function SmartLinksPage() {
  return (
    <div className="space-y-6 font-sans text-xs pb-12">
      <div>
        <h1 className="text-2xl font-black text-metricool-dark">SmartLinks</h1>
        <p className="text-xs text-slate-500 mt-1">
          Send your audience exactly where you want them to go with custom link-in-bio microsites.
        </p>
      </div>

      {/* Hero Banner matching Screenshot 5 */}
      <div className="bg-[#e8f0fe] p-6 rounded-2xl border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <h2 className="text-base font-bold text-slate-900">Custom Microsites & Link-in-Bio</h2>
          <p className="text-xs text-slate-600">
            Link your website, online store, social networks, and featured campaigns in one customizable page.
          </p>
        </div>

        <button
          onClick={() => alert("Upgrade your plan for SmartLinks...")}
          className="bg-metricool-dark text-metricool-lime text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-md shrink-0"
        >
          Upgrade your plan
        </button>
      </div>

      {/* 3 SmartLinks Cards matching Screenshot 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Capture clients and redirect them */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <LinkIcon className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Capture clients and redirect them</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Create your SmartLink with all your brand's most important links. Take your audience exactly where you want them to go.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-center">
            <p className="text-xs text-slate-500 font-bold">Total Clicks</p>
            <p className="text-2xl font-black text-slate-900">1,234</p>
          </div>
        </div>

        {/* Card 2: Create custom clickable links */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <MousePointer className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Create custom clickable links</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Design buttons with your brand colors, images, and fonts. Add links to your website, store, or social channels.
            </p>
          </div>

          <div className="bg-metricool-dark text-metricool-lime p-3 rounded-xl text-center font-extrabold text-xs">
            Custom Buttons Active
          </div>
        </div>

        {/* Card 3: Measure the impact */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <BarChart2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Measure impact and ROI</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Access detailed analytics on visits, clicks, and conversions for your SmartLink microsite.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <div className="flex justify-between text-[11px] font-bold text-slate-700">
              <span>Visits</span>
              <span className="text-emerald-600">+12% this month</span>
            </div>
            <p className="text-2xl font-black text-slate-900">23</p>
          </div>
        </div>
      </div>
    </div>
  );
}
