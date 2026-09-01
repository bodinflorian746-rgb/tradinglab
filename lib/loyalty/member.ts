// Couche de LECTURE de l'espace Membre (« Fidélité ») — SERVER-ONLY.
//
// Comme lib/loyalty/master.ts : lectures via le client de SESSION de
// l'utilisateur → soumises à la RLS (policies `auth.uid() = user_id`), donc
// un membre ne peut techniquement lire que SES propres opérations, même en
// cas de bug applicatif (dernier rempart). En DEV_AUTH_BYPASS, lecture en
// service_role (l'utilisateur mocké n'a pas de vraie session JWT).
//
// Solde et niveau ne sont jamais stockés : calculés à la volée depuis le
// ledger via les fonctions pures de lib/loyalty/points.ts.

import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isDevAuthBypass, DEV_USER } from "@/lib/dev-auth";
import {
  computeBalance,
  computeEarnedTotal,
  tierForEarned,
  type LedgerAmount,
} from "@/lib/loyalty/points";
import { COMPLETION_BONUS_SLUG, isCompletionSetFulfilled, membershipCycleWindow } from "@/lib/loyalty/completion-bonus";
import type { GroupPointRule, PartnerGroup, Tier } from "@/lib/loyalty/types";

async function readClient() {
  return isDevAuthBypass() ? createAdminClient() : await createClient();
}

export type CurrentMember = { id: string; email: string };

/** Utilisateur courant (connecté), sans exigence d'appartenance à un groupe. */
export async function getCurrentMember(): Promise<CurrentMember | null> {
  if (isDevAuthBypass()) return { id: DEV_USER.id, email: DEV_USER.email ?? "" };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return { id: user.id, email: user.email ?? "" };
}

/** Pseudo public du membre courant — lecture RLS (profiles_select : auth.uid() = id). */
export async function getMyUsername(userId: string): Promise<string | null> {
  const supabase = await readClient();
  const { data, error } = await supabase.from("profiles").select("username").eq("id", userId).maybeSingle();
  if (error || !data) return null;
  return data.username as string;
}

/**
 * Actions du barème ACTIVES d'un groupe — onglet "Gagner" de l'espace membre.
 * RLS group_point_rules_select (is_group_member) couvre déjà membre ET admin ;
 * le .eq("is_active", true) est redondant avec l'usage prévu mais explicite.
 */
export async function listActiveGroupPointRules(
  groupId: string,
): Promise<{ rows: GroupPointRule[]; error: string | null }> {
  const supabase = await readClient();
  const { data, error } = await supabase
    .from("group_point_rules")
    .select("id, group_id, slug, label, points, is_active, is_system, sort_order, created_at, updated_at")
    .eq("group_id", groupId)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) return { rows: [], error: error.message };
  return { rows: (data ?? []) as GroupPointRule[], error: null };
}

/**
 * Liens Telegram cliquables (group_telegram_link, migration 20260901170000)
 * des groupes demandés, pour l'onglet "Gagner". `null` (absent de la map ou
 * valeur null) = aucun lien configuré → la phrase reste en texte simple côté
 * UI, jamais un lien mort. Bulk (Map par group_id) pour la landing /fidelite
 * qui affiche plusieurs groupes à la fois ; appelée avec un seul id pour
 * /fidelite/[groupId].
 */
export async function listGroupTelegramLinks(groupIds: string[]): Promise<Map<string, string | null>> {
  if (groupIds.length === 0) return new Map();
  const supabase = await readClient();
  const { data } = await supabase.from("group_telegram_link").select("group_id, telegram_link").in("group_id", groupIds);
  return new Map((data ?? []).map((r) => [r.group_id as string, r.telegram_link as string | null]));
}

export type MemberWallet = {
  group: PartnerGroup;
  balance: number;
  earnedTotal: number;
  tier: Tier;
};

type LedgerRow = { group_id: string; amount: number; kind: LedgerAmount["kind"] };

function walletFromLedger(group: PartnerGroup, rows: LedgerAmount[]): MemberWallet {
  const earnedTotal = computeEarnedTotal(rows);
  return {
    group,
    balance: computeBalance(rows),
    earnedTotal,
    tier: tierForEarned(earnedTotal),
  };
}

export type MyGroupMembership = {
  membershipId: string;
  group: PartnerGroup;
  role: "admin" | "member";
  joinedAt: string;
};

/**
 * Groupes où l'utilisateur est membre ACTIF (tous rôles), pour l'espace
 * Mon compte (rattachement/quitter un groupe) — distinct de getMyWallets qui
 * charge en plus le ledger, inutile ici.
 */
