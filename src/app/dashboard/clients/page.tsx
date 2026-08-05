"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  ClientProfile,
  BlotatoAccount,
  loadClientsFromStorage,
  saveClientsToStorage,
} from "@/lib/mockData";
import {
  Users,
  Plus,
  Building2,
  Check,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Instagram,
  Link as LinkIcon,
  X,
  Loader2,
  AlertCircle,
  ExternalLink,
  Edit3,
} from "lucide-react";

const PLATFORM_ICONS: Record<string, string> = {
  instagram: "📷",
  facebook: "📘",
  tiktok: "🎵",
  youtube: "▶",
  linkedin: "💼",
  twitter: "𝕏",
};

const PLATFORM_COLORS: Record<string, string> = {
  instagram: "bg-pink-100 text-pink-700 border-pink-200",
  facebook: "bg-blue-100 text-blue-700 border-blue-200",
  tiktok: "bg-slate-100 text-slate-800 border-slate-300",
  youtube: "bg-red-100 text-red-700 border-red-200",
  linkedin: "bg-indigo-100 text-indigo-700 border-indigo-200",
  twitter: "bg-slate-100 text-slate-800 border-slate-300",
};

const TIMEZONES = [
  "Asia/Kolkata",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Dubai",
  "Asia/Singapore",
  "Australia/Sydney",
];

