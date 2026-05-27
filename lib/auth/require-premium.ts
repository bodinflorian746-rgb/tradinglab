// Helper Server Component / Layout pour gater les pages premium.
//
// Combine : auth utilisateur (createClient de @/lib/supabase/server) +
// isPremium() (qui regarde abonnement & trial). Renvoie un objet typé que
// le layout / la page peut décliner :
//
//   - { user: null, isPremium: false, reason: 'not_logged_in' }
//   - { user: User, isPremium: true,  reason: 'subscription' | 'trial', trialEndsAt? }
//   - { user: User, isPremium: false, reason: 'trial_expired' }
//
// Mémoïsé par requête.

import "server-only";
import { cache } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { isPremium } from "./premium";

export type RequirePremiumReason =
  | "not_logged_in"
  | "subscription"
  | "trial"
  | "trial_expired";

export type RequirePremiumResult = {
  user: User | null;
  isPremium: boolean;
  reason: RequirePremiumReason;
  trialEndsAt?: Date;
};

export const requirePremium = cache(async function requirePremium(): Promise<RequirePremiumResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, isPremium: false, reason: "not_logged_in" };
  }

  const status = await isPremium(user.id);

  if (status.isPremium && status.reason === "subscription") {
    return { user, isPremium: true, reason: "subscription" };
  }
  if (status.isPremium && status.reason === "trial") {
    return {
      user,
      isPremium: true,
      reason: "trial",
      trialEndsAt: status.trialEndsAt,
    };
  }

  // User connecté mais ni abo actif, ni trial valide.
  return { user, isPremium: false, reason: "trial_expired" };
});
