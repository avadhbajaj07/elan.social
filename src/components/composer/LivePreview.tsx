"use client";

import { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Share2, ThumbsUp, MapPin, Globe, Star } from "lucide-react";
import { SocialPlatformKey } from "./PlatformSelector";

export type ImageAspect = "1:1" | "4:5" | "1.91:1" | "original";
export type ImageFit = "cover" | "contain";
export type ImagePosition = "center" | "top" | "bottom";

export interface LivePreviewProps {
  caption: string;
  hashtags: string[];
  mediaUrl: string;
  activePlatform: SocialPlatformKey;
  clientName: string;
  clientHandle: string;
  clientAvatar: string;
  imageAspect?: ImageAspect;
  imageFit?: ImageFit;
  imagePosition?: ImagePosition;
}

export default function LivePreview({
  caption,
  hashtags,
  mediaUrl,
  activePlatform,
  clientName,
  clientHandle,
  clientAvatar,
  imageAspect = "1:1",
  imageFit = "cover",
  imagePosition = "center",
}: LivePreviewProps) {
  const fullCaption = `${caption} ${hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`)).join(" ")}`;
  const displayMedia = mediaUrl || "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80";

  return (
    <div className="flex flex-col items-center">
      {/* Device Header Simulator */}
      <div className="w-full max-w-sm glass-panel rounded-3xl border border-slate-700/80 p-4 shadow-2xl bg-slate-950 text-white font-sans overflow-hidden">
        
        {/* Device Top Bar Notch */}
        <div className="flex items-center justify-between px-3 pb-3 border-b border-slate-800/80 text-[10px] text-slate-400 font-mono">
          <span>9:41</span>
          <div className="w-16 h-3 bg-slate-800 rounded-full" />
          <span>5G ⚡</span>
        </div>

        {/* Preview Platform Switcher */}
        <div className="py-2.5 px-1 border-b border-slate-800/60 flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-400">Live Preview:</span>
          <span className="bg-blue-600/30 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30 capitalize">
            {activePlatform}
          </span>
        </div>

        {/* Platform Specific Renderer */}
        <div className="py-3 max-h-[520px] overflow-y-auto pr-1">
          {activePlatform === "instagram" && (
            <InstagramPreview
              clientName={clientName}
              clientHandle={clientHandle}
              avatar={clientAvatar}
              mediaUrl={displayMedia}
              caption={fullCaption}
              aspect={imageAspect}
              fit={imageFit}
              position={imagePosition}
            />
          )}

          {activePlatform === "tiktok" && (
            <TikTokPreview
              clientHandle={clientHandle}
              avatar={clientAvatar}
              mediaUrl={displayMedia}
              caption={fullCaption}
              fit={imageFit}
              position={imagePosition}
            />
          )}

          {activePlatform === "linkedin" && (
            <LinkedInPreview
              clientName={clientName}
              avatar={clientAvatar}
              mediaUrl={displayMedia}
              caption={fullCaption}
              fit={imageFit}
              position={imagePosition}
            />
          )}

          {activePlatform === "facebook" && (
            <FacebookPreview
              clientName={clientName}
              avatar={clientAvatar}
              mediaUrl={displayMedia}
              caption={fullCaption}
              fit={imageFit}
              position={imagePosition}
            />
          )}

          {activePlatform === "gmb" && (
            <GMBPreview
              clientName={clientName}
              avatar={clientAvatar}
              mediaUrl={displayMedia}
              caption={fullCaption}
              fit={imageFit}
              position={imagePosition}
            />
          )}

          {["youtube", "threads", "bluesky", "pinterest", "twitter"].includes(activePlatform) && (
            <GenericPreview
              platform={activePlatform}
              clientName={clientName}
              clientHandle={clientHandle}
              avatar={clientAvatar}
              mediaUrl={displayMedia}
              caption={fullCaption}
              fit={imageFit}
              position={imagePosition}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// 1. Instagram Post Preview Component
function InstagramPreview({
  clientName,
  clientHandle,
  avatar,
  mediaUrl,
  caption,
  aspect = "1:1",
  fit = "cover",
  position = "center",
}: {
  clientName: string;
  clientHandle: string;
  avatar: string;
  mediaUrl: string;
  caption: string;
  aspect?: ImageAspect;
  fit?: ImageFit;
  position?: ImagePosition;
}) {
  const aspectClass =
    aspect === "4:5"
      ? "aspect-[4/5]"
      : aspect === "1.91:1"
      ? "aspect-[1.91/1]"
      : aspect === "original"
      ? "min-h-[220px] max-h-[420px]"
      : "aspect-square";

  const fitClass = fit === "contain" ? "object-contain" : "object-cover";
  const posClass = position === "top" ? "object-top" : position === "bottom" ? "object-bottom" : "object-center";

  return (
    <div className="space-y-3 bg-black text-white rounded-xl overflow-hidden p-2">
      {/* IG Header */}
      <div className="flex items-center justify-between px-2 py-1">
        <div className="flex items-center gap-2">
          <img src={avatar} alt={clientName} className="w-8 h-8 rounded-full border border-pink-500 object-cover" />
          <div className="flex flex-col">
            <span className="text-xs font-bold leading-tight">{clientHandle.replace("@", "")}</span>
            <span className="text-[10px] text-slate-400">Zurich, Switzerland</span>
          </div>
        </div>
        <MoreHorizontal className="w-4 h-4 text-slate-400" />
      </div>

      {/* Media Image Frame */}
      <div className={`relative w-full bg-slate-900 overflow-hidden rounded-lg ${aspectClass}`}>
        {/* Background blur for letterboxing if contained */}
        {fit === "contain" && (
          <div
            className="absolute inset-0 bg-cover bg-center filter blur-md opacity-30 scale-110"
            style={{ backgroundImage: `url(${mediaUrl})` }}
          />
        )}
        <img
          src={mediaUrl}
          alt="Post content"
          className={`relative z-10 w-full h-full ${fitClass} ${posClass}`}
        />
      </div>

      {/* Action Icons */}
      <div className="flex items-center justify-between px-2 text-white">
        <div className="flex items-center gap-3">
          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
          <MessageCircle className="w-5 h-5 text-white" />
          <Send className="w-5 h-5 text-white" />
        </div>
        <Bookmark className="w-5 h-5 text-white" />
      </div>

      {/* Likes & Caption */}
      <div className="px-2 space-y-1 text-xs">
        <p className="font-bold text-white">1,482 likes</p>
        <p className="text-slate-200 leading-relaxed text-[11px]">
          <span className="font-bold mr-1.5">{clientHandle.replace("@", "")}</span>
          {caption}
        </p>
        <p className="text-[9px] text-slate-500 uppercase tracking-wide">2 HOURS AGO</p>
      </div>
    </div>
  );
}

// 2. TikTok Reel Preview Component
function TikTokPreview({ clientHandle, avatar, mediaUrl, caption, fit = "cover", position = "center" }: any) {
  const fitClass = fit === "contain" ? "object-contain" : "object-cover";
  const posClass = position === "top" ? "object-top" : position === "bottom" ? "object-bottom" : "object-center";

  return (
    <div className="relative aspect-[9/16] w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
      {fit === "contain" && (
        <div className="absolute inset-0 bg-cover bg-center filter blur-md opacity-30 scale-110" style={{ backgroundImage: `url(${mediaUrl})` }} />
      )}
      <img src={mediaUrl} alt="TikTok video" className={`relative z-10 w-full h-full ${fitClass} ${posClass}`} />
      <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/20 via-transparent to-black/90 p-3 flex flex-col justify-between">
        <div className="flex justify-between items-center text-xs font-bold text-white">
          <span>Following | <strong className="text-white">For You</strong></span>
        </div>

        <div className="flex flex-col items-end gap-3 text-white">
          <div className="relative">
            <img src={avatar} className="w-9 h-9 rounded-full border-2 border-white object-cover" />
            <div className="w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center text-[10px] absolute -bottom-1 left-2.5 font-bold">+</div>
          </div>
          <div className="flex flex-col items-center">
            <Heart className="w-6 h-6 fill-red-500 text-red-500" />
            <span className="text-[10px] font-bold">24.5K</span>
          </div>
          <div className="flex flex-col items-center">
            <MessageCircle className="w-6 h-6 fill-white text-white" />
            <span className="text-[10px] font-bold">842</span>
          </div>
          <div className="flex flex-col items-center">
            <Bookmark className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] font-bold">3.1K</span>
          </div>
        </div>

        <div className="text-white space-y-1 pr-12">
          <p className="font-bold text-xs">{clientHandle}</p>
          <p className="text-[10px] text-slate-200 line-clamp-2">{caption}</p>
        </div>
      </div>
    </div>
  );
}

// 3. LinkedIn Post Preview Component
function LinkedInPreview({ clientName, avatar, mediaUrl, caption, fit = "cover", position = "center" }: any) {
  const fitClass = fit === "contain" ? "object-contain" : "object-cover";
  const posClass = position === "top" ? "object-top" : position === "bottom" ? "object-bottom" : "object-center";

  return (
    <div className="space-y-2.5 bg-slate-900 border border-slate-800 text-white rounded-xl p-3 text-xs">
      <div className="flex items-center gap-2">
        <img src={avatar} className="w-9 h-9 rounded-full object-cover" />
        <div className="flex flex-col">
          <span className="font-bold text-slate-100">{clientName}</span>
          <span className="text-[10px] text-slate-400">12,500 followers • 1h • 🌐</span>
        </div>
      </div>

      <p className="text-slate-200 text-[11px] leading-relaxed whitespace-pre-line">{caption}</p>

      <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
        {fit === "contain" && (
          <div className="absolute inset-0 bg-cover bg-center filter blur-md opacity-30" style={{ backgroundImage: `url(${mediaUrl})` }} />
        )}
        <img src={mediaUrl} className={`relative z-10 w-full h-48 ${fitClass} ${posClass}`} />
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-slate-400 text-[11px]">
        <button className="flex items-center gap-1 hover:text-blue-400">
          <ThumbsUp className="w-3.5 h-3.5" /> Like
        </button>
        <button className="flex items-center gap-1 hover:text-blue-400">
          <MessageCircle className="w-3.5 h-3.5" /> Comment
        </button>
        <button className="flex items-center gap-1 hover:text-blue-400">
          <Share2 className="w-3.5 h-3.5" /> Repost
        </button>
      </div>
    </div>
  );
}

// 4. Facebook Post Preview Component
function FacebookPreview({ clientName, avatar, mediaUrl, caption, fit = "cover", position = "center" }: any) {
  const fitClass = fit === "contain" ? "object-contain" : "object-cover";
  const posClass = position === "top" ? "object-top" : position === "bottom" ? "object-bottom" : "object-center";

  return (
    <div className="space-y-2.5 bg-slate-900 border border-slate-800 text-white rounded-xl p-3 text-xs">
      <div className="flex items-center gap-2">
        <img src={avatar} className="w-9 h-9 rounded-full object-cover" />
        <div className="flex flex-col">
          <span className="font-bold text-blue-400">{clientName}</span>
          <span className="text-[10px] text-slate-400">Sponsored • 🌎</span>
        </div>
      </div>

      <p className="text-slate-200 text-[11px] leading-relaxed">{caption}</p>

      <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
        {fit === "contain" && (
          <div className="absolute inset-0 bg-cover bg-center filter blur-md opacity-30" style={{ backgroundImage: `url(${mediaUrl})` }} />
        )}
        <img src={mediaUrl} className={`relative z-10 w-full h-48 ${fitClass} ${posClass}`} />
      </div>

      <div className="flex items-center justify-around pt-2 border-t border-slate-800 text-slate-400 text-[11px]">
        <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5 text-blue-500" /> Like</span>
        <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> Comment</span>
        <span className="flex items-center gap-1"><Share2 className="w-3.5 h-3.5" /> Share</span>
      </div>
    </div>
  );
}

// 5. Google Business Profile (GMB) Update Preview Component
function GMBPreview({ clientName, avatar, mediaUrl, caption, fit = "cover", position = "center" }: any) {
  const fitClass = fit === "contain" ? "object-contain" : "object-cover";
  const posClass = position === "top" ? "object-top" : position === "bottom" ? "object-bottom" : "object-center";

  return (
    <div className="space-y-2.5 bg-slate-900 border border-slate-800 text-white rounded-xl p-3 text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-red-500" />
          <span className="font-bold text-slate-200">{clientName}</span>
        </div>
        <div className="flex items-center text-amber-400 text-[10px]">
          <Star className="w-3 h-3 fill-amber-400" /> 4.9 (128)
        </div>
      </div>

      <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
        {fit === "contain" && (
          <div className="absolute inset-0 bg-cover bg-center filter blur-md opacity-30" style={{ backgroundImage: `url(${mediaUrl})` }} />
        )}
        <img src={mediaUrl} className={`relative z-10 w-full h-40 ${fitClass} ${posClass}`} />
      </div>

      <p className="text-slate-300 text-[11px] leading-relaxed">{caption}</p>

      <div className="pt-1">
        <button className="w-full bg-blue-600 text-white font-bold py-1.5 rounded-lg text-xs hover:bg-blue-500 transition-colors flex items-center justify-center gap-1">
          <Globe className="w-3.5 h-3.5" /> Call Now / Book Online
        </button>
      </div>
    </div>
  );
}

function GenericPreview({ platform, clientName, clientHandle, avatar, mediaUrl, caption, fit = "cover", position = "center" }: any) {
  const fitClass = fit === "contain" ? "object-contain" : "object-cover";
  const posClass = position === "top" ? "object-top" : position === "bottom" ? "object-bottom" : "object-center";

  return (
    <div className="space-y-2.5 bg-slate-900 border border-slate-800 text-white rounded-xl p-3 text-xs">
      <div className="flex items-center gap-2">
        <img src={avatar} className="w-8 h-8 rounded-full object-cover" />
        <div className="flex flex-col">
          <span className="font-bold text-slate-200">{clientName}</span>
          <span className="text-[10px] text-slate-400">{clientHandle}</span>
        </div>
      </div>

      <p className="text-slate-300 text-[11px] leading-relaxed">{caption}</p>

      <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
        {fit === "contain" && (
          <div className="absolute inset-0 bg-cover bg-center filter blur-md opacity-30" style={{ backgroundImage: `url(${mediaUrl})` }} />
        )}
        <img src={mediaUrl} className={`relative z-10 w-full h-44 ${fitClass} ${posClass}`} />
      </div>
    </div>
  );
}
