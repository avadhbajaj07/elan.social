"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, Lock, Building, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [agencyName, setAgencyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex items-center justify-center p-4 selection:bg-[#ccff00] selection:text-slate-950">
      <div className="w-full max-w-md bg-slate-900/90 border-2 border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-1.5 justify-center group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
              <Sparkles className="w-4.5 h-4.5 text-[#ccff00]" />
            </div>
            <span className="text-2xl font-black lowercase text-white">
              elan<span className="text-pink-500">.social</span>
            </span>
          </Link>

          <h1 className="text-2xl font-black text-white pt-2">Create Agency Account</h1>
          <p className="text-xs text-slate-400 font-bold">
            Start managing all social networks & client approvals
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          <div className="space-y-1">
            <label className="font-extrabold text-slate-300 block text-xs">Agency / Brand Name:</label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                placeholder="e.g. Apex Marketing Agency"
                className="w-full bg-white text-slate-900 font-extrabold text-sm border-2 border-slate-700 focus:border-pink-500 rounded-xl pl-10 pr-4 py-3 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-extrabold text-slate-300 block text-xs">Work Email:</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@agency.com"
                className="w-full bg-white text-slate-900 font-extrabold text-sm border-2 border-slate-700 focus:border-pink-500 rounded-xl pl-10 pr-4 py-3 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-extrabold text-slate-300 block text-xs">Password:</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white text-slate-900 font-extrabold text-sm border-2 border-slate-700 focus:border-pink-500 rounded-xl pl-10 pr-4 py-3 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#ccff00] text-slate-950 font-black text-sm rounded-xl shadow-lg hover:bg-white transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? "Creating Account..." : "Create Agency Account"} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800 text-xs">
          <span className="text-slate-400 font-medium">Already have an account? </span>
          <Link href="/login" className="text-pink-500 font-extrabold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
