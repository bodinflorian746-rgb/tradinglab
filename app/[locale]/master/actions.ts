"use server";

// Server Actions de l'espace Group Admin (« Master ») — ÉCRITURES uniquement.
// Deux actions autorisées : générer et révoquer des codes de points.
//
// Sécurité (défense en profondeur) :
//   • écriture via service_role (createAdminClient) — aucune policy d'écriture
//     n'existe pour authenticated ;
//   • re-vérification à CHAQUE appel : admin actif du groupe (ou Super Admin)
//     ET groupe actif (authorizeGroupWrite) — un groupe suspendu est en
//     LECTURE SEULE, y compris pour le Super Admin.

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { authorizeGroupWrite } from "@/lib/loyalty/access";
import { generatePointsCode } from "@/lib/loyalty/codes";
import { generateCode } from "@/lib/access-codes";
import {
  classifyRevokeFailure,
  validateAccessCodeGenerateParams,
  validateGenerateParams,
  validateShopItemParams,
} from "@/lib/loyalty/master-validation";

export type GenerateResult =
  | { ok: true; created: number }
  | { ok: false; error: string };

export type RevokeResult = { ok: true } | { ok: false; error: string };

type CurrentUser = { id: string; email: string | null };

async function currentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return { id: user.id, email: user.email ?? null };
}

/**
 * Génère `count` codes de points disponibles pour un groupe.
 * count 1–100, pointsValue 1–100000, expiresAt (optionnel) strictement futur.
 * Insertion atomique par lot ; en cas de collision (unique_violation), le lot
 * entier est régénéré (jusqu'à 5 tentatives). Aucun succès partiel silencieux :
 * on renvoie soit created===count, soit une erreur.
 */
export async function generatePointsCodesAction(input: {
  locale: string;
  groupId: string;
  count: unknown;
  pointsValue: unknown;
  expiresAt: unknown;
}): Promise<GenerateResult> {
  const user = await currentUser();
  if (!user) return { ok: false, error: "unauthenticated" };
  const userId = user.id;

  const authz = await authorizeGroupWrite(userId, input.groupId, user.email);
  if (authz !== "ok") return { ok: false, error: authz }; // forbidden | group_suspended

  const v = validateGenerateParams(
    { count: input.count, pointsValue: input.pointsValue, expiresAt: input.expiresAt },
    Date.now(),
  );
  if (!v.ok) return { ok: false, error: v.error };
  const { count, pointsValue, expiresAt } = v.value;

  const admin = createAdminClient();
  const MAX_ATTEMPTS = 5;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const set = new Set<string>();
    while (set.size < count) set.add(generatePointsCode());
    const rows = [...set].map((code) => ({
      code,
      group_id: input.groupId,
      points_value: pointsValue,
      status: "available" as const,
      created_by: userId,
      expires_at: expiresAt,
    }));

    const { data, error } = await admin.from("points_codes").insert(rows).select("code");
    if (!error) {
      const created = data?.length ?? 0;
      if (created === count) {
        revalidatePath(`/${input.locale}/master/${input.groupId}/codes`);
        revalidatePath(`/${input.locale}/master/${input.groupId}`);
        return { ok: true, created };
      }
      // Un INSERT multi-lignes est atomique : un écart ne devrait pas arriver.
      // On le signale plutôt que de laisser passer un résultat partiel.
      return { ok: false, error: "partial" };
    }
    if (error.code === "23505") continue; // collision → régénère tout le lot
    console.error(`[master/generate] insert error group=${input.groupId}: ${error.message}`);
    return { ok: false, error: "db" };
  }
  return { ok: false, error: "collision" };
}

/**
 * Révoque un code disponible du groupe (available → revoked). Vérifie qu'EXACTEMENT
 * une ligne available du BON groupe a été modifiée ; sinon renvoie une erreur
 * métier claire : not_found | wrong_group | not_revocable.
 */
