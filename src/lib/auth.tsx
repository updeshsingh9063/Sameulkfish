"use client";

// Session handling.
//
// PREVIEW: sign-in is simulated. In the Alpha this provider wraps
// @azure/msal-react: signIn() becomes loginRedirect() against the Shield
// Microsoft Entra tenant, and getAccessToken() returns the token sent to
// the protected API (starting with GET /api/users/me).

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export interface User {
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  ready: boolean;
  signIn: () => void;
  signOut: () => void;
}

const KEY = "spfm.session.v1";
const PREVIEW_USER: User = { name: "Samuel Fish", email: "samuel@shieldsecuritydoors.example" };

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw) as User);
    } catch {
      /* no stored session */
    }
    setReady(true);
  }, []);

  const signIn = useCallback(() => {
    setUser(PREVIEW_USER);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(PREVIEW_USER));
    } catch {}
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    try {
      window.localStorage.removeItem(KEY);
    } catch {}
  }, []);

  return <AuthContext.Provider value={{ user, ready, signIn, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
