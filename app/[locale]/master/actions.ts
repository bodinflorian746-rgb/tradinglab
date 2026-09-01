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
  deriveRuleSlug,
  validateAccessCodeGenerateParams,
  validateCompletionBonusParams,
  validateGenerateParams,
  validateGroupPointRuleParams,
  validateShopItemParams,
  validateTelegramLinkParams,
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
  emoji?: unknown;
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
      emoji: v.value.emoji,
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
  emoji?: unknown;
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
      emoji: v.value.emoji,
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

// ─── Référence Telegram du groupe ─────────────────────────────────────────────
// Même garde que les codes/magasin (authorizeGroupWrite : admin actif du
// groupe OU Super Admin, groupe actif requis) — accessible aux DEUX consoles
// (Master et la fiche groupe Super Admin), contrairement à renameGroupAction
// (Super Admin uniquement).

const TELEGRAM_REFERENCE_MAX_LENGTH = 500;

export type UpdateTelegramResult = { ok: true } | { ok: false; error: string };

export async function updateGroupTelegramAction(input: {
  locale: string;
  groupId: string;
  telegramReference: unknown;
}): Promise<UpdateTelegramResult> {
  const user = await currentUser();
  if (!user) return { ok: false, error: "unauthenticated" };

  const authz = await authorizeGroupWrite(user.id, input.groupId, user.email);
  if (authz !== "ok") return { ok: false, error: authz };

  if (typeof input.telegramReference !== "string") return { ok: false, error: "invalid_telegram" };
  const trimmed = input.telegramReference.trim();
  if (trimmed.length > TELEGRAM_REFERENCE_MAX_LENGTH) return { ok: false, error: "invalid_telegram" };
  const telegramReference = trimmed === "" ? null : trimmed;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("partner_groups")
    .update({ telegram_reference: telegramReference })
    .eq("id", input.groupId)
    .select("id");
  if (error) {
    console.error(`[master/telegram] update error group=${input.groupId}: ${error.message}`);
    return { ok: false, error: "db" };
  }
  if ((data?.length ?? 0) !== 1) return { ok: false, error: "not_found" };

  revalidatePath(`/${input.locale}/master/${input.groupId}`);
  revalidatePath(`/${input.locale}/admin/loyalty/groups/${input.groupId}`);
  return { ok: true };
}

// ─── Lien Telegram cliquable du groupe (group_telegram_link) ─────────────────
// Distinct de telegram_reference ci-dessus (texte libre, table
// partner_groups) : cette valeur DOIT toujours être un lien exploitable si
// non-null, validée par validateTelegramLinkParams (handle ou URL t.me,
// normalisée en https://t.me/… — jamais du texte arbitraire). Table dédiée
// group_telegram_link (migration 20260901170000), pas de policy d'écriture :
// toute écriture passe ici, en service_role, derrière authorizeGroupWrite —
// même garde que le champ voisin.

export type UpdateTelegramLinkResult = { ok: true; telegramLink: string | null } | { ok: false; error: string };

export async function updateGroupTelegramLinkAction(input: {
  locale: string;
  groupId: string;
  telegramLink: unknown;
}): Promise<UpdateTelegramLinkResult> {
  const user = await currentUser();
  if (!user) return { ok: false, error: "unauthenticated" };

  const authz = await authorizeGroupWrite(user.id, input.groupId, user.email);
  if (authz !== "ok") return { ok: false, error: authz };

  const v = validateTelegramLinkParams(input);
  if (!v.ok) return { ok: false, error: v.error };

  const admin = createAdminClient();
  const { error } = await admin
    .from("group_telegram_link")
    .upsert({ group_id: input.groupId, telegram_link: v.value.telegramLink }, { onConflict: "group_id" });
  if (error) {
    console.error(`[master/telegram-link] upsert error group=${input.groupId}: ${error.message}`);
    return { ok: false, error: "db" };
  }

  revalidatePath(`/${input.locale}/master/${input.groupId}`);
  revalidatePath(`/${input.locale}/fidelite/${input.groupId}`);
  revalidatePath(`/${input.locale}/fidelite`);
  return { ok: true, telegramLink: v.value.telegramLink };
}

