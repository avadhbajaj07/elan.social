"use client";

import { useState } from "react";
import { Sparkles, Video, Play, FileText, Download, Send } from "lucide-react";

export default function AIStudioPage() {
  const [topic, setTopic] = useState("Swiss Luxury Watch Craftsmanship & Precision");
  const [templateStyle, setTemplateStyle] = useState<"faceless_reels" | "quote_card" | "slideshow">("faceless_reels");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<any>(null);

  const handleGenerateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;

    setIsGenerating(true);
    try {
      const res = await fetch("/api/content/video-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, style: templateStyle }),
      });

      const data = await res.json();
      setGeneratedVideo(data);
    } catch (err) {
      console.error("Template generation error", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-400" /> AI Video & Slide Template Studio
        </h1>
        <p className="text-xs text-slate-400">
          Auto-generate viral TikTok/Reels slideshows, quote cards, and faceless short videos via Blotato Template Engine.
        </p>
      </div>

      {/* Main Generator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Options Form (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-purple-500/30 bg-purple-950/20 space-y-6">
          <form onSubmit={handleGenerateTemplate} className="space-y-5 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-200 block">Video / Slide Topic Prompt:</label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. 5 Geneva Horology Secrets or Top 3 French Wines for Dinner"
                className="w-full glass-input rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-2">
              <label className="font-bold text-slate-200 block">Select Blotato Template Style:</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setTemplateStyle("faceless_reels")}
                  className={`p-3.5 rounded-2xl border text-left space-y-1 transition-all ${
                    templateStyle === "faceless_reels"
                      ? "bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-500/20"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <Video className="w-5 h-5" />
                  <p className="font-bold">Faceless Reel</p>
                  <p className="text-[10px] opacity-80">9:16 Short Video</p>
                </button>

                <button
                  type="button"
                  onClick={() => setTemplateStyle("quote_card")}
                  className={`p-3.5 rounded-2xl border text-left space-y-1 transition-all ${
                    templateStyle === "quote_card"
                      ? "bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-500/20"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  <p className="font-bold">Quote Card</p>
                  <p className="text-[10px] opacity-80">Minimalist Graphic</p>
                </button>

                <button
                  type="button"
                  onClick={() => setTemplateStyle("slideshow")}
                  className={`p-3.5 rounded-2xl border text-left space-y-1 transition-all ${
                    templateStyle === "slideshow"
                      ? "bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-500/20"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <Sparkles className="w-5 h-5" />
                  <p className="font-bold">Slideshow</p>
                  <p className="text-[10px] opacity-80">Multi-Slide Carousel</p>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3.5 rounded-2xl shadow-xl shadow-purple-500/25 flex items-center justify-center gap-2 text-sm transition-all"
            >
              {isGenerating ? (
                <Sparkles className="w-5 h-5 animate-spin" />
              ) : (
                <Video className="w-5 h-5" />
              )}
              Generate Video Asset via Blotato API
            </button>
          </form>
        </div>

        {/* Right Output Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-xs font-bold text-slate-300">Generated Video Output Preview:</h2>

          <div className="glass-panel p-4 rounded-3xl border border-slate-800 space-y-4">
            {generatedVideo ? (
              <div className="space-y-3">
                <div className="relative aspect-[9/16] max-h-[380px] mx-auto rounded-2xl overflow-hidden border border-slate-700 bg-slate-900">
                  <img
                    src={generatedVideo.videoUrl || generatedVideo.thumbnailUrl}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg">
                      <Play className="w-6 h-6 ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1">
                  <p className="font-bold text-purple-300">Generated Caption:</p>
                  <p className="text-slate-300">{generatedVideo.caption}</p>
                </div>

                <div className="flex gap-2">
                  <a
                    href="/dashboard/composer"
                    className="flex-1 gradient-brand text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" /> Send to Composer
                  </a>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-xs text-slate-500 space-y-2">
                <Video className="w-10 h-10 mx-auto text-slate-600 animate-pulse" />
                <p>Fill out the topic prompt above to generate a viral video template.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
