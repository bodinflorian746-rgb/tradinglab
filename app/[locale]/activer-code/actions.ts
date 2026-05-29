"use server";

// Server Action d'activation d'un code d'accès (parcours grand public).
// Vérifie le code dans access_codes (existe / non expiré / non utilisé),
// le consomme atomiquement, puis DÉCLENCHE le trial 48h en posant
// email_confirmed_at via le service role (lib/auth/premium.ts lit ce champ).
//
// Les erreurs sont renvoyées sous forme de CODE (?error=invalid|expired|...)
// que la page mappe vers un message localisé (FR/ES).

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function getStr(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v : "";
}

function activateError(locale: string, reason: string): never {
  redirect(`/${locale}/activer-code?error=${reason}`);
}

export async function activateCode(formData: FormData) {
  const code = getStr(formData, "code").trim().toUpperCase();
  const locale = getStr(formData, "locale") || "fr";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) activateError(locale, "notLoggedIn");

  if (!code) activateError(locale, "invalid");

  const admin = createAdminClient();

  // ─── 1. Lecture + validation du code ──────────────────────────────────────
  const { data: row, error: readErr } = await admin
    .from("access_codes")
    .select("code, status, expires_at, used_at")
    .eq("code", code)
    .maybeSingle();

  if (readErr) activateError(locale, "generic");
  if (!row) activateError(locale, "invalid");
  if (row.used_at || row.status === "used") activateError(locale, "used");
  if (row.status !== "available") activateError(locale, "invalid");
  if (row.expires_at && new Date(row.expires_at).getTime() < Date.now()) {
    activateError(locale, "expired");
  }

  // ─── 2. Consommation atomique (anti double-usage concurrent) ──────────────
  const { data: updated, error: updErr } = await admin
    .from("access_codes")
    .update({
      status: "used",
      used_by_user_id: user.id,
      used_at: new Date().toISOString(),
    })
    .eq("code", code)
    .eq("status", "available")
    .select("code");

  if (updErr || !updated || updated.length === 0) activateError(locale, "used");

  // ─── 3. Déclenche le trial 48h : email_confirmed_at = now (service role) ───
  const { error: confirmErr } = await admin.auth.admin.updateUserById(user.id, {
    email_confirm: true,
  });
  if (confirmErr) activateError(locale, "generic");

  revalidatePath("/", "layout");
  redirect(`/${locale}/dashboard`);
}
