// Helper Server Component / Layout pour gater les pages premium.
//
// Combine : auth utilisateur (createClient de @/lib/supabase/server) +
// isPremium() (qui regarde abonnement & trial). Renvoie un objet typé que
// le layout / la page peut décliner :
//
//   - { user: null, isPremium: false, reason: 'not_logged_in' }
//   - { user: User, isPremium: true,  reason: 'admin' | 'subscription' | 'trial', trialEndsAt? }
//   - { user: User, isPremium: false, reason: 'trial_expired' }
//
// Mémoïsé par requête.
//
// Court-circuit admin : si user.email ∈ ADMIN_EMAILS, accès premium illimité,
// sans aucune requête Stripe/Supabase pour vérifier sub/trial. Le boolean
// d'admin est évalué côté serveur via lib/auth/admin (process.env, server-only).

import "server-only";
import { cache } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "./admin";
import { isPremium } from "./premium";

export type RequirePremiumReason =
  | "not_logged_in"
  | "admin"
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

  // Admins → accès illimité, court-circuit avant toute requête trial/sub.
  if (isAdmin(user.email)) {
    return { user, isPremium: true, reason: "admin" };
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
