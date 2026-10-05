// Logique partagée d'envoi d'un code d'essai 48h. Appelée par :
//   - app/[locale]/auth/actions.ts signUp (branche from=trial : envoi auto)
//   - app/[locale]/pricing/actions.ts requestTrialCode (clic explicite badge)
//
// Responsabilités :
//   1) Anti-spam : si app_metadata.trial_code_requested_at déjà posé → no-op.
//   2) Génère un code 'trial' (expires +7 jours), insère en DB (sans
//      used_by_user_id : contrainte access_codes_used_consistency).
//   3) Envoie le mail Resend.
//   4) Marque app_metadata.trial_code_requested_at (anti double-envoi).
//
// La vérif "user déjà premium" et "user connecté" reste à l'appelant : ce util
// suppose un User valide en entrée.

import "server-only";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { generateCode } from "@/lib/access-codes";
import { sendTrialCodeEmail } from "@/lib/email/send-trial-code";

export type TrialCodeResult =
  | { ok: true; alreadyRequested: true }
  | { ok: true; alreadyRequested: false }
  | { ok: false; error: string };

export async function sendTrialCodeForUser(
  admin: SupabaseClient,
  user: User,
  locale: string,
): Promise<TrialCodeResult> {
  if (!user.email) return { ok: false, error: "user.email missing" };

  // 1. Anti-spam
  const { data: full, error: getErr } = await admin.auth.admin.getUserById(user.id);
  if (getErr) return { ok: false, error: getErr.message };
  const meta = (full.user?.app_metadata ?? {}) as Record<string, unknown>;
  if (meta.trial_code_requested_at) {
    return { ok: true, alreadyRequested: true };
  }

  // 2. Génère + insère
  const code = generateCode();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const { error: insErr } = await admin.from("access_codes").insert({
    code,
    status: "available",
    type: "trial",
    expires_at: expiresAt,
  });
  if (insErr) return { ok: false, error: insErr.message };

  // 3. Mail Resend
  const activateUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/activer-code`;
  const sent = await sendTrialCodeEmail(user.email, code, locale, activateUrl);
  if (!sent.ok) return { ok: false, error: sent.error ?? "mail send failed" };

  // 4. Marque la demande (non bloquant si échoue).
  // trial_code : stocké pour permettre le renvoi À L'IDENTIQUE
  // (resendTrialCodeForUser). ⚠ app_metadata est inclus dans le JWT Supabase →
  // lisible par l'utilisateur lui-même côté client (« own-code », déjà envoyé
  // dans son email). Exposition assumée (choix produit). Aucun autre effet :
  // le control-flow, l'anti-spam et les valeurs de retour ci-dessus sont
  // inchangés → 1er envoi identique pour signUp(from=trial) + requestTrialCode.
  const { error: metaErr } = await admin.auth.admin.updateUserById(user.id, {
    app_metadata: { ...meta, trial_code_requested_at: new Date().toISOString(), trial_code: code },
  });
  if (metaErr) {
    console.error(`[trial-flow] app_metadata update échoué pour ${user.id}: ${metaErr.message}`);
  }

  return { ok: true, alreadyRequested: false };
}

// ─── Renvoi du MÊME code (jamais un nouveau) ─────────────────────────────────
// Utilisé UNIQUEMENT par le bouton « Renvoyer le code » de /code-envoye (via
// la Server Action resendTrialCode). Ne génère jamais de code : relit
// app_metadata.trial_code (posé au 1er envoi) et le ré-émet.
//
// Rate-limit anti-spam : renvoi possible seulement si le trial n'est pas
// consommé, avec max 3 renvois et un cooldown de 60 s entre deux.

export const MAX_TRIAL_RESENDS = 3;
export const TRIAL_RESEND_COOLDOWN_MS = 60_000;

export type ResendCodeResult =
  | { ok: true }
  | {
      ok: false;
      reason: "consumed" | "no_stored_code" | "rate_limited" | "mail_failed" | "error";
    };

export async function resendTrialCodeForUser(
  admin: SupabaseClient,
  user: User,
  locale: string,
): Promise<ResendCodeResult> {
  if (!user.email) return { ok: false, reason: "error" };

  const { data: full, error: getErr } = await admin.auth.admin.getUserById(user.id);
  if (getErr) return { ok: false, reason: "error" };
  const meta = (full.user?.app_metadata ?? {}) as Record<string, unknown>;

  // Trial déjà consommé → plus de renvoi.
  if (meta.trial_consumed_at) return { ok: false, reason: "consumed" };

  // On renvoie EXACTEMENT le code stocké au 1er envoi. Absent (user antérieur à
  // cette feature) → on ne régénère pas, on signale.
  const code = typeof meta.trial_code === "string" ? meta.trial_code : "";
  if (!code) return { ok: false, reason: "no_stored_code" };

  // Rate-limit : max N renvois + cooldown.
  const resends = typeof meta.trial_resends === "number" ? meta.trial_resends : 0;
  const lastAt =
    typeof meta.trial_last_resent_at === "string" ? Date.parse(meta.trial_last_resent_at) : 0;
  const now = Date.now();
  if (resends >= MAX_TRIAL_RESENDS) return { ok: false, reason: "rate_limited" };
  if (lastAt && now - lastAt < TRIAL_RESEND_COOLDOWN_MS) {
    return { ok: false, reason: "rate_limited" };
  }

  // Ré-émission du MÊME code (réutilise la primitive d'envoi, pas de duplication
  // du template email).
  const activateUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/activer-code`;
  const sent = await sendTrialCodeEmail(user.email, code, locale, activateUrl);
  if (!sent.ok) return { ok: false, reason: "mail_failed" };

  // Incrémente le compteur de renvois (non bloquant).
  const { error: metaErr } = await admin.auth.admin.updateUserById(user.id, {
    app_metadata: {
      ...meta,
      trial_resends: resends + 1,
      trial_last_resent_at: new Date().toISOString(),
    },
  });
  if (metaErr) {
    console.error(`[trial-flow] resend metadata update échoué pour ${user.id}: ${metaErr.message}`);
  }

  return { ok: true };
}
