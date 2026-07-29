"use server";

// Server Action Super Admin — ÉCRITURE unique de la console fidélité :
// attribuer ou retirer le rôle admin d'un groupe à un utilisateur EXISTANT.
//
// L'utilisateur ne change jamais de compte : on ne fait qu'écrire une ligne
// group_memberships(group_id, user_id, role, status). Aucune table, aucune
// RPC nouvelle — la table, ses contraintes (unique(group_id,user_id), FK vers
// auth.users) et sa RLS existent déjà (migration 20260721120000). Écriture
// via service_role (aucune policy INSERT/UPDATE cliente sur group_memberships).
//
//   • promotion ('admin')  : upsert — crée l'adhésion si absente, sinon la
//     (re)promeut et la réactive. Ne touche jamais aux autres groupes.
//   • rétrogradation ('member') : repasse le rôle à member SANS retirer
//     l'utilisateur du groupe (il garde son accès boutique/points) — seul le
//     droit d'administration est retiré, conformément à la consigne.

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentSuperAdmin } from "@/lib/loyalty/admin";
import {
  isValidEmail,
  slugify,
  validateAdminEmails,
  validateGroupName,
} from "@/lib/loyalty/admin-validation";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type SetGroupMemberRoleResult = { ok: true } | { ok: false; error: string };

export async function setGroupMemberRoleAction(input: {
  locale: string;
  groupId: string;
  userId: string;
  role: "admin" | "member";
}): Promise<SetGroupMemberRoleResult> {
  const superAdmin = await getCurrentSuperAdmin();
  if (!superAdmin) return { ok: false, error: "forbidden" };

  if (!UUID_RE.test(input.groupId) || !UUID_RE.test(input.userId)) {
    return { ok: false, error: "invalid" };
  }
  if (input.role !== "admin" && input.role !== "member") {
    return { ok: false, error: "invalid" };
  }

  const db = createAdminClient();

  if (input.role === "admin") {
    const { error } = await db.from("group_memberships").upsert(
      { group_id: input.groupId, user_id: input.userId, role: "admin", status: "active" },
      { onConflict: "group_id,user_id" },
    );
    if (error) {
      if (error.code === "23503") return { ok: false, error: "user_not_found" };
      console.error(`[admin/loyalty] promote error group=${input.groupId} user=${input.userId}: ${error.message}`);
      return { ok: false, error: "db" };
    }
  } else {
    const { data, error } = await db
      .from("group_memberships")
      .update({ role: "member" })
      .eq("group_id", input.groupId)
      .eq("user_id", input.userId)
      .select("id");
    if (error) {
      console.error(`[admin/loyalty] demote error group=${input.groupId} user=${input.userId}: ${error.message}`);
      return { ok: false, error: "db" };
    }
    if ((data?.length ?? 0) !== 1) return { ok: false, error: "not_found" };
  }

  revalidatePath(`/${input.locale}/admin/loyalty/groups/${input.groupId}`);
  return { ok: true };
}

// ─── Création d'un groupe + attribution des admins par e-mail ────────────────
// Le groupe reste une entité séparée des comptes utilisateurs (partner_groups
// inchangé) ; les administrateurs rattachés gardent exactement leur compte
// TradeScaleX normal (group_memberships, jamais un nouveau type de compte).
//
// Atomicité : create_group_with_admins (migration 20260726090000) résout
// TOUS les e-mails avant d'écrire quoi que ce soit — si un seul ne correspond
// à aucun compte, aucun groupe n'est créé.

export type CreateGroupResult =
  | { ok: true; groupId: string }
  | {
      ok: false;
      error: "forbidden" | "invalid_name" | "invalid_emails" | "email_not_found" | "no_admins" | "db";
      detail?: string;
    };

