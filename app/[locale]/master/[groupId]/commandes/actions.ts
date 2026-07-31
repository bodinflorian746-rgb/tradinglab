"use server";

// Server Action du suivi des commandes (Group Admin / Super Admin) — une
// seule écriture : marquer une commande comme livrée. Ne touche JAMAIS
// price_paid, le stock, ni aucune ligne de points_ledger.
//
// Sécurité (même garde que le reste de l'espace Master) :
//   • userId TOUJOURS dérivé côté serveur via supabase.auth.getUser(), jamais
//     confié au client ;
//   • authorizeGroupWrite revérifie à CHAQUE appel que l'appelant est admin
//     actif du groupe concerné, OU Super Admin — un admin d'un AUTRE groupe
//     ne peut jamais modifier une commande qui n'est pas la sienne (le
//     .eq("group_id", ...) sur l'UPDATE est une seconde ceinture) ;
//   • un groupe suspendu reste lecture seule (même règle que codes/magasin).

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { authorizeGroupWrite } from "@/lib/loyalty/access";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type MarkOrderDeliveredResult = { ok: true } | { ok: false; error: string };

export async function markOrderDeliveredAction(input: {
  locale: string;
  groupId: string;
  orderId: string;
}): Promise<MarkOrderDeliveredResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "unauthenticated" };

  const authz = await authorizeGroupWrite(user.id, input.groupId, user.email);
  if (authz !== "ok") return { ok: false, error: authz }; // forbidden | group_suspended

  if (typeof input.orderId !== "string" || !UUID_RE.test(input.orderId)) {
    return { ok: false, error: "not_found" };
  }

  const admin = createAdminClient();
  // .eq("group_id", ...) : défense en profondeur — même si orderId provenait
  // d'un autre groupe, l'update ne peut jamais l'atteindre. Ne modifie que
  // status et delivered_at ; jamais price_paid, stock ou points_ledger.
  const { data, error } = await admin
    .from("group_shop_purchases")
    .update({ status: "delivered", delivered_at: new Date().toISOString() })
    .eq("id", input.orderId)
    .eq("group_id", input.groupId)
    .select("id");

  if (error) {
    console.error(`[master/orders] update error order=${input.orderId}: ${error.message}`);
    return { ok: false, error: "db" };
  }
  if ((data?.length ?? 0) !== 1) return { ok: false, error: "not_found" };

  revalidatePath(`/${input.locale}/master/${input.groupId}/commandes`);
  return { ok: true };
}
