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
import { computeAccessPeriodEnd, decideAccessWrite, type ExistingSubscription } from "@/lib/access-codes";

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
    .select("code, status, type, expires_at, used_at, duration_days")
    .eq("code", code)
    .maybeSingle();

  if (readErr) activateError(locale, "generic");
  if (!row) activateError(locale, "invalid");
  if (row.used_at || row.status === "used") activateError(locale, "used");
  if (row.status !== "available") activateError(locale, "invalid");
  if (row.expires_at && new Date(row.expires_at).getTime() < Date.now()) {
    activateError(locale, "expired");
  }

  // ─── 1bis. Anti ré-activation trial (1 seul trial 48h par compte, à vie) ──
  // On lit app_metadata.trial_consumed_at AVANT toute consommation. Si le code
  // est de type 'trial' ET l'user a déjà consommé un trial → on refuse et on
  // redirige vers /pricing. Le code n'est PAS marqué used (il reste utilisable
  // par un autre user, ce qui est cohérent vu qu'il n'est pas lié à un user
  // tant qu'il est available). NB : on ne se base JAMAIS sur
  // trial_code_requested_at — un code demandé mais non consommé doit rester
  // activable.
  let userMetaForActivation: Record<string, unknown> = {};
  if (row.type === "trial") {
    const { data: fullUser, error: getErr } = await admin.auth.admin.getUserById(user.id);
    if (getErr) activateError(locale, "generic");
    userMetaForActivation = (fullUser.user?.app_metadata ?? {}) as Record<string, unknown>;
    if (userMetaForActivation.trial_consumed_at) {
      redirect(`/${locale}/pricing?trial_already_used=1`);
    }
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

  // ─── 3bis. Marqueur durable trial_consumed_at (verrou 1 trial / compte) ──
  // Posé uniquement pour les codes de type 'trial'. broker/lifetime conservent
  // leur propre logique (subscription à durée illimitée) et ne déclenchent pas
  // ce verrou. Non bloquant si l'update échoue : le code est déjà consommé +
  // email_confirmed_at posé → le user a accès, le flag est juste manqué pour
  // la prochaine demande (à corriger côté DB si besoin).
  if (row.type === "trial") {
    const { error: trialMetaErr } = await admin.auth.admin.updateUserById(user.id, {
      app_metadata: {
        ...userMetaForActivation,
        trial_consumed_at: new Date().toISOString(),
      },
    });
    if (trialMetaErr) {
      console.error(
        `[activate] trial_consumed_at update échoué pour ${user.id}: ${trialMetaErr.message}`,
      );
    }
  }

  // ─── 4. Codes 'broker' / 'lifetime' / 'duration' : accès via une subscription
  // premium.ts accorde l'accès si status ∈ {active,trialing} ET
  // current_period_end > now. broker/lifetime posent une date très lointaine
  // (accès à vie, mécanisme inchangé) ; 'duration' (codes générés par un admin
  // de groupe, cf. app/[locale]/master/actions.ts) pose now + duration_days
  // jours. Toujours sans Stripe (stripe_subscription_id null). Le type reste
  // tracé dans access_codes.type (ligne consommée).
  //
  // Règle « ne jamais raccourcir un accès existant » (decideAccessWrite) : un
  // code durée activé sur un compte à vie ne change rien, et un abonnement
  // Stripe en cours n'est jamais écrasé (prélèvements orphelins sinon).
  if (row.type === "broker" || row.type === "lifetime" || row.type === "duration") {
    const nowMs = Date.now();
    const nowIso = new Date(nowMs).toISOString();
    const periodEnd = computeAccessPeriodEnd(row.type, row.duration_days, nowMs);

    const { data: existing, error: existingErr } = await admin
      .from("subscriptions")
      .select("status, current_period_end, stripe_subscription_id")
      .eq("user_id", user.id)
      .maybeSingle();
    // Lecture impossible : on n'écrit que si le nouvel accès est « à vie »
    // (il ne peut raccourcir aucun accès non Stripe) ; sinon on s'abstient
    // plutôt que risquer d'écraser un accès plus long.
    const decision = existingErr
      ? row.type === "duration" ? "keep_unknown" : "write"
      : decideAccessWrite(existing as ExistingSubscription, periodEnd, nowMs);
    if (existingErr) {
      console.error(`[activate] lecture subscription échouée pour ${user.id}: ${existingErr.message}`);
    }
    if (decision !== "write") {
      // Code déjà consommé, accès existant conservé tel quel. Tracé pour suivi
      // (ex. remplacement d'un code durée par un code à vie déjà présent).
      console.warn(`[activate] code ${row.type} sans effet pour ${user.id} : ${decision}`);
      revalidatePath("/", "layout");
      redirect(`/${locale}`);
    }

    const { error: subErr } = await admin.from("subscriptions").upsert(
      {
        user_id: user.id,
        status: "active",
        stripe_subscription_id: null,
        stripe_customer_id: null,
        stripe_price_id: null,
        current_period_start: nowIso,
        current_period_end: periodEnd,
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