export async function revokePointsCodeAction(input: {
  locale: string;
  groupId: string;
  code: string;
}): Promise<RevokeResult> {
  const user = await currentUser();
  if (!user) return { ok: false, error: "unauthenticated" };
  const userId = user.id;

  const authz = await authorizeGroupWrite(userId, input.groupId, user.email);
  if (authz !== "ok") return { ok: false, error: authz };

  const code = (input.code ?? "").trim();
  if (!code) return { ok: false, error: "not_found" };

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("points_codes")
    .update({ status: "revoked" })
    .eq("code", code)
    .eq("group_id", input.groupId)
    .eq("status", "available")
    .select("code");
  if (error) {
    console.error(`[master/revoke] update error code=${code}: ${error.message}`);
    return { ok: false, error: "db" };
  }
  if ((data?.length ?? 0) === 1) {
    revalidatePath(`/${input.locale}/master/${input.groupId}/codes`);
    revalidatePath(`/${input.locale}/master/${input.groupId}`);
    return { ok: true };
  }

  // Aucune ligne modifiée → on classe l'échec via la ligne réelle (code = PK).
  const { data: row } = await admin
    .from("points_codes")
    .select("group_id, status")
    .eq("code", code)
    .maybeSingle();
  return {
    ok: false,
    error: classifyRevokeFailure(
      row ? { group_id: row.group_id as string, status: row.status as string } : null,
      input.groupId,
    ),
  };
}

// ─── Magasin par groupe ──────────────────────────────────────────────────────
// Même garde que les codes de points : authorizeGroupWrite (admin actif ET
// groupe actif) re-vérifiée à chaque écriture. Un groupe suspendu bloque aussi
// toute création/modification d'article — comportement hérité sans code
// supplémentaire.

export type ShopItemResult = { ok: true; itemId: string } | { ok: false; error: string };