export async function createGroupAction(input: {
  locale: string;
  name: unknown;
  adminEmails: unknown;
}): Promise<CreateGroupResult> {
  const superAdmin = await getCurrentSuperAdmin();
  if (!superAdmin) return { ok: false, error: "forbidden" };

  const nameV = validateGroupName(input.name);
  if (!nameV.ok) return { ok: false, error: "invalid_name" };

  const emailsV = validateAdminEmails(input.adminEmails);
  if (!emailsV.ok) return { ok: false, error: "invalid_emails" };

  const db = createAdminClient();
  const MAX_ATTEMPTS = 5;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const slug = slugify(nameV.value);
    const { data, error } = await db.rpc("create_group_with_admins", {
      p_name: nameV.value,
      p_slug: slug,
      p_admin_emails: emailsV.value,
      p_created_by: superAdmin.id,
    });
    if (error) {
      if (error.code === "23505") continue; // collision de slug → régénère et réessaie
      console.error(`[admin/loyalty] createGroup error: ${error.message}`);
      return { ok: false, error: "db" };
    }

    const row = Array.isArray(data) ? data[0] : data;
    const result = typeof row?.result === "string" ? row.result : "";
    if (result === "ok") {
      revalidatePath(`/${input.locale}/admin/loyalty`);
      return { ok: true, groupId: row.result_group_id as string };
    }
    if (result === "email_not_found") {
      return { ok: false, error: "email_not_found", detail: row.result_missing_email as string };
    }
    if (result === "no_admins") {
      return { ok: false, error: "no_admins" };
    }
    console.error(`[admin/loyalty] createGroup unexpected rpc result: ${JSON.stringify(row)}`);
    return { ok: false, error: "db" };
  }
  return { ok: false, error: "db" };
}

// ─── Attribution du rôle admin à un utilisateur EXISTANT, par e-mail ─────────
// Complète setGroupMemberRoleAction (qui opère par UUID, pour les membres déjà
// listés) : ici on part d'une adresse e-mail, résolue en compte TradeScaleX
// existant via get_user_id_by_email (migration 20260726090000). Aucun nouveau
// compte n'est jamais créé — si l'e-mail ne correspond à aucun compte, l'appel
// échoue explicitement (email_not_found).

export type AddGroupAdminByEmailResult = { ok: true } | { ok: false; error: string };

export async function addGroupAdminByEmailAction(input: {
  locale: string;
  groupId: string;
  email: unknown;
}): Promise<AddGroupAdminByEmailResult> {
  const superAdmin = await getCurrentSuperAdmin();
  if (!superAdmin) return { ok: false, error: "forbidden" };

  if (!UUID_RE.test(input.groupId)) return { ok: false, error: "invalid" };
  if (!isValidEmail(input.email)) return { ok: false, error: "invalid_email" };
  const email = input.email.trim().toLowerCase();

  const db = createAdminClient();

  const { data: userId, error: lookupErr } = await db.rpc("get_user_id_by_email", { p_email: email });
  if (lookupErr) {
    console.error(`[admin/loyalty] email lookup error: ${lookupErr.message}`);
    return { ok: false, error: "db" };
  }
  if (!userId) return { ok: false, error: "email_not_found" };

  const { error } = await db.from("group_memberships").upsert(
    { group_id: input.groupId, user_id: userId, role: "admin", status: "active" },
    { onConflict: "group_id,user_id" },
  );
  if (error) {
    console.error(`[admin/loyalty] add admin error group=${input.groupId}: ${error.message}`);
    return { ok: false, error: "db" };
  }

  revalidatePath(`/${input.locale}/admin/loyalty/groups/${input.groupId}`);
  return { ok: true };
}

// ─── Renommage d'un groupe ────────────────────────────────────────────────────

export type RenameGroupResult = { ok: true } | { ok: false; error: string };

export async function renameGroupAction(input: {
  locale: string;
  groupId: string;
  name: unknown;
}): Promise<RenameGroupResult> {
  const superAdmin = await getCurrentSuperAdmin();
  if (!superAdmin) return { ok: false, error: "forbidden" };

  if (!UUID_RE.test(input.groupId)) return { ok: false, error: "invalid" };
  const nameV = validateGroupName(input.name);
  if (!nameV.ok) return { ok: false, error: "invalid_name" };

  const db = createAdminClient();
  const { data, error } = await db
    .from("partner_groups")
    .update({ name: nameV.value })
    .eq("id", input.groupId)
    .select("id");
  if (error) {
    console.error(`[admin/loyalty] rename error group=${input.groupId}: ${error.message}`);
    return { ok: false, error: "db" };
  }
  if ((data?.length ?? 0) !== 1) return { ok: false, error: "not_found" };

  revalidatePath(`/${input.locale}/admin/loyalty/groups/${input.groupId}`);
  revalidatePath(`/${input.locale}/admin/loyalty`);
  return { ok: true };
}
