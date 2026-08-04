"use client";

import { useState } from "react";
import { INITIAL_CLIENTS, ClientProfile } from "@/lib/mockData";
import { Users, Plus, Globe, Mail, Building2, ChevronRight } from "lucide-react";

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientProfile[]>(INITIAL_CLIENTS);
  const [showAddModal, setShowAddModal] = useState(false);

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

  return (
    <div className="space-y-8 font-sans text-xs pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-600" /> Client Workspaces & Brands
          </h1>
          <p className="text-xs text-slate-500 font-bold mt-1">
            Multi-tenant client brand management with scoped social media account mappings & 1-click approvals.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-slate-950 text-[#ccff00] text-xs font-black px-5 py-3 rounded-2xl shadow-md flex items-center gap-1.5 hover:bg-black transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Client Profile
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

                {/* Connected Social Platforms */}
                <div className="space-y-2 pt-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                    Connected Platforms:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {client.connectedPlatforms.map((plat) => (
                      <span key={plat} className="bg-slate-100 border border-slate-200 font-extrabold text-[10px] px-2.5 py-1 rounded-lg text-slate-800 uppercase">
                        {plat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400 text-[11px]">Workspace Active</span>
                <button className="text-slate-900 font-black hover:underline flex items-center gap-1">
                  Brand Mappings <ChevronRight className="w-3.5 h-3.5" />
                </button>
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
                  placeholder="e.g. Apex Luxury Brand"
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
                  placeholder="marketing@client.com"
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
                  Save Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
