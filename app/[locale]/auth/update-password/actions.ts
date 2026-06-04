"use server";

// Server Action de mise à jour du mot de passe après recovery.
// Variante "home connectée" : après update on garde la session et on envoie
// l'user sur la home (pas de signOut, contrairement à /mot-de-passe-nouveau).
//
// Prérequis : session déjà établie (le code recovery a été échangé par
// /auth/callback OU directement par la page si le redirectTo Supabase pointait
// dessus). Sans session, on redirige vers /login.

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
    redirect(`/${locale}/auth/update-password?error=generic`);
  }
  if (password !== confirm) {
    redirect(`/${locale}/auth/update-password?error=mismatch`);
  }
  if (password.length < 6) {
    redirect(`/${locale}/auth/update-password?error=tooShort`);
  }

  const supabase = await createClient();

  // Sans session, updateUser échoue. La session de recovery a été établie via
  // l'échange code → session (par /auth/callback ou par la page elle-même).
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/${locale}/login`);
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    console.error(`[update-password] updateUser échoué : ${error.message}`);
    redirect(`/${locale}/auth/update-password?error=generic`);
  }

  // Session conservée → home connectée (spec : pas de signOut/login).
  redirect(`/${locale}/`);
}
