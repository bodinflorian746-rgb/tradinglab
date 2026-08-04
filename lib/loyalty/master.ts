// Couche de LECTURE de l'espace Group Admin (« Master ») — SERVER-ONLY.
//
// Contrairement à la console Super Admin (lib/loyalty/admin.ts, service_role),
// ces lectures passent par le client de SESSION de l'utilisateur → elles sont
// soumises à la RLS. Les policies `is_group_admin(group_id)` garantissent donc
// l'isolation AU NIVEAU BASE : un Master ne peut charger que les lignes de ses
// groupes, même en cas de bug applicatif (dernier rempart).
//
// L'accès à /master est réservé à l'admin actif du groupe OU au Super Admin
// (ADMIN_EMAILS/isAdmin) : le Super Admin administre opérationnellement
// n'importe quel groupe (codes, magasin) en réutilisant ces mêmes pages —
// aucune logique dupliquée entre les deux consoles.

import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isDevAuthBypass, DEV_USER } from "@/lib/dev-auth";
import { isGroupAdmin } from "@/lib/loyalty/access";
import { isAdmin } from "@/lib/auth/admin";
import { resolveUserEmails } from "@/lib/loyalty/orders";
import {
  buildGroupsWithStats,
  type CodeStatRow,
  type GroupStats,
  type LedgerStatRow,
  type MembershipStatRow,
} from "@/lib/loyalty/admin-format";
import type { GroupAccessCode, PartnerGroup } from "@/lib/loyalty/types";
import type { CodeRow, LedgerRow, MemberRow, Paged } from "@/lib/loyalty/admin";

export type GroupAdminUser = { id: string; email: string };

// En bypass dev OU pour un vrai Super Admin, on lit via le service_role : le
// client de session (RLS via is_group_admin) ne renverrait que les groupes où
// l'appelant est réellement membre — un Super Admin qui consulte un groupe
// qu'il n'administre pas personnellement doit quand même tout voir.
async function readClient() {
  if (isDevAuthBypass()) return createAdminClient();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user && isAdmin(user.email)) return createAdminClient();
  return supabase;
}

/**
 * Garde de page : renvoie l'utilisateur courant s'il est admin ACTIF du
 * groupe, OU Super Admin (ADMIN_EMAILS/isAdmin — peut administrer n'importe
 * quel groupe), sinon null (→ notFound côté page).
 */
export async function getGroupAdminUser(
  groupId: string,
): Promise<GroupAdminUser | null> {
  if (isDevAuthBypass()) return { id: DEV_USER.id, email: DEV_USER.email ?? "" };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  if (isAdmin(user.email)) return { id: user.id, email: user.email ?? "" };
  if (!(await isGroupAdmin(user.id, groupId))) return null;
  return { id: user.id, email: user.email ?? "" };
}

/** Groupes dont l'utilisateur courant est admin ACTIF (pour la landing). */
export async function getMyAdminGroups(): Promise<PartnerGroup[]> {
  // Dev local : on liste TOUS les groupes (l'utilisateur mocké n'a pas d'adhésion).
  if (isDevAuthBypass()) {
    const { data } = await createAdminClient()
      .from("partner_groups")
      .select("id, name, slug, telegram_reference, status, created_by, created_at, updated_at")
      .order("name", { ascending: true });
    return (data ?? []) as PartnerGroup[];
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: mm, error: mErr } = await supabase
    .from("group_memberships")
    .select("group_id")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .eq("status", "active");
  if (mErr) {
    console.error(`[loyalty/master] getMyAdminGroups memberships: ${mErr.message}`);
    return [];
  }
  const ids = (mm ?? []).map((r) => r.group_id as string);
  if (ids.length === 0) return [];

  const { data: groups, error: gErr } = await supabase
    .from("partner_groups")
    .select("id, name, slug, telegram_reference, status, created_by, created_at, updated_at")
    .in("id", ids)
    .order("name", { ascending: true });
  if (gErr) {
    console.error(`[loyalty/master] getMyAdminGroups groups: ${gErr.message}`);
    return [];
  }
  return (groups ?? []) as PartnerGroup[];
}

export type GroupDashboard = { group: PartnerGroup; stats: GroupStats };

