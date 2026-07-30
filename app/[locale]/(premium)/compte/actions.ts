"use server";

// Server Action — création d'une session du portail client Stripe pour gérer
// l'abonnement (changer la carte, voir les factures, résilier). Le portail
// Stripe gère lui-même tous les flux (annulation, reprise, etc.) et déclenche
// les webhooks customer.subscription.updated / deleted qui sont déjà routés
// vers la table public.subscriptions par app/api/stripe/webhook/route.ts.
//
// Conditions :
//   - utilisateur connecté (sinon redirect /login)
//   - existence d'un stripe_customer_id dans subscriptions (sinon redirect
//     /compte?no_portal=1 ; cas trial / broker / lifetime sans Stripe)
//
// L'appel Stripe utilise le singleton lib/stripe.ts (mode test/live résolu
// automatiquement via STRIPE_MODE).

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";

function getStr(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v : "";
}

// ─── Quitter un groupe (Mon compte) ──────────────────────────────────────────
// Aucune RPC ni Server Action de départ n'existait déjà dans le repo (recherche
// effectuée avant écriture). userId TOUJOURS lu côté serveur (jamais reçu du
// client) ; seul groupId est un input non fiable. La ligne group_memberships
// n'est supprimée que si elle appartient bien à l'utilisateur courant ET que
// son rôle est strictement 'member' — un rôle 'admin' est structurellement
// impossible à supprimer par cette action (vérifié deux fois : lecture
// préalable + clause .eq("role", "member") sur le DELETE lui-même).

export type LeaveGroupResult =
  | { ok: true }
  | { ok: false; error: "unauthenticated" | "not_found" | "admin_role" | "db" };

export async function leaveGroupAction(input: {
  locale: string;
  groupId: string;
}): Promise<LeaveGroupResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "unauthenticated" };

  const admin = createAdminClient();

  const { data: membership, error: readErr } = await admin
    .from("group_memberships")
    .select("id, role")
    .eq("user_id", user.id)
    .eq("group_id", input.groupId)
    .maybeSingle();
  if (readErr) {
    console.error(`[compte/leave] lookup membership échoué user=${user.id} group=${input.groupId}: ${readErr.message}`);
    return { ok: false, error: "db" };
  }
  if (!membership) return { ok: false, error: "not_found" };
  if (membership.role !== "member") return { ok: false, error: "admin_role" };

  const { error: delErr, data: deleted } = await admin
    .from("group_memberships")
    .delete()
    .eq("id", membership.id)
    .eq("user_id", user.id)
    .eq("role", "member")
    .select("id");
  if (delErr) {
    console.error(`[compte/leave] delete échoué user=${user.id} group=${input.groupId}: ${delErr.message}`);
    return { ok: false, error: "db" };
  }
  if (!deleted || deleted.length === 0) return { ok: false, error: "not_found" };

  revalidatePath(`/${input.locale}/compte`);
  return { ok: true };
}

export async function createPortalSession(formData: FormData) {
  const locale = getStr(formData, "locale") || "fr";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/${locale}/login`);
  }

  // RLS : l'user authentifié lit uniquement sa propre subscription.
  const { data: sub, error: subErr } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (subErr) {
    console.error(`[compte] lookup subscriptions échoué pour ${user.id}: ${subErr.message}`);
    redirect(`/${locale}/compte?portal_error=1`);
  }

  if (!sub?.stripe_customer_id) {
    // Pas d'abo Stripe : trial code, broker/lifetime, ou rien du tout.
    // Le portail Stripe n'a rien à gérer ici.
    redirect(`/${locale}/compte?no_portal=1`);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    console.error(`[compte] NEXT_PUBLIC_SITE_URL manquant`);
    redirect(`/${locale}/compte?portal_error=1`);
  }

  let portalUrl: string;
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: `${siteUrl}/${locale}/compte`,
    });
    portalUrl = session.url;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Stripe error";
    console.error(`[compte] billingPortal.sessions.create échoué pour ${user.id}: ${msg}`);
    redirect(`/${locale}/compte?portal_error=1`);
  }

  redirect(portalUrl);
}
