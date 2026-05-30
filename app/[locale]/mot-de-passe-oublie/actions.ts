"use server";

// Server Action de demande de réinitialisation de mot de passe.
// Envoie un mail Supabase contenant un lien de recovery vers
// /[locale]/auth/callback?next=/mot-de-passe-nouveau. Le callback
// échange le code contre une session, puis redirige vers la page
// de saisie du nouveau mot de passe.
//
// Sécurité : on ne révèle pas si l'email existe (anti-énumération).
// Supabase resetPasswordForEmail retourne déjà OK même si le compte
// n'existe pas. On redirige toujours vers ?sent=1.

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/i18n/site";

function getStr(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v : "";
}

export async function requestPasswordReset(formData: FormData) {
  const email = getStr(formData, "email").trim();
  const locale = getStr(formData, "locale") || "fr";

  if (!email) {
    redirect(`/${locale}/mot-de-passe-oublie?error=missing`);
  }

  const supabase = await createClient();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? SITE_URL;
  const redirectTo = `${baseUrl}/${locale}/auth/callback?next=/mot-de-passe-nouveau`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

  if (error) {
    console.error(`[reset-password] resetPasswordForEmail échoué pour ${email}: ${error.message}`);
    redirect(`/${locale}/mot-de-passe-oublie?error=generic`);
  }

  // Toujours OK (anti-énumération) — la page affiche "Si le compte existe, lien envoyé".
  redirect(`/${locale}/mot-de-passe-oublie?sent=1`);
}
