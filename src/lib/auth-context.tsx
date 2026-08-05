"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password?: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password?: string, agencyName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isConfigured: false,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
});

const DEMO_USER: User = {
  id: "demo-agency-uuid-1234-5678",
  app_metadata: { provider: "email" },
  user_metadata: { agency_name: "Apex Media Studio EU" },
  aud: "authenticated",
  created_at: new Date().toISOString(),
  email: "agency@apex-media.eu",
  role: "authenticated",
  updated_at: new Date().toISOString(),
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (!configured) {
      // Demo/Fallback mode when Supabase credentials are not populated in .env.local
      const savedAuth = typeof window !== "undefined" ? localStorage.getItem("elan_demo_auth") : null;
      if (savedAuth === "true" || savedAuth === null) {
        setUser(DEMO_USER);
      } else {
        setUser(null);
      }
      setLoading(false);
      return;
    }

    // Real Supabase Auth Mode
    const initAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
      } catch (err) {
        console.error("Supabase auth session error:", err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [configured]);

  const signIn = async (email: string, password?: string) => {
    if (!configured) {
      if (typeof window !== "undefined") {
        localStorage.setItem("elan_demo_auth", "true");
      }
      setUser(DEMO_USER);
      return { error: null };
    }

    if (!password) {
      return { error: new Error("Password is required") };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password?: string, agencyName?: string) => {
    if (!configured) {
      if (typeof window !== "undefined") {
        localStorage.setItem("elan_demo_auth", "true");
      }
      setUser({
        ...DEMO_USER,
        email,
        user_metadata: { agency_name: agencyName || "My Social Agency" },
      });
      return { error: null };
    }

    if (!password) {
      return { error: new Error("Password is required") };
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          agency_name: agencyName,
        },
      },
    });
    return { error };
  };

  const signOut = async () => {
    if (!configured) {
      if (typeof window !== "undefined") {
        localStorage.setItem("elan_demo_auth", "false");
      }
      setUser(null);
      setSession(null);
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isConfigured: !!configured,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
