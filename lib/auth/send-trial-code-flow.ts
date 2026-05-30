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

  // 4. Marque la demande (non bloquant si échoue)
  const { error: metaErr } = await admin.auth.admin.updateUserById(user.id, {
    app_metadata: { ...meta, trial_code_requested_at: new Date().toISOString() },
  });
  if (metaErr) {
    console.error(`[trial-flow] app_metadata update échoué pour ${user.id}: ${metaErr.message}`);
  }

  return { ok: true, alreadyRequested: false };
}
