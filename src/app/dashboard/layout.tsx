"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { INITIAL_CLIENTS, ClientProfile } from "@/lib/mockData";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<ClientProfile[]>(INITIAL_CLIENTS);
  const [selectedClient, setSelectedClient] = useState<ClientProfile>(INITIAL_CLIENTS[0]);

  return (
    <div className="min-h-screen bg-slate-100 text-metricool-dark flex font-sans selection:bg-metricool-lime selection:text-metricool-dark">
      {/* Metricool Left Navigation Sidebar */}
      <Sidebar
        clients={clients}
        selectedClient={selectedClient}
        onSelectClient={setSelectedClient}
      />

      {/* Main Content Area */}
      <div className="flex-1 pl-60 flex flex-col min-w-0">
        {/* Metricool Dark Header Topbar */}
        <Header selectedClient={selectedClient} />
        
        {/* Page Content Body */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
