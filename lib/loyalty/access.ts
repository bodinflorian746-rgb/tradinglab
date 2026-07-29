// Helpers d'autorisation multi-tenant du programme de fidélité — SERVER-ONLY.
//
// Ils répondent à trois questions, côté serveur, avant toute écriture sensible
// (les Server Actions de la phase 2 s'appuieront dessus) :
//   • un utilisateur est-il admin d'un groupe donné ?
//   • un utilisateur est-il membre actif d'un groupe donné ?
//   • un utilisateur peut-il consulter / gérer un groupe donné ?
//
// Ils utilisent createAdminClient() (service_role, bypass RLS) car ils
// s'exécutent en amont de l'autorisation applicative : c'est ICI qu'on décide.
// Le Super Admin (ADMIN_EMAILS / isAdmin) court-circuite tout (peut tout gérer).
//
// Ne JAMAIS importer ce module depuis un composant client.

import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/auth/admin";
import { isDevAuthBypass } from "@/lib/dev-auth";
import type { MembershipRole } from "@/lib/loyalty/types";

async function getActiveMembershipRole(
  userId: string,
  groupId: string,
): Promise<MembershipRole | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("group_memberships")
    .select("role")
    .eq("user_id", userId)
    .eq("group_id", groupId)
    .eq("status", "active")
    .maybeSingle();

  if (error) {
    console.error(
      `[loyalty/access] lookup membership failed user=${userId} group=${groupId}: ${error.message}`,
    );
    return null; // fail-closed
  }
  const role = data?.role;
  return role === "admin" || role === "member" ? role : null;
}

/** true si `userId` est admin ACTIF du groupe `groupId`. */
export async function isGroupAdmin(
  userId: string,
  groupId: string,
): Promise<boolean> {
  return (await getActiveMembershipRole(userId, groupId)) === "admin";
}

/** true si `userId` est membre ACTIF (admin ou member) du groupe `groupId`. */
export async function isActiveGroupMember(
  userId: string,
  groupId: string,
): Promise<boolean> {
  return (await getActiveMembershipRole(userId, groupId)) !== null;
}

/**
 * true si `userId` peut CONSULTER le groupe : Super Admin, ou membre actif.
 * @param userEmail email de l'utilisateur (pour le check Super Admin ADMIN_EMAILS)
 */
export async function canViewGroup(
  userId: string,
  userEmail: string | null | undefined,
  groupId: string,
): Promise<boolean> {
  if (isAdmin(userEmail)) return true;
  return isActiveGroupMember(userId, groupId);
}

/**
 * true si `userId` peut GÉRER le groupe : Super Admin, ou admin actif du groupe.
 * Un admin d'un autre groupe renvoie toujours false (isolation multi-tenant).
 * @param userEmail email de l'utilisateur (pour le check Super Admin ADMIN_EMAILS)
 */
export async function canManageGroup(
  userId: string,
  userEmail: string | null | undefined,
  groupId: string,
): Promise<boolean> {
  if (isAdmin(userEmail)) return true;
  return isGroupAdmin(userId, groupId);
}

// ─── Espace /master (Group Admin) — gardes STRICTES ──────────────────────────
// L'espace /master est réservé aux VRAIS admins actifs de groupe : PAS de bypass
// Super Admin ici (le Super Admin utilise /admin/loyalty). Cela évite toute
// incohérence entre l'autorisation et la landing qui liste les adhésions.

/** IDs des groupes dont `userId` est admin ACTIF (service_role, source de vérité). */
export async function getActiveAdminGroupIds(userId: string): Promise<string[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("group_memberships")
    .select("group_id")
    .eq("user_id", userId)
    .eq("role", "admin")
    .eq("status", "active");
  if (error) {
    console.error(`[loyalty/access] getActiveAdminGroupIds user=${userId}: ${error.message}`);
    return []; // fail-closed
  }
  return (data ?? []).map((r) => r.group_id as string);
}

/** true si `userId` administre activement ≥ 1 groupe (pour le flag de nav). */
export async function hasActiveAdminGroup(userId: string): Promise<boolean> {
  if (isDevAuthBypass()) return true; // dev local : accès à l'espace Master
  const admin = createAdminClient();
  const { count, error } = await admin
    .from("group_memberships")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("role", "admin")
    .eq("status", "active");
  if (error) {
    console.error(`[loyalty/access] hasActiveAdminGroup user=${userId}: ${error.message}`);
    return false;
  }
  return (count ?? 0) > 0;
}

/** Résultat d'autorisation d'ÉCRITURE sur un groupe. */
export type GroupWriteAuth = "ok" | "forbidden" | "group_suspended";

/**
 * Autorise une ÉCRITURE (génération / révocation de code, magasin) sur un
 * groupe :
 *   • l'appelant DOIT être admin actif du groupe, OU Super Admin
 *     (ADMIN_EMAILS/isAdmin) — le Super Admin peut administrer
 *     opérationnellement n'importe quel groupe depuis sa fiche groupe
 *     (dispensé aussi en dev bypass) ;
 *   • le groupe DOIT être `status='active'` (un groupe suspendu est lecture
 *     seule) — cette règle reste TOUJOURS appliquée, y compris pour le Super
 *     Admin et en bypass dev : c'est une règle métier à tester, pas un
 *     obstacle d'authentification.
 * Renvoie 'forbidden' | 'group_suspended' sinon.
 */
export async function authorizeGroupWrite(
  userId: string,
  groupId: string,
  userEmail?: string | null,
): Promise<GroupWriteAuth> {
  const bypassed = isDevAuthBypass() || isAdmin(userEmail);
  if (!bypassed && !(await isGroupAdmin(userId, groupId))) return "forbidden";
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("partner_groups")
    .select("status")
    .eq("id", groupId)
    .maybeSingle();
  if (error || !data) return "forbidden";
  return data.status === "active" ? "ok" : "group_suspended";
}
