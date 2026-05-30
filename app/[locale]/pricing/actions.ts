"use server";

// Server Action de demande du code d'essai 48h (déclenchée par le badge
// "48h gratuit" sur /pricing et par le paywall premium).
//
// Le code 48h ne part QUE sur action explicite (jamais au signup classique).
// Flux :
//   - non connecté          → redirect /signup?from=trial
//   - déjà premium (trial/sub) → redirect /${locale} (pas besoin de code)
//   - sinon (logique commune avec signUp from=trial) → lib/auth/send-trial-code-flow
//   - erreur (insert / mail) → redirect /pricing?trial_error=1

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isPremium } from "@/lib/auth/premium";
import { sendTrialCodeForUser } from "@/lib/auth/send-trial-code-flow";

function getStr(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v : "";
}

export async function requestTrialCode(formData: FormData) {
  const locale = getStr(formData, "locale") || "fr";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) {
    redirect(`/${locale}/signup?from=trial`);
  }

  const emailEnc = encodeURIComponent(user.email);

  const premium = await isPremium(user.id);
  if (premium.isPremium) {
    redirect(`/${locale}`);
  }

  const admin = createAdminClient();
  const result = await sendTrialCodeForUser(admin, user, locale);

  if (!result.ok) {
    console.error(`[trial] sendTrialCodeForUser échoué pour ${user.email}: ${result.error}`);
    redirect(`/${locale}/pricing?trial_error=1`);
  }
  // alreadyRequested ou nouvel envoi : on aboutit toujours sur /code-envoye.
  redirect(`/${locale}/code-envoye?email=${emailEnc}`);
}
