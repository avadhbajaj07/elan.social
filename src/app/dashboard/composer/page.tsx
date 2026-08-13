"use client";

import { useState, useEffect } from "react";
import LivePreview, { ImageAspect, ImageFit, ImagePosition } from "@/components/composer/LivePreview";
import { ClientProfile, BlotatoAccount, loadClientsFromStorage } from "@/lib/mockData";
import {
  Send, Clock, Image as ImageIcon, Hash, CheckCircle2, Calendar as CalendarIcon,
  Loader2, AlertCircle, Check, RefreshCw, Plus, Trash2,
  GalleryHorizontal, Film, LayoutTemplate, MoveUp, MoveDown,
  MessageSquare, Zap, ChevronDown, ChevronUp, Info, Crop, Maximize, Sliders, Sparkles, MapPin,
} from "lucide-react";

// ─── Platform definitions ───────────────────────────────────────────────────
const PLATFORMS: Record<string, { icon: string; label: string; color: string; supportsCarousel: boolean; supportsVideo: boolean; supportsStory: boolean; supportsThread: boolean }> = {
  instagram: { icon: "📷", label: "Instagram", color: "bg-pink-50 text-pink-700 border-pink-200", supportsCarousel: true, supportsVideo: true, supportsStory: false, supportsThread: false },
  facebook:  { icon: "📘", label: "Facebook",  color: "bg-blue-50 text-blue-700 border-blue-200", supportsCarousel: true, supportsVideo: true, supportsStory: false, supportsThread: false },
  tiktok:    { icon: "🎵", label: "TikTok",    color: "bg-slate-100 text-slate-800 border-slate-300", supportsCarousel: false, supportsVideo: true, supportsStory: false, supportsThread: false },
  youtube:   { icon: "▶",  label: "YouTube",   color: "bg-red-50 text-red-700 border-red-200", supportsCarousel: false, supportsVideo: true, supportsStory: false, supportsThread: false },
  linkedin:  { icon: "💼", label: "LinkedIn",  color: "bg-indigo-50 text-indigo-700 border-indigo-200", supportsCarousel: true, supportsVideo: true, supportsStory: false, supportsThread: false },
  twitter:   { icon: "𝕏",  label: "X/Twitter", color: "bg-slate-100 text-slate-800 border-slate-300", supportsCarousel: true, supportsVideo: true, supportsStory: false, supportsThread: true },
  threads:   { icon: "🧵", label: "Threads",   color: "bg-slate-100 text-slate-800 border-slate-300", supportsCarousel: false, supportsVideo: true, supportsStory: false, supportsThread: true },
  bluesky:   { icon: "🦋", label: "Bluesky",   color: "bg-sky-50 text-sky-700 border-sky-200", supportsCarousel: false, supportsVideo: false, supportsStory: false, supportsThread: true },
  pinterest: { icon: "📌", label: "Pinterest", color: "bg-red-50 text-red-600 border-red-200", supportsCarousel: false, supportsVideo: true, supportsStory: false, supportsThread: false },
};

type PostType = "single" | "carousel" | "pdf_doc" | "video" | "story" | "text";
type ScheduleMode = "now" | "schedule" | "next_slot";

// ─── Thread post item ────────────────────────────────────────────────────────
interface ThreadPost { text: string; mediaUrls: string[] }

