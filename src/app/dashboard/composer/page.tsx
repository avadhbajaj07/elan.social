"use client";

import { useState, useEffect } from "react";
import PlatformSelector, { SocialPlatformKey } from "@/components/composer/PlatformSelector";
import LivePreview from "@/components/composer/LivePreview";
import {
  ClientProfile,
  BlotatoAccount,
  loadClientsFromStorage,
} from "@/lib/mockData";
import {
  Send,
  Clock,
  Image as ImageIcon,
  Hash,
  CheckCircle2,
  Calendar as CalendarIcon,
  Loader2,
  AlertCircle,
  Check,
  RefreshCw,
  Plus,
  Trash2,
  GalleryHorizontal,
  Film,
  LayoutTemplate,
  MoveUp,
  MoveDown,
} from "lucide-react";

const PLATFORM_ICONS: Record<string, string> = {
  instagram: "📷",
  facebook: "📘",
  tiktok: "🎵",
  youtube: "▶",
  linkedin: "💼",
  twitter: "𝕏",
};

export default function PostComposerPage() {
  // Clients & Accounts
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);
  const [blotatoAccounts, setBlotatoAccounts] = useState<BlotatoAccount[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);

  // Platform preview
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatformKey[]>(["instagram"]);
  const [activePreviewPlatform, setActivePreviewPlatform] = useState<SocialPlatformKey>("instagram");

  // Post content
  const [postType, setPostType] = useState<"single" | "carousel" | "video">("single");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [newHashtagInput, setNewHashtagInput] = useState("");
  // Single image / video
  const [mediaUrl, setMediaUrl] = useState("");
  // Carousel: multiple image URLs
  const [carouselUrls, setCarouselUrls] = useState<string[]>(["" , ""]);
  const [newCarouselUrl, setNewCarouselUrl] = useState("");

  const [scheduledTime, setScheduledTime] = useState(() => {
    // Default to tomorrow at 10am
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(10, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [postMode, setPostMode] = useState<"schedule" | "now">("schedule");

  // Submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  // Load clients from localStorage
  useEffect(() => {
    const saved = loadClientsFromStorage();
    setClients(saved);
    if (saved.length > 0) setSelectedClient(saved[0]);
  }, []);

  // Fetch Blotato accounts
  const fetchAccounts = async () => {
    setLoadingAccounts(true);
    try {
      const res = await fetch("/api/social-accounts", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.accounts)) {
        setBlotatoAccounts(data.accounts);
      }
    } catch {
      console.warn("Failed to load Blotato accounts");
    } finally {
      setLoadingAccounts(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // When client changes, auto-select their assigned accounts
  useEffect(() => {
    if (selectedClient && blotatoAccounts.length > 0) {
      const clientAccountIds = selectedClient.blotatoAccountIds || [];
      setSelectedAccountIds(clientAccountIds);

      // Set platforms based on selected accounts
      const clientAccounts = blotatoAccounts.filter((a) => clientAccountIds.includes(a.id));
      const platforms = Array.from(new Set(clientAccounts.map((a) => a.platform as SocialPlatformKey)));
      if (platforms.length > 0) {
        setSelectedPlatforms(platforms);
        setActivePreviewPlatform(platforms[0]);
      }
    }
  }, [selectedClient, blotatoAccounts]);

  const toggleAccount = (accountId: string) => {
    const acc = blotatoAccounts.find((a) => a.id === accountId);
    if (!acc) return;

    setSelectedAccountIds((prev) => {
      const isSelected = prev.includes(accountId);
      const updated = isSelected ? prev.filter((id) => id !== accountId) : [...prev, accountId];

      // Update platforms list
      const updatedAccounts = blotatoAccounts.filter((a) => updated.includes(a.id));
      const platforms = Array.from(new Set(updatedAccounts.map((a) => a.platform as SocialPlatformKey)));
      if (platforms.length > 0) {
        setSelectedPlatforms(platforms);
        if (!platforms.includes(activePreviewPlatform)) setActivePreviewPlatform(platforms[0]);
      }

      return updated;
    });
  };

  const handleAddHashtag = () => {
    if (newHashtagInput.trim()) {
      const cleanTag = newHashtagInput.replace("#", "").trim();
      if (!hashtags.includes(cleanTag)) setHashtags([...hashtags, cleanTag]);
      setNewHashtagInput("");
    }
  };

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAccountIds.length === 0) {
      setSubmitResult({ success: false, message: "Please select at least one social account to post to." });
      return;
    }
    if (!caption.trim()) {
      setSubmitResult({ success: false, message: "Please write a caption for your post." });
      return;
    }

    setIsSubmitting(true);
    setSubmitResult(null);

    const finalCaption = hashtags.length > 0
      ? `${caption}\n\n${hashtags.map((h) => `#${h}`).join(" ")}`
      : caption;

    // Build media URLs based on post type
    let finalMediaUrls: string[] = [];
    if (postType === "carousel") {
      finalMediaUrls = carouselUrls.filter((u) => u.trim() !== "");
      if (finalMediaUrls.length < 2) {
        setSubmitResult({ success: false, message: "Carousel needs at least 2 image URLs." });
        setIsSubmitting(false);
        return;
      }
    } else if (postType === "single" || postType === "video") {
      finalMediaUrls = mediaUrl ? [mediaUrl] : [];
    }

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: selectedClient?.id,
          clientName: selectedClient?.name,
          blotatoAccountIds: selectedAccountIds,
          caption: finalCaption,
          mediaUrls: finalMediaUrls,
          postType,
          platforms: selectedPlatforms,
          scheduledTime: postMode === "schedule" ? scheduledTime : new Date().toISOString(),
          publishNow: postMode === "now",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitResult({
          success: true,
          message: postMode === "now"
            ? `✅ Post published successfully to ${selectedAccountIds.length} account(s)!`
            : `✅ Post scheduled for ${new Date(scheduledTime).toLocaleString("en-IN")}!`,
        });
        // Reset form
        setCaption("");
        setHashtags([]);
        setMediaUrl("");
      } else {
        setSubmitResult({ success: false, message: data.error || "Failed to schedule post. Please try again." });
      }
    } catch (err) {
      setSubmitResult({ success: false, message: "Network error. Please check your connection." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get accounts for the selected client
  const clientAccounts = selectedClient
    ? blotatoAccounts.filter((a) => (selectedClient.blotatoAccountIds || []).includes(a.id))
    : blotatoAccounts; // If no client selected, show all accounts

  const hasNoClients = clients.length === 0;
  const hasNoAccounts = !loadingAccounts && blotatoAccounts.length === 0;

  return (
    <div className="space-y-6 font-sans pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900">Post Composer & Scheduler</h1>
        <p className="text-xs text-slate-500 font-bold mt-1">
          Write your post, pick the accounts, set a time — done.
        </p>
      </div>

      {/* Warning: no clients */}
      {hasNoClients && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-black text-amber-800 text-sm">No clients added yet</p>
            <p className="text-xs text-amber-600 font-bold mt-1">
              Go to <strong>Dashboard → Clients</strong> to add your clients and assign their social accounts first.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ─── LEFT COLUMN ─── */}
        <div className="lg:col-span-7 space-y-5">

          {/* Step 1: Pick Client */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-950 text-[#ccff00] flex items-center justify-center text-xs font-black">1</span>
                Select Client
              </h2>
            </div>

            {hasNoClients ? (
              <p className="text-xs text-slate-400 font-bold">No clients yet — add them in the Clients page.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {clients.map((client) => (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => setSelectedClient(client)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-xs font-black transition-all text-left ${
                      selectedClient?.id === client.id
                        ? "border-purple-500 bg-purple-50 text-purple-800"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <img
                      src={client.logo}
                      alt={client.name}
                      className="w-6 h-6 rounded-lg object-cover shrink-0"
                    />
                    <span className="truncate">{client.name}</span>
                    {selectedClient?.id === client.id && (
                      <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Step 2: Pick Social Accounts */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-950 text-[#ccff00] flex items-center justify-center text-xs font-black">2</span>
                Post To (Select Accounts)
              </h2>
              <button onClick={fetchAccounts} disabled={loadingAccounts} className="text-slate-400 hover:text-purple-600">
                <RefreshCw className={`w-3.5 h-3.5 ${loadingAccounts ? "animate-spin" : ""}`} />
              </button>
            </div>

            {loadingAccounts ? (
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold py-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading accounts...
              </div>
            ) : hasNoAccounts ? (
              <div className="text-xs text-slate-400 font-bold bg-slate-50 rounded-xl p-3 text-center">
                No Blotato accounts connected yet.{" "}
                <a href="https://my.blotato.com/login" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline font-black">
                  Connect on Blotato →
                </a>
              </div>
            ) : (
              <>
                <p className="text-[11px] text-slate-400 font-bold">
                  {selectedClient
                    ? `Showing accounts assigned to ${selectedClient.name}. Toggle to include/exclude.`
                    : "Select which accounts to post to:"}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {(clientAccounts.length > 0 ? clientAccounts : blotatoAccounts).map((acc) => {
                    const isSelected = selectedAccountIds.includes(acc.id);
                    return (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => toggleAccount(acc.id)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-[11px] font-black transition-all ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                            : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <span>{PLATFORM_ICONS[acc.platform] || "📱"}</span>
                        <span className="flex-1 truncate text-left">{acc.username}</span>
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${isSelected ? "bg-emerald-500" : "border-2 border-slate-300"}`}>
                          {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {selectedAccountIds.length === 0 && (
                  <p className="text-[11px] text-red-500 font-bold">⚠ Select at least one account</p>
                )}
              </>
            )}
          </div>

          {/* Step 3: Write Post */}
          <form onSubmit={handleSubmitPost} className="bg-white rounded-3xl border-2 border-slate-200 p-5 shadow-sm space-y-5">
            <h2 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-950 text-[#ccff00] flex items-center justify-center text-xs font-black">3</span>
              Write Your Post
            </h2>

            {/* Caption */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700">Caption *</label>
              <textarea
                rows={5}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write your post caption here..."
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-purple-500 rounded-2xl p-4 text-xs text-slate-900 placeholder-slate-400 outline-none leading-relaxed resize-none transition-colors"
                required
              />
              <p className="text-[10px] text-slate-400 font-bold text-right">{caption.length} characters</p>
            </div>

            {/* Hashtags */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-blue-500" /> Hashtags
              </label>
              <div className="flex flex-wrap gap-1.5">
                {hashtags.map((tag) => (
                  <span key={tag} className="bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1">
                    #{tag}
                    <button type="button" onClick={() => setHashtags(hashtags.filter((t) => t !== tag))} className="text-blue-400 hover:text-red-500 ml-0.5">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newHashtagInput}
                  onChange={(e) => setNewHashtagInput(e.target.value)}
                  placeholder="#hashtag"
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddHashtag(); } }}
                  className="flex-1 bg-slate-50 border-2 border-slate-200 focus:border-purple-500 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
                />
                <button type="button" onClick={handleAddHashtag} className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black px-4 py-2 rounded-xl border-2 border-slate-200 transition-all">
                  Add
                </button>
              </div>
            </div>

            {/* Post Type Selector */}
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                <LayoutTemplate className="w-3.5 h-3.5 text-purple-500" /> Post Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { type: "single", icon: <ImageIcon className="w-4 h-4" />, label: "Single Image" },
                  { type: "carousel", icon: <GalleryHorizontal className="w-4 h-4" />, label: "Carousel" },
                  { type: "video", icon: <Film className="w-4 h-4" />, label: "Video / Reel" },
                ].map(({ type, icon, label }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setPostType(type as any)}
                    className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 text-xs font-black transition-all ${
                      postType === type
                        ? "border-purple-500 bg-purple-50 text-purple-800"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {icon}
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              {/* Carousel tip */}
              {postType === "carousel" && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-[11px] text-blue-700 font-bold">
                  📷 <strong>Instagram Carousel:</strong> Add 2–10 image URLs. They'll appear as swipeable slides. Use publicly accessible image URLs (Unsplash, Cloudinary, your CDN, etc.)
                </div>
              )}
              {postType === "video" && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-[11px] text-purple-700 font-bold">
                  🎬 <strong>Video / Reel:</strong> Paste a direct video URL (.mp4). If your video already has music baked in, it will publish with that audio. Trending music must be added natively in the Instagram/TikTok app.
                </div>
              )}
            </div>

            {/* Single Image / Video URL */}
            {(postType === "single" || postType === "video") && (
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                  {postType === "video"
                    ? <><Film className="w-3.5 h-3.5 text-purple-500" /> Video URL (.mp4)</>
                    : <><ImageIcon className="w-3.5 h-3.5 text-emerald-500" /> Image URL (optional)</>
                  }
                </label>
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder={postType === "video" ? "https://example.com/reel.mp4" : "https://images.unsplash.com/..."}
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none transition-colors"
                />
                {mediaUrl && postType === "single" && (
                  <img src={mediaUrl} alt="preview" className="w-full h-40 object-cover rounded-xl border border-slate-200 mt-2" onError={(e) => (e.currentTarget.style.display = "none")} />
                )}
              </div>
            )}

            {/* Carousel Image Manager */}
            {postType === "carousel" && (
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                  <GalleryHorizontal className="w-3.5 h-3.5 text-pink-500" /> Carousel Slides ({carouselUrls.filter(u => u.trim()).length}/10)
                </label>

                <div className="space-y-2">
                  {carouselUrls.map((url, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="flex flex-col gap-1">
                        <button type="button" disabled={idx === 0} onClick={() => { const a = [...carouselUrls]; [a[idx-1], a[idx]] = [a[idx], a[idx-1]]; setCarouselUrls(a); }} className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center disabled:opacity-30 transition-all"><MoveUp className="w-3 h-3 text-slate-600" /></button>
                        <button type="button" disabled={idx === carouselUrls.length - 1} onClick={() => { const a = [...carouselUrls]; [a[idx], a[idx+1]] = [a[idx+1], a[idx]]; setCarouselUrls(a); }} className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center disabled:opacity-30 transition-all"><MoveDown className="w-3 h-3 text-slate-600" /></button>
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-black flex items-center justify-center shrink-0">{idx + 1}</span>
                          <input
                            type="url"
                            value={url}
                            onChange={(e) => { const a = [...carouselUrls]; a[idx] = e.target.value; setCarouselUrls(a); }}
                            placeholder={`Slide ${idx + 1} image URL...`}
                            className="flex-1 bg-slate-50 border-2 border-slate-200 focus:border-pink-400 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setCarouselUrls(carouselUrls.filter((_, i) => i !== idx))}
                            disabled={carouselUrls.length <= 2}
                            className="w-7 h-7 rounded-xl bg-red-50 hover:bg-red-100 flex items-center justify-center disabled:opacity-30 transition-all shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                          </button>
                        </div>
                        {url.trim() && (
                          <img src={url} alt={`slide ${idx + 1}`} className="w-full h-24 object-cover rounded-lg border border-slate-200" onError={(e) => (e.currentTarget.style.display = "none")} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {carouselUrls.length < 10 && (
                  <button
                    type="button"
                    onClick={() => setCarouselUrls([...carouselUrls, ""])}
                    className="w-full py-2 rounded-xl border-2 border-dashed border-slate-300 hover:border-pink-400 text-xs font-black text-slate-500 hover:text-pink-600 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Slide ({carouselUrls.length}/10)
                  </button>
                )}

                {/* Carousel strip preview */}
                {carouselUrls.some(u => u.trim()) && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {carouselUrls.filter(u => u.trim()).map((url, idx) => (
                      <img key={idx} src={url} alt={`slide ${idx+1}`} className="w-16 h-16 object-cover rounded-lg border-2 border-slate-200 shrink-0" onError={(e) => (e.currentTarget.style.display = "none")} />
                    ))}
                  </div>
                )}
              </div>
            )}


            {/* Schedule vs Post Now */}
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                <CalendarIcon className="w-3.5 h-3.5 text-purple-500" /> When to Post
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPostMode("schedule")}
                  className={`flex-1 py-2 rounded-xl text-xs font-black border-2 transition-all ${postMode === "schedule" ? "border-purple-500 bg-purple-50 text-purple-800" : "border-slate-200 bg-slate-50 text-slate-600"}`}
                >
                  📅 Schedule for Later
                </button>
                <button
                  type="button"
                  onClick={() => setPostMode("now")}
                  className={`flex-1 py-2 rounded-xl text-xs font-black border-2 transition-all ${postMode === "now" ? "border-emerald-500 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-slate-50 text-slate-600"}`}
                >
                  ⚡ Post Right Now
                </button>
              </div>

              {postMode === "schedule" && (
                <input
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none"
                  required={postMode === "schedule"}
                />
              )}
            </div>

            {/* Result Banner */}
            {submitResult && (
              <div className={`p-4 rounded-2xl border-2 text-xs font-black flex items-start gap-2 ${submitResult.success ? "bg-emerald-50 border-emerald-300 text-emerald-800" : "bg-red-50 border-red-300 text-red-700"}`}>
                {submitResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                {submitResult.message}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2 border-t border-slate-200">
              <button
                type="submit"
                disabled={isSubmitting || selectedAccountIds.length === 0}
                className="w-full bg-slate-950 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-[#ccff00] font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 text-sm transition-all"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                ) : postMode === "now" ? (
                  <><Send className="w-4 h-4" /> Publish Now to {selectedAccountIds.length} Account(s)</>
                ) : (
                  <><Clock className="w-4 h-4" /> Schedule Post for {selectedAccountIds.length} Account(s)</>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ─── RIGHT COLUMN: Live Preview ─── */}
        <div className="lg:col-span-5 space-y-4 sticky top-6 self-start">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black text-slate-700">Live Preview:</span>
            <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 p-1 rounded-xl">
              {selectedPlatforms.map((p) => (
                <button
                  key={p}
                  onClick={() => setActivePreviewPlatform(p)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${
                    activePreviewPlatform === p
                      ? "bg-slate-950 text-[#ccff00] shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <LivePreview
            caption={caption || "Your caption will appear here..."}
            hashtags={hashtags}
            mediaUrl={mediaUrl || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80"}
            activePlatform={activePreviewPlatform}
            clientName={selectedClient?.name || "Your Client"}
            clientHandle={`@${(selectedClient?.name || "client").toLowerCase().replace(/[^a-z0-9]/g, "_")}`}
            clientAvatar={selectedClient?.avatar_url || selectedClient?.logo || ""}
          />
        </div>
      </div>
    </div>
  );
}
