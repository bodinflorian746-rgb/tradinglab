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

function getStr(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v : "";
}

function signupError(locale: string, msg: string, from?: string): never {
  const fromQS = from === "pricing" ? `&from=${from}` : "";
  redirect(`/${locale}/signup?error=${encodeURIComponent(msg)}${fromQS}`);
}

export async function signUp(formData: FormData) {
  const email    = getStr(formData, "email").trim();
  const password = getStr(formData, "password");
  const locale   = getStr(formData, "locale") || "fr";
  const from     = getStr(formData, "from");

  if (!email || !password) {
    signupError(locale, "missing", from);
  }

  const supabase = await createClient();
  const admin = createAdminClient();

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
    // (lu par app/[locale]/pricing/CheckoutButton.tsx).
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