export default function PostComposerPage() {
  // Clients & Accounts
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);
  const [blotatoAccounts, setBlotatoAccounts] = useState<BlotatoAccount[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [selectedAccounts, setSelectedAccounts] = useState<BlotatoAccount[]>([]);

  // Post Content
  const [postType, setPostType] = useState<PostType>("single");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [newHashtag, setNewHashtag] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [carouselUrls, setCarouselUrls] = useState<string[]>(["", ""]);

  // Image Aspect Ratio & Framing Adjustments
  const [imageAspect, setImageAspect] = useState<ImageAspect>("4:5"); // Default to 4:5 Portrait (Instagram standard)
  const [imageFit, setImageFit] = useState<ImageFit>("contain"); // Default to contain to avoid cutting top text!
  const [imagePosition, setImagePosition] = useState<ImagePosition>("top"); // Default to top align

  // Platform-specific
  const [firstComment, setFirstComment] = useState(""); // Instagram first comment
  const [locationTag, setLocationTag] = useState(""); // Instagram Location Tag / Location ID
  const [threadPosts, setThreadPosts] = useState<ThreadPost[]>([{ text: "", mediaUrls: [] }]); // thread chain
  const [showAdvanced, setShowAdvanced] = useState(false);

  // TikTok Platform Elements
  const [tiktokPrivacy, setTiktokPrivacy] = useState<string>("PUBLIC_TO_EVERYONE");
  const [tiktokAllowComments, setTiktokAllowComments] = useState<boolean>(true);
  const [tiktokAllowDuet, setTiktokAllowDuet] = useState<boolean>(true);
  const [tiktokAllowStitch, setTiktokAllowStitch] = useState<boolean>(true);
  const [tiktokIsAiGenerated, setTiktokIsAiGenerated] = useState<boolean>(false);
  const [tiktokIsBrandedContent, setTiktokIsBrandedContent] = useState<boolean>(false);
  const [tiktokIsYourBrand, setTiktokIsYourBrand] = useState<boolean>(false);

  // YouTube Platform Options
  const [youtubeTitle, setYoutubeTitle] = useState("");
  const [youtubePrivacy, setYoutubePrivacy] = useState<string>("public");
  const [youtubeNotifySubscribers, setYoutubeNotifySubscribers] = useState<boolean>(true);
  const [youtubeMadeForKids, setYoutubeMadeForKids] = useState<boolean>(false);

  // Pinterest Platform Options
  const [pinterestBoardId, setPinterestBoardId] = useState("default");
  const [pinterestPinTitle, setPinterestPinTitle] = useState("");
  const [pinterestDestinationLink, setPinterestDestinationLink] = useState("");

  // LinkedIn Platform Options
  const [linkedinVisibility, setLinkedinVisibility] = useState<string>("PUBLIC");
  const [linkedinArticleLink, setLinkedinArticleLink] = useState("");
  const [linkedinPdfUrl, setLinkedinPdfUrl] = useState("");
  const [linkedinPdfName, setLinkedinPdfName] = useState("");
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);

  const handlePdfFileSelect = async (file: File) => {
    if (!file) return;
    setIsUploadingPdf(true);
    setLinkedinPdfName(file.name);

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch("/api/cloudinary/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64,
          folder: "linkedin-carousels-pdf",
          resourceType: "raw",
        }),
      });

      const data = await res.json();
      if (data.success && data.url) {
        setLinkedinPdfUrl(data.url);
      } else {
        alert(data.error || "Failed to upload PDF document.");
      }
    } catch (err: any) {
      alert(err.message || "PDF upload error.");
    } finally {
      setIsUploadingPdf(false);
    }
  };

  // Scheduling
  const [scheduleMode, setScheduleMode] = useState<ScheduleMode>("schedule");
  const [scheduledTime, setScheduledTime] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(10, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });

  // Submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; errors?: string[] } | null>(null);

  // ── Load clients from localStorage ──────────────────────────────────────
  useEffect(() => {
    const saved = loadClientsFromStorage();
    setClients(saved);
    if (saved.length > 0) setSelectedClient(saved[0]);
  }, []);

  // ── Fetch Blotato accounts ───────────────────────────────────────────────
  const fetchAccounts = async () => {
    setLoadingAccounts(true);
    try {
      const res = await fetch("/api/social-accounts", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.accounts)) setBlotatoAccounts(data.accounts);
    } catch { /* silent */ }
    finally { setLoadingAccounts(false); }
  };
  useEffect(() => { fetchAccounts(); }, []);

  // ── When client changes, auto-select their accounts ──────────────────────
  useEffect(() => {
    if (!blotatoAccounts.length) return;
    if (selectedClient) {
      const ids = selectedClient.blotatoAccountIds || [];
      const matched = blotatoAccounts.filter(a => ids.includes(a.id));
      if (matched.length > 0) {
        setSelectedAccounts(matched);
      } else {
        // Fallback: select active Blotato accounts so posting never fails due to stale IDs
        setSelectedAccounts(blotatoAccounts);
      }
    } else {
      setSelectedAccounts(blotatoAccounts);
    }
  }, [selectedClient, blotatoAccounts]);

  const toggleAccount = (acc: BlotatoAccount) => {
    setSelectedAccounts(prev =>
      prev.find(a => a.id === acc.id) ? prev.filter(a => a.id !== acc.id) : [...prev, acc]
    );
  };

  const addHashtag = () => {
    const tag = newHashtag.replace("#", "").trim();
    if (tag && !hashtags.includes(tag)) setHashtags([...hashtags, tag]);
    setNewHashtag("");
  };

  // ── Derive platform from selected accounts ───────────────────────────────
  const selectedPlatforms = Array.from(new Set(selectedAccounts.map(a => a.platform)));
  const supportsThread = selectedPlatforms.some(p => PLATFORMS[p]?.supportsThread);
  const hasInstagram = selectedPlatforms.includes("instagram");

  // ── Submit post ──────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccounts.length) { setResult({ success: false, message: "Select at least one account." }); return; }
    if (!caption.trim() && postType !== "carousel") { setResult({ success: false, message: "Caption is required." }); return; }
    if (postType === "carousel" && carouselUrls.filter(u => u.trim()).length < 2) { setResult({ success: false, message: "Carousel needs at least 2 image URLs." }); return; }

    setIsSubmitting(true);
    setResult(null);

    const finalCaption = hashtags.length > 0
      ? `${caption}\n\n${hashtags.map(h => `#${h}`).join(" ")}`
      : caption;

    let finalMediaUrls: string[] = [];
    if (postType === "carousel") finalMediaUrls = carouselUrls.filter(u => u.trim());
    else if (mediaUrl.trim()) finalMediaUrls = [mediaUrl.trim()];

    // Post to each account separately (each may have different platform)
    const allResults: any[] = [];
    const allErrors: string[] = [];

    for (const acc of selectedAccounts) {
      try {
        const payload: any = {
          blotatoAccountIds: [acc.id],
          platform: acc.platform,
          caption: finalCaption,
          mediaUrls: finalMediaUrls,
          postType,
          publishNow: scheduleMode === "now",
          useNextFreeSlot: scheduleMode === "next_slot",
          scheduledTime: scheduleMode === "schedule" ? scheduledTime : undefined,
        };

        // Thread posts (for Twitter/Bluesky/Threads)
        if (supportsThread && PLATFORMS[acc.platform]?.supportsThread && threadPosts.length > 0) {
          payload.additionalPosts = threadPosts.filter(p => p.text.trim()).map(p => ({
            text: p.text,
            mediaUrls: p.mediaUrls,
          }));
        }

        // First comment & Location (Instagram)
        if (acc.platform === "instagram") {
          if (firstComment.trim()) payload.firstCommentText = firstComment.trim();
          if (locationTag.trim()) payload.locationTag = locationTag.trim();
        }

        // TikTok elements
        if (acc.platform === "tiktok") {
          payload.privacyLevel = tiktokPrivacy;
          payload.disabledComments = !tiktokAllowComments;
          payload.disabledDuet = !tiktokAllowDuet;
          payload.disabledStitch = !tiktokAllowStitch;
          payload.isAiGenerated = tiktokIsAiGenerated;
          payload.isBrandedContent = tiktokIsBrandedContent;
          payload.isYourBrand = tiktokIsYourBrand;
        }

        // YouTube elements
        if (acc.platform === "youtube") {
          if (youtubeTitle.trim()) payload.youtubeTitle = youtubeTitle.trim();
          payload.privacyStatus = youtubePrivacy;
          payload.shouldNotifySubscribers = youtubeNotifySubscribers;
          payload.madeForKids = youtubeMadeForKids;
        }

        // Pinterest elements
        if (acc.platform === "pinterest") {
          payload.boardId = pinterestBoardId.trim() || "default";
          if (pinterestPinTitle.trim()) payload.pinTitle = pinterestPinTitle.trim();
          if (pinterestDestinationLink.trim()) payload.pinLink = pinterestDestinationLink.trim();
        }

        // LinkedIn & PDF elements
        if (linkedinPdfUrl.trim()) {
          payload.mediaUrls = [linkedinPdfUrl.trim()];
        }

        if (acc.platform === "linkedin") {
          payload.visibility = linkedinVisibility;
          if (linkedinArticleLink.trim()) payload.link = linkedinArticleLink.trim();
        }

        const res = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          allResults.push(...(data.results || []));
          if (data.errors && data.errors.length > 0) {
            allErrors.push(...data.errors);
          }
        } else {
          const detail = data.error || (data.errors && data.errors.join(", ")) || "Failed";
          allErrors.push(`${acc.username}: ${detail}`);
        }
      } catch (err: any) {
        allErrors.push(`${acc.username}: ${err.message}`);
      }
    }

    const successCount = allResults.filter(r => r.success).length;

    if (successCount > 0) {
      setResult({
        success: true,
        message: scheduleMode === "now"
          ? `✅ Published to ${successCount} account(s) successfully!`
          : scheduleMode === "next_slot"
          ? `✅ Added to next free slot for ${successCount} account(s)!`
          : `✅ Scheduled for ${successCount} account(s) on ${new Date(scheduledTime).toLocaleString("en-IN")}!`,
        errors: allErrors.length > 0 ? allErrors : undefined,
      });
      // Reset form
      setCaption(""); setHashtags([]); setMediaUrl("");
      setCarouselUrls(["", ""]); setFirstComment("");
      setThreadPosts([{ text: "", mediaUrls: [] }]);
    } else {
      setResult({ success: false, message: "All posts failed.", errors: allErrors });
    }
    setIsSubmitting(false);
  };

  // ── Preview platform ─────────────────────────────────────────────────────
  const [previewPlatform, setPreviewPlatform] = useState("instagram");
  useEffect(() => {
    if (selectedPlatforms.length > 0 && !selectedPlatforms.includes(previewPlatform)) {
      setPreviewPlatform(selectedPlatforms[0]);
    }
  }, [selectedPlatforms]);

  const clientAccounts = selectedClient
    ? blotatoAccounts.filter(a => (selectedClient.blotatoAccountIds || []).includes(a.id))
    : blotatoAccounts;

  return (
    <div className="space-y-6 font-sans pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900">Post Composer & Scheduler</h1>
        <p className="text-xs text-slate-500 font-bold mt-1">
          All Blotato features: 9 platforms · Carousel · Video · Threads · First Comment · Schedule / Next Slot / Post Now
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ─── LEFT COLUMN ─────────────────────────────────────────────────── */}
        <div className="lg:col-span-7 space-y-5">

          {/* STEP 1 — Select Client */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 shadow-sm space-y-3">
            <h2 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-950 text-[#ccff00] flex items-center justify-center text-xs font-black">1</span>
              Select Client
            </h2>
            {clients.length === 0 ? (
              <p className="text-xs text-slate-400 font-bold">No clients yet — add them in Clients page.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {clients.map(c => (
                  <button key={c.id} type="button" onClick={() => setSelectedClient(c)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-xs font-black transition-all text-left ${selectedClient?.id === c.id ? "border-purple-500 bg-purple-50 text-purple-800" : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"}`}>
                    <img src={c.logo} alt={c.name} className="w-6 h-6 rounded-lg object-cover shrink-0" />
                    <span className="truncate flex-1">{c.name}</span>
                    {selectedClient?.id === c.id && <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* STEP 2 — Select Accounts */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-950 text-[#ccff00] flex items-center justify-center text-xs font-black">2</span>
                Post To (Accounts)
              </h2>
              <button onClick={fetchAccounts} disabled={loadingAccounts} className="text-slate-400 hover:text-purple-600 transition-colors">
                <RefreshCw className={`w-3.5 h-3.5 ${loadingAccounts ? "animate-spin" : ""}`} />
              </button>
            </div>

            {loadingAccounts ? (
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading Blotato accounts...
              </div>
            ) : (clientAccounts.length === 0 ? blotatoAccounts : clientAccounts).length === 0 ? (
              <p className="text-xs text-slate-400 font-bold bg-slate-50 rounded-xl p-3 text-center">
                No accounts. <a href="https://my.blotato.com/login" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Connect on Blotato →</a>
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {(clientAccounts.length > 0 ? clientAccounts : blotatoAccounts).map(acc => {
                  const meta = PLATFORMS[acc.platform] || { icon: "📱", label: acc.platform, color: "bg-slate-50 text-slate-700 border-slate-200" };
                  const isSelected = selectedAccounts.some(a => a.id === acc.id);
                  return (
                    <button key={acc.id} type="button" onClick={() => toggleAccount(acc)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-[11px] font-black transition-all ${isSelected ? "border-emerald-500 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"}`}>
                      <span>{meta.icon}</span>
                      <div className="flex-1 text-left truncate">
                        <div className="truncate">{acc.username}</div>
                        <div className="text-[10px] font-bold opacity-60">{meta.label}</div>
                      </div>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${isSelected ? "bg-emerald-500" : "border-2 border-slate-300"}`}>
                        {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Selected platforms display */}
            {selectedPlatforms.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedPlatforms.map(p => {
                  const meta = PLATFORMS[p] || { icon: "📱", label: p, color: "bg-slate-100 text-slate-600 border-slate-200" };
                  return (
                    <span key={p} className={`text-[10px] font-black px-2 py-1 rounded-lg border ${meta.color}`}>
                      {meta.icon} {meta.label}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* STEP 3 — Compose Post */}
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border-2 border-slate-200 p-5 shadow-sm space-y-5">
            <h2 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-950 text-[#ccff00] flex items-center justify-center text-xs font-black">3</span>
              Compose Your Post
            </h2>

            {/* Post Type */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                <LayoutTemplate className="w-3.5 h-3.5 text-purple-500" /> Post Type
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {(["single", "carousel", "pdf_doc", "video", "story", "text"] as PostType[]).map(type => (
                  <button key={type} type="button" onClick={() => setPostType(type)}
                    className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 text-xs font-black transition-all capitalize ${postType === type ? "border-purple-500 bg-purple-50 text-purple-800" : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"}`}>
                    {type === "single" && <ImageIcon className="w-4 h-4" />}
                    {type === "carousel" && <GalleryHorizontal className="w-4 h-4" />}
                    {type === "pdf_doc" && <span className="text-base leading-none">📄</span>}
                    {type === "video" && <Film className="w-4 h-4" />}
                    {type === "story" && <Sparkles className="w-4 h-4 text-pink-500" />}
                    {type === "text" && <MessageSquare className="w-4 h-4" />}
                    {type === "single" ? "Image" : type === "pdf_doc" ? "PDF Slider 📄" : type === "story" ? "Story 📸" : type}
                  </button>
                ))}
              </div>
              {postType === "pdf_doc" && (
                <p className="text-[11px] bg-blue-50 border border-blue-200 text-blue-800 font-bold p-3 rounded-xl">
                  📄 <strong>PDF Carousel Slider:</strong> Upload your multi-page PDF document below. Each PDF page becomes a swipeable slide in LinkedIn's native carousel player! (Recommended size: 1080×1350px / 4:5).
                </p>
              )}
              {postType === "carousel" && (
                <div className="space-y-2">
                  <p className="text-[11px] bg-blue-50 border border-blue-200 text-blue-700 font-bold p-2.5 rounded-xl">
                    📷 <strong>Carousel (Instagram & Facebook):</strong> Add 2–10 image URLs for swipeable slides.
                  </p>
                  {selectedPlatforms.includes("linkedin") && (
                    <div className="text-[11px] bg-amber-50 border-2 border-amber-300 text-amber-900 font-black p-3 rounded-2xl space-y-1">
                      <p className="flex items-center gap-1.5 text-xs text-amber-950">
                        📄 <strong>LinkedIn Native Carousel Requirement:</strong>
                      </p>
                      <p className="font-medium text-[11px] leading-relaxed">
                        On LinkedIn, uploading multiple images posts them as a grid gallery. To post a <strong>true swipeable carousel on LinkedIn</strong>, click <strong>PDF Slider 📄</strong> above or upload your PDF document below!
                      </p>
                    </div>
                  )}
                </div>
              )}
              {postType === "video" && (
                <p className="text-[11px] bg-purple-50 border border-purple-200 text-purple-700 font-bold p-2.5 rounded-xl">
                  🎬 <strong>Video / Reel:</strong> Paste a direct .mp4 URL. Pre-encode audio/music into the video before uploading.
                </p>
              )}
              {postType === "story" && (
                <p className="text-[11px] bg-pink-50 border border-pink-200 text-pink-700 font-bold p-2.5 rounded-xl">
                  📸 <strong>Instagram Story:</strong> Upload an image or vertical video URL to publish directly to Instagram Stories!
                </p>
              )}
            </div>

            {/* Caption */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700">Caption {postType !== "text" ? "" : "(required)"}</label>
              <textarea rows={4} value={caption} onChange={e => setCaption(e.target.value)}
                placeholder="Write your post caption..."
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-purple-500 rounded-2xl p-4 text-xs text-slate-900 placeholder-slate-400 outline-none leading-relaxed resize-none transition-colors" />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>Characters: {caption.length}</span>
                {selectedPlatforms.includes("twitter") && <span className={caption.length > 280 ? "text-red-500" : ""}>Twitter limit: 280</span>}
              </div>
            </div>

            {/* Hashtags */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-blue-500" /> Hashtags
              </label>
              <div className="flex flex-wrap gap-1.5">
                {hashtags.map(tag => (
                  <span key={tag} className="bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1">
                    #{tag}
                    <button type="button" onClick={() => setHashtags(hashtags.filter(t => t !== tag))} className="text-blue-400 hover:text-red-500">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={newHashtag} onChange={e => setNewHashtag(e.target.value)}
                  placeholder="#hashtag"
                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addHashtag(); } }}
                  className="flex-1 bg-slate-50 border-2 border-slate-200 focus:border-purple-500 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none" />
                <button type="button" onClick={addHashtag}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black px-4 py-2 rounded-xl border-2 border-slate-200">
                  Add
                </button>
              </div>
            </div>

            {/* Single Image / Video URL */}
            {(postType === "single" || postType === "video") && (
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                  {postType === "video" ? <><Film className="w-3.5 h-3.5 text-purple-500" /> Video URL (.mp4)</> : <><ImageIcon className="w-3.5 h-3.5 text-emerald-500" /> Image URL</>}
                </label>
                <input type="url" value={mediaUrl} onChange={e => setMediaUrl(e.target.value)}
                  placeholder={postType === "video" ? "https://example.com/reel.mp4" : "https://images.unsplash.com/..."}
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none transition-colors" />
                {mediaUrl && postType === "single" && (
                  <img src={mediaUrl} alt="preview" className="w-full h-36 object-cover rounded-xl border border-slate-200 mt-1" onError={e => (e.currentTarget.style.display = "none")} />
                )}
              </div>
            )}

            {/* Carousel & PDF Manager */}
            {(postType === "carousel" || postType === "pdf_doc") && (
              <div className="space-y-4 bg-slate-50 border-2 border-slate-200 rounded-2xl p-4">
                {/* LinkedIn PDF Carousel Document Uploader */}
                <div className="bg-blue-50/80 border-2 border-blue-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-blue-950 flex items-center gap-1.5">
                      📄 LinkedIn PDF Carousel Document (Required for LinkedIn Sliders)
                    </label>
                    <span className="text-[10px] bg-blue-600 text-white font-black px-2 py-0.5 rounded-full">
                      PDF Slides
                    </span>
                  </div>

                  <input
                    id="carousel-main-pdf-input"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handlePdfFileSelect(file);
                    }}
                    className="hidden"
                  />

                  {isUploadingPdf ? (
                    <div className="flex items-center justify-center gap-2 text-xs font-bold text-blue-800 py-4 bg-white rounded-xl border border-blue-200">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      Uploading PDF document ({linkedinPdfName})...
                    </div>
                  ) : linkedinPdfUrl ? (
                    <div className="space-y-2 bg-white p-3 rounded-xl border-2 border-blue-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 truncate pr-2">
                          <span className="text-2xl">📄</span>
                          <div className="text-left truncate">
                            <p className="text-xs font-black text-blue-950 truncate">{linkedinPdfName || "CarouselPresentation.pdf"}</p>
                            <p className="text-[10px] font-bold text-emerald-600">✓ Ready to publish as LinkedIn Slider Carousel</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => { setLinkedinPdfUrl(""); setLinkedinPdfName(""); }}
                          className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 text-xs font-black px-2.5 py-1 rounded-lg transition-colors shrink-0"
                        >
                          Remove PDF
                        </button>
                      </div>
                      <input
                        type="url"
                        value={linkedinPdfUrl}
                        onChange={(e) => setLinkedinPdfUrl(e.target.value)}
                        placeholder="https://res.cloudinary.com/.../document.pdf"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[11px] text-slate-700 outline-none"
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() => document.getElementById("carousel-main-pdf-input")?.click()}
                      className="bg-white border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-xl p-5 text-center cursor-pointer transition-colors space-y-1.5 group"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto font-black text-lg group-hover:scale-110 transition-transform">
                        📄
                      </div>
                      <p className="text-xs font-black text-blue-950">
                        Click Here to Upload PDF Document for LinkedIn Carousel
                      </p>
                      <p className="text-[10px] text-slate-500 font-bold">
                        (Upload your multi-page PDF presentation file. Each page becomes a carousel slide on LinkedIn!)
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200 space-y-3">
                  <label className="text-xs font-black text-slate-700 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <GalleryHorizontal className="w-3.5 h-3.5 text-pink-500" /> Image Carousel Slides (Instagram & Facebook) ({carouselUrls.filter(u => u.trim()).length}/10)
                    </span>
                  </label>
                  <div className="space-y-2">
                    {carouselUrls.map((url, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="flex flex-col gap-1 pt-1">
                          <button type="button" disabled={idx === 0} onClick={() => { const a = [...carouselUrls]; [a[idx-1],a[idx]]=[a[idx],a[idx-1]]; setCarouselUrls(a); }} className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center disabled:opacity-30"><MoveUp className="w-3 h-3 text-slate-600" /></button>
                          <button type="button" disabled={idx === carouselUrls.length-1} onClick={() => { const a = [...carouselUrls]; [a[idx],a[idx+1]]=[a[idx+1],a[idx]]; setCarouselUrls(a); }} className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center disabled:opacity-30"><MoveDown className="w-3 h-3 text-slate-600" /></button>
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-black flex items-center justify-center shrink-0">{idx+1}</span>
                            <input type="url" value={url} onChange={e => { const a=[...carouselUrls]; a[idx]=e.target.value; setCarouselUrls(a); }}
                              placeholder={`Slide ${idx+1} image URL...`}
                              className="flex-1 bg-white border-2 border-slate-200 focus:border-pink-400 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none" />
                            <button type="button" disabled={carouselUrls.length <= 2} onClick={() => setCarouselUrls(carouselUrls.filter((_,i) => i !== idx))}
                              className="w-7 h-7 rounded-xl bg-red-50 hover:bg-red-100 flex items-center justify-center disabled:opacity-30 shrink-0">
                              <Trash2 className="w-3.5 h-3.5 text-red-500" />
                            </button>
                          </div>
                          {url.trim() && <img src={url} alt={`slide ${idx+1}`} className="w-full h-20 object-cover rounded-lg border border-slate-200" onError={e => (e.currentTarget.style.display = "none")} />}
                        </div>
                      </div>
                    ))}
                  </div>
                  {carouselUrls.length < 10 && (
                    <button type="button" onClick={() => setCarouselUrls([...carouselUrls, ""])}
                      className="w-full py-2 rounded-xl border-2 border-dashed border-slate-300 hover:border-pink-400 text-xs font-black text-slate-500 hover:text-pink-600 flex items-center justify-center gap-1.5 transition-all">
                      <Plus className="w-3.5 h-3.5" /> Add Image Slide ({carouselUrls.length}/10)
                    </button>
                  )}

                  {carouselUrls.some(u => u.trim()) && (
                    <div className="flex gap-2 overflow-x-auto pb-1 pt-1">
                      {carouselUrls.filter(u => u.trim()).map((url, i) => (
                        <img key={i} src={url} alt="" className="w-14 h-14 object-cover rounded-lg border-2 border-slate-200 shrink-0" onError={e => (e.currentTarget.style.display="none")} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Image Aspect Ratio & Framing Adjustments (Instagram Sizing & Crop Fix) */}
            {(postType === "single" || postType === "carousel") && (
              <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <Crop className="w-3.5 h-3.5 text-purple-600" /> Image Size, Aspect Ratio & Framing (Crop Fix)
                  </label>
                  <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                    Prevents Top Text Cut
                  </span>
                </div>

                {/* Aspect Ratio Selector */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-600">1. Instagram Aspect Ratio:</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { aspect: "4:5", label: "4:5 Portrait", desc: "Instagram Default" },
                      { aspect: "1:1", label: "1:1 Square", desc: "Classic Feed" },
                      { aspect: "1.91:1", label: "1.91:1 Landscape", desc: "Wide Banner" },
                      { aspect: "original", label: "Fit Original", desc: "Full Uncropped" },
                    ].map(({ aspect, label, desc }) => (
                      <button
                        key={aspect}
                        type="button"
                        onClick={() => setImageAspect(aspect as any)}
                        className={`flex flex-col items-center py-2 px-1 rounded-xl border-2 text-[10px] font-black transition-all ${
                          imageAspect === aspect
                            ? "border-purple-600 bg-purple-100 text-purple-900 shadow-sm"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <span>{label}</span>
                        <span className="text-[9px] font-normal opacity-75">{desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fit vs Cover Mode & Position */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-600">2. Fit Mode:</span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setImageFit("contain")}
                        className={`flex-1 py-1.5 rounded-lg border-2 text-[10px] font-black transition-all ${
                          imageFit === "contain"
                            ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                            : "border-slate-200 bg-white text-slate-600"
                        }`}
                      >
                        ✓ Fit Full (No Crop)
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageFit("cover")}
                        className={`flex-1 py-1.5 rounded-lg border-2 text-[10px] font-black transition-all ${
                          imageFit === "cover"
                            ? "border-purple-500 bg-purple-50 text-purple-800"
                            : "border-slate-200 bg-white text-slate-600"
                        }`}
                      >
                        Fill Box (Crop)
                      </button>
                    </div>
                  </div>

                  {/* Alignment Position Focus */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-600">3. Crop Focus Alignment:</span>
                    <div className="grid grid-cols-3 gap-1">
                      {[
                        { pos: "top", label: "Top (Header)" },
                        { pos: "center", label: "Center" },
                        { pos: "bottom", label: "Bottom" },
                      ].map(({ pos, label }) => (
                        <button
                          key={pos}
                          type="button"
                          onClick={() => setImagePosition(pos as any)}
                          className={`py-1.5 rounded-lg border-2 text-[9px] font-black transition-all truncate px-1 ${
                            imagePosition === pos
                              ? "border-blue-500 bg-blue-50 text-blue-800"
                              : "border-slate-200 bg-white text-slate-600"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Advanced / Platform-Specific Features ── */}
            <div className="border-t border-slate-100 pt-4">
              <button type="button" onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-xs font-black text-slate-600 hover:text-purple-700 transition-colors w-full">
                {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                Advanced / Platform Features
                <span className="ml-auto text-[10px] font-bold text-slate-400">Threads · First Comment · etc.</span>
              </button>
              {showAdvanced && (
                <div className="mt-4 space-y-4">
                  {/* TikTok Platform Options */}
                  <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-4 border border-slate-800">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-white flex items-center gap-1.5">
                        🎵 TikTok Post Controls & Settings
                      </label>
                      <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold">
                        All 7 Elements
                      </span>
                    </div>

                    {/* 1. Privacy Level */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-300">1. Who can view this video (Privacy):</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { value: "PUBLIC_TO_EVERYONE", label: "🌐 Everyone (Public)" },
                          { value: "MUTUAL_FOLLOW_FRIENDS", label: "👥 Friends Only" },
                          { value: "FOLLOWER_OF_CREATOR", label: "🔒 Followers Only" },
                          { value: "SELF_ONLY", label: "🔐 Private (Only Me)" },
                        ].map((item) => (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => setTiktokPrivacy(item.value)}
                            className={`py-1.5 px-2 rounded-xl border text-[10px] font-black transition-all text-left truncate ${
                              tiktokPrivacy === item.value
                                ? "border-[#ccff00] bg-slate-800 text-[#ccff00]"
                                : "border-slate-800 bg-slate-950 text-slate-400"
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 2. Interactive Permissions (Comments, Duet, Stitch) */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-300">2. Interaction Permissions:</span>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setTiktokAllowComments(!tiktokAllowComments)}
                          className={`py-1.5 px-2 rounded-xl border text-[10px] font-black transition-all ${
                            tiktokAllowComments
                              ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                              : "border-slate-800 bg-slate-950 text-slate-500"
                          }`}
                        >
                          {tiktokAllowComments ? "✓ Comments On" : "✕ Comments Off"}
                        </button>

                        <button
                          type="button"
                          onClick={() => setTiktokAllowDuet(!tiktokAllowDuet)}
                          className={`py-1.5 px-2 rounded-xl border text-[10px] font-black transition-all ${
                            tiktokAllowDuet
                              ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                              : "border-slate-800 bg-slate-950 text-slate-500"
                          }`}
                        >
                          {tiktokAllowDuet ? "✓ Duet On" : "✕ Duet Off"}
                        </button>

                        <button
                          type="button"
                          onClick={() => setTiktokAllowStitch(!tiktokAllowStitch)}
                          className={`py-1.5 px-2 rounded-xl border text-[10px] font-black transition-all ${
                            tiktokAllowStitch
                              ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                              : "border-slate-800 bg-slate-950 text-slate-500"
                          }`}
                        >
                          {tiktokAllowStitch ? "✓ Stitch On" : "✕ Stitch Off"}
                        </button>
                      </div>
                    </div>

                    {/* 3. Disclosure & Content Labels */}
                    <div className="space-y-2 pt-1 border-t border-slate-800">
                      <span className="text-[11px] font-bold text-slate-300">3. Content Disclosures & Labels:</span>

                      <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <div>
                          <p className="text-xs font-bold text-white">AI-Generated Content Label</p>
                          <p className="text-[10px] text-slate-400">Mark video as created with AI tools</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setTiktokIsAiGenerated(!tiktokIsAiGenerated)}
                          className={`w-10 h-6 rounded-full transition-colors relative p-0.5 ${
                            tiktokIsAiGenerated ? "bg-purple-600" : "bg-slate-800"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                            tiktokIsAiGenerated ? "translate-x-4" : "translate-x-0"
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <div>
                          <p className="text-xs font-bold text-white">Branded / Commercial Content</p>
                          <p className="text-[10px] text-slate-400">Disclose paid sponsorship or partnership</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setTiktokIsBrandedContent(!tiktokIsBrandedContent)}
                          className={`w-10 h-6 rounded-full transition-colors relative p-0.5 ${
                            tiktokIsBrandedContent ? "bg-purple-600" : "bg-slate-800"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                            tiktokIsBrandedContent ? "translate-x-4" : "translate-x-0"
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <div>
                          <p className="text-xs font-bold text-white">Your Own Brand Promotion</p>
                          <p className="text-[10px] text-slate-400">Promoting your own product/business</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setTiktokIsYourBrand(!tiktokIsYourBrand)}
                          className={`w-10 h-6 rounded-full transition-colors relative p-0.5 ${
                            tiktokIsYourBrand ? "bg-purple-600" : "bg-slate-800"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                            tiktokIsYourBrand ? "translate-x-4" : "translate-x-0"
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>
                  {hasInstagram && (
                    <div className="bg-pink-50 border border-pink-200 rounded-2xl p-4 space-y-3">
                      <label className="text-xs font-black text-pink-800 flex items-center gap-1.5">
                        📷 Instagram — Location Tagging & First Comment
                      </label>

                      {/* Location Tag */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-pink-700">📍 Location Tag / Location ID:</span>
                        <input
                          type="text"
                          value={locationTag}
                          onChange={(e) => setLocationTag(e.target.value)}
                          placeholder="e.g. Geneva, Switzerland or Location ID (213050307)"
                          className="w-full bg-white border-2 border-pink-200 focus:border-pink-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none transition-colors"
                        />
                      </div>

                      {/* First Comment */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-pink-700">💬 First Comment:</span>
                        <textarea rows={2} value={firstComment} onChange={e => setFirstComment(e.target.value)}
                          placeholder="e.g. #luxury #fashion #style #trending"
                          className="w-full bg-white border-2 border-pink-200 focus:border-pink-500 rounded-xl p-3 text-xs text-slate-900 outline-none resize-none transition-colors" />
                      </div>
                    </div>
                  )}

                  {/* YouTube Platform Options */}
                  {selectedPlatforms.includes("youtube") && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-3">
                      <label className="text-xs font-black text-red-900 flex items-center gap-1.5">
                        ▶ YouTube Video Settings
                      </label>
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-red-800">Video Title (Required by YouTube):</span>
                        <input
                          type="text"
                          value={youtubeTitle}
                          onChange={(e) => setYoutubeTitle(e.target.value)}
                          placeholder="e.g. Masterclass 2026 Tutorial"
                          className="w-full bg-white border-2 border-red-200 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-red-800">Privacy Status:</span>
                          <select
                            value={youtubePrivacy}
                            onChange={(e) => setYoutubePrivacy(e.target.value)}
                            className="w-full bg-white border-2 border-red-200 focus:border-red-500 rounded-xl px-3 py-2 text-xs font-black text-slate-900 outline-none"
                          >
                            <option value="public">🌐 Public</option>
                            <option value="unlisted">🔗 Unlisted</option>
                            <option value="private">🔒 Private</option>
                          </select>
                        </div>
                        <div className="flex flex-col justify-center space-y-1 pt-3">
                          <button
                            type="button"
                            onClick={() => setYoutubeNotifySubscribers(!youtubeNotifySubscribers)}
                            className={`py-2 px-3 rounded-xl border text-[10px] font-black transition-all ${
                              youtubeNotifySubscribers
                                ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                                : "border-slate-300 bg-white text-slate-500"
                            }`}
                          >
                            {youtubeNotifySubscribers ? "✓ Notify Subscribers" : "✕ Don't Notify"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pinterest Platform Options */}
                  {selectedPlatforms.includes("pinterest") && (
                    <div className="bg-red-50/70 border border-red-200 rounded-2xl p-4 space-y-3">
                      <label className="text-xs font-black text-red-900 flex items-center gap-1.5">
                        📌 Pinterest Pin Options
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-red-800">Board ID:</span>
                          <input
                            type="text"
                            value={pinterestBoardId}
                            onChange={(e) => setPinterestBoardId(e.target.value)}
                            placeholder="default or Board ID"
                            className="w-full bg-white border-2 border-red-200 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-red-800">Pin Title:</span>
                          <input
                            type="text"
                            value={pinterestPinTitle}
                            onChange={(e) => setPinterestPinTitle(e.target.value)}
                            placeholder="Pin Title"
                            className="w-full bg-white border-2 border-red-200 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-red-800">Destination Link URL:</span>
                        <input
                          type="url"
                          value={pinterestDestinationLink}
                          onChange={(e) => setPinterestDestinationLink(e.target.value)}
                          placeholder="https://yourwebsite.com/product"
                          className="w-full bg-white border-2 border-red-200 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* LinkedIn Platform Options */}
                  {selectedPlatforms.includes("linkedin") && (
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-3">
                      <label className="text-xs font-black text-blue-900 flex items-center gap-1.5">
                        💼 LinkedIn Options
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-blue-800">Post Visibility:</span>
                          <select
                            value={linkedinVisibility}
                            onChange={(e) => setLinkedinVisibility(e.target.value)}
                            className="w-full bg-white border-2 border-blue-200 focus:border-blue-500 rounded-xl px-3 py-2 text-xs font-black text-slate-900 outline-none"
                          >
                            <option value="PUBLIC">🌐 Anyone (Public)</option>
                            <option value="CONNECTIONS">👥 Connections Only</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-blue-800">Attach Article Link:</span>
                          <input
                            type="url"
                            value={linkedinArticleLink}
                            onChange={(e) => setLinkedinArticleLink(e.target.value)}
                            placeholder="https://blog.com/article"
                            className="w-full bg-white border-2 border-blue-200 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                          />
                        </div>
                      </div>

                      {/* PDF Carousel Document Uploader */}
                      <div className="space-y-2 pt-2 border-t border-blue-200">
                        <label className="text-xs font-black text-blue-950 flex items-center justify-between">
                          <span>📄 LinkedIn PDF Carousel Document (Slider)</span>
                          <span className="text-[10px] bg-blue-100 text-blue-800 font-extrabold px-2 py-0.5 rounded-full">
                            PDF Pages = Carousel Slides
                          </span>
                        </label>

                        <div className="bg-white border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-2xl p-4 text-center transition-colors">
                          <input
                            id="linkedin-pdf-input"
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handlePdfFileSelect(file);
                            }}
                            className="hidden"
                          />

                          {isUploadingPdf ? (
                            <div className="flex items-center justify-center gap-2 text-xs font-bold text-blue-700 py-3">
                              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                              Uploading PDF document ({linkedinPdfName})...
                            </div>
                          ) : linkedinPdfUrl ? (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between bg-blue-50 p-3 rounded-xl border border-blue-200">
                                <div className="flex items-center gap-2 truncate pr-2">
                                  <span className="text-xl">📄</span>
                                  <div className="text-left truncate">
                                    <p className="text-xs font-black text-blue-950 truncate">{linkedinPdfName || "CarouselPresentation.pdf"}</p>
                                    <p className="text-[10px] font-bold text-emerald-600">✓ Ready to publish as LinkedIn Slider Carousel</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => { setLinkedinPdfUrl(""); setLinkedinPdfName(""); }}
                                  className="bg-white text-red-600 border border-red-200 hover:bg-red-50 text-xs font-black px-2.5 py-1 rounded-lg transition-colors"
                                >
                                  Remove
                                </button>
                              </div>
                              <input
                                type="url"
                                value={linkedinPdfUrl}
                                onChange={(e) => setLinkedinPdfUrl(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-[11px] text-slate-700 outline-none"
                              />
                            </div>
                          ) : (
                            <div
                              onClick={() => document.getElementById("linkedin-pdf-input")?.click()}
                              className="cursor-pointer space-y-1.5 py-2 group"
                            >
                              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto font-black text-lg group-hover:scale-110 transition-transform">
                                📄
                              </div>
                              <p className="text-xs font-black text-blue-900">
                                Click to Select & Upload PDF Document for LinkedIn Carousel
                              </p>
                              <p className="text-[10px] text-slate-500 font-bold">
                                Upload your multi-page PDF presentation. LinkedIn will automatically render each page as a swipeable slide in its native document player!
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Thread/Twitter Thread Chaining */}
                  {supportsThread && (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                      <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                        🧵 Thread Chain (Twitter / Bluesky / Threads)
                      </label>
                      <p className="text-[11px] text-slate-500 font-bold">Add more posts chained after the first one to create a thread.</p>
                      {threadPosts.map((tp, idx) => (
                        <div key={idx} className="flex gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-300 text-slate-700 text-[10px] font-black flex items-center justify-center shrink-0 mt-2">{idx+2}</span>
                          <div className="flex-1 space-y-1">
                            <textarea rows={2} value={tp.text} onChange={e => { const a=[...threadPosts]; a[idx]={...a[idx], text: e.target.value}; setThreadPosts(a); }}
                              placeholder={`Thread post ${idx+2}...`}
                              className="w-full bg-white border-2 border-slate-200 focus:border-blue-400 rounded-xl p-3 text-xs text-slate-900 outline-none resize-none" />
                          </div>
                          <button type="button" onClick={() => setThreadPosts(threadPosts.filter((_,i) => i !== idx))}
                            className="w-7 h-7 rounded-xl bg-red-50 hover:bg-red-100 flex items-center justify-center shrink-0 mt-1.5">
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                          </button>
                        </div>
                      ))}
                      <button type="button" onClick={() => setThreadPosts([...threadPosts, { text: "", mediaUrls: [] }])}
                        className="w-full py-2 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-400 text-xs font-black text-slate-500 hover:text-blue-600 flex items-center justify-center gap-1.5">
                        <Plus className="w-3.5 h-3.5" /> Add Thread Post
                      </button>
                    </div>
                  )}

                  {/* Platforms info */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Platform Support Matrix</p>
                    <div className="space-y-1">
                      {selectedPlatforms.map(p => {
                        const meta = PLATFORMS[p];
                        if (!meta) return null;
                        return (
                          <div key={p} className="flex items-center gap-2 text-[11px]">
                            <span>{meta.icon}</span>
                            <span className="font-black text-slate-700 w-20">{meta.label}</span>
                            <div className="flex gap-1.5">
                              {meta.supportsCarousel && <span className="bg-blue-100 text-blue-700 font-black px-1.5 py-0.5 rounded text-[10px]">Carousel</span>}
                              {meta.supportsVideo && <span className="bg-purple-100 text-purple-700 font-black px-1.5 py-0.5 rounded text-[10px]">Video</span>}
                              {meta.supportsThread && <span className="bg-slate-200 text-slate-700 font-black px-1.5 py-0.5 rounded text-[10px]">Thread</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* STEP 4 — Schedule */}
            <div className="space-y-3 border-t border-slate-100 pt-5">
              <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                <CalendarIcon className="w-3.5 h-3.5 text-purple-500" /> When to Post
              </label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { mode: "now", icon: <Zap className="w-3.5 h-3.5" />, label: "Post Now", desc: "Publish immediately" },
                  { mode: "schedule", icon: <CalendarIcon className="w-3.5 h-3.5" />, label: "Schedule", desc: "Pick date & time" },
                  { mode: "next_slot", icon: <Clock className="w-3.5 h-3.5" />, label: "Next Slot", desc: "Auto best time" },
                ] as const).map(({ mode, icon, label, desc }) => (
                  <button key={mode} type="button" onClick={() => setScheduleMode(mode)}
                    className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 text-xs font-black transition-all ${scheduleMode === mode ? "border-purple-500 bg-purple-50 text-purple-800" : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"}`}>
                    {icon}
                    <span>{label}</span>
                    <span className="text-[9px] font-bold opacity-60">{desc}</span>
                  </button>
                ))}
              </div>

              {scheduleMode === "schedule" && (
                <input type="datetime-local" value={scheduledTime} onChange={e => setScheduledTime(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none" />
              )}
              {scheduleMode === "next_slot" && (
                <p className="text-[11px] bg-purple-50 border border-purple-200 text-purple-700 font-bold p-2.5 rounded-xl">
                  ⚡ <strong>Next Free Slot:</strong> Blotato will automatically pick the best next available time slot in your content calendar.
                </p>
              )}
            </div>

            {/* Result */}
            {result && (
              <div className={`p-4 rounded-2xl border-2 text-xs font-black space-y-2 ${result.success ? "bg-emerald-50 border-emerald-300 text-emerald-800" : "bg-red-50 border-red-300 text-red-700"}`}>
                <div className="flex items-start gap-2">
                  {result.success ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                  {result.message}
                </div>
                {result.errors && result.errors.length > 0 && (
                  <ul className="pl-6 space-y-0.5 text-[11px] opacity-80">
                    {result.errors.map((e, i) => <li key={i}>⚠ {e}</li>)}
                  </ul>
                )}
              </div>
            )}

            {/* Submit */}
            <div className="border-t border-slate-200 pt-4">
              <button type="submit" disabled={isSubmitting || selectedAccounts.length === 0}
                className="w-full bg-slate-950 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-[#ccff00] font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 text-sm transition-all">
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                ) : scheduleMode === "now" ? (
                  <><Send className="w-4 h-4" /> Publish Now → {selectedAccounts.length} Account{selectedAccounts.length !== 1 ? "s" : ""}</>
                ) : scheduleMode === "next_slot" ? (
                  <><Clock className="w-4 h-4" /> Add to Next Free Slot → {selectedAccounts.length} Account{selectedAccounts.length !== 1 ? "s" : ""}</>
                ) : (
                  <><CalendarIcon className="w-4 h-4" /> Schedule Post → {selectedAccounts.length} Account{selectedAccounts.length !== 1 ? "s" : ""}</>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ─── RIGHT COLUMN: Live Preview ───────────────────────────────────── */}
        <div className="lg:col-span-5 sticky top-6 self-start space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black text-slate-700">Live Preview:</span>
            <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 p-1 rounded-xl flex-wrap">
              {(selectedPlatforms.length > 0 ? selectedPlatforms : ["instagram"]).map(p => (
                <button key={p} onClick={() => setPreviewPlatform(p)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${previewPlatform === p ? "bg-slate-950 text-[#ccff00] shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>
                  {PLATFORMS[p]?.icon || "📱"} {p}
                </button>
              ))}
            </div>
          </div>

          <LivePreview
            caption={caption || "Your caption will appear here..."}
            hashtags={hashtags}
            mediaUrl={postType === "carousel"
              ? (carouselUrls.find(u => u.trim()) || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80")
              : (mediaUrl || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80")
            }
            activePlatform={previewPlatform as any}
            clientName={selectedClient?.name || "Your Client"}
            clientHandle={`@${(selectedClient?.name || "client").toLowerCase().replace(/[^a-z0-9]/g, "_")}`}
            clientAvatar={selectedClient?.avatar_url || selectedClient?.logo || ""}
            imageAspect={imageAspect}
            imageFit={imageFit}
            imagePosition={imagePosition}
          />

          {/* Blotato supported platforms */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3">All 9 Supported Platforms</p>
            <div className="grid grid-cols-3 gap-1.5">
              {Object.entries(PLATFORMS).map(([key, meta]) => (
                <div key={key} className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-[10px] font-black ${meta.color}`}>
                  <span>{meta.icon}</span>
                  <span className="truncate">{meta.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
