"use server";

// Server Action de mise à jour du mot de passe après recovery.
// Prérequis : user en session "recovery" (le callback /auth/callback a
// déjà échangé le code pour une session). On utilise supabase.auth.updateUser
// qui fonctionne sur la session courante.
//
// Après update → signOut() + redirect /login pour forcer une vraie connexion
// avec le nouveau mot de passe (et invalider la session de recovery).

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function getStr(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v : "";
}

export async function updatePassword(formData: FormData) {
  const password = getStr(formData, "password");
  const confirm = getStr(formData, "confirm");
  const locale = getStr(formData, "locale") || "fr";

  if (!password || !confirm) {
    redirect(`/${locale}/mot-de-passe-nouveau?error=missing`);
  }
  if (password !== confirm) {
    redirect(`/${locale}/mot-de-passe-nouveau?error=mismatch`);
  }
  if (password.length < 6) {
    redirect(`/${locale}/mot-de-passe-nouveau?error=weak`);
  }

  const supabase = await createClient();

  // Garde : sans session, updateUser échoue. La session recovery a été
  // posée par /auth/callback. Si elle n'existe pas (lien périmé, accès
  // direct à la page sans passer par le callback), on redirige vers
  // la demande de reset.
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/${locale}/mot-de-passe-nouveau?error=notRecovery`);
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    console.error(`[update-password] updateUser échoué : ${error.message}`);
    redirect(`/${locale}/mot-de-passe-nouveau?error=generic`);
  }

  // SignOut pour invalider la session de recovery et forcer une vraie
  // re-connexion avec le nouveau mot de passe (sécurité + clarté UX).
  await supabase.auth.signOut();

  redirect(`/${locale}/login?reset=1`);
}