export async function createShopItemAction(input: {
  locale: string;
  groupId: string;
  name: unknown;
  description: unknown;
  itemType: unknown;
  pricePoints: unknown;
  stock?: unknown;
  imageUrl?: unknown;
}): Promise<ShopItemResult> {
  const user = await currentUser();
  if (!user) return { ok: false, error: "unauthenticated" };
  const userId = user.id;

  const authz = await authorizeGroupWrite(userId, input.groupId, user.email);
  if (authz !== "ok") return { ok: false, error: authz };

  const v = validateShopItemParams(input);
  if (!v.ok) return { ok: false, error: v.error };

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("group_shop_items")
    .insert({
      group_id: input.groupId,
      name: v.value.name,
      description: v.value.description,
      item_type: v.value.itemType,
      price_points: v.value.pricePoints,
      stock: v.value.stock,
      image_url: v.value.imageUrl,
      created_by: userId,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error(`[master/shop] create error group=${input.groupId}: ${error?.message}`);
    return { ok: false, error: "db" };
  }

  revalidatePath(`/${input.locale}/master/${input.groupId}/magasin`);
  return { ok: true, itemId: data.id as string };
}

export async function updateShopItemAction(input: {
  locale: string;
  groupId: string;
  itemId: string;
  name: unknown;
  description: unknown;
  itemType: unknown;
  pricePoints: unknown;
  stock?: unknown;
  imageUrl?: unknown;
}): Promise<ShopItemResult> {
  const user = await currentUser();
  if (!user) return { ok: false, error: "unauthenticated" };
  const userId = user.id;

  const authz = await authorizeGroupWrite(userId, input.groupId, user.email);
  if (authz !== "ok") return { ok: false, error: authz };

  const v = validateShopItemParams(input);
  if (!v.ok) return { ok: false, error: v.error };

  const admin = createAdminClient();
  // .eq("group_id", ...) empêche toute action cross-groupe même si itemId
  // provenait d'un autre groupe (défense en profondeur, même schéma que revoke).
  const { data, error } = await admin
    .from("group_shop_items")
    .update({
      name: v.value.name,
      description: v.value.description,
      item_type: v.value.itemType,
      price_points: v.value.pricePoints,
      stock: v.value.stock,
      image_url: v.value.imageUrl,
    })
    .eq("id", input.itemId)
    .eq("group_id", input.groupId)
    .select("id");

  if (error) {
    console.error(`[master/shop] update error item=${input.itemId}: ${error.message}`);
    return { ok: false, error: "db" };
  }
  if ((data?.length ?? 0) !== 1) return { ok: false, error: "not_found" };

  revalidatePath(`/${input.locale}/master/${input.groupId}/magasin`);
  return { ok: true, itemId: input.itemId };
}

export async function toggleShopItemStatusAction(input: {
  locale: string;
  groupId: string;
  itemId: string;
  nextStatus: "active" | "inactive";
}): Promise<ShopItemResult> {
  const user = await currentUser();
  if (!user) return { ok: false, error: "unauthenticated" };
  const userId = user.id;

  const authz = await authorizeGroupWrite(userId, input.groupId, user.email);
  if (authz !== "ok") return { ok: false, error: authz };

  if (input.nextStatus !== "active" && input.nextStatus !== "inactive") {
    return { ok: false, error: "invalid_status" };
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("group_shop_items")
    .update({ status: input.nextStatus })
    .eq("id", input.itemId)
    .eq("group_id", input.groupId)
    .select("id");

  if (error) {
    console.error(`[master/shop] toggle error item=${input.itemId}: ${error.message}`);
    return { ok: false, error: "db" };
  }
  if ((data?.length ?? 0) !== 1) return { ok: false, error: "not_found" };

  revalidatePath(`/${input.locale}/master/${input.groupId}/magasin`);
  return { ok: true, itemId: input.itemId };
}

// ─── Codes de déblocage de compte (access_codes) par groupe ──────────────────
// Même garde que les codes de points : authorizeGroupWrite (admin actif ET
// groupe actif). Réutilise le générateur access_codes (generateCode(),
// format TSX-XXXX-XXXX) et le validateur/classifieur déjà écrits pour les
// codes de points — la table diffère (access_codes vs points_codes) mais la
// logique de génération/révocation est identique.
//
// SÉCURITÉ : le type est toujours 'lifetime' ou 'duration' ici, jamais
// 'trial'/'broker' — réservés au Super Admin (/admin/codes). En dehors de ce
// choix de type, AUCUNE limite métier de quantité ou de durée : un admin de
// groupe peut générer autant de codes qu'il veut, avec la durée qu'il veut
// (cf. validateAccessCodeGenerateParams — décision produit explicite).

export async function generateAccessCodesAction(input: {
  locale: string;
  groupId: string;
  count: unknown;
  kind: unknown;
  durationDays: unknown;
  expiresAt: unknown;
}): Promise<GenerateResult> {
  const user = await currentUser();
  if (!user) return { ok: false, error: "unauthenticated" };
  const userId = user.id;

  const authz = await authorizeGroupWrite(userId, input.groupId, user.email);
  if (authz !== "ok") return { ok: false, error: authz };

  const v = validateAccessCodeGenerateParams(
    { count: input.count, kind: input.kind, durationDays: input.durationDays, expiresAt: input.expiresAt },
    Date.now(),
  );
  if (!v.ok) return { ok: false, error: v.error };
  const { count, kind, durationDays, expiresAt } = v.value;

  const admin = createAdminClient();
  const MAX_ATTEMPTS = 5;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const set = new Set<string>();
    while (set.size < count) set.add(generateCode());
    const rows = [...set].map((code) => ({
      code,
      group_id: input.groupId,
      type: kind === "lifetime" ? ("lifetime" as const) : ("duration" as const),
      duration_days: kind === "duration" ? durationDays : null,
      status: "available" as const,
      expires_at: expiresAt,
    }));

    const { data, error } = await admin.from("access_codes").insert(rows).select("code");
    if (!error) {
      const created = data?.length ?? 0;
      if (created === count) {
        revalidatePath(`/${input.locale}/master/${input.groupId}/deblocage`);
        revalidatePath(`/${input.locale}/master/${input.groupId}`);
        return { ok: true, created };
      }
      return { ok: false, error: "partial" };
    }
    if (error.code === "23505") continue; // collision de code → régénère tout le lot
    console.error(`[master/access-codes] insert error group=${input.groupId}: ${error.message}`);
    return { ok: false, error: "db" };
  }
  return { ok: false, error: "collision" };
}

export async function revokeAccessCodeAction(input: {
  locale: string;
  groupId: string;
  code: string;
}): Promise<RevokeResult> {
  const user = await currentUser();
  if (!user) return { ok: false, error: "unauthenticated" };
  const userId = user.id;

  const authz = await authorizeGroupWrite(userId, input.groupId, user.email);
  if (authz !== "ok") return { ok: false, error: authz };

  const code = (input.code ?? "").trim();
  if (!code) return { ok: false, error: "not_found" };

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("access_codes")
    .update({ status: "revoked" })
    .eq("code", code)
    .eq("group_id", input.groupId)
    .eq("status", "available")
    .select("code");
  if (error) {
    console.error(`[master/access-codes] revoke error code=${code}: ${error.message}`);
    return { ok: false, error: "db" };
  }
  if ((data?.length ?? 0) === 1) {
    revalidatePath(`/${input.locale}/master/${input.groupId}/deblocage`);
    revalidatePath(`/${input.locale}/master/${input.groupId}`);
    return { ok: true };
  }

  const { data: row } = await admin
    .from("access_codes")
    .select("group_id, status")
    .eq("code", code)
    .maybeSingle();
  return {
    ok: false,
    error: classifyRevokeFailure(
      row ? { group_id: (row.group_id as string) ?? "", status: row.status as string } : null,
      input.groupId,
    ),
  };
}
