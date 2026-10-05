"use server";

// Server Action « Renvoyer le code » (bouton de /code-envoye). Retourne un état
// exploitable par useActionState (pas de redirect), pour un feedback inline
// (loading / « Code renvoyé » / limite atteinte).
//
// Ne touche NI requestTrialCode NI le 1er envoi : délègue à
// resendTrialCodeForUser (lib/auth/send-trial-code-flow) qui renvoie EXACTEMENT
// le même code stocké, avec rate-limit anti-spam (max 3, cooldown 60 s).

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resendTrialCodeForUser } from "@/lib/auth/send-trial-code-flow";

export type ResendState =
  | { status: "success" }
  | {
      status: "error";
      reason: "not_logged_in" | "consumed" | "no_stored_code" | "rate_limited" | "generic";
    };

function getStr(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v : "";
}

export async function resendTrialCode(
  _prevState: ResendState | null,
  formData: FormData,
): Promise<ResendState> {
  const locale = getStr(formData, "locale") || "fr";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "error", reason: "not_logged_in" };

  const admin = createAdminClient();
  const res = await resendTrialCodeForUser(admin, user, locale);
  if (res.ok) return { status: "success" };

  const reason =
    res.reason === "consumed"
      ? "consumed"
      : res.reason === "rate_limited"
        ? "rate_limited"
        : res.reason === "no_stored_code"
          ? "no_stored_code"
          : "generic";
  return { status: "error", reason };
}
