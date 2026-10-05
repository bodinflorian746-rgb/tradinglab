"use server";

// Server Actions auth : signUp, signIn, signOut. Appelées depuis les
// <form action={...}>.
//
// signUp gère 3 branches selon le param `from` (input caché du formulaire) :
//   - from=trial    → après création, envoie auto le code 48h + redirect /code-envoye
//   - from=pricing  → après création, redirect /pricing?auto_checkout=1 (auto-lance
//                     le checkout Stripe via CheckoutButton.tsx)
//   - sinon         → redirect /${locale} (signup libre, aucun code, aucun mail)

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendTrialCodeForUser } from "@/lib/auth/send-trial-code-flow";
import { isStripeCheckoutEnabled } from "@/lib/stripe-checkout-flag";

function getStr(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v : "";
}

function signupError(locale: string, msg: string, from?: string): never {
  const fromQS = from === "pricing" ? `&from=${from}` : "";
  redirect(`/${locale}/signup?error=${encodeURIComponent(msg)}${fromQS}`);
}

// Même regex que profiles_username_format (migration
// 20260825120000_profiles.sql) et que updateUsernameAction
// (app/[locale]/(premium)/compte/actions.ts).
const USERNAME_FORMAT = /^[a-z0-9_]{3,20}$/;

export async function signUp(formData: FormData) {
  const email    = getStr(formData, "email").trim();
  const password = getStr(formData, "password");
  const username = getStr(formData, "username").trim();
  const locale   = getStr(formData, "locale") || "fr";
  const from     = getStr(formData, "from");

  if (!email || !password || !username) {
    signupError(locale, "missing", from);
  }
  if (!USERNAME_FORMAT.test(username)) {
    signupError(locale, "invalid_username", from);
  }

  const supabase = await createClient();
  const admin = createAdminClient();

  // ─── 0. Pseudo disponible ? ───────────────────────────────────────────────
  // Vérifié AVANT toute création de compte, via service_role (la policy RLS
  // profiles_select ne laisserait de toute façon voir aucune ligne avant que
  // le compte existe). Reste un TOCTOU possible avec l'étape 1bis (deux
  // inscriptions concurrentes sur le même pseudo) — accepté, cf. commentaire
  // de l'étape 1bis : jamais bloquant une fois le compte créé.
  const { data: existingProfile } = await admin
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();
  if (existingProfile) {
    signupError(locale, "username_taken", from);
  }

  // ─── 1. Inscription publique (auto-confirme + ouvre la session) ────────────
  // Avec "Confirm email" OFF côté Supabase, supabase.auth.signUp() auto-confirme
  // l'email ET établit la session immédiatement (cookies posés par le client
  // SSR). On ne peut PAS utiliser admin.createUser + signInWithPassword : un user
  // créé non confirmé se voit refuser la connexion (erreur email_not_confirmed).
  const { data: created, error: createErr } = await supabase.auth.signUp({ email, password });
  if (createErr || !created.user) {
    const exists =
      createErr?.code === "user_already_exists" ||
      (createErr?.message ?? "").toLowerCase().includes("already");
    signupError(locale, exists ? "exists" : "generic", from);
  }

  // ─── 1bis. Écrase le pseudo dérivé par handle_new_user avec le choix voulu
  // Le trigger handle_new_user (supabase/migrations/20260825120000_profiles.sql)
  // vient d'insérer une ligne public.profiles avec un pseudo DÉRIVÉ DE
  // L'EMAIL — on l'écrase ici par le pseudo choisi par l'utilisateur, déjà
  // validé en format et en disponibilité à l'étape 0. Best-effort
  // volontaire : si l'UPDATE échoue malgré tout (23505, course concurrente
  // rarissime entre la vérification de l'étape 0 et cet UPDATE), on logue et
  // on continue avec le pseudo dérivé du trigger plutôt que d'échouer toute
  // l'inscription — le compte auth existe déjà à ce stade, aucun moyen
  // propre de revenir en arrière.
  const { error: usernameErr } = await admin
    .from("profiles")
    .update({ username })
    .eq("id", created.user.id);
  if (usernameErr) {
    console.error(`[signup] écrasement du pseudo échoué pour ${email}: ${usernameErr.message}`);
  }

  // ─── 2. Backdate email_confirmed_at à 1970 (le trial ne démarre PAS ici) ──
  // supabase.auth.signUp() vient de poser email_confirmed_at = now. Or
  // lib/auth/premium.ts déclenche le trial 48h sur ce champ : on le backdate
  // à '1970-01-01' via service role (fonction SQL set_email_confirmed_at_far_past,
  // SECURITY DEFINER) — pas null, sinon signInWithPassword refuse l'user à la
  // re-connexion (code email_not_confirmed). Avec une date passée, le trial est
  // expiré (paywall affiché) ET le login fonctionne. L'activation posera la
  // date à now() via set_email_confirmed_at_now.
  const { error: resetErr } = await admin.rpc("set_email_confirmed_at_far_past", {
    uid: created.user.id,
  });
  if (resetErr) {
    console.error(`[signup] set_email_confirmed_at_far_past échoué pour ${email}: ${resetErr.message}`);
  }

  // ─── 3. Redirection selon l'intention (from) ─────────────────────────────
  revalidatePath("/", "layout");

  if (from === "trial") {
    // Le user vient du badge "48h gratuit" : envoi auto du code maintenant
    // (factorise avec requestTrialCode via send-trial-code-flow).
    const result = await sendTrialCodeForUser(admin, created.user, locale);
    if (!result.ok) {
      console.error(`[signup] sendTrialCodeForUser échoué pour ${email}: ${result.error}`);
      redirect(`/${locale}/pricing?trial_error=1`);
    }
    redirect(`/${locale}/code-envoye?email=${encodeURIComponent(email)}`);
  }

  if (from === "pricing") {
    // Le user vient du CheckoutButton (intention abonnement) : on relance le
    // checkout Stripe automatiquement au mount via le paramètre auto_checkout=1
    // (lu par app/[locale]/pricing/CheckoutButton.tsx). Checkout désactivé
    // côté serveur → simple retour sur /pricing, sans relance automatique.
    if (!isStripeCheckoutEnabled()) redirect(`/${locale}/pricing`);
    redirect(`/${locale}/pricing?auto_checkout=1`);
  }

  // Signup libre (sans intention) : home.
  redirect(`/${locale}`);
}

export async function signIn(formData: FormData) {
  const email = getStr(formData, "email");
  const password = getStr(formData, "password");
  const locale = getStr(formData, "locale") || "fr";
  const from = getStr(formData, "from");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const fromQS = from === "pricing" ? `&from=${from}` : "";
    redirect(`/${locale}/login?error=${encodeURIComponent(error.message)}${fromQS}`);
  }

  revalidatePath("/", "layout");

  // Reprise checkout : user existant venu de /pricing → on relance le paiement
  // au lieu de l'envoyer sur la home. CheckoutButton détecte auto_checkout=1
  // et déclenche fetch /api/stripe/checkout au mount. Toute autre valeur de
  // `from` (ou aucune) → home, comportement historique inchangé.
  if (from === "pricing") {
    // Checkout désactivé côté serveur → retour /pricing sans relance auto.
    if (!isStripeCheckoutEnabled()) redirect(`/${locale}/pricing`);
    redirect(`/${locale}/pricing?auto_checkout=1`);
  }
  redirect(`/${locale}`);
}

export async function signOut(formData: FormData) {
  const locale = getStr(formData, "locale") || "fr";
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect(`/${locale}/login`);
}
