// Server Supabase client (Server Components, Server Actions, Route Handlers).
// Lit/écrit les cookies via next/headers pour persister la session.

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isDevAuthBypass, DEV_USER } from "@/lib/dev-auth";

export async function createClient() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Appelé depuis un Server Component → set ignoré.
            // Le refresh de session est géré dans proxy.ts (cookies passés à la response).
          }
        },
      },
    },
  );

  // ─── DEV ONLY : bypass d'authentification local ──────────────────────────
  // Uniquement si NODE_ENV=development ET DEV_AUTH_BYPASS=true (cf. lib/dev-auth).
  // Impossible en production. On mocke getUser/getSession → l'app considère
  // l'utilisateur de dev comme connecté, sans écran de connexion.
  if (isDevAuthBypass()) {
    supabase.auth.getUser = (async () => ({
      data: { user: DEV_USER },
      error: null,
    })) as typeof supabase.auth.getUser;
    supabase.auth.getSession = (async () => ({
      data: { session: { user: DEV_USER } },
      error: null,
    })) as unknown as typeof supabase.auth.getSession;
  }

  return supabase;
}
