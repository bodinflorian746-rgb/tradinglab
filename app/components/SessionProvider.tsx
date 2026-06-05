"use client";

// Contexte session minimal côté client. Hydraté par app/[locale]/layout.tsx
// avec l'utilisateur lu côté serveur (supabase.auth.getUser()). Permet à la
// Navbar (et autres composants client) d'être auth-aware dès le premier paint
// sans re-fetch côté client (pas de flicker).
//
// isAdmin est calculé CÔTÉ SERVEUR via lib/auth/admin.ts (qui lit
// process.env.ADMIN_EMAILS, server-only) et passé en initialIsAdmin. Le
// composant client n'a JAMAIS accès à la liste des emails admin, juste au
// boolean dérivé pour le user courant.

import { createContext, useContext, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";

type SessionCtx = { user: User | null; isAdmin: boolean };

const SessionContext = createContext<SessionCtx>({ user: null, isAdmin: false });

export function SessionProvider({
  initialUser,
  initialIsAdmin,
  children,
}: {
  initialUser: User | null;
  initialIsAdmin: boolean;
  children: ReactNode;
}) {
  return (
    <SessionContext.Provider value={{ user: initialUser, isAdmin: initialIsAdmin }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionCtx {
  return useContext(SessionContext);
}
