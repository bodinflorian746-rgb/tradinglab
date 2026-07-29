"use server";

// Server Action de l'espace Membre (« Fidélité ») — ÉCRITURE unique : activer
// un code de points reçu sur Telegram.
//
// Sécurité :
//   • auth requise (createClient().auth.getUser()) ;
//   • écriture via la RPC `activate_points_code` (service_role uniquement,
//     cf. migration 20260723120000) — transaction atomique : consommation du
//     code + auto-join du groupe + crédit du ledger, ou rien du tout ;
//   • aucune policy INSERT/UPDATE cliente sur points_codes / points_ledger /
//     group_memberships : impossible de contourner la RPC depuis le client.

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  normalizeCodeInput,
  isActivateOutcome,
  isJoinGroupOutcome,
  isPurchaseOutcome,
  isValidIdempotencyKey,
} from "@/lib/loyalty/member-validation";

export type ActivateResult =
  | { ok: true; creditedPoints: number; groupId: string }
  | {
      ok: false;
      error:
        | "unauthenticated"
        | "invalid"
        | "not_found"
        | "already_used"
        | "expired"
        | "group_suspended"
        | "db";
    };

export async function activatePointsCodeAction(input: {
  locale: string;
  code: unknown;
}): Promise<ActivateResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "unauthenticated" };

  const code = normalizeCodeInput(input.code);
  if (!code) return { ok: false, error: "invalid" };

  const admin = createAdminClient();
  const { data, error } = await admin.rpc("activate_points_code", {
    p_code: code,
    p_user_id: user.id,
  });
  if (error) {
    console.error(`[fidelite/activate] rpc error code=${code}: ${error.message}`);
    return { ok: false, error: "db" };
  }

  const row = Array.isArray(data) ? data[0] : data;
  const outcome = typeof row?.result === "string" ? row.result : "";
  if (!isActivateOutcome(outcome)) {
    console.error(`[fidelite/activate] unexpected rpc result: ${JSON.stringify(row)}`);
    return { ok: false, error: "db" };
  }
  if (outcome !== "ok") return { ok: false, error: outcome };

  revalidatePath(`/${input.locale}/fidelite`);
  return {
    ok: true,
    creditedPoints: row.credited_points as number,
    groupId: row.result_group_id as string,
  };
}

// ─── Rattachement à un groupe via son code de référence ─────────────────────
// RPC `join_group_by_reference_code` (service_role uniquement, migration
// 20260724120000) — idempotente et atomique : crée l'adhésion si absente,
// la réactive si suspendue (sans jamais toucher au rôle existant), refuse si
// le groupe est suspendu.

export type JoinGroupResult =
  | { ok: true; groupId: string; groupName: string }
  | {
      ok: false;
      error: "unauthenticated" | "invalid" | "not_found" | "already_member" | "group_suspended" | "db";
    };

export async function joinGroupByReferenceCodeAction(input: {
  locale: string;
  code: unknown;
}): Promise<JoinGroupResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "unauthenticated" };

  const code = normalizeCodeInput(input.code);
  if (!code) return { ok: false, error: "invalid" };

  const admin = createAdminClient();
  const { data, error } = await admin.rpc("join_group_by_reference_code", {
    p_reference_code: code,
    p_user_id: user.id,
  });
  if (error) {
    console.error(`[fidelite/join] rpc error code=${code}: ${error.message}`);
    return { ok: false, error: "db" };
  }

  const row = Array.isArray(data) ? data[0] : data;
  const outcome = typeof row?.result === "string" ? row.result : "";
  if (!isJoinGroupOutcome(outcome)) {
    console.error(`[fidelite/join] unexpected rpc result: ${JSON.stringify(row)}`);
    return { ok: false, error: "db" };
  }
  if (outcome !== "ok") return { ok: false, error: outcome };

  revalidatePath(`/${input.locale}/fidelite`);
  return { ok: true, groupId: row.result_group_id as string, groupName: row.result_group_name as string };
}

// ─── Achat d'un article du magasin ───────────────────────────────────────────
// RPC `purchase_shop_item` (service_role uniquement) — atomique, verrouillée
// par utilisateur (pg_advisory_xact_lock côté RPC) : débite points_ledger et
// crée l'achat dans une seule transaction, ou rien du tout.
//
// idempotencyKey : générée côté formulaire (une seule fois par tentative
// d'achat, réutilisée si cette même tentative est rejouée — double clic,
// requête répétée). C'est elle qui garantit l'idempotence EN BASE (contrainte
// unique (user_id, idempotency_key) sur group_shop_purchases) : le verrou
// pg_advisory_xact_lock seul sérialise les appels mais n'empêche pas deux
// achats VOLONTAIREMENT distincts de réussir si le solde le permet — ce n'est
// pas son rôle. Un rejeu de la RPC ('already_processed') est traité comme un
// succès (même achat, mêmes valeurs renvoyées), pas comme une erreur.

export type PurchaseResult =
  | { ok: true; purchaseId: string; pricePaid: number }
  | {
      ok: false;
      error:
        | "unauthenticated"
        | "invalid"
        | "idempotency_key_reused"
        | "not_found"
        | "item_inactive"
        | "group_suspended"
        | "not_member"
        | "insufficient_balance"
        | "db";
    };

export async function purchaseItemAction(input: {
  locale: string;
  groupId: string;
  itemId: string;
  idempotencyKey: unknown;
}): Promise<PurchaseResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "unauthenticated" };

  if (!isValidIdempotencyKey(input.idempotencyKey)) return { ok: false, error: "invalid" };

  const admin = createAdminClient();
  const { data, error } = await admin.rpc("purchase_shop_item", {
    p_item_id: input.itemId,
    p_user_id: user.id,
    p_idempotency_key: input.idempotencyKey,
  });
  if (error) {
    console.error(`[fidelite/purchase] rpc error item=${input.itemId}: ${error.message}`);
    return { ok: false, error: "db" };
  }

  const row = Array.isArray(data) ? data[0] : data;
  const outcome = typeof row?.result === "string" ? row.result : "";
  if (!isPurchaseOutcome(outcome)) {
    console.error(`[fidelite/purchase] unexpected rpc result: ${JSON.stringify(row)}`);
    return { ok: false, error: "db" };
  }
  if (outcome !== "ok" && outcome !== "already_processed") return { ok: false, error: outcome };

  revalidatePath(`/${input.locale}/fidelite/${input.groupId}`);
  return {
    ok: true,
    purchaseId: row.result_purchase_id as string,
    pricePaid: row.result_price_paid as number,
  };
}
