"use client";

import { useState } from "react";
import { INITIAL_CLIENTS, INITIAL_ACCOUNTS, ClientProfile } from "@/lib/mockData";
import { Users, Plus, Globe, Mail, Building2, ChevronRight } from "lucide-react";

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientProfile[]>(INITIAL_CLIENTS);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Client Form State
  const [newName, setNewName] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newCountry, setNewCountry] = useState("Switzerland");

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const newClient: ClientProfile = {
      id: `client_${Date.now()}`,
      agency_id: "agency-admin",
      name: newName,
      company_name: newCompany || newName,
      email: newEmail,
      country: newCountry,
      avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      created_at: new Date().toISOString(),
    };

    setClients([...clients, newClient]);
    setShowAddModal(false);
    setNewName("");
    setNewEmail("");
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-metricool-dark flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-600" /> Client Workspaces & Brands
          </h1>
          <p className="text-xs text-slate-500">
            Multi-tenant client brand management with scoped social media account mappings & 1-click approvals.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-metricool-dark text-metricool-lime text-xs font-extrabold px-4 py-2.5 rounded-full shadow-md flex items-center gap-1.5 hover:bg-black transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Client Profile
        </button>
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => {
          const clientAccounts = INITIAL_ACCOUNTS.filter((acc) => acc.client_id === client.id);

          return (
            <div
              key={client.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5 hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Client Profile Top */}
                <div className="flex items-center gap-3">
                  <img
                    src={client.avatar_url}
                    alt={client.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                  />
                  <div className="flex flex-col">
                    <h3 className="text-base font-bold text-slate-900 leading-tight">{client.name}</h3>
                    <p className="text-xs text-slate-500">{client.company_name}</p>
                  </div>
                </div>

                {/* Country Badge */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700 font-semibold flex items-center gap-1">
                    <Globe className="w-3 h-3 text-blue-600" /> {client.country}
                  </span>
                </div>

                {/* Contact Email */}
                <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate">{client.email}</span>
                </div>

                {/* Connected Social Accounts */}
                <div className="space-y-2 pt-2">
                  <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    Connected Accounts ({clientAccounts.length}):
                  </label>
                  <div className="space-y-1.5">
                    {clientAccounts.length > 0 ? (
                      clientAccounts.map((acc) => (
                        <div
                          key={acc.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-extrabold uppercase bg-slate-200 px-1.5 py-0.5 rounded text-slate-800">
                              {acc.platform}
                            </span>
                            <span className="text-slate-800 font-bold">{acc.account_name}</span>
                          </div>
                          <span className="text-[10px] text-emerald-700 font-bold">Active</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">No social accounts connected yet.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Workspace Active</span>
                <button className="text-metricool-dark font-extrabold hover:underline flex items-center gap-1">
                  Account Mappings <ChevronRight className="w-3.5 h-3.5" />
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
              <h3 className="text-lg font-black text-metricool-dark flex items-center gap-2">
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
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Company Legal Name:</label>
                <input
                  type="text"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="e.g. Geneva Hospitality S.A."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Client Approval Email:</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="marketing@client.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Country:</label>
                <input
                  type="text"
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
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
                  className="flex-1 bg-metricool-dark text-metricool-lime font-extrabold py-3 rounded-xl shadow-md"
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
