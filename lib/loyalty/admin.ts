// Couche d'accès aux données de la console Super Admin fidélité — SERVER-ONLY.
//
// Règles (cf. cahier des charges phase 2) :
//   • lecture seule : AUCUN insert / update / delete ici ;
//   • vérification Super Admin (ADMIN_EMAILS / isAdmin) avant chaque lecture ;
//   • lectures via service_role (createAdminClient) — jamais exposé au client ;
//   • aucune donnée retournée si l'autorisation échoue ;
//   • agrégations centralisées (pas de requêtes dispersées dans les pages).
//
// L'agrégation des sommes se fait en TS (admin-format.ts) sur des colonnes
// minimales : l'API d'agrégats PostgREST est désactivée et aucun DDL n'est
// déployable ici. Limite : pour rester correct au-delà de la limite de lignes
// PostgREST (~1000/req), on pagine la lecture d'agrégation jusqu'à un plafond
// de sécurité (AGG_ROW_CAP) et on signale une éventuelle troncature.

import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/auth/admin";
import {
  buildGroupsWithStats,
  buildOverview,
  type CodeStatRow,
  type LedgerStatRow,
  type LoyaltyOverview,
  type MembershipStatRow,
  type PartnerGroupWithStats,
} from "@/lib/loyalty/admin-format";
import type { PartnerGroup } from "@/lib/loyalty/types";

/** Plafond de lignes agrégées en TS (garde-fou mémoire, cf. entête). */
const AGG_ROW_CAP = 50_000;
const PAGE = 1_000; // limite pratique par requête PostgREST

export class UnauthorizedError extends Error {
  constructor() {
    super("unauthorized");
    this.name = "UnauthorizedError";
  }
}

export type CurrentAdmin = { id: string; email: string };

/**
 * Renvoie l'admin courant s'il figure dans ADMIN_EMAILS, sinon null.
 * À utiliser pour le guard de page (→ notFound si null).
 */
export async function getCurrentSuperAdmin(): Promise<CurrentAdmin | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return null;
  return { id: user.id, email: user.email as string };
}

/** Défense en profondeur : lève UnauthorizedError si l'appelant n'est pas admin. */
async function requireSuperAdmin(): Promise<CurrentAdmin> {
  const admin = await getCurrentSuperAdmin();
  if (!admin) throw new UnauthorizedError();
  return admin;
}

// ─── Lecture paginée complète (pour agrégation TS) ──────────────────────────
async function fetchAllMinimal<T>(
  table: string,
  columns: string,
): Promise<{ rows: T[]; truncated: boolean }> {
  const db = createAdminClient();
  const rows: T[] = [];
  for (let from = 0; from < AGG_ROW_CAP; from += PAGE) {
    const to = Math.min(from + PAGE, AGG_ROW_CAP) - 1;
    const { data, error } = await db.from(table).select(columns).range(from, to);
    if (error) throw new Error(`[loyalty/admin] read ${table}: ${error.message}`);
    const batch = (data ?? []) as T[];
    rows.push(...batch);
    if (batch.length < to - from + 1) return { rows, truncated: false };
  }
  return { rows, truncated: true };
}

// ─── 1. Synthèse globale + liste des groupes (même page) ─────────────────────
export type OverviewAndGroups = {
  overview: LoyaltyOverview;
  groups: PartnerGroupWithStats[];
  truncated: boolean;
  error: string | null;
};

export async function getOverviewAndGroups(): Promise<OverviewAndGroups> {
  await requireSuperAdmin();
  try {
    const [g, m, c, l] = await Promise.all([
      fetchAllMinimal<PartnerGroup>(
        "partner_groups",
        "id, name, slug, telegram_reference, status, created_by, created_at, updated_at",
      ),
      fetchAllMinimal<MembershipStatRow>("group_memberships", "group_id, role, status"),
      fetchAllMinimal<CodeStatRow>("points_codes", "group_id, status, points_value"),
      fetchAllMinimal<LedgerStatRow>("points_ledger", "group_id, amount, kind"),
    ]);
    const overview = buildOverview(g.rows, m.rows, c.rows, l.rows);
    const groups = buildGroupsWithStats(g.rows, m.rows, c.rows, l.rows);
    return {
      overview,
      groups,
      truncated: g.truncated || m.truncated || c.truncated || l.truncated,
      error: null,
    };
  } catch (err) {
    return {
      overview: buildOverview([], [], [], []),
      groups: [],
      truncated: false,
      error: err instanceof Error ? err.message : "Erreur de lecture.",
    };
  }
}

// ─── 2. Détail d'un groupe : infos + stats scopées ───────────────────────────
export type GroupDetail = {
  group: PartnerGroup;
  stats: PartnerGroupWithStats["stats"];
};

