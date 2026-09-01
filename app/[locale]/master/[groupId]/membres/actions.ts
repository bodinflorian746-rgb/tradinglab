"use server";

// Server Action — crédit d'une contribution affilié. Anciennement
// crediter/actions.ts (Sprint 1) : déplacée ici car l'écran de crédit est
// désormais fusionné dans membres/page.tsx (une seule recherche pseudo/email,
// deux écrans séparés faisaient doublon).
//
// Même pattern que leaveGroupAction / updateUsernameAction (compte/actions.ts) :
// input objet typé, user.id TOUJOURS relu côté serveur depuis la session
// (jamais reçu du client — seuls groupId/userId(cible)/ruleSlug sont des
// inputs non fiables), écriture via createAdminClient() (service_role — aucune
// policy INSERT pour authenticated sur points_ledger ni group_point_rules),
// retour en union discriminée.
//
// Garde d'accès : canManageGroup(userId, userEmail, groupId) — re-vérifie
// group_id côté serveur via group_memberships (ou le bypass Super Admin
// ADMIN_EMAILS), jamais une confiance aveugle dans l'input.groupId.
//
// Le MONTANT n'est JAMAIS reçu du client : il est lu dans group_point_rules
// (is_active=true) au moment du crédit. rule_slug/rule_label sont copiés
// dans la ligne de ledger à cet instant précis (figent le libellé, cf.
// migration 20260828130000). Le ledger est append-only (trigger bloquant) :
// un double-crédit ne s'annule pas d'ici, c'est pourquoi CreditButtons
// désactive le bouton pendant la requête (anti double-clic côté UI).
//
// Après le crédit normal : évaluation du bonus de complétion
// (evaluateAndPayCompletionBonus, cf. migration 20260901160000) — ce crédit
// vient peut-être de compléter l'ensemble configuré par l'admin pour ce
// membre, dans SON cycle de 30 jours ancré sur son adhésion (group_memberships
// .joined_at) — pas le mois calendaire, cf. lib/loyalty/completion-bonus.ts.

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { canManageGroup } from "@/lib/loyalty/access";
import {
  COMPLETION_BONUS_LABEL,
  COMPLETION_BONUS_SLUG,
  isCompletionSetFulfilled,
  membershipCycleWindow,
} from "@/lib/loyalty/completion-bonus";

export type CreditContributionResult =
  | { ok: true; amount: number; label: string; bonusAwarded: number | null }
  | { ok: false; error: "unauthenticated" | "forbidden" | "rule_not_found" | "not_member" | "db" };

/**
 * Évalue le bonus de complétion du groupe pour CE membre après un crédit
 * normal, et le verse s'il est mérité. Aucune donnée reçue du client :
 * groupId/userId/createdBy viennent tous d'un contexte déjà autorisé par
 * l'appelant (creditContributionAction).
 *
 * Idempotence : une lecture applicative (rapide, évite un aller-retour
 * inutile la plupart du temps) PUIS un INSERT dont l'idempotence réelle
 * repose sur l'index unique partiel de points_ledger (migration
 * 20260901160000) — un doublon (double-clic, requêtes concurrentes) échoue en
 * 23505, traité ici comme "déjà versé", jamais comme une erreur. N'échoue
 * jamais le crédit normal qui vient d'avoir lieu : toute erreur ici est
 * journalisée et absorbée (retour null), le crédit demandé par l'admin reste
 * acquis dans tous les cas.
 */
