"use server";

// Server Action d'activation d'un code d'accès (parcours grand public).
// Vérifie le code dans access_codes (existe / non expiré / non utilisé),
// le consomme atomiquement, puis confirme l'email via le service role.
//   - code 'trial'            → trial 48h (email_confirmed_at lu par premium.ts)
//   - code 'broker'/'lifetime'→ subscription active "à vie" (accès illimité)
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

  // ─── 1. Lecture + validation du code (avec le type) ───────────────────────
  const { data: row, error: readErr } = await admin
    .from("access_codes")
    .select("code, status, type, expires_at, used_at")
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

  // ─── 3. Pose email_confirmed_at = now() via SQL (service role) ─────────────
  // Pour un code 'trial' c'est ce qui déclenche le trial 48h via premium.ts.
  // Pour 'broker'/'lifetime' on actualise aussi (cohérence) ; l'accès illimité
  // vient de la subscription créée à l'étape 4.
  // On utilise une RPC SECURITY DEFINER (pas admin.updateUserById({email_confirm:true}))
  // car au signup on backdate à 1970 ; updateUserById(email_confirm:true) est
  // no-op si email_confirmed_at est déjà set (même très ancien). La RPC force now().
  const { error: confirmErr } = await admin.rpc("set_email_confirmed_at_now", {
    uid: user.id,
  });
  if (confirmErr) activateError(locale, "generic");

  // ─── 4. Codes 'broker' / 'lifetime' : accès illimité via une subscription ──
  // premium.ts accorde l'accès si status ∈ {active,trialing} ET
  // current_period_end > now : on pose donc une date très lointaine (accès à
  // vie), sans Stripe (stripe_subscription_id null). La distinction
  // broker/lifetime reste tracée dans access_codes.type (ligne consommée).
  if (row.type === "broker" || row.type === "lifetime") {
    const FAR_FUTURE = "2099-12-31T23:59:59.000Z";
    const nowIso = new Date().toISOString();
    const { error: subErr } = await admin.from("subscriptions").upsert(
      {
        user_id: user.id,
        status: "active",
        stripe_subscription_id: null,
        stripe_customer_id: null,
        stripe_price_id: null,
        current_period_start: nowIso,
        current_period_end: FAR_FUTURE,
        cancel_at_period_end: false,
        updated_at: nowIso,
      },
      { onConflict: "user_id" },
    );
    if (subErr) {
      // Code déjà consommé : on ne bloque pas (sinon user coincé). On log pour
      // réparation manuelle ; l'user garde au minimum l'accès 48h (email_confirm).
      console.error(
        `[activate] upsert subscription (${row.type}) échoué pour ${user.id}: ${subErr.message}`,
      );
    }
  }

  revalidatePath("/", "layout");
  redirect(`/${locale}`);
}
