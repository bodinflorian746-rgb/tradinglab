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
import type { GroupShopItem, GroupShopPurchase } from "@/lib/loyalty/types";
import type { Paged } from "@/lib/loyalty/admin";

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
  "id, group_id, name, description, item_type, price_points, image_url, stock, status, created_by, created_at, updated_at";

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

// Vue gestionnaire : la clé d'idempotence est un détail d'implémentation de la
// RPC (déduplication des tentatives), jamais affichée — non sélectionnée ici.
type GroupShopPurchaseRow = Omit<GroupShopPurchase, "idempotency_key">;

/** Historique des achats d'un groupe, paginé — vue gestionnaire. */
export async function listGroupPurchases(
  groupId: string,
  opts: { page?: number; pageSize?: number } = {},
): Promise<Paged<GroupShopPurchaseRow & { item_name: string | null }>> {
  const supabase = await readClient();
  const page = opts.page ?? 1;
  const pageSize = opts.pageSize ?? 25;
  const from = (page - 1) * pageSize;
  const { data, error, count } = await supabase
    .from("group_shop_purchases")
    .select("id, group_id, item_id, user_id, price_paid, created_at, group_shop_items(name)", {
      count: "exact",
    })
    .eq("group_id", groupId)
    .order("created_at", { ascending: false })
    .range(from, from + pageSize - 1);
  if (error) return { rows: [], total: 0, error: error.message };
  const rows = (data ?? []).map((r) => {
    const joined = r as unknown as GroupShopPurchaseRow & {
      group_shop_items: { name: string } | { name: string }[] | null;
    };
    const item = Array.isArray(joined.group_shop_items)
      ? joined.group_shop_items[0]
      : joined.group_shop_items;
    return { ...(r as GroupShopPurchaseRow), item_name: item?.name ?? null };
  });
  return { rows, total: count ?? 0, error: null };
}
