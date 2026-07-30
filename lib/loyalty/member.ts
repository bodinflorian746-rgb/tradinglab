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
import type { PartnerGroup, Tier } from "@/lib/loyalty/types";

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
