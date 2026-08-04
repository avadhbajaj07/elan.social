"use client";

import { useState } from "react";
import { MessageSquare, Users, Clock, CheckCircle2, Send } from "lucide-react";

export default function SocialInboxPage() {
  const [replyText, setReplyText] = useState("");
  const [repliedCount, setRepliedCount] = useState(48);

  return (
    <div className="space-y-6 font-sans text-xs pb-12">
      <div>
        <h1 className="text-2xl font-black text-metricool-dark">Inbox</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage all your conversations in one place. Reply to messages from Instagram, Facebook, X and more without switching apps.
        </p>
      </div>

      {/* Hero Banner matching Screenshot 3 */}
      <div className="bg-[#e8f0fe] p-6 rounded-2xl border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <h2 className="text-base font-bold text-slate-900">Centralized Team Inbox</h2>
          <p className="text-xs text-slate-600">
            Reply to direct messages, comments, and reviews across all your connected brand profiles.
          </p>
        </div>

        <button
          onClick={() => alert("Connecting networks...")}
          className="bg-metricool-dark text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shrink-0"
        >
          Connect social networks
        </button>
      </div>

      {/* 3 Inbox Feature Cards matching Screenshot 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Reply from a unified inbox */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Reply from a unified inbox</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Centralize direct messages, comments and mentions from all your networks in one place.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex justify-between text-[11px] font-bold text-slate-700">
              <span>Unread</span>
              <span className="text-purple-600">Avg reply 8 min</span>
            </div>
            <p className="text-2xl font-black text-slate-900">12 messages</p>
          </div>
        </div>

        {/* Card 2: Collaborate with your team in real time */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Collaborate with your team in real time</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Assign conversations, leave internal notes and respond faster with shared workflows.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex justify-between text-[11px] font-bold text-slate-700">
              <span>Replies Today</span>
              <span className="text-emerald-600">5 networks connected</span>
            </div>
            <p className="text-2xl font-black text-slate-900">{repliedCount} replies</p>
          </div>
        </div>

        {/* Card 3: Measure your response time */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Measure your response time</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Analyze customer service metrics: average response time, volume and satisfaction tags.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex justify-between text-[11px] font-bold text-slate-700">
              <span>Customer Tags</span>
              <span className="text-blue-600">8 in use</span>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <span className="bg-pink-100 text-pink-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full">VIP</span>
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full">Lead</span>
              <span className="bg-blue-100 text-blue-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full">Recurring</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
