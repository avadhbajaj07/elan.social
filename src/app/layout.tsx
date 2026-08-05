import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "elan.social - All-in-One Social Media Management & Client Approval Platform",
  description: "Manage Instagram, TikTok, Facebook, LinkedIn, Google Business, and YouTube from one unified dashboard. Automated 1-click client approvals and Blotato publishing.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-white min-h-screen antialiased selection:bg-[#ccff00] selection:text-slate-950">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

