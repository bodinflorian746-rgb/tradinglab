"use server";

// Server Actions auth V1 : signUp (avec code d'accès), signIn, signOut.
// Appelées depuis les <form action={...}> dans /signup, /login, /dashboard.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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
  const code     = getStr(formData, "code").trim();
  const locale   = getStr(formData, "locale") || "fr";

  if (!email || !password) {
    signupError(locale, "Email et mot de passe requis.");
  }
  if (!code) {
    signupError(locale, "Code d'accès requis.");
  }

  const supabase = await createClient();

  // ─── 1. Pré-validation du code d'accès ────────────────────────────────────
  // Lecture du code pour vérifier statut + expiration AVANT toute création
  // de compte. Évite la création d'un user orphelin si le code est invalide.
  const { data: codeRow, error: codeReadErr } = await supabase
    .from("access_codes")
    .select("code, status, expires_at")
    .eq("code", code)
    .maybeSingle();

  if (codeReadErr) {
    signupError(locale, "Impossible de vérifier le code d'accès. Réessaie.");
  }
  if (!codeRow) {
    signupError(locale, "Code d'accès invalide.");
  }
  if (codeRow.status === "used") {
    signupError(locale, "Ce code d'accès a déjà été utilisé.");
  }
  if (codeRow.status === "revoked") {
    signupError(locale, "Ce code d'accès a été révoqué.");
  }
  if (codeRow.status !== "available") {
    signupError(locale, "Code d'accès invalide.");
  }
  if (codeRow.expires_at && new Date(codeRow.expires_at).getTime() < Date.now()) {
    signupError(locale, "Ce code d'accès a expiré.");
  }

  // ─── 2. Création du compte Supabase ───────────────────────────────────────
  const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/auth/callback`,
    },
  });

  if (signUpErr) {
    signupError(locale, signUpErr.message);
  }

  const userId = signUpData.user?.id;
  if (!userId) {
    signupError(locale, "Erreur lors de la création du compte.");
  }

  // ─── 3. Consommation atomique du code ─────────────────────────────────────
  // UPDATE conditionnel : on n'écrit que si status='available' au moment de
  // l'UPDATE. Si une autre signup concurrente vient de réserver le code
  // entre notre SELECT (étape 1) et notre UPDATE, l'UPDATE matche 0 lignes
  // → on détecte la race et on rejette le signup.
  const { data: updated, error: updateErr } = await supabase
    .from("access_codes")
    .update({
      status:          "used",
      used_by_user_id: userId,
      used_at:         new Date().toISOString(),
    })
    .eq("code", code)
    .eq("status", "available")
    .select("code");

  if (updateErr || !updated || updated.length === 0) {
    // Race condition : un autre user vient de prendre ce code.
    // Le compte vient d'être créé mais n'a pas de code consommé.
    // On signe out l'user et on lui demande de réessayer / contacter support.
    await supabase.auth.signOut();
    signupError(locale, "Ce code d'accès vient d'être utilisé. Contacte le support si tu pensais l'avoir réservé.");
  }

  revalidatePath("/", "layout");
  redirect(`/${locale}/dashboard`);
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
