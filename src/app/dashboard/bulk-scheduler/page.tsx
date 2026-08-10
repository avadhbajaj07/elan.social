"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ClientProfile,
  BlotatoAccount,
  loadClientsFromStorage,
} from "@/lib/mockData";
import {
  FolderUp,
  Cloud,
  CheckCircle2,
  Calendar,
  Clock,
  Send,
  Upload,
  Trash2,
  Settings,
  Sparkles,
  Loader2,
  AlertCircle,
  Check,
  RefreshCw,
  Plus,
  ArrowRight,
  Hash,
  FileImage,
} from "lucide-react";

interface PosterItem {
  id: string;
  file: File;
  previewUrl: string;
  cloudinaryUrl?: string;
  status: "idle" | "uploading" | "uploaded" | "error" | "scheduled";
  errorMsg?: string;
  scheduledTime?: string;
}

interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  uploadPreset: string;
}

const STORAGE_KEY_CLOUDINARY = "elan_cloudinary_config_v1";

export default function BulkSchedulerPage() {
  // Clients & Blotato Accounts
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);
  const [blotatoAccounts, setBlotatoAccounts] = useState<BlotatoAccount[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [selectedAccounts, setSelectedAccounts] = useState<BlotatoAccount[]>([]);

  // Cloudinary Settings
  const [cloudinary, setCloudinary] = useState<CloudinaryConfig>({
    cloudName: "",
    apiKey: "",
    apiSecret: "",
    uploadPreset: "",
  });
  const [showConfig, setShowConfig] = useState(false);
  const [configSaved, setConfigSaved] = useState(false);

  // Posters & Queue
  const [posters, setPosters] = useState<PosterItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Scheduling Rules
  const [postTime, setPostTime] = useState("09:00"); // Default 9:00 AM as requested!
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1); // Start tomorrow
    return d.toISOString().slice(0, 10);
  });
  const [postsPerDay, setPostsPerDay] = useState(1);
  const [baseCaption, setBaseCaption] = useState(
    "Check out today's exclusive poster release! ✨ Follow for daily updates and insights."
  );
  const [hashtags, setHashtags] = useState<string[]>([
    "DailyPosters",
    "DesignInspiration",
    "SocialMediaAutomation",
  ]);
  const [newHashtag, setNewHashtag] = useState("");

  // Scheduling execution state
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleResult, setScheduleResult] = useState<{
    success: boolean;
    message: string;
    scheduledCount?: number;
    errors?: string[];
  } | null>(null);

  // Load clients & Cloudinary config on mount
  useEffect(() => {
    const savedClients = loadClientsFromStorage();
    setClients(savedClients);
    if (savedClients.length > 0) setSelectedClient(savedClients[0]);

    try {
      const savedConfig = localStorage.getItem(STORAGE_KEY_CLOUDINARY);
      if (savedConfig) setCloudinary(JSON.parse(savedConfig));
    } catch {
      /* silent */
    }
  }, []);

  // Save Cloudinary config
  const handleSaveCloudinary = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(STORAGE_KEY_CLOUDINARY, JSON.stringify(cloudinary));
      setConfigSaved(true);
      setTimeout(() => setConfigSaved(false), 3000);
      setShowConfig(false);
    } catch {
      /* silent */
    }
  };

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
      /* silent */
    } finally {
      setLoadingAccounts(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // When client changes, auto-select their accounts
  useEffect(() => {
    if (!blotatoAccounts.length) return;
    if (selectedClient) {
      const clientAccountIds = selectedClient.blotatoAccountIds || [];
      const matched = blotatoAccounts.filter((a) => clientAccountIds.includes(a.id));
      setSelectedAccounts(matched.length > 0 ? matched : blotatoAccounts);
    } else {
      setSelectedAccounts(blotatoAccounts);
    }
  }, [selectedClient, blotatoAccounts]);

  const toggleAccount = (acc: BlotatoAccount) => {
    setSelectedAccounts((prev) =>
      prev.find((a) => a.id === acc.id) ? prev.filter((a) => a.id !== acc.id) : [...prev, acc]
    );
  };

  // ── Handle poster file selection / folder drop ─────────────────────────────
  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newItems: PosterItem[] = [];

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        newItems.push({
          id: Math.random().toString(36).substring(2, 9),
          file,
          previewUrl: URL.createObjectURL(file),
          status: "idle",
        });
      }
    });

    setPosters((prev) => [...prev, ...newItems]);
  };

  const removePoster = (id: string) => {
    setPosters((prev) => prev.filter((p) => p.id !== id));
  };

  // ── Upload all posters to Cloudinary ──────────────────────────────────────
  const handleUploadAllToCloudinary = async () => {
    if (posters.length === 0) return;
    setIsUploading(true);
    setUploadProgress(0);

    const updatedPosters = [...posters];

    for (let i = 0; i < updatedPosters.length; i++) {
      const poster = updatedPosters[i];
      if (poster.status === "uploaded" && poster.cloudinaryUrl) continue;

      updatedPosters[i].status = "uploading";
      setPosters([...updatedPosters]);

      try {
        // Convert File to base64
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(poster.file);
        });

        const res = await fetch("/api/cloudinary/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: base64,
            cloudName: cloudinary.cloudName,
            apiKey: cloudinary.apiKey,
            apiSecret: cloudinary.apiSecret,
            uploadPreset: cloudinary.uploadPreset,
            folder: `elan-${selectedClient?.slug || "posters"}`,
          }),
        });

        const data = await res.json();

        if (data.success && data.url) {
          updatedPosters[i].cloudinaryUrl = data.url;
          updatedPosters[i].status = "uploaded";
        } else {
          updatedPosters[i].status = "error";
          updatedPosters[i].errorMsg = data.error || "Upload failed";
        }
      } catch (err: any) {
        updatedPosters[i].status = "error";
        updatedPosters[i].errorMsg = err.message || "Upload error";
      }

      setUploadProgress(Math.round(((i + 1) / updatedPosters.length) * 100));
      setPosters([...updatedPosters]);
    }

    setIsUploading(false);
  };

  // ── Auto-Generate Daily 9:00 AM Timestamps ────────────────────────────────
  const calculateScheduleTimestamps = (total: number): string[] => {
    const timestamps: string[] = [];
    const [hours, minutes] = postTime.split(":").map(Number);
    let currentDate = new Date(startDate);
    currentDate.setHours(hours, minutes, 0, 0);

    for (let i = 0; i < total; i++) {
      timestamps.push(currentDate.toISOString());
      // Increment day by 1 for 1 post per day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return timestamps;
  };

  // ── Dispatch Bulk Queue to Blotato ─────────────────────────────────────────
  const handleScheduleBulkQueue = async () => {
    if (posters.length === 0) return;
    if (selectedAccounts.length === 0) {
      setScheduleResult({
        success: false,
        message: "Please select at least one social account to post to.",
      });
      return;
    }

    // Ensure all posters have Cloudinary URLs
    const unuploaded = posters.filter((p) => !p.cloudinaryUrl);
    if (unuploaded.length > 0) {
      setScheduleResult({
        success: false,
        message: `Please upload all posters to Cloudinary first (${unuploaded.length} pending).`,
      });
      return;
    }

    setIsScheduling(true);
    setScheduleResult(null);

    const timestamps = calculateScheduleTimestamps(posters.length);
    const updatedPosters = [...posters];
    const errors: string[] = [];
    let scheduledCount = 0;

    const fullCaptionText =
      hashtags.length > 0
        ? `${baseCaption}\n\n${hashtags.map((h) => `#${h}`).join(" ")}`
        : baseCaption;

    // Dispatch each poster to Blotato API with daily 9:00 AM timestamp
    for (let i = 0; i < updatedPosters.length; i++) {
      const poster = updatedPosters[i];
      const scheduledIso = timestamps[i];
      updatedPosters[i].scheduledTime = scheduledIso;

      for (const acc of selectedAccounts) {
        try {
          const res = await fetch("/api/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              blotatoAccountIds: [acc.id],
              platform: acc.platform,
              caption: fullCaptionText,
              mediaUrls: [poster.cloudinaryUrl],
              postType: "single",
              publishNow: false,
              scheduledTime: scheduledIso,
            }),
          });

          const data = await res.json();
          if (data.success) {
            scheduledCount++;
            updatedPosters[i].status = "scheduled";
          } else {
            errors.push(
              `Poster #${i + 1} (${acc.username}): ${data.error || "Failed"}`
            );
          }
        } catch (err: any) {
          errors.push(`Poster #${i + 1} (${acc.username}): ${err.message}`);
        }
      }

      setPosters([...updatedPosters]);
    }

    if (scheduledCount > 0) {
      setScheduleResult({
        success: true,
        message: `🎉 Successfully scheduled ${posters.length} posters daily at ${postTime}!`,
        scheduledCount,
        errors: errors.length > 0 ? errors : undefined,
      });
    } else {
      setScheduleResult({
        success: false,
        message: "Failed to schedule bulk posters.",
        errors,
      });
    }

    setIsScheduling(false);
  };

  const addHashtag = () => {
    const clean = newHashtag.replace("#", "").trim();
    if (clean && !hashtags.includes(clean)) setHashtags([...hashtags, clean]);
    setNewHashtag("");
  };

  const isConfigured = Boolean(cloudinary.cloudName || cloudinary.uploadPreset);

  return (
    <div className="space-y-6 font-sans text-xs pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <FolderUp className="w-7 h-7 text-purple-600" />
            Bulk Poster Auto-Scheduler
          </h1>
          <p className="text-xs text-slate-500 font-bold mt-1">
            Upload your folder of posters to Cloudinary and auto-schedule them daily at 9:00 AM across all your accounts.
          </p>
        </div>

        <button
          onClick={() => setShowConfig(!showConfig)}
          className="bg-white border-2 border-slate-200 hover:border-purple-500 text-slate-800 font-black px-4 py-2.5 rounded-2xl shadow-sm transition-all flex items-center gap-2"
        >
          <Cloud className="w-4 h-4 text-purple-600" />
          <span>Cloudinary Settings</span>
          {isConfigured && (
            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Cloudinary configured" />
          )}
        </button>
      </div>

      {/* Cloudinary Settings Drawer */}
      {showConfig && (
        <form
          onSubmit={handleSaveCloudinary}
          className="bg-slate-900 text-white rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-800 animate-in fade-in duration-300"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-black text-sm text-white flex items-center gap-2">
              <Cloud className="w-4 h-4 text-purple-400" /> Connect Your Cloudinary Account
            </h2>
            <span className="text-[10px] text-slate-400 font-bold">
              Images upload directly to your Cloudinary CDN
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-300">Cloud Name *</label>
              <input
                type="text"
                value={cloudinary.cloudName}
                onChange={(e) => setCloudinary({ ...cloudinary, cloudName: e.target.value })}
                placeholder="e.g. dxy821k..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-300">Unsigned Upload Preset (Recommended)</label>
              <input
                type="text"
                value={cloudinary.uploadPreset}
                onChange={(e) => setCloudinary({ ...cloudinary, uploadPreset: e.target.value })}
                placeholder="e.g. ml_default or unsigned_preset"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-300">API Key (Optional for signed uploads)</label>
              <input
                type="text"
                value={cloudinary.apiKey}
                onChange={(e) => setCloudinary({ ...cloudinary, apiKey: e.target.value })}
                placeholder="Cloudinary API Key"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-300">API Secret (Optional)</label>
              <input
                type="password"
                value={cloudinary.apiSecret}
                onChange={(e) => setCloudinary({ ...cloudinary, apiSecret: e.target.value })}
                placeholder="Cloudinary API Secret"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[10px] text-slate-400 font-bold">
              Don't have Cloudinary? Create a free account at <a href="https://cloudinary.com" target="_blank" rel="noreferrer" className="text-purple-400 underline">cloudinary.com</a>
            </span>
            <button
              type="submit"
              className="bg-[#ccff00] text-slate-950 font-black px-5 py-2.5 rounded-xl hover:bg-white transition-all text-xs"
            >
              Save Credentials
            </button>
          </div>

          {configSaved && (
            <p className="text-xs font-black text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Cloudinary credentials saved!
            </p>
          )}
        </form>
      )}

      {/* Main Grid: Upload & Scheduler Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ─── LEFT COLUMN: Posters Folder Uploader (7 cols) ─── */}
        <div className="lg:col-span-7 space-y-5">

          {/* Step 1: Select Client & Accounts */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 shadow-sm space-y-3">
            <h2 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-950 text-[#ccff00] flex items-center justify-center text-xs font-black">1</span>
              Target Workspace & Accounts
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-600">Client Workspace</label>
                <select
                  value={selectedClient?.id || ""}
                  onChange={(e) => {
                    const c = clients.find((item) => item.id === e.target.value);
                    if (c) setSelectedClient(c);
                  }}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs font-black text-slate-900 outline-none"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      🏢 {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-600">Post To Accounts</label>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {blotatoAccounts.map((acc) => {
                    const isSelected = selectedAccounts.some((a) => a.id === acc.id);
                    return (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => toggleAccount(acc)}
                        className={`px-2.5 py-1 rounded-lg border text-[10px] font-black transition-all ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                            : "border-slate-200 bg-slate-50 text-slate-600"
                        }`}
                      >
                        {acc.username} {isSelected ? "✓" : ""}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Upload Posters Folder */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-950 text-[#ccff00] flex items-center justify-center text-xs font-black">2</span>
                Upload Posters Folder ({posters.length} Posters Selected)
              </h2>

              {posters.length > 0 && (
                <button
                  onClick={() => setPosters([])}
                  className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear All
                </button>
              )}
            </div>

            {/* Drag & Drop Upload Zone */}
            <div
              onClick={() => document.getElementById("poster-file-input")?.click()}
              className="border-2 border-dashed border-purple-300 hover:border-purple-600 bg-purple-50/50 rounded-2xl p-8 text-center cursor-pointer transition-all space-y-2 group"
            >
              <input
                id="poster-file-input"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs font-black text-slate-800">
                Click to Select Poster Folder / Multiple Files
              </p>
              <p className="text-[10px] text-slate-400 font-bold">
                Select 1 to 50 image posters at once (PNG, JPG, WebP)
              </p>
            </div>

            {/* Poster Grid List */}
            {posters.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-slate-600">
                    Posters Queue ({posters.filter((p) => p.status === "uploaded").length}/{posters.length} Uploaded to Cloudinary)
                  </span>

                  <button
                    type="button"
                    onClick={handleUploadAllToCloudinary}
                    disabled={isUploading || posters.every((p) => p.status === "uploaded")}
                    className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-black text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    {isUploading ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading ({uploadProgress}%)...</>
                    ) : posters.every((p) => p.status === "uploaded") ? (
                      <><CheckCircle2 className="w-3.5 h-3.5 text-[#ccff00]" /> All Uploaded to Cloudinary</>
                    ) : (
                      <><Cloud className="w-3.5 h-3.5" /> Upload All to Cloudinary CDN</>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-72 overflow-y-auto pr-1">
                  {posters.map((poster, index) => (
                    <div
                      key={poster.id}
                      className="relative group rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-50 flex flex-col items-center"
                    >
                      <img
                        src={poster.previewUrl}
                        alt={`Poster ${index + 1}`}
                        className="w-full h-24 object-cover"
                      />
                      <div className="w-full p-1 bg-slate-900 text-white text-[9px] font-black text-center truncate flex items-center justify-between px-1.5">
                        <span>#{index + 1}</span>
                        {poster.status === "uploaded" && <span className="text-emerald-400">✓ CDN</span>}
                        {poster.status === "uploading" && <span className="text-purple-300">Uploading...</span>}
                        {poster.status === "error" && <span className="text-red-400">Error</span>}
                      </div>
                      <button
                        onClick={() => removePoster(poster.id)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-900/80 text-white flex items-center justify-center text-[10px] hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── RIGHT COLUMN: Schedule Rules & Dispatch (5 cols) ─── */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 shadow-sm space-y-4">
            <h2 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-950 text-[#ccff00] flex items-center justify-center text-xs font-black">3</span>
              Daily Auto-Scheduler Rules
            </h2>

            {/* Posting Time (Default 9:00 AM) */}
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-purple-600" /> Daily Post Time (Default 9:00 AM)
              </label>
              <input
                type="time"
                value={postTime}
                onChange={(e) => setPostTime(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-black outline-none"
              />
            </div>

            {/* Start Date */}
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" /> Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-purple-500 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-bold outline-none"
              />
            </div>

            {/* Caption Template */}
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-700">Base Caption Template</label>
              <textarea
                rows={3}
                value={baseCaption}
                onChange={(e) => setBaseCaption(e.target.value)}
                placeholder="Base caption for all posters..."
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-purple-500 rounded-xl p-3 text-xs text-slate-900 outline-none leading-relaxed resize-none"
              />
            </div>

            {/* Hashtags */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-700 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-blue-500" /> Hashtags
              </label>
              <div className="flex flex-wrap gap-1">
                {hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => setHashtags(hashtags.filter((t) => t !== tag))}
                      className="text-blue-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={newHashtag}
                  onChange={(e) => setNewHashtag(e.target.value)}
                  placeholder="#hashtag"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addHashtag();
                    }
                  }}
                  className="flex-1 bg-slate-50 border-2 border-slate-200 focus:border-purple-500 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none"
                />
                <button
                  type="button"
                  onClick={addHashtag}
                  className="bg-slate-100 text-slate-800 text-xs font-black px-3 py-1.5 rounded-xl border border-slate-300"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Results Banner */}
            {scheduleResult && (
              <div
                className={`p-4 rounded-2xl border-2 text-xs font-black space-y-1 ${
                  scheduleResult.success
                    ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                    : "bg-red-50 border-red-300 text-red-700"
                }`}
              >
                <div className="flex items-start gap-2">
                  {scheduleResult.success ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  )}
                  {scheduleResult.message}
                </div>
              </div>
            )}

            {/* Action Submit */}
            <div className="pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={handleScheduleBulkQueue}
                disabled={isScheduling || posters.length === 0}
                className="w-full bg-slate-950 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-[#ccff00] font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 text-sm transition-all"
              >
                {isScheduling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Scheduling Queue...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" /> Schedule {posters.length} Posters (1/Day @ {postTime})
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
