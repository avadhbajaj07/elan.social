"use client";

import { useState } from "react";
import PlatformSelector, { SocialPlatformKey } from "@/components/composer/PlatformSelector";
import LivePreview from "@/components/composer/LivePreview";
import { INITIAL_CLIENTS, ClientProfile } from "@/lib/mockData";
import {
  Send,
  Clock,
  Image as ImageIcon,
  Hash,
  CheckCircle2,
  Copy,
  ExternalLink,
  Calendar as CalendarIcon
} from "lucide-react";

export default function PostComposerPage() {
  const [selectedClient, setSelectedClient] = useState<ClientProfile>(INITIAL_CLIENTS[0]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatformKey[]>([
    "instagram",
    "linkedin",
    "tiktok",
  ]);
  const [activePreviewPlatform, setActivePreviewPlatform] = useState<SocialPlatformKey>("instagram");

  // Post State
  const [caption, setCaption] = useState(
    "Introducing the Royal Tourbillon Alpine Edition 🏔️ Precision engineered in Geneva with a hand-carved sapphire crystal bezel. Available exclusively in selected boutiques across Zurich & Paris."
  );
  const [hashtags, setHashtags] = useState<string[]>([
    "LuxuryHorology",
    "SwissMade",
    "HauteHorlogerie",
    "GenevaWatches",
    "WatchCollector",
  ]);
  const [newHashtagInput, setNewHashtagInput] = useState("");
  const [mediaUrl, setMediaUrl] = useState(
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80"
  );
  const [scheduledTime, setScheduledTime] = useState("2026-08-10T09:00");
  const [postStatus, setPostStatus] = useState<"pending_approval" | "approved" | "draft">("pending_approval");

  // Submission Result State
  const [createdApprovalUrl, setCreatedApprovalUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const togglePlatform = (p: SocialPlatformKey) => {
    if (selectedPlatforms.includes(p)) {
      if (selectedPlatforms.length > 1) {
        const updated = selectedPlatforms.filter((item) => item !== p);
        setSelectedPlatforms(updated);
        if (activePreviewPlatform === p) setActivePreviewPlatform(updated[0]);
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  const handleAddHashtag = () => {
    if (newHashtagInput.trim()) {
      const cleanTag = newHashtagInput.replace("#", "").trim();
      if (!hashtags.includes(cleanTag)) {
        setHashtags([...hashtags, cleanTag]);
      }
      setNewHashtagInput("");
    }
  };

  const handleRemoveHashtag = (tagToRemove: string) => {
    setHashtags(hashtags.filter((t) => t !== tagToRemove));
  };

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setCreatedApprovalUrl(null);

    try {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: selectedClient.name,
          clientEmail: selectedClient.email,
          platforms: selectedPlatforms,
          caption,
          hashtags,
          mediaUrls: [mediaUrl],
          scheduledTime,
          status: postStatus,
        }),
      });

      const data = await res.json();
      if (data.post?.approval_url) {
        setCreatedApprovalUrl(data.post.approval_url);
      } else {
        setCreatedApprovalUrl(`${window.location.origin}/approval/token-demo-123`);
      }
    } catch (err) {
      console.error("Failed to create post", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-metricool-dark">
            Multi-Platform Post Composer
          </h1>
          <p className="text-xs text-slate-500">
            Compose once, preview across live device frames, and generate 1-click client approval links.
          </p>
        </div>

        {/* Active Client Selector */}
        <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs shadow-sm">
          <span className="text-slate-500 font-semibold">Client:</span>
          <select
            value={selectedClient.id}
            onChange={(e) => {
              const target = INITIAL_CLIENTS.find((c) => c.id === e.target.value);
              if (target) setSelectedClient(target);
            }}
            className="bg-transparent text-metricool-dark font-bold focus:outline-none cursor-pointer"
          >
            {INITIAL_CLIENTS.map((c) => (
              <option key={c.id} value={c.id} className="bg-white text-metricool-dark">
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Composer Form (Left) & Real-time Live Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Target Platforms Picker */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <PlatformSelector
              selectedPlatforms={selectedPlatforms}
              onTogglePlatform={togglePlatform}
            />
          </div>

          {/* 2. Caption & Media Form */}
          <form onSubmit={handleSubmitPost} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            
            {/* Caption Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Post Caption Text:</label>
              <textarea
                rows={5}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write your post caption..."
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-4 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-metricool-dark leading-relaxed"
                required
              />
            </div>

            {/* Hashtag Manager */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-blue-600" /> Hashtags:
              </label>

              <div className="flex flex-wrap gap-1.5">
                {hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-slate-100 border border-slate-300 text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveHashtag(tag)}
                      className="text-slate-400 hover:text-red-600 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newHashtagInput}
                  onChange={(e) => setNewHashtagInput(e.target.value)}
                  placeholder="Add custom hashtag..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddHashtag();
                    }
                  }}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800"
                />
                <button
                  type="button"
                  onClick={handleAddHashtag}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-300"
                >
                  + Add
                </button>
              </div>
            </div>

            {/* Media Image URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-600" /> Media Image / Video URL:
              </label>
              <input
                type="url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900"
                required
              />
            </div>

            {/* Scheduling & Approval Status Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block flex items-center gap-1">
                  <CalendarIcon className="w-3.5 h-3.5 text-blue-600" /> Schedule Date & Time:
                </label>
                <input
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Approval Workflow:</label>
                <select
                  value={postStatus}
                  onChange={(e: any) => setPostStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl px-3.5 py-2 font-bold"
                >
                  <option value="pending_approval">Require 1-Click Client Approval Email</option>
                  <option value="approved">Pre-Approve (Direct Publish)</option>
                  <option value="draft">Save as Agency Draft</option>
                </select>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-metricool-dark hover:bg-black text-metricool-lime font-extrabold py-3.5 rounded-2xl shadow-xl flex items-center justify-center gap-2 text-sm transition-all"
              >
                <Send className="w-4 h-4" /> Schedule & Dispatch 1-Click Approval Link
              </button>
            </div>
          </form>

          {/* Generated 1-Click Approval Link Banner */}
          {createdApprovalUrl && (
            <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-300 space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-xs">
                <CheckCircle2 className="w-4 h-4" /> 1-Click Client Approval Link Generated!
              </div>

              <p className="text-slate-700 text-xs">
                An approval notification link has been generated for <strong className="text-slate-900">{selectedClient.email}</strong>:
              </p>

              <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-300 text-xs shadow-sm">
                <input
                  type="text"
                  readOnly
                  value={createdApprovalUrl}
                  className="flex-1 bg-transparent text-slate-800 font-mono text-[11px] focus:outline-none"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(createdApprovalUrl)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 border border-slate-300"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
                <a
                  href={createdApprovalUrl}
                  target="_blank"
                  className="bg-metricool-dark text-metricool-lime px-3 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" /> Open
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Right Preview Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-700">Preview Device Selector:</span>
            <div className="flex items-center gap-1 bg-slate-100 border border-slate-300 p-1 rounded-xl">
              {selectedPlatforms.map((p) => (
                <button
                  key={p}
                  onClick={() => setActivePreviewPlatform(p)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase transition-all ${
                    activePreviewPlatform === p
                      ? "bg-metricool-dark text-metricool-lime shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <LivePreview
            caption={caption}
            hashtags={hashtags}
            mediaUrl={mediaUrl}
            activePlatform={activePreviewPlatform}
            clientName={selectedClient.name}
            clientHandle={`@${selectedClient.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}`}
            clientAvatar={selectedClient.avatar_url || selectedClient.logo}
          />
        </div>
      </div>
    </div>
  );
}
