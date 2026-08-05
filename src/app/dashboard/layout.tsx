"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { ClientProfile, loadClientsFromStorage, INITIAL_CLIENTS } from "@/lib/mockData";

const PLACEHOLDER_CLIENT: ClientProfile = {
  id: "default",
  name: "My Agency",
  slug: "my-agency",
  logo: "https://ui-avatars.com/api/?name=My+Agency&background=6366f1&color=fff&bold=true&size=128",
  email: "",
  timeZone: "Asia/Kolkata",
  blotatoAccountIds: [],
  connectedPlatforms: [],
  stats: { totalFollowers: 0, followerGrowth: 0, monthlyImpressions: 0, postsThisMonth: 0 },
  createdAt: new Date().toISOString(),
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<ClientProfile[]>([PLACEHOLDER_CLIENT]);
  const [selectedClient, setSelectedClient] = useState<ClientProfile>(PLACEHOLDER_CLIENT);

  // Load clients from localStorage so they persist across pages
  useEffect(() => {
    const saved = loadClientsFromStorage();
    if (saved.length > 0) {
      setClients(saved);
      setSelectedClient(saved[0]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex font-sans selection:bg-[#ccff00] selection:text-slate-900">
      <Sidebar
        clients={clients}
        selectedClient={selectedClient}
        onSelectClient={setSelectedClient}
      />
      <div className="flex-1 pl-60 flex flex-col min-w-0">
        <Header selectedClient={selectedClient} />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