// ─── Barème de points par groupe (group_point_rules) ─────────────────────────
// Même garde que le magasin/les codes : authorizeGroupWrite (admin actif du
// groupe OU Super Admin, groupe actif requis). Écriture exclusivement en
// service_role (aucune policy d'écriture sur group_point_rules — cf.
// migration 20260828130000). Le slug est dérivé du label UNE SEULE FOIS, à la
// création : il n'est plus jamais réécrit ensuite (updateGroupPointRuleAction
// ne touche que label/points) car il sert d'identité stable de l'action dans
// points_ledger.rule_slug — le renommer romprait le lien avec l'historique
// déjà crédité.

export type GroupPointRuleResult = { ok: true; ruleId: string } | { ok: false; error: string };

export async function createGroupPointRuleAction(input: {
  locale: string;
  groupId: string;
  label: unknown;
  points: unknown;
}): Promise<GroupPointRuleResult> {
  const user = await currentUser();
  if (!user) return { ok: false, error: "unauthenticated" };

  const authz = await authorizeGroupWrite(user.id, input.groupId, user.email);
  if (authz !== "ok") return { ok: false, error: authz };

  const v = validateGroupPointRuleParams(input);
  if (!v.ok) return { ok: false, error: v.error };

  const admin = createAdminClient();

  // sort_order = juste après la règle la plus basse existante du groupe (les
  // nouvelles actions apparaissent en bas de liste, réordonnables ensuite).
  const { data: lastRow } = await admin
    .from("group_point_rules")
    .select("sort_order")
    .eq("group_id", input.groupId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextSortOrder = (lastRow?.sort_order ?? -1) + 1;

  const base = deriveRuleSlug(v.value.label);
  const MAX_ATTEMPTS = 20;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const slug = attempt === 0 ? base : `${base}_${attempt + 1}`;
    const { data, error } = await admin
      .from("group_point_rules")
      .insert({
        group_id: input.groupId,
        slug,
        label: v.value.label,
        points: v.value.points,
        is_active: true,
        is_system: false,
        sort_order: nextSortOrder,
      })
      .select("id")
      .single();
    if (!error) {
      revalidatePath(`/${input.locale}/master/${input.groupId}/bareme`);
      return { ok: true, ruleId: data.id as string };
    }
    if (error.code === "23505") continue; // collision de slug → réessaie avec un suffixe
    console.error(`[master/bareme] create error group=${input.groupId}: ${error.message}`);
    return { ok: false, error: "db" };
  }
  return { ok: false, error: "collision" };
}

export async function updateGroupPointRuleAction(input: {
  locale: string;
  groupId: string;
  ruleId: string;
  label: unknown;
  points: unknown;
}): Promise<GroupPointRuleResult> {
  const user = await currentUser();
  if (!user) return { ok: false, error: "unauthenticated" };

  const authz = await authorizeGroupWrite(user.id, input.groupId, user.email);
  if (authz !== "ok") return { ok: false, error: authz };

  const v = validateGroupPointRuleParams(input);
  if (!v.ok) return { ok: false, error: v.error };

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("group_point_rules")
    .update({ label: v.value.label, points: v.value.points })
    .eq("id", input.ruleId)
    .eq("group_id", input.groupId)
    .select("id");

  if (error) {
    console.error(`[master/bareme] update error rule=${input.ruleId}: ${error.message}`);
    return { ok: false, error: "db" };
  }
  if ((data?.length ?? 0) !== 1) return { ok: false, error: "not_found" };

  revalidatePath(`/${input.locale}/master/${input.groupId}/bareme`);
  return { ok: true, ruleId: input.ruleId };
}