export async function getMyGroupMemberships(userId: string): Promise<MyGroupMembership[]> {
  const supabase = await readClient();

  const { data: memberships, error: mErr } = await supabase
    .from("group_memberships")
    .select("id, group_id, role, joined_at")
    .eq("user_id", userId)
    .eq("status", "active");
  if (mErr) {
    console.error(`[loyalty/member] getMyGroupMemberships memberships: ${mErr.message}`);
    return [];
  }
  const rows = memberships ?? [];
  if (rows.length === 0) return [];

  const groupIds = rows.map((m) => m.group_id as string);
  const { data: groups, error: gErr } = await supabase
    .from("partner_groups")
    .select("id, name, slug, telegram_reference, status, created_by, created_at, updated_at")
    .in("id", groupIds);
  if (gErr) {
    console.error(`[loyalty/member] getMyGroupMemberships groups: ${gErr.message}`);
    return [];
  }
  const groupById = new Map((groups as PartnerGroup[]).map((g) => [g.id, g]));

  return rows
    .map((m) => {
      const group = groupById.get(m.group_id as string);
      if (!group) return null;
      return {
        membershipId: m.id as string,
        group,
        role: m.role as "admin" | "member",
        joinedAt: m.joined_at as string,
      };
    })
    .filter((x): x is MyGroupMembership => x !== null);
}

/** Un portefeuille par groupe où l'utilisateur est membre ACTIF. */
export async function getMyWallets(userId: string): Promise<MemberWallet[]> {
  const supabase = await readClient();

  const { data: memberships, error: mErr } = await supabase
    .from("group_memberships")
    .select("group_id")
    .eq("user_id", userId)
    .eq("status", "active");
  if (mErr) {
    console.error(`[loyalty/member] getMyWallets memberships: ${mErr.message}`);
    return [];
  }
  const groupIds = (memberships ?? []).map((m) => m.group_id as string);
  if (groupIds.length === 0) return [];

  const [groupsRes, ledgerRes] = await Promise.all([
    supabase
      .from("partner_groups")
      .select("id, name, slug, telegram_reference, status, created_by, created_at, updated_at")
      .in("id", groupIds),
    supabase
      .from("points_ledger")
      .select("group_id, amount, kind")
      .eq("user_id", userId)
      .in("group_id", groupIds),
  ]);
  if (groupsRes.error) {
    console.error(`[loyalty/member] getMyWallets groups: ${groupsRes.error.message}`);
    return [];
  }
  if (ledgerRes.error) {
    console.error(`[loyalty/member] getMyWallets ledger: ${ledgerRes.error.message}`);
  }
  const ledger = (ledgerRes.data ?? []) as LedgerRow[];

  return (groupsRes.data as PartnerGroup[]).map((group) =>
    walletFromLedger(
      group,
      ledger.filter((r) => r.group_id === group.id),
    ),
  );
}

/**
 * Détail du portefeuille pour UN groupe. Renvoie `wallet: null` (sans erreur)
 * si l'utilisateur n'est pas membre actif de ce groupe → la page appelante
 * doit alors répondre 404 (aucune fuite d'existence du groupe).
 */
export async function getWalletDetail(
  userId: string,
  groupId: string,
): Promise<{ wallet: MemberWallet | null; error: string | null }> {
  const supabase = await readClient();

  const { data: membership, error: mErr } = await supabase
    .from("group_memberships")
    .select("status")
    .eq("user_id", userId)
    .eq("group_id", groupId)
    .eq("status", "active")
    .maybeSingle();
  if (mErr) return { wallet: null, error: mErr.message };
  if (!membership) return { wallet: null, error: null };

  const [groupRes, ledgerRes] = await Promise.all([
    supabase
      .from("partner_groups")
      .select("id, name, slug, telegram_reference, status, created_by, created_at, updated_at")
      .eq("id", groupId)
      .maybeSingle(),
    supabase.from("points_ledger").select("group_id, amount, kind").eq("user_id", userId).eq("group_id", groupId),
  ]);
  if (groupRes.error || !groupRes.data) {
    return { wallet: null, error: groupRes.error?.message ?? null };
  }
  if (ledgerRes.error) return { wallet: null, error: ledgerRes.error.message };

  return {
    wallet: walletFromLedger(groupRes.data as PartnerGroup, (ledgerRes.data ?? []) as LedgerRow[]),
    error: null,
  };
}

export type MemberLedgerRow = {
  id: string;
  kind: string;
  amount: number;
  points_code: string | null;
  reason: string | null;
  created_at: string;
};

export type Paged<T> = { rows: T[]; total: number; error: string | null };