export async function getGroupDetail(
  groupId: string,
): Promise<{ detail: GroupDetail | null; error: string | null }> {
  await requireSuperAdmin();
  const db = createAdminClient();
  try {
    const { data: group, error: gErr } = await db
      .from("partner_groups")
      .select(
        "id, name, slug, telegram_reference, status, created_by, created_at, updated_at",
      )
      .eq("id", groupId)
      .maybeSingle();
    if (gErr) throw new Error(gErr.message);
    if (!group) return { detail: null, error: null };

    // Stats scopées au groupe (isolation : .eq('group_id', groupId) partout).
    const [m, c, l] = await Promise.all([
      db.from("group_memberships").select("group_id, role, status").eq("group_id", groupId),
      db.from("points_codes").select("group_id, status, points_value").eq("group_id", groupId),
      db.from("points_ledger").select("group_id, amount, kind").eq("group_id", groupId),
    ]);
    for (const r of [m, c, l]) {
      if (r.error) throw new Error(r.error.message);
    }
    const [withStats] = buildGroupsWithStats(
      [group as PartnerGroup],
      (m.data ?? []) as MembershipStatRow[],
      (c.data ?? []) as CodeStatRow[],
      (l.data ?? []) as LedgerStatRow[],
    );
    return { detail: { group: withStats, stats: withStats.stats }, error: null };
  } catch (err) {
    return { detail: null, error: err instanceof Error ? err.message : "Erreur de lecture." };
  }
}

// ─── 3. Listes paginées (membres / codes / ledger) ──────────────────────────
export type Paged<T> = { rows: T[]; total: number; error: string | null };

export type MemberRow = {
  id: string;
  user_id: string;
  role: "admin" | "member";
  status: "active" | "suspended";
  joined_at: string;
};

export async function listGroupMembers(
  groupId: string,
  opts: { page?: number; pageSize?: number } = {},
): Promise<Paged<MemberRow>> {
  await requireSuperAdmin();
  const db = createAdminClient();
  const page = opts.page ?? 1;
  const pageSize = opts.pageSize ?? 25;
  const from = (page - 1) * pageSize;
  const { data, error, count } = await db
    .from("group_memberships")
    .select("id, user_id, role, status, joined_at", { count: "exact" })
    .eq("group_id", groupId)
    .order("joined_at", { ascending: false })
    .range(from, from + pageSize - 1);
  if (error) return { rows: [], total: 0, error: error.message };
  return { rows: (data ?? []) as MemberRow[], total: count ?? 0, error: null };
}

export type CodeRow = {
  code: string;
  points_value: number;
  status: "available" | "used" | "revoked" | "expired";
  created_by: string | null;
  used_by_user_id: string | null;
  used_at: string | null;
  expires_at: string | null;
  created_at: string;
};

export async function listGroupCodes(
  groupId: string,
  opts: {
    status?: "available" | "used" | "revoked" | "expired" | null;
    page?: number;
    pageSize?: number;
  } = {},
): Promise<Paged<CodeRow>> {
  await requireSuperAdmin();
  const db = createAdminClient();
  const page = opts.page ?? 1;
  const pageSize = opts.pageSize ?? 25;
  const from = (page - 1) * pageSize;
  let q = db
    .from("points_codes")
    .select(
      "code, points_value, status, created_by, used_by_user_id, used_at, expires_at, created_at",
      { count: "exact" },
    )
    .eq("group_id", groupId);
  if (opts.status) q = q.eq("status", opts.status);
  const { data, error, count } = await q
    .order("created_at", { ascending: false })
    .range(from, from + pageSize - 1);
  if (error) return { rows: [], total: 0, error: error.message };
  return { rows: (data ?? []) as CodeRow[], total: count ?? 0, error: null };
}

export type LedgerRow = {
  id: string;
  user_id: string;
  kind: string;
  amount: number;
  points_code: string | null;
  reason: string | null;
  created_by: string | null;
  created_at: string;
};

export async function listGroupLedger(
  groupId: string,
  opts: {
    kind?: string | null;
    sign?: "credit" | "debit" | null;
    from?: string | null;
    to?: string | null;
    member?: string | null;
    page?: number;
    pageSize?: number;
  } = {},
): Promise<Paged<LedgerRow>> {
  await requireSuperAdmin();
  const db = createAdminClient();
  const page = opts.page ?? 1;
  const pageSize = opts.pageSize ?? 25;
  const offset = (page - 1) * pageSize;
  let q = db
    .from("points_ledger")
    .select(
      "id, user_id, kind, amount, points_code, reason, created_by, created_at",
      { count: "exact" },
    )
    .eq("group_id", groupId);
  if (opts.kind) q = q.eq("kind", opts.kind);
  if (opts.sign === "credit") q = q.gt("amount", 0);
  else if (opts.sign === "debit") q = q.lt("amount", 0);
  if (opts.from) q = q.gte("created_at", opts.from);
  if (opts.to) q = q.lte("created_at", opts.to);
  if (opts.member) q = q.eq("user_id", opts.member);
  const { data, error, count } = await q
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);
  if (error) return { rows: [], total: 0, error: error.message };
  return { rows: (data ?? []) as LedgerRow[], total: count ?? 0, error: null };
}
