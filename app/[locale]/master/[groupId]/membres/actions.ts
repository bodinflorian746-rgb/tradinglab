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

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { canManageGroup } from "@/lib/loyalty/access";

export type CreditContributionResult =
  | { ok: true; amount: number; label: string }
  | { ok: false; error: "unauthenticated" | "forbidden" | "rule_not_found" | "not_member" | "db" };

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
    .select("id")
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

  revalidatePath(`/${input.locale}/master/${input.groupId}/membres`);
  return { ok: true, amount: rule.points, label: rule.label };
}
