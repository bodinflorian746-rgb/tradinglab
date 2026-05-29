"use server";

// Server Action de demande du code d'essai 48h (déclenchée par le badge
// "48h gratuit" sur /pricing et par le paywall premium).
//
// Le code 48h ne part QUE sur action explicite (jamais au signup). Flux :
//   - non connecté          → redirect /signup?from=trial
//   - déjà premium (trial/sub) → redirect /dashboard (pas besoin de code)
//   - déjà demandé un code  → redirect /code-envoye (anti-spam, 1 code par user)
//   - sinon                 → génère le code, l'insère, envoie le mail Resend,
//                             marque app_metadata.trial_code_requested_at,
//                             redirect /code-envoye
//   - erreur (insert / mail) → redirect /pricing?trial_error=1

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isPremium } from "@/lib/auth/premium";
import { generateCode } from "@/lib/access-codes";
import { sendTrialCodeEmail } from "@/lib/email/send-trial-code";

function getStr(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v : "";
}

export async function requestTrialCode(formData: FormData) {
  const locale = getStr(formData, "locale") || "fr";

  // a) Connecté ?
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) {
    redirect(`/${locale}/signup?from=trial`);
  }

  const email = user.email;
  const emailEnc = encodeURIComponent(email);

  // b) Déjà premium (trial actif ou abonnement) → pas besoin de code.
  const premium = await isPremium(user.id);
  if (premium.isPremium) {
    redirect(`/${locale}/dashboard`);
  }

  const admin = createAdminClient();

  // b bis) Anti-spam : un seul code trial par user. On marque la demande dans
  // app_metadata (server-only). Si déjà demandé → on renvoie sur /code-envoye.
  const { data: full, error: getErr } = await admin.auth.admin.getUserById(user.id);
  if (getErr) {
    console.error(`[trial] getUserById échoué pour ${user.id}: ${getErr.message}`);
    redirect(`/${locale}/pricing?trial_error=1`);
  }
  const appMeta = (full.user?.app_metadata ?? {}) as Record<string, unknown>;
  if (appMeta.trial_code_requested_at) {
    redirect(`/${locale}/code-envoye?email=${emailEnc}`);
  }

  // c) Génère + insère le code (available, NON lié au user — contrainte SQL).
  const code = generateCode();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const { error: insErr } = await admin.from("access_codes").insert({
    code,
    status: "available",
    type: "trial",
    expires_at: expiresAt,
  });
  if (insErr) {
    console.error(`[trial] insertion code échouée pour ${email}: ${insErr.message}`);
    redirect(`/${locale}/pricing?trial_error=1`);
  }

  // d) Envoi du mail Resend.
  const activateUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/activer-code`;
  const sent = await sendTrialCodeEmail(email, code, locale, activateUrl);
  if (!sent.ok) {
    console.error(`[trial] envoi email échoué pour ${email}: ${sent.error}`);
    redirect(`/${locale}/pricing?trial_error=1`);
  }

  // Marque la demande (anti double-envoi). Non bloquant si ça échoue.
  const { error: metaErr } = await admin.auth.admin.updateUserById(user.id, {
    app_metadata: { ...appMeta, trial_code_requested_at: new Date().toISOString() },
  });
  if (metaErr) {
    console.error(`[trial] marquage app_metadata échoué pour ${user.id}: ${metaErr.message}`);
  }

  // e) Confirmation.
  redirect(`/${locale}/code-envoye?email=${emailEnc}`);
}
