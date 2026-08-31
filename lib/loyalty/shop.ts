// Couche de LECTURE du magasin par groupe — SERVER-ONLY.
//
// Même pattern que lib/loyalty/master.ts et lib/loyalty/member.ts : lectures
// via le client de SESSION → soumises à la RLS (`group_shop_items_select` /
// `group_shop_purchases_select`, cf. migration 20260724120000). Un gestionnaire
// voit tous les statuts de son groupe ; un membre ne voit que les articles
// actifs de ses groupes actifs — l'isolation est garantie EN BASE, pas
// seulement par le filtrage applicatif.

import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isDevAuthBypass } from "@/lib/dev-auth";
import { isAdmin } from "@/lib/auth/admin";
import type { GroupShopItem } from "@/lib/loyalty/types";

// Même pattern que lib/loyalty/master.ts : un vrai Super Admin (pas seulement
// le bypass dev) bascule aussi en service_role — sinon la RLS
// (group_shop_items_select) ne renverrait rien pour un groupe qu'il n'admine
// pas personnellement, malgré la page qui l'y autorise désormais.
async function readClient() {
  if (isDevAuthBypass()) return createAdminClient();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user && isAdmin(user.email)) return createAdminClient();
  return supabase;
}

const ITEM_COLUMNS =
  "id, group_id, name, description, item_type, price_points, image_url, stock, status, emoji, created_by, created_at, updated_at";

/** Tous les articles d'un groupe (actifs + inactifs) — vue gestionnaire. */
export async function listShopItemsForManager(
  groupId: string,
): Promise<{ rows: GroupShopItem[]; error: string | null }> {
  const supabase = await readClient();
  const { data, error } = await supabase
    .from("group_shop_items")
    .select(ITEM_COLUMNS)
    .eq("group_id", groupId)
    .order("created_at", { ascending: false });
  if (error) return { rows: [], error: error.message };
  return { rows: (data ?? []) as GroupShopItem[], error: null };
}

/** Articles ACTIFS d'un groupe — vue membre (RLS filtre déjà, .eq redondant volontaire pour la clarté). */
export async function listActiveShopItemsForMember(
  groupId: string,
): Promise<{ rows: GroupShopItem[]; error: string | null }> {
  const supabase = await readClient();
  const { data, error } = await supabase
    .from("group_shop_items")
    .select(ITEM_COLUMNS)
    .eq("group_id", groupId)
    .eq("status", "active")
    .order("created_at", { ascending: false });
  if (error) return { rows: [], error: error.message };
  return { rows: (data ?? []) as GroupShopItem[], error: null };
}

// L'historique des achats d'un groupe vit sur l'écran Commandes dédié
// (lib/loyalty/orders.ts#listGroupOrders) — jamais dupliqué ici. La section
// "Achats des membres" qui existait sur cette page (Magasin) reposait sur une
// jointure imbriquée (group_shop_items(name)) que PostgREST ne résolvait pas
// (aucune relation déclarée entre group_shop_purchases et group_shop_items) ;
// supprimée plutôt que réparée, puisque orders.ts couvre déjà exactement ce
// besoin, correctement.