export async function toggleGroupPointRuleStatusAction(input: {
  locale: string;
  groupId: string;
  ruleId: string;
  nextActive: boolean;
}): Promise<GroupPointRuleResult> {
  const user = await currentUser();
  if (!user) return { ok: false, error: "unauthenticated" };

  const authz = await authorizeGroupWrite(user.id, input.groupId, user.email);
  if (authz !== "ok") return { ok: false, error: authz };

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("group_point_rules")
    .update({ is_active: input.nextActive })
    .eq("id", input.ruleId)
    .eq("group_id", input.groupId)
    .select("id");

  if (error) {
    console.error(`[master/bareme] toggle error rule=${input.ruleId}: ${error.message}`);
    return { ok: false, error: "db" };
  }
  if ((data?.length ?? 0) !== 1) return { ok: false, error: "not_found" };

  revalidatePath(`/${input.locale}/master/${input.groupId}/bareme`);
  return { ok: true, ruleId: input.ruleId };
}

export type DeleteGroupPointRuleResult = { ok: true } | { ok: false; error: string };

export async function deleteGroupPointRuleAction(input: {
  locale: string;
  groupId: string;
  ruleId: string;
}): Promise<DeleteGroupPointRuleResult> {
  const user = await currentUser();
  if (!user) return { ok: false, error: "unauthenticated" };

  const authz = await authorizeGroupWrite(user.id, input.groupId, user.email);
  if (authz !== "ok") return { ok: false, error: authz };

  const admin = createAdminClient();

  // is_system se vérifie AVANT le delete (jamais une confiance dans un input
  // client) : les 3 actions semées par défaut ne sont jamais supprimables,
  // seulement renommables/repointables/désactivables.
  const { data: row, error: readErr } = await admin
    .from("group_point_rules")
    .select("is_system")
    .eq("id", input.ruleId)
    .eq("group_id", input.groupId)
    .maybeSingle();
  if (readErr) {
    console.error(`[master/bareme] read error rule=${input.ruleId}: ${readErr.message}`);
    return { ok: false, error: "db" };
  }
  if (!row) return { ok: false, error: "not_found" };
  if (row.is_system) return { ok: false, error: "is_system" };

  const { error } = await admin
    .from("group_point_rules")
    .delete()
    .eq("id", input.ruleId)
    .eq("group_id", input.groupId)
    .eq("is_system", false);
  if (error) {
    console.error(`[master/bareme] delete error rule=${input.ruleId}: ${error.message}`);
    return { ok: false, error: "db" };
  }

  revalidatePath(`/${input.locale}/master/${input.groupId}/bareme`);
  return { ok: true };
}

/**
 * Échange le sort_order de la règle `ruleId` avec son voisin immédiat
 * (direction "up" = voisin précédent, "down" = voisin suivant). No-op (ok:true)
 * si la règle est déjà en bout de liste dans cette direction. Deux UPDATE
 * séquentiels non transactionnels : risque de contention négligeable (écran
 * admin, un seul opérateur à la fois en pratique).
 */
export async function reorderGroupPointRuleAction(input: {
  locale: string;
  groupId: string;
  ruleId: string;
  direction: "up" | "down";
}): Promise<GroupPointRuleResult> {
  const user = await currentUser();
  if (!user) return { ok: false, error: "unauthenticated" };

  const authz = await authorizeGroupWrite(user.id, input.groupId, user.email);
  if (authz !== "ok") return { ok: false, error: authz };

  if (input.direction !== "up" && input.direction !== "down") {
    return { ok: false, error: "invalid_direction" };
  }

  const admin = createAdminClient();
  const { data: rows, error } = await admin
    .from("group_point_rules")
    .select("id, sort_order")
    .eq("group_id", input.groupId)
    .order("sort_order", { ascending: true });
  if (error || !rows) {
    console.error(`[master/bareme] reorder read error group=${input.groupId}: ${error?.message}`);
    return { ok: false, error: "db" };
  }

  const idx = rows.findIndex((r) => r.id === input.ruleId);
  if (idx === -1) return { ok: false, error: "not_found" };

  const neighborIdx = input.direction === "up" ? idx - 1 : idx + 1;
  if (neighborIdx < 0 || neighborIdx >= rows.length) {
    return { ok: true, ruleId: input.ruleId }; // déjà en bout de liste : no-op
  }

  const current = rows[idx];
  const neighbor = rows[neighborIdx];
  const [r1, r2] = await Promise.all([
    admin.from("group_point_rules").update({ sort_order: neighbor.sort_order }).eq("id", current.id),
    admin.from("group_point_rules").update({ sort_order: current.sort_order }).eq("id", neighbor.id),
  ]);
  if (r1.error || r2.error) {
    console.error(`[master/bareme] reorder write error group=${input.groupId}: ${r1.error?.message ?? r2.error?.message}`);
    return { ok: false, error: "db" };
  }

  revalidatePath(`/${input.locale}/master/${input.groupId}/bareme`);
  return { ok: true, ruleId: input.ruleId };
}