/** Historique paginé des opérations du membre pour un groupe (les siennes uniquement). */
export async function listMyLedger(
  userId: string,
  groupId: string,
  opts: { page?: number; pageSize?: number } = {},
): Promise<Paged<MemberLedgerRow>> {
  const supabase = await readClient();
  const page = opts.page ?? 1;
  const pageSize = opts.pageSize ?? 25;
  const from = (page - 1) * pageSize;

  const { data, error, count } = await supabase
    .from("points_ledger")
    .select("id, kind, amount, points_code, reason, created_at", { count: "exact" })
    .eq("user_id", userId)
    .eq("group_id", groupId)
    .order("created_at", { ascending: false })
    .range(from, from + pageSize - 1);
  if (error) return { rows: [], total: 0, error: error.message };
  return { rows: (data ?? []) as MemberLedgerRow[], total: count ?? 0, error: null };
}

export type CompletionBonusRuleStatus = { slug: string; label: string; done: boolean };

export type CompletionBonusStatus = {
  points: number;
  rules: CompletionBonusRuleStatus[];
  completedCount: number;
  totalCount: number;
  complete: boolean;
  alreadyAwardedThisCycle: boolean;
  daysRemaining: number;
};

/**
 * Progression du membre courant sur le bonus de complétion de SON cycle en
 * cours (30 jours glissants ancrés sur son adhésion, group_memberships
 * .joined_at — pas le mois calendaire, cf. lib/loyalty/completion-bonus.ts),
 * pour l'onglet "Gagner" de l'espace membre. `status: null` signifie "rien à
 * afficher" (aucun bonus configuré, bonus inactif, ensemble vide, ou membre
 * non actif de ce groupe) — la page appelante n'affiche alors aucun bloc
 * bonus, jamais un message d'erreur. points_ledger et group_memberships sont
 * lus via readClient() (RLS `auth.uid() = user_id`) : ce membre ne peut
 * techniquement voir QUE ses propres lignes, même en cas de bug applicatif.
 */
export async function getMyCompletionBonusStatus(
  userId: string,
  groupId: string,
): Promise<{ status: CompletionBonusStatus | null; error: string | null }> {
  const supabase = await readClient();

  const [bonusRes, membershipRes] = await Promise.all([
    supabase
      .from("group_completion_bonus")
      .select("id, points")
      .eq("group_id", groupId)
      .eq("is_active", true)
      .maybeSingle(),
    supabase
      .from("group_memberships")
      .select("joined_at")
      .eq("group_id", groupId)
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle(),
  ]);
  if (bonusRes.error) return { status: null, error: bonusRes.error.message };
  if (!bonusRes.data) return { status: null, error: null };
  if (membershipRes.error) return { status: null, error: membershipRes.error.message };
  // Pas (ou plus) membre actif de ce groupe : aucun cycle à afficher.
  if (!membershipRes.data) return { status: null, error: null };
  const bonusRow = bonusRes.data;

  const { data: ruleRows, error: rErr } = await supabase
    .from("group_completion_bonus_rules")
    .select("rule_slug")
    .eq("bonus_id", bonusRow.id);
  if (rErr) return { status: null, error: rErr.message };
  const requiredSlugs = (ruleRows ?? []).map((r) => r.rule_slug as string);
  if (requiredSlugs.length === 0) return { status: null, error: null };

  // Cycle DE CE MEMBRE, ancré sur son adhésion.
  const { start, end, daysRemaining } = membershipCycleWindow(
    new Date(membershipRes.data.joined_at as string).getTime(),
    Date.now(),
  );

  const [defsRes, creditsRes] = await Promise.all([
    // Labels lisibles : le barème ACTUEL. Cas limite improbable (règle
    // supprimée depuis) → fallback au slug brut ci-dessous, jamais bloquant.
    supabase.from("group_point_rules").select("slug, label").eq("group_id", groupId).in("slug", requiredSlugs),
    supabase
      .from("points_ledger")
      .select("rule_slug")
      .eq("group_id", groupId)
      .eq("user_id", userId)
      .eq("kind", "manual_credit")
      .gte("created_at", start)
      .lt("created_at", end),
  ]);
  if (creditsRes.error) return { status: null, error: creditsRes.error.message };

  const labelBySlug = new Map((defsRes.data ?? []).map((r) => [r.slug as string, r.label as string]));
  const creditedSlugs = new Set((creditsRes.data ?? []).map((r) => r.rule_slug as string));

  const rules = requiredSlugs.map((slug) => ({
    slug,
    label: labelBySlug.get(slug) ?? slug,
    done: creditedSlugs.has(slug),
  }));
  const completedCount = rules.filter((r) => r.done).length;

  return {
    status: {
      points: bonusRow.points as number,
      rules,
      completedCount,
      totalCount: rules.length,
      complete: isCompletionSetFulfilled(requiredSlugs, creditedSlugs),
      alreadyAwardedThisCycle: creditedSlugs.has(COMPLETION_BONUS_SLUG),
      daysRemaining,
    },
    error: null,
  };
}
