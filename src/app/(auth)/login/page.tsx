"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("agency@apex-media.eu");
  const [password, setPassword] = useState("••••••••••••");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 selection:bg-blue-500 selection:text-white relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="glass-panel max-w-md w-full p-8 rounded-3xl border border-slate-800 space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              SocialPulse<span className="text-blue-500">.ai</span>
            </span>
          </Link>
          <h1 className="text-xl font-bold text-white pt-2">Sign In to Agency Dashboard</h1>
          <p className="text-xs text-slate-400">Enter your credentials to access client workspaces</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Work Email:</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-input rounded-xl pl-9 pr-4 py-2.5 text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Password:</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input rounded-xl pl-9 pr-4 py-2.5 text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full gradient-brand text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 text-xs hover:opacity-90 transition-all pt-3"
          >
            Sign In to Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Don't have an agency account yet?{" "}
          <Link href="/signup" className="text-blue-400 font-bold hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
}
