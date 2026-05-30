"use client";

// Contexte session minimal côté client. Hydraté par app/[locale]/layout.tsx
// avec l'utilisateur lu côté serveur (supabase.auth.getUser()). Permet à la
// Navbar (et autres composants client) d'être auth-aware dès le premier paint
// sans re-fetch côté client (pas de flicker).

import { createContext, useContext, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";

type SessionCtx = { user: User | null };

const SessionContext = createContext<SessionCtx>({ user: null });

export function SessionProvider({
  initialUser,
  children,
}: {
  initialUser: User | null;
  children: ReactNode;
}) {
  return (
    <SessionContext.Provider value={{ user: initialUser }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionCtx {
  return useContext(SessionContext);
}
