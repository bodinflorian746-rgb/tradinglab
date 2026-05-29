"use server";

// Server Actions auth : signUp (grand public, code trial auto par mail),
// signIn, signOut. Appelées depuis les <form action={...}>.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateCode } from "@/lib/access-codes";
import { sendTrialCodeEmail } from "@/lib/email/send-trial-code";

function getStr(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v : "";
}

function signupError(locale: string, msg: string): never {
  redirect(`/${locale}/signup?error=${encodeURIComponent(msg)}`);
}

export async function signUp(formData: FormData) {
  const email    = getStr(formData, "email").trim();
  const password = getStr(formData, "password");
  const locale   = getStr(formData, "locale") || "fr";

  if (!email || !password) {
    signupError(locale, "missing");
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
    signupError(locale, exists ? "exists" : "generic");
  }

  // ─── 2. Remise à null de email_confirmed_at (le trial ne démarre PAS ici) ──
  // signUp() vient de poser email_confirmed_at = now. Or lib/auth/premium.ts
  // déclenche le trial 48h sur ce champ : on le remet à null via le service role
  // (fonction SQL reset_email_confirmation, SECURITY DEFINER) pour que le trial
  // ne démarre qu'à l'activation du code. La session déjà émise reste valide.
  const { error: resetErr } = await admin.rpc("reset_email_confirmation", {
    uid: created.user.id,
  });
  if (resetErr) {
    console.error(`[signup] reset_email_confirmation échoué pour ${email}: ${resetErr.message}`);
  }

  // ─── 3. Génération + insertion d'un code trial (expire dans 7 jours) ───────
  // Code "available" NON lié à un user : la contrainte access_codes_used_consistency
  // interdit used_by_user_id sur un code non 'used'. Le lien (used_by_user_id +
  // status='used') est posé à l'activation, sur /activer-code.
  const code = generateCode();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const { error: codeErr } = await admin.from("access_codes").insert({
    code,
    status: "available",
    type: "trial",
    expires_at: expiresAt,
  });
  if (codeErr) {
    // Compte créé mais code non inséré : on log et on continue (l'user pourra
    // demander un renvoi). On ne bloque pas l'UX d'inscription.
    console.error(`[signup] insertion code échouée pour ${email}: ${codeErr.message}`);
  }

  // ─── 4. Envoi du mail Resend (code + lien d'activation) ───────────────────
  const activateUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/activer-code`;
  const sent = await sendTrialCodeEmail(email, code, locale, activateUrl);
  if (!sent.ok) {
    console.error(`[signup] envoi email échoué pour ${email}: ${sent.error}`);
  }

  // ─── 5. Redirection vers "vérifie ton email" (email passé pour affichage) ──
  revalidatePath("/", "layout");
  redirect(`/${locale}/verifie-email?email=${encodeURIComponent(email)}`);
}

export async function signIn(formData: FormData) {
  const email = getStr(formData, "email");
  const password = getStr(formData, "password");
  const locale = getStr(formData, "locale") || "fr";

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/${locale}/login?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect(`/${locale}/dashboard`);
}

export async function signOut(formData: FormData) {
  const locale = getStr(formData, "locale") || "fr";
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect(`/${locale}/login`);
}
