"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { INITIAL_CLIENTS, ClientProfile } from "@/lib/mockData";
import { Users, Plus, Globe, Mail, Building2, ChevronRight, Share2, Link as LinkIcon, Smartphone, Check, CheckCircle2, Sparkles } from "lucide-react";

function ClientsContent() {
  const searchParams = useSearchParams();
  const [clients, setClients] = useState<ClientProfile[]>(INITIAL_CLIENTS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Check URL search parameters for OAuth success
  useEffect(() => {
    const success = searchParams.get("success");
    const connected = searchParams.get("connected");
    const handle = searchParams.get("handle");

    if (success === "true" && connected) {
      setSuccessBanner(
        `🎉 Successfully Connected ${connected.toUpperCase()} Account ${handle || ""} to Workspace!`
      );
    }
  }, [searchParams]);

  // New Client Form State
  const [newName, setNewName] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const newClient: ClientProfile = {
      id: `client_${Date.now()}`,
      name: newName,
      slug: newName.toLowerCase().replace(/\s+/g, "-"),
      logo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      email: newEmail,
      timeZone: "America/New_York",
      connectedPlatforms: ["instagram", "tiktok", "facebook", "linkedin"],
      stats: {
        totalFollowers: 0,
        followerGrowth: 0,
        monthlyImpressions: 0,
        postsThisMonth: 0,
      },
    };

    setClients([...clients, newClient]);
    setShowAddModal(false);
    setNewName("");
    setNewEmail("");
  };

  const copyClientConnectLink = (slug: string) => {
    const siteUrl = window.location.origin;
    const connectUrl = `${siteUrl}/connect/${slug}`;
    navigator.clipboard.writeText(connectUrl);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 3000);
  };

  return (
    <div className="space-y-8 font-sans text-xs pb-12">
      {/* Success Notification Banner */}
      {successBanner && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-5 rounded-3xl shadow-xl flex items-center justify-between animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-black text-xl">
              <CheckCircle2 className="w-6 h-6 text-[#ccff00]" />
            </div>
            <div>
              <h4 className="text-base font-black">{successBanner}</h4>
              <p className="text-xs text-emerald-100 font-bold">
                Your social channel is authorized and active for automated post scheduling.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSuccessBanner(null)}
            className="bg-white/20 hover:bg-white/30 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-600" /> Client Workspaces & Brands
          </h1>
          <p className="text-xs text-slate-500 font-bold mt-1">
            Send isolated social media connection links to your clients. They connect Instagram directly without seeing Blotato or other clients' data.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-slate-950 text-[#ccff00] text-xs font-black px-5 py-3 rounded-2xl shadow-md flex items-center gap-1.5 hover:bg-black transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Client Workspace
        </button>
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => {
          return (
            <div
              key={client.id}
              className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-xl space-y-5 hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Client Profile Top */}
                <div className="flex items-center gap-3">
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                  />
                  <div className="flex flex-col">
                    <h3 className="text-base font-black text-slate-900 leading-tight">{client.name}</h3>
                    <p className="text-xs text-slate-500 font-bold">{client.slug}</p>
                  </div>
                </div>

                {/* Share Client Connect Link Button */}
                <div className="bg-purple-50 p-3.5 rounded-2xl border border-purple-200 space-y-2">
                  <p className="text-[11px] font-black text-purple-900 flex items-center gap-1">
                    <LinkIcon className="w-3.5 h-3.5 text-purple-600" /> Client Connection Link
                  </p>
                  <button
                    onClick={() => copyClientConnectLink(client.slug)}
                    className="w-full bg-slate-950 hover:bg-black text-[#ccff00] font-black text-xs py-2 rounded-xl transition-all shadow flex items-center justify-center gap-1.5"
                  >
                    {copiedSlug === client.slug ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" /> Link Copied! Send to Client
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4" /> Share Instagram Link With Client
                      </>
                    )}
                  </button>
                </div>

                {/* Direct Connect Buttons */}
                <div className="space-y-2 pt-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                    Direct In-App OAuth:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`/api/auth/connect/instagram?clientId=${client.id}`}
                      className="p-2 bg-pink-50 border border-pink-200 rounded-xl font-bold text-[11px] text-pink-700 text-center hover:bg-pink-100 flex items-center justify-center gap-1"
                    >
                      📷 Connect Instagram
                    </a>
                    <a
                      href={`/api/auth/connect/tiktok?clientId=${client.id}`}
                      className="p-2 bg-slate-100 border border-slate-200 rounded-xl font-bold text-[11px] text-slate-900 text-center hover:bg-slate-200 flex items-center justify-center gap-1"
                    >
                      🎵 Connect TikTok
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400 text-[11px]">Workspace Isolated</span>
                <span className="text-emerald-600 font-black flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Active & Connected
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg p-6 rounded-3xl border border-slate-200 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" /> Create Client Workspace
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Client / Brand Name:</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Geneva Fine Dining"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Client Contact Email:</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="client@brand.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-slate-950 text-[#ccff00] font-black py-3 rounded-xl shadow-md"
                >
                  Create Client Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ClientsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-500 font-bold">Loading client workspaces...</div>}>
      <ClientsContent />
    </Suspense>
  );
}
