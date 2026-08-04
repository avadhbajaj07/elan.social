"use client";

import { Check } from "lucide-react";

export type SocialPlatformKey =
  | "instagram"
  | "tiktok"
  | "gmb"
  | "facebook"
  | "linkedin"
  | "youtube"
  | "threads"
  | "bluesky";

export interface PlatformConfig {
  key: SocialPlatformKey;
  label: string;
  color: string;
  iconBg: string;
  iconText: string;
}

export const ALL_PLATFORMS: PlatformConfig[] = [
  { key: "instagram", label: "Instagram", color: "from-purple-600 to-pink-500", iconBg: "bg-pink-500/20", iconText: "📷" },
  { key: "tiktok", label: "TikTok", color: "from-cyan-500 to-pink-500", iconBg: "bg-cyan-500/20", iconText: "🎵" },
  { key: "facebook", label: "Facebook", color: "from-blue-600 to-blue-800", iconBg: "bg-blue-600/20", iconText: "📘" },
  { key: "linkedin", label: "LinkedIn", color: "from-blue-700 to-indigo-800", iconBg: "bg-blue-700/20", iconText: "💼" },
  { key: "gmb", label: "Google Business", color: "from-red-500 to-yellow-500", iconBg: "bg-red-500/20", iconText: "📍" },
  { key: "youtube", label: "YouTube Shorts", color: "from-red-600 to-red-800", iconBg: "bg-red-600/20", iconText: "▶️" },
  { key: "threads", label: "Threads", color: "from-slate-700 to-slate-900", iconBg: "bg-slate-700/20", iconText: "🧵" },
  { key: "bluesky", label: "Bluesky", color: "from-sky-400 to-blue-600", iconBg: "bg-sky-400/20", iconText: "🦋" },
];

export interface PlatformSelectorProps {
  selectedPlatforms: SocialPlatformKey[];
  onTogglePlatform: (platform: SocialPlatformKey) => void;
}

export default function PlatformSelector({ selectedPlatforms, onTogglePlatform }: PlatformSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-slate-300 block">
        Select Target Platforms for Cross-Posting:
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {ALL_PLATFORMS.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform.key);

          return (
            <button
              key={platform.key}
              type="button"
              onClick={() => onTogglePlatform(platform.key)}
              className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${
                isSelected
                  ? "bg-slate-800/90 border-blue-500 text-white shadow-md shadow-blue-500/10"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{platform.iconText}</span>
                <span>{platform.label}</span>
              </div>
              <div
                className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                  isSelected ? "bg-blue-600 border-blue-500 text-white" : "border-slate-700 bg-slate-900"
                }`}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