// ─── Bonus mensuel de complétion (group_completion_bonus) ─────────────────────
// Même garde que le barème (authorizeGroupWrite : admin actif du groupe OU
// Super Admin, groupe actif requis). Écriture exclusivement en service_role
// (aucune policy d'écriture sur ces deux tables — migration 20260901160000).
//
// Deux écritures séquentielles non transactionnelles (upsert du bonus, puis
// remplacement intégral de sa composition) : même tolérance que
// reorderGroupPointRuleAction ci-dessus (écran admin, un seul opérateur à la
// fois en pratique). Un déclenchement de bonus concurrent pendant cette
// fenêtre reste sûr : l'idempotence du versement repose sur l'index unique
// partiel de points_ledger (migration 20260901160000), jamais sur l'état de
// ces deux tables de configuration.

export type CompletionBonusResult = { ok: true } | { ok: false; error: string };

export async function upsertGroupCompletionBonusAction(input: {
  locale: string;
  groupId: string;
  points: unknown;
  ruleSlugs: unknown;
  isActive: unknown;
}): Promise<CompletionBonusResult> {
  const user = await currentUser();
  if (!user) return { ok: false, error: "unauthenticated" };

  const authz = await authorizeGroupWrite(user.id, input.groupId, user.email);
  if (authz !== "ok") return { ok: false, error: authz };

  const admin = createAdminClient();

  // Ensemble validé UNIQUEMENT contre les slugs des règles ACTIVES du groupe
  // au moment de l'appel — jamais une confiance dans les slugs fournis par le
  // client (cf. validateCompletionBonusParams).
  const { data: activeRules, error: rulesErr } = await admin
    .from("group_point_rules")
    .select("slug")
    .eq("group_id", input.groupId)
    .eq("is_active", true);
  if (rulesErr) {
    console.error(`[master/completion-bonus] read rules error group=${input.groupId}: ${rulesErr.message}`);
    return { ok: false, error: "db" };
  }
  const validSlugs = new Set((activeRules ?? []).map((r) => r.slug as string));

  const v = validateCompletionBonusParams(input, validSlugs);
  if (!v.ok) return { ok: false, error: v.error };

  const { data: bonus, error: upsertErr } = await admin
    .from("group_completion_bonus")
    .upsert(
      { group_id: input.groupId, points: v.value.points, is_active: v.value.isActive },
      { onConflict: "group_id" },
    )
    .select("id")
    .single();
  if (upsertErr || !bonus) {
    console.error(`[master/completion-bonus] upsert error group=${input.groupId}: ${upsertErr?.message}`);
    return { ok: false, error: "db" };
  }

  // Remplacement intégral de la composition : plus simple et aussi fiable
  // qu'un diff insert/delete pour une liste courte (checkboxes), même
  // principe que la ré-écriture complète pratiquée ailleurs sur ce genre
  // d'écran (aucun historique à préserver sur cette table de configuration).
  const { error: delErr } = await admin.from("group_completion_bonus_rules").delete().eq("bonus_id", bonus.id);
  if (delErr) {
    console.error(`[master/completion-bonus] delete rules error group=${input.groupId}: ${delErr.message}`);
    return { ok: false, error: "db" };
  }

  const { error: insErr } = await admin
    .from("group_completion_bonus_rules")
    .insert(v.value.ruleSlugs.map((rule_slug) => ({ bonus_id: bonus.id, rule_slug })));
  if (insErr) {
    console.error(`[master/completion-bonus] insert rules error group=${input.groupId}: ${insErr.message}`);
    return { ok: false, error: "db" };
  }

  revalidatePath(`/${input.locale}/master/${input.groupId}/bareme`);
  return { ok: true };
}