function ClientsContent() {
  const searchParams = useSearchParams();

  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [blotatoAccounts, setBlotatoAccounts] = useState<BlotatoAccount[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [accountsError, setAccountsError] = useState<string | null>(null);
  const [setupRequired, setSetupRequired] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientProfile | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formIndustry, setFormIndustry] = useState("");
  const [formTimezone, setFormTimezone] = useState("Asia/Kolkata");
  const [formNotes, setFormNotes] = useState("");
  const [formSelectedAccounts, setFormSelectedAccounts] = useState<string[]>([]);

  // Load clients from localStorage on mount
  useEffect(() => {
    const saved = loadClientsFromStorage();
    setClients(saved);
  }, []);

  // Fetch real Blotato accounts
  const fetchBlotatoAccounts = async () => {
    setLoadingAccounts(true);
    setAccountsError(null);
    try {
      const res = await fetch("/api/social-accounts", { cache: "no-store" });
      const data = await res.json();
      if (data.setup_required) {
        setSetupRequired(true);
      } else if (data.success && Array.isArray(data.accounts)) {
        setBlotatoAccounts(data.accounts);
        setSetupRequired(false);
      } else {
        setAccountsError(data.error || "Failed to load Blotato accounts");
      }
    } catch {
      setAccountsError("Network error loading accounts");
    } finally {
      setLoadingAccounts(false);
    }
  };

  useEffect(() => {
    fetchBlotatoAccounts();
  }, []);

  // Handle success URL params from OAuth
  useEffect(() => {
    const success = searchParams.get("success");
    const connected = searchParams.get("connected");
    if (success === "true" && connected) {
      setSuccessBanner(`✅ ${connected.toUpperCase()} account connected!`);
      setTimeout(() => setSuccessBanner(null), 5000);
    }
  }, [searchParams]);

  const persistClients = (updated: ClientProfile[]) => {
    setClients(updated);
    saveClientsToStorage(updated);
  };

  const openAddModal = () => {
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormIndustry("");
    setFormTimezone("Asia/Kolkata");
    setFormNotes("");
    setFormSelectedAccounts([]);
    setEditingClient(null);
    setShowAddModal(true);
  };

  const openEditModal = (client: ClientProfile) => {
    setFormName(client.name);
    setFormEmail(client.email || "");
    setFormPhone(client.phone || "");
    setFormIndustry(client.industry || "");
    setFormTimezone(client.timeZone);
    setFormNotes(client.notes || "");
    setFormSelectedAccounts(client.blotatoAccountIds || []);
    setEditingClient(client);
    setShowAddModal(true);
  };

  const toggleAccountSelection = (accountId: string) => {
    setFormSelectedAccounts((prev) =>
      prev.includes(accountId)
        ? prev.filter((id) => id !== accountId)
        : [...prev, accountId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) return;

    // Derive connected platforms from selected Blotato accounts
    const selectedAccObjs = blotatoAccounts.filter((a) =>
      formSelectedAccounts.includes(a.id)
    );
    const platforms = Array.from(
      new Set(selectedAccObjs.map((a) => a.platform as any))
    );

    if (editingClient) {
      // Edit existing
      const updated = clients.map((c) =>
        c.id === editingClient.id
          ? {
              ...c,
              name: formName,
              email: formEmail,
              phone: formPhone,
              industry: formIndustry,
              timeZone: formTimezone,
              notes: formNotes,
              blotatoAccountIds: formSelectedAccounts,
              connectedPlatforms: platforms,
              slug: formName.toLowerCase().replace(/\s+/g, "-"),
            }
          : c
      );
      persistClients(updated);
      setSuccessBanner(`✅ ${formName} updated successfully!`);
    } else {
      // Create new
      const newClient: ClientProfile = {
        id: `client_${Date.now()}`,
        name: formName,
        slug: formName.toLowerCase().replace(/\s+/g, "-"),
        logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(formName)}&background=6366f1&color=fff&bold=true&size=128`,
        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(formName)}&background=6366f1&color=fff&bold=true&size=128`,
        email: formEmail,
        phone: formPhone,
        industry: formIndustry,
        timeZone: formTimezone,
        notes: formNotes,
        blotatoAccountIds: formSelectedAccounts,
        connectedPlatforms: platforms,
        stats: {
          totalFollowers: 0,
          followerGrowth: 0,
          monthlyImpressions: 0,
          postsThisMonth: 0,
        },
        createdAt: new Date().toISOString(),
      };
      persistClients([...clients, newClient]);
      setSuccessBanner(`🎉 ${formName} workspace created!`);
    }

    setShowAddModal(false);
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  const handleDelete = (clientId: string) => {
    const updated = clients.filter((c) => c.id !== clientId);
    persistClients(updated);
    setDeleteConfirm(null);
    setSuccessBanner("Client workspace removed.");
    setTimeout(() => setSuccessBanner(null), 3000);
  };

  // Get Blotato account objects for a client
  const getClientAccounts = (client: ClientProfile) =>
    blotatoAccounts.filter((a) => (client.blotatoAccountIds || []).includes(a.id));

  return (
    <div className="space-y-8 font-sans pb-16">
      {/* Success Banner */}
      {successBanner && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in duration-300">
          <span className="font-black text-sm">{successBanner}</span>
          <button
            onClick={() => setSuccessBanner(null)}
            className="ml-4 text-white/70 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
            <Users className="w-7 h-7 text-purple-600" /> Client Workspaces
          </h1>
          <p className="text-xs text-slate-500 font-bold mt-1">
            Manage all your clients and their connected social accounts in one place.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-slate-950 text-[#ccff00] text-xs font-black px-5 py-3 rounded-2xl shadow-md flex items-center gap-1.5 hover:bg-black transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Client
        </button>
      </div>

      {/* Blotato Accounts Panel */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white text-xs font-black">B</span>
              Your Blotato Connected Accounts
            </h2>
            <p className="text-[11px] text-slate-500 font-bold mt-0.5">
              Assign these accounts to clients when creating workspaces.
            </p>
          </div>
          <button
            onClick={fetchBlotatoAccounts}
            disabled={loadingAccounts}
            className="text-slate-400 hover:text-purple-600 transition-colors"
            title="Refresh accounts"
          >
            <RefreshCw className={`w-4 h-4 ${loadingAccounts ? "animate-spin text-purple-600" : ""}`} />
          </button>
        </div>

        {loadingAccounts ? (
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold py-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading from Blotato...
          </div>
        ) : setupRequired ? (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-black text-amber-800 text-xs">Blotato API Key Missing</p>
              <p className="text-[11px] text-amber-600 font-bold mt-1">
                Add your <code className="bg-amber-100 px-1 rounded font-mono">BLOTATO_API_KEY</code> to your environment variables.
              </p>
              <a
                href="https://my.blotato.com/login"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-[11px] font-black text-amber-700 hover:underline"
              >
                Get API Key from Blotato <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ) : accountsError ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-xs text-red-600 font-bold">
            {accountsError}
          </div>
        ) : blotatoAccounts.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl p-4 text-center">
            <p className="text-xs font-black text-slate-500">No accounts connected on Blotato yet.</p>
            <a
              href="https://my.blotato.com/login"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-black text-purple-600 hover:underline"
            >
              Connect accounts on Blotato <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {blotatoAccounts.map((acc) => (
              <div
                key={acc.id}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-black ${
                  PLATFORM_COLORS[acc.platform] || "bg-slate-100 text-slate-800 border-slate-200"
                }`}
              >
                <span>{PLATFORM_ICONS[acc.platform] || "📱"}</span>
                <span>{acc.username}</span>
                <span className="ml-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
              </div>
            ))}
            <a
              href="https://my.blotato.com/login"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-dashed border-slate-300 text-[11px] font-black text-slate-500 hover:border-purple-400 hover:text-purple-600 transition-all"
            >
              <Plus className="w-3 h-3" /> Add more on Blotato
            </a>
          </div>
        )}
      </div>

      {/* Client Grid */}
      {clients.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="text-lg font-black text-slate-700">No clients yet</h3>
          <p className="text-xs text-slate-400 font-bold mt-1 max-w-sm mx-auto">
            Add your first client workspace and assign their social media accounts.
          </p>
          <button
            onClick={openAddModal}
            className="mt-5 bg-slate-950 text-[#ccff00] font-black px-6 py-3 rounded-2xl text-sm hover:bg-black transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Your First Client
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {clients.map((client) => {
            const clientAccounts = getClientAccounts(client);
            return (
              <div
                key={client.id}
                className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-5 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={client.logo}
                      alt={client.name}
                      className="w-11 h-11 rounded-2xl object-cover border border-slate-200"
                    />
                    <div>
                      <h3 className="font-black text-slate-900 text-sm leading-tight">{client.name}</h3>
                      {client.email && (
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">{client.email}</p>
                      )}
                      {client.industry && (
                        <span className="text-[10px] bg-purple-100 text-purple-700 font-black px-2 py-0.5 rounded-full">
                          {client.industry}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => openEditModal(client)}
                      className="w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(client.id)}
                      className="w-7 h-7 rounded-xl bg-red-50 hover:bg-red-100 flex items-center justify-center transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </button>
                  </div>
                </div>

                {/* Connected Accounts */}
                <div className="px-5 pb-4 flex-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                    Connected Accounts
                  </p>
                  {clientAccounts.length === 0 ? (
                    <div className="text-[11px] text-slate-400 font-bold bg-slate-50 rounded-xl p-3 text-center">
                      No accounts assigned yet
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {clientAccounts.map((acc) => (
                        <div
                          key={acc.id}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[11px] font-black ${
                            PLATFORM_COLORS[acc.platform] || "bg-slate-100 text-slate-800 border-slate-200"
                          }`}
                        >
                          <span>{PLATFORM_ICONS[acc.platform] || "📱"}</span>
                          <span className="flex-1">{acc.username}</span>
                          <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white" />
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold">
                    🕐 {client.timeZone}
                  </span>
                  <span className="text-[10px] font-black text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {clientAccounts.length} account{clientAccounts.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Delete Confirm */}
                {deleteConfirm === client.id && (
                  <div className="mx-5 mb-4 bg-red-50 border border-red-200 rounded-2xl p-3 space-y-2">
                    <p className="text-xs font-black text-red-700">Remove this client?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="flex-1 text-xs font-black py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
                        className="flex-1 text-xs font-black py-1.5 rounded-xl bg-red-500 text-white hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Add Client Card */}
          <button
            onClick={openAddModal}
            className="bg-white rounded-3xl border-2 border-dashed border-slate-300 hover:border-purple-400 hover:bg-purple-50 transition-all flex flex-col items-center justify-center gap-3 p-8 min-h-[200px] group"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-purple-100 flex items-center justify-center transition-all">
              <Plus className="w-6 h-6 text-slate-400 group-hover:text-purple-600 transition-colors" />
            </div>
            <span className="text-sm font-black text-slate-400 group-hover:text-purple-600 transition-colors">
              Add New Client
            </span>
          </button>
        </div>
      )}

      {/* Add / Edit Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl border-2 border-slate-900 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b-2 border-slate-100 bg-gradient-to-r from-purple-600 to-pink-600 shrink-0">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  {editingClient ? "Edit Client" : "New Client Workspace"}
                </h3>
                <p className="text-purple-100 text-xs font-bold mt-0.5">
                  {editingClient ? "Update client details and account assignments" : "Create a workspace and assign social accounts"}
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
              <div className="p-6 space-y-5">
                {/* Client Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-1">
                    <label className="text-xs font-black text-slate-700">Client / Brand Name *</label>
                    <input
                      required
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Royal Restaurant"
                      className="w-full bg-slate-50 border-2 border-slate-200 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold text-xs outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-700">Contact Email</label>
                    <input
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="client@brand.com"
                      className="w-full bg-slate-50 border-2 border-slate-200 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold text-xs outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-700">Phone</label>
                    <input
                      type="text"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-50 border-2 border-slate-200 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold text-xs outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-700">Industry</label>
                    <input
                      type="text"
                      value={formIndustry}
                      onChange={(e) => setFormIndustry(e.target.value)}
                      placeholder="e.g. Restaurant, Fashion..."
                      className="w-full bg-slate-50 border-2 border-slate-200 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold text-xs outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-700">Timezone</label>
                    <select
                      value={formTimezone}
                      onChange={(e) => setFormTimezone(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-200 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold text-xs outline-none transition-colors"
                    >
                      {TIMEZONES.map((tz) => (
                        <option key={tz} value={tz}>
                          {tz}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Assign Blotato Accounts */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-700">
                      Assign Social Accounts (from Blotato)
                    </label>
                    <button
                      type="button"
                      onClick={fetchBlotatoAccounts}
                      className="text-[10px] text-purple-600 font-black hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-2.5 h-2.5" /> Refresh
                    </button>
                  </div>

                  {loadingAccounts ? (
                    <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading accounts...
                    </div>
                  ) : setupRequired ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 font-bold">
                      Blotato API key not configured.
                    </div>
                  ) : blotatoAccounts.length === 0 ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                      <p className="text-xs text-slate-400 font-bold">No accounts on Blotato yet.</p>
                      <a
                        href="https://my.blotato.com/login"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-purple-600 font-black hover:underline inline-flex items-center gap-1 mt-1"
                      >
                        Connect on Blotato <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {blotatoAccounts.map((acc) => {
                        const isSelected = formSelectedAccounts.includes(acc.id);
                        return (
                          <button
                            key={acc.id}
                            type="button"
                            onClick={() => toggleAccountSelection(acc.id)}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-[11px] font-black transition-all text-left ${
                              isSelected
                                ? "border-purple-500 bg-purple-50 text-purple-800"
                                : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                            }`}
                          >
                            <span>{PLATFORM_ICONS[acc.platform] || "📱"}</span>
                            <span className="flex-1 truncate">{acc.username}</span>
                            <div
                              className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? "bg-purple-600"
                                  : "border-2 border-slate-300"
                              }`}
                            >
                              {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700">Notes (optional)</label>
                  <textarea
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Any notes about this client..."
                    rows={2}
                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold text-xs outline-none resize-none transition-colors"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-white border-2 border-slate-200 text-slate-700 font-black py-2.5 rounded-xl text-xs hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-slate-950 text-[#ccff00] font-black py-2.5 rounded-xl text-xs hover:bg-black transition-all"
                >
                  {editingClient ? "Save Changes" : "Create Workspace"}
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
    <Suspense fallback={<div className="p-8 text-slate-500 font-bold">Loading workspaces...</div>}>
      <ClientsContent />
    </Suspense>
  );
}