async function evaluateAndPayCompletionBonus(
  admin: SupabaseClient,
  input: { groupId: string; userId: string; membershipId: string; joinedAt: string; createdBy: string },
): Promise<number | null> {
  const { data: bonus, error: bErr } = await admin
    .from("group_completion_bonus")
    .select("id, points")
    .eq("group_id", input.groupId)
    .eq("is_active", true)
    .maybeSingle();
  if (bErr) {
    console.error(`[membres/completion-bonus] read bonus error group=${input.groupId}: ${bErr.message}`);
    return null;
  }
  if (!bonus) return null;

  const { data: ruleRows, error: rErr } = await admin
    .from("group_completion_bonus_rules")
    .select("rule_slug")
    .eq("bonus_id", bonus.id);
  if (rErr) {
    console.error(`[membres/completion-bonus] read rules error group=${input.groupId}: ${rErr.message}`);
    return null;
  }
  const requiredSlugs = (ruleRows ?? []).map((r) => r.rule_slug as string);
  if (requiredSlugs.length === 0) return null;

  // Cycle DE CE MEMBRE, ancré sur son adhésion — pas le mois calendaire.
  const { cycleNumber, start, end } = membershipCycleWindow(new Date(input.joinedAt).getTime(), Date.now());

  const { data: creditRows, error: cErr } = await admin
    .from("points_ledger")
    .select("rule_slug")
    .eq("group_id", input.groupId)
    .eq("user_id", input.userId)
    .eq("kind", "manual_credit")
    .gte("created_at", start)
    .lt("created_at", end);
  if (cErr) {
    console.error(
      `[membres/completion-bonus] read credits error group=${input.groupId} user=${input.userId}: ${cErr.message}`,
    );
    return null;
  }
  const creditedSlugs = new Set((creditRows ?? []).map((r) => r.rule_slug as string));

  // Déjà versé sur ce cycle (vérif applicative — l'idempotence réelle est
  // portée par l'index unique (completion_bonus_membership_id,
  // completion_bonus_cycle) de points_ledger, cf. entête de fonction).
  if (creditedSlugs.has(COMPLETION_BONUS_SLUG)) return null;
  if (!isCompletionSetFulfilled(requiredSlugs, creditedSlugs)) return null;

  const { error: insErr } = await admin.from("points_ledger").insert({
    group_id: input.groupId,
    user_id: input.userId,
    kind: "manual_credit",
    amount: bonus.points,
    reason: COMPLETION_BONUS_LABEL,
    rule_slug: COMPLETION_BONUS_SLUG,
    rule_label: COMPLETION_BONUS_LABEL,
    created_by: input.createdBy,
    completion_bonus_membership_id: input.membershipId,
    completion_bonus_cycle: cycleNumber,
  });
  if (insErr) {
    // 23505 = déjà versé sur ce cycle (course concurrente bloquée par l'index
    // unique partiel) : comportement attendu, pas une erreur.
    if (insErr.code !== "23505") {
      console.error(
        `[membres/completion-bonus] insert error group=${input.groupId} user=${input.userId}: ${insErr.message}`,
      );
    }
    return null;
  }

  return bonus.points as number;
}

export async function creditContributionAction(input: {
  locale: string;
  groupId: string;
  userId: string;
  ruleSlug: string;
}): Promise<CreditContributionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "unauthenticated" };

  const allowed = await canManageGroup(user.id, user.email, input.groupId);
  if (!allowed) return { ok: false, error: "forbidden" };

  const admin = createAdminClient();

  // Le montant vient EXCLUSIVEMENT d'ici — jamais d'un champ du formulaire.
  const { data: rule, error: ruleErr } = await admin
    .from("group_point_rules")
    .select("slug, label, points, is_active")
    .eq("group_id", input.groupId)
    .eq("slug", input.ruleSlug)
    .maybeSingle();
  if (ruleErr) {
    console.error(`[membres/credit] lecture règle échouée group=${input.groupId} slug=${input.ruleSlug}: ${ruleErr.message}`);
    return { ok: false, error: "db" };
  }
  if (!rule || !rule.is_active) return { ok: false, error: "rule_not_found" };

  // Défense en profondeur : userId (membre ciblé) est un input non fiable —
  // on vérifie qu'il appartient bien, activement, à CE groupe. canManageGroup
  // n'a vérifié que les droits de l'ADMIN sur le groupe, pas le lien entre le
  // membre ciblé et ce même groupe.
  const { data: membership, error: memErr } = await admin
    .from("group_memberships")
    .select("id, joined_at")
    .eq("group_id", input.groupId)
    .eq("user_id", input.userId)
    .eq("status", "active")
    .maybeSingle();
  if (memErr) {
    console.error(`[membres/credit] lecture membership échouée group=${input.groupId} user=${input.userId}: ${memErr.message}`);
    return { ok: false, error: "db" };
  }
  if (!membership) return { ok: false, error: "not_member" };

  const { error: insErr } = await admin.from("points_ledger").insert({
    group_id: input.groupId,
    user_id: input.userId,
    kind: "manual_credit",
    amount: rule.points,
    reason: rule.label,
    rule_slug: rule.slug,
    rule_label: rule.label,
    created_by: user.id,
  });
  if (insErr) {
    console.error(`[membres/credit] insert ledger échoué group=${input.groupId} user=${input.userId}: ${insErr.message}`);
    return { ok: false, error: "db" };
  }

  // Évalué APRÈS le crédit normal, sur ce même admin client : ce crédit vient
  // peut-être de compléter l'ensemble du cycle en cours de CE membre. Ne peut
  // jamais faire échouer la réponse — le crédit demandé par l'admin est déjà
  // acquis.
  const bonusAwarded = await evaluateAndPayCompletionBonus(admin, {
    groupId: input.groupId,
    userId: input.userId,
    membershipId: membership.id as string,
    joinedAt: membership.joined_at as string,
    createdBy: user.id,
  });

  revalidatePath(`/${input.locale}/master/${input.groupId}/membres`);
  return { ok: true, amount: rule.points, label: rule.label, bonusAwarded };
}