/** Tableau de bord d'un groupe (infos + stats agrégées), lu via la session/RLS. */
export async function getGroupDashboard(
  groupId: string,
): Promise<{ dashboard: GroupDashboard | null; error: string | null }> {
  const supabase = await readClient();
  try {
    const { data: group, error: gErr } = await supabase
      .from("partner_groups")
      .select("id, name, slug, telegram_reference, status, created_by, created_at, updated_at")
      .eq("id", groupId)
      .maybeSingle();
    if (gErr) throw new Error(gErr.message);
    if (!group) return { dashboard: null, error: null };

    // reference_code vit dans partner_group_settings (table indépendante,
    // pas de FK physique vers partner_groups — cf. migration 20260724120000)
    // depuis la réécriture qui a suivi l'incident SQLSTATE XX001. Lu ici en
    // second temps et fusionné, pour ne rien changer au type PartnerGroup ni
    // aux composants qui affichent group.reference_code.
    const [m, c, l, s] = await Promise.all([
      supabase.from("group_memberships").select("group_id, role, status").eq("group_id", groupId),
      supabase.from("points_codes").select("group_id, status, points_value").eq("group_id", groupId),
      supabase.from("points_ledger").select("group_id, amount, kind").eq("group_id", groupId),
      supabase.from("partner_group_settings").select("reference_code").eq("group_id", groupId).maybeSingle(),
    ]);
    for (const r of [m, c, l, s]) if (r.error) throw new Error(r.error.message);

    const groupWithReferenceCode = { ...group, reference_code: s.data?.reference_code ?? "" };

    const [withStats] = buildGroupsWithStats(
      [groupWithReferenceCode as PartnerGroup],
      (m.data ?? []) as MembershipStatRow[],
      (c.data ?? []) as CodeStatRow[],
      (l.data ?? []) as LedgerStatRow[],
    );
    return { dashboard: { group: withStats, stats: withStats.stats }, error: null };
  } catch (err) {
    return { dashboard: null, error: err instanceof Error ? err.message : "Erreur de lecture." };
  }
}

export async function listMembers(
  groupId: string,
  opts: { page?: number; pageSize?: number } = {},
): Promise<Paged<MemberRow>> {
  const supabase = await readClient();
  const page = opts.page ?? 1;
  const pageSize = opts.pageSize ?? 25;
  const from = (page - 1) * pageSize;
  const { data, error, count } = await supabase
    .from("group_memberships")
    .select("id, user_id, role, status, joined_at", { count: "exact" })
    .eq("group_id", groupId)
    .order("joined_at", { ascending: false })
    .range(from, from + pageSize - 1);
  if (error) return { rows: [], total: 0, error: error.message };
  return { rows: (data ?? []) as MemberRow[], total: count ?? 0, error: null };
}

export async function listCodes(
  groupId: string,
  opts: {
    status?: "available" | "used" | "revoked" | "expired" | null;
    page?: number;
    pageSize?: number;
  } = {},
): Promise<Paged<CodeRow>> {
  const supabase = await readClient();
  const page = opts.page ?? 1;
  const pageSize = opts.pageSize ?? 25;
  const from = (page - 1) * pageSize;
  let q = supabase
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

/**
 * Codes de déblocage de compte (access_codes) du groupe — même pattern que
 * listCodes (points_codes) : lecture via session/RLS (policy
 * access_codes_group_admin_select, migration 20260725100000), isolation
 * garantie en base. Les codes globaux (group_id null, Super Admin) ne
 * remontent jamais ici.
 */
export async function listAccessCodes(
  groupId: string,
  opts: {
    status?: "available" | "used" | "revoked" | null;
    page?: number;
    pageSize?: number;
  } = {},
): Promise<Paged<GroupAccessCode>> {
  const supabase = await readClient();
  const page = opts.page ?? 1;
  const pageSize = opts.pageSize ?? 25;
  const from = (page - 1) * pageSize;
  let q = supabase
    .from("access_codes")
    .select("code, group_id, status, type, duration_days, used_by_user_id, used_at, expires_at, created_at", {
      count: "exact",
    })
    .eq("group_id", groupId);
  if (opts.status) q = q.eq("status", opts.status);
  const { data, error, count } = await q
    .order("created_at", { ascending: false })
    .range(from, from + pageSize - 1);
  if (error) return { rows: [], total: 0, error: error.message };
  return { rows: (data ?? []) as GroupAccessCode[], total: count ?? 0, error: null };
}

export async function listLedger(
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
  const supabase = await readClient();
  const page = opts.page ?? 1;
  const pageSize = opts.pageSize ?? 25;
  const offset = (page - 1) * pageSize;
  let q = supabase
    .from("points_ledger")
    .select("id, user_id, kind, amount, points_code, reason, created_by, created_at", {
      count: "exact",
    })
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

/**
 * E-mails des admins ACTIFS de ce groupe (role='admin', status='active') —
 * jamais le créateur du groupe (partner_groups.created_by, un concept
 * distinct). Utilisée pour l'affichage restreint (canManageGroup) du
 * tableau de bord Master : app/[locale]/master/[groupId]/page.tsx.
 */
export async function getGroupAdminEmails(groupId: string): Promise<string[]> {
  const supabase = await readClient();
  const { data, error } = await supabase
    .from("group_memberships")
    .select("user_id")
    .eq("group_id", groupId)
    .eq("role", "admin")
    .eq("status", "active");
  if (error || !data) return [];
  const emails = await resolveUserEmails(data.map((r) => r.user_id as string));
  return [...emails.values()].filter((e): e is string => !!e);
}
