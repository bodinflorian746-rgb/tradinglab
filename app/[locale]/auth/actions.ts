"use server";

// Server Actions auth : signUp (grand public, code trial auto par mail),
// signIn, signOut. Appelées depuis les <form action={...}>.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

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
  const from     = getStr(formData, "from");

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

  // ─── 3. Redirection ───────────────────────────────────────────────────────
  // PAS de génération de code ni d'envoi de mail ici : le code 48h ne part que
  // sur action explicite (clic du badge "48h gratuit" → requestTrialCode).
  // `from=trial` : l'user venait du badge en étant déconnecté → on le ramène sur
  // /pricing pour qu'il (re)clique "48h gratuit", maintenant connecté. Sinon home.
  revalidatePath("/", "layout");
  redirect(from === "trial" ? `/${locale}/pricing` : `/${locale}`);
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
