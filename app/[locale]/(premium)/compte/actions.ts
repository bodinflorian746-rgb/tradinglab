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

// ─── Modifier son pseudo (Mon compte) ────────────────────────────────────────
// Même pattern que leaveGroupAction ci-dessus : user.id TOUJOURS relu côté
// serveur depuis la session (jamais reçu du client, contrairement à
// `username`, seul input non fiable) ; écriture via createAdminClient()
// (service_role — public.profiles n'a aucune policy INSERT/UPDATE/DELETE
// pour authenticated, cf. supabase/migrations/20260825120000_profiles.sql) ;
// retour en union discriminée, jamais de throw.
//
// Le format est revalidé ici même si la contrainte profiles_username_format
// existe déjà en base (défense en profondeur : message clair avant tout
// aller-retour DB). La violation de l'unicité (23505) reste possible malgré
// cette validation (TOCTOU entre deux requêtes concurrentes sur le même
// pseudo) : c'est le seul cas où l'on s'appuie sur l'erreur Postgres, jamais
// remontée telle quelle au client — traduite en message fixe.
//
// Pas de dictionnaire i18n ici (fichier qui n'en utilise déjà aucun) :
// messages français directs, affichés tels quels côté client.

const USERNAME_FORMAT = /^[a-z0-9_]{3,20}$/;

export type UpdateUsernameResult =
  | { ok: true; username: string }
  | { ok: false; error: string };

export async function updateUsernameAction(input: {
  username: string;
}): Promise<UpdateUsernameResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Tu dois être connecté." };

  const username = typeof input.username === "string" ? input.username.trim() : "";
  if (!USERNAME_FORMAT.test(username)) {
    return {
      ok: false,
      error: "Le pseudo doit faire 3 à 20 caractères : minuscules, chiffres et _ uniquement.",
    };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({ username })
    .eq("id", user.id);

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "Ce pseudo est déjà pris" };
    }
    console.error(`[compte/username] update échoué user=${user.id}: ${error.message}`);
    return { ok: false, error: "Une erreur est survenue, réessaie plus tard." };
  }

  return { ok: true, username };
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
