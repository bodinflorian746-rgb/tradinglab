// Suivi minimal des commandes (achats de boutique) pour les administrateurs
// de groupe — SERVER-ONLY. Réutilise exclusivement group_shop_purchases (+
// status/delivered_at, migration 20260730120000) et group_shop_items :
// aucune nouvelle table.
//
// Même pattern de lecture que lib/loyalty/shop.ts / master.ts : readClient()
// bascule sur le service_role pour un vrai Super Admin (ou le bypass dev),
// sinon passe par le client de session → soumis à la RLS existante
// (group_shop_purchases_select, migration 20260724120000) qui garantit déjà
// l'isolation multi-tenant en base pour un Group Admin.
//
// L'ÉCRITURE (marquer comme livrée) vit dans
// app/[locale]/master/[groupId]/commandes/actions.ts (Server Action, même
// garde authorizeGroupWrite que tout le reste de l'espace Master) — ce
// fichier n'expose qu'une LECTURE, jamais un débit de points, un changement
// de stock ou de prix payé.

import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isDevAuthBypass } from "@/lib/dev-auth";
import { isAdmin } from "@/lib/auth/admin";

export type OrderStatus = "pending" | "delivered";

export type GroupOrderRow = {
  id: string;
  user_id: string;
  price_paid: number;
  status: OrderStatus;
  created_at: string;
  item_name: string | null;
  buyer_email: string | null;
};

async function readClient() {
  if (isDevAuthBypass()) return createAdminClient();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user && isAdmin(user.email)) return createAdminClient();
  return supabase;
}

// Résolution d'e-mail EXCLUSIVEMENT côté serveur, via l'API admin GoTrue
// (service_role) — jamais la service_role key exposée au navigateur, jamais
// d'e-mail renvoyé par une route/composant client. Exportée : même mécanisme
// réutilisé par app/[locale]/master/[groupId]/page.tsx et
// app/[locale]/admin/loyalty/groups/[groupId]/page.tsx pour afficher un
// e-mail réel plutôt qu'un UUID tronqué, chacun avec sa propre garde
// d'autorisation.
export async function resolveUserEmails(userIds: readonly string[]): Promise<Map<string, string | null>> {
  const unique = [...new Set(userIds)];
  const admin = createAdminClient();
  const entries = await Promise.all(
    unique.map(async (id) => {
      const { data, error } = await admin.auth.admin.getUserById(id);
      if (error) return [id, null] as const;
      return [id, data.user?.email ?? null] as const;
    }),
  );
  return new Map(entries);
}

type PurchaseRow = {
  id: string;
  item_id: string;
  user_id: string;
  price_paid: number;
  status: string;
  created_at: string;
};

// item_id n'est PAS une clé étrangère physique vers group_shop_items (choix
// d'architecture explicite, cf. migration 20260724120000) : PostgREST ne peut
// donc PAS embarquer group_shop_items(...) dans le select (aucune relation
// détectable dans le schema cache). On résout le nom de l'article via une
// SECONDE requête explicite, même principe que les RPC de ce schéma.
async function resolveItemNames(
  supabase: Awaited<ReturnType<typeof readClient>>,
  itemIds: readonly string[],
): Promise<Map<string, string>> {
  const unique = [...new Set(itemIds)];
  if (unique.length === 0) return new Map();
  const { data, error } = await supabase.from("group_shop_items").select("id, name").in("id", unique);
  if (error || !data) return new Map();
  return new Map(data.map((i) => [i.id as string, i.name as string]));
}

/** Commandes d'UN groupe, triées de la plus récente à la plus ancienne — pas de pagination, pas de filtre. */
export async function listGroupOrders(
  groupId: string,
): Promise<{ rows: GroupOrderRow[]; error: string | null }> {
  const supabase = await readClient();

  const { data, error } = await supabase
    .from("group_shop_purchases")
    .select("id, item_id, user_id, price_paid, status, created_at")
    .eq("group_id", groupId)
    .order("created_at", { ascending: false });
  if (error) return { rows: [], error: error.message };

  const rowsRaw = (data ?? []) as PurchaseRow[];
  const [emails, items] = await Promise.all([
    resolveUserEmails(rowsRaw.map((r) => r.user_id)),
    resolveItemNames(supabase, rowsRaw.map((r) => r.item_id)),
  ]);

  const rows: GroupOrderRow[] = rowsRaw.map((r) => ({
    id: r.id,
    user_id: r.user_id,
    price_paid: r.price_paid,
    status: r.status as OrderStatus,
    created_at: r.created_at,
    item_name: items.get(r.item_id) ?? null,
    buyer_email: emails.get(r.user_id) ?? null,
  }));

  return { rows, error: null };
}
