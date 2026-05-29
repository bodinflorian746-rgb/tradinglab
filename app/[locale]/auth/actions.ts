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

  // ─── 1. Création du compte via service role, email NON confirmé ────────────
  // email_confirm:false → email_confirmed_at reste null. lib/auth/premium.ts
  // s'appuie sur ce champ : tant qu'il est null, AUCUN trial 48h. Le trial est
  // déclenché uniquement à la saisie du code sur /activer-code (preuve que
  // l'email est réel). On gère NOUS le mail (Resend), pas Supabase.
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: false,
  });
  if (createErr || !created.user) {
    const exists =
      createErr?.code === "email_exists" ||
      (createErr?.message ?? "").toLowerCase().includes("already");
    signupError(locale, exists ? "exists" : "generic");
  }

  // ─── 2. Connexion immédiate pour établir la session ───────────────────────
  // La session permet d'identifier l'user sur /activer-code. Nécessite "Confirm
  // email" OFF côté Supabase (sinon signInWithPassword refuse un email non
  // confirmé). email_confirmed_at reste null malgré la session → pas de trial.
  const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
  if (signInErr) {
    signupError(locale, "generic");
  }

  // ─── 3. Génération + insertion d'un code trial (expire dans 7 jours) ───────
  // Code rattaché à l'user créé (used_by_user_id) ; reste "available" jusqu'à
  // l'activation sur /activer-code qui posera status='used' + used_at.
  const code = generateCode();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const { error: codeErr } = await admin.from("access_codes").insert({
    code,
    status: "available",
    type: "trial",
    expires_at: expiresAt,
    used_by_user_id: created.user.id,
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
