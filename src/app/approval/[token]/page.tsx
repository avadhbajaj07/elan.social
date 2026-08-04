"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { Sparkles, CheckCircle2, Clock, Calendar, AlertCircle, Send, ShieldCheck, Heart, MessageCircle } from "lucide-react";

export default function ClientApprovalPortalPage({ params }: { params: { token: string } }) {
  const [postStatus, setPostStatus] = useState<"pending" | "approved" | "rejected">("pending");
  const [revisionFeedback, setRevisionFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRevisionForm, setShowRevisionForm] = useState(false);

  // Simulated post data retrieved via approval token
  const postData = {
    clientName: "Alps Haute Horlogerie",
    scheduledTime: "Monday, August 10, 2026 at 09:00 CET",
    platforms: ["Instagram", "LinkedIn", "TikTok"],
    caption:
      "Introducing the Royal Tourbillon Alpine Edition 🏔️ Precision engineered in Geneva with a hand-carved sapphire crystal bezel. Available exclusively in selected boutiques across Zurich & Paris.",
    hashtags: ["#LuxuryHorology", "#SwissMade", "#HauteHorlogerie", "#GenevaWatches", "#WatchCollector"],
    mediaUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80",
    agencyName: "Apex Agency Europe",
  };

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/posts/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: params.token, action: "approve" }),
      });

      if (res.ok) {
        setPostStatus("approved");
        // Trigger celebratory confetti effect
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionFeedback.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/posts/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: params.token,
          action: "reject",
          clientFeedback: revisionFeedback,
        }),
      });

      if (res.ok) {
        setPostStatus("rejected");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500 selection:text-white flex flex-col justify-between p-4 sm:p-6 md:p-10">
      
      {/* Header Bar */}
      <header className="max-w-3xl mx-auto w-full glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center text-white font-bold">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white">SocialPulse Client Approval</span>
            <span className="text-[10px] text-slate-400">1-Click Portal (No Login Required)</span>
          </div>
        </div>
        <span className="text-xs bg-slate-900 border border-slate-800 text-blue-400 font-bold px-3 py-1 rounded-full">
          Token Valid
        </span>
      </header>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto w-full my-8 space-y-6">
        
        {/* Banner Info */}
        <div className="glass-panel p-6 rounded-3xl border border-blue-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/30 space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            <Clock className="w-3.5 h-3.5" /> Action Required: Review & Approve Post
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            Scheduled Post Review for <span className="text-blue-400">{postData.clientName}</span>
          </h1>
          <p className="text-xs text-slate-400">
            Prepared by <strong className="text-slate-200">{postData.agencyName}</strong> • Scheduled for publishing on <strong className="text-white">{postData.scheduledTime}</strong>.
          </p>
        </div>

        {/* Post Card Visual Preview */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <span>Target Channels:</span>
              {postData.platforms.map((p) => (
                <span key={p} className="bg-slate-800 text-blue-400 px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase">
                  {p}
                </span>
              ))}
            </div>
            <span className="text-xs text-slate-400 font-mono">100% Mobile Ready</span>
          </div>

          {/* Media & Caption */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="aspect-square w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
              <img src={postData.mediaUrl} alt="Post content" className="w-full h-full object-cover" />
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-2">
                <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Caption & Copy:</label>
                <p className="text-slate-100 text-sm leading-relaxed whitespace-pre-line p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                  {postData.caption}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Hashtags:</label>
                <div className="flex flex-wrap gap-1">
                  {postData.hashtags.map((h) => (
                    <span key={h} className="text-blue-400 bg-slate-900 px-2 py-0.5 rounded text-[11px] font-mono">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Decision Actions */}
          <div className="pt-6 border-t border-slate-800">
            {postStatus === "pending" && (
              <div className="space-y-4">
                {!showRevisionForm ? (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleApprove}
                      disabled={isSubmitting}
                      className="flex-1 gradient-brand text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 text-sm hover:opacity-90 transition-all hover:scale-[1.02]"
                    >
                      <CheckCircle2 className="w-5 h-5" /> Approve Post for Publishing
                    </button>

                    <button
                      onClick={() => setShowRevisionForm(true)}
                      className="glass-panel text-slate-300 hover:text-white font-semibold py-4 px-6 rounded-2xl border border-slate-700/80 text-sm transition-all"
                    >
                      Request Revisions
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleRequestRevision} className="space-y-3 animate-in fade-in duration-200">
                    <label className="font-semibold text-xs text-slate-300">Describe requested changes for your agency:</label>
                    <textarea
                      rows={3}
                      value={revisionFeedback}
                      onChange={(e) => setRevisionFeedback(e.target.value)}
                      placeholder="e.g. Please update the watch model name or adjust hashtag list..."
                      className="w-full glass-input rounded-xl p-3 text-xs text-white"
                      required
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowRevisionForm(false)}
                        className="bg-slate-800 text-slate-300 font-bold px-4 py-2 rounded-xl text-xs"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5"
                      >
                        <Send className="w-4 h-4" /> Send Revision Request
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {postStatus === "approved" && (
              <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-center space-y-2 animate-in zoom-in-95 duration-300">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-xl font-bold text-white">Post Approved Successfully! 🎉</h3>
                <p className="text-xs text-emerald-300 max-w-md mx-auto">
                  Thank you! This post has been marked as <strong>Approved</strong> and will be automatically published by Blotato on <strong>{postData.scheduledTime}</strong>.
                </p>
              </div>
            )}

            {postStatus === "rejected" && (
              <div className="p-6 rounded-2xl bg-amber-950/40 border border-amber-500/50 text-center space-y-2 animate-in zoom-in-95 duration-300">
                <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
                <h3 className="text-xl font-bold text-white">Revision Request Sent</h3>
                <p className="text-xs text-amber-300 max-w-md mx-auto">
                  Your feedback has been delivered to <strong>{postData.agencyName}</strong>. They will update the post copy and send you an updated approval link soon.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-3xl mx-auto w-full text-center text-[11px] text-slate-500 py-4">
        Powered by SocialPulse SaaS Client Approvals Engine • 100% GDPR Compliant
      </footer>
    </div>
  );
}
