// Admin Supabase client (server-only, service role key).
// Bypasse RLS. À utiliser UNIQUEMENT côté serveur (Route Handlers, Server Actions, webhooks Stripe).
// Ne jamais importer depuis un composant client.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let adminClient: SupabaseClient | null = null;

export function createAdminClient(): SupabaseClient {
  if (adminClient) return adminClient;

  adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

  return adminClient;
}
