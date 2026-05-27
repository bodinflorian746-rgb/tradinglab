// Helper de gating premium côté serveur.
//
// Évalue si un user a accès au contenu premium :
//   1. Abonnement actif (status ∈ {active, trialing} ET current_period_end > now)
//   2. Sinon : trial 48h post-confirmation email (email_confirmed_at + 48h > now)
//   3. Sinon : pas d'accès
//
// Utilise createAdminClient() car on lit à la fois public.subscriptions ET
// auth.users (l'accès à auth.users est interdit avec la publishable key).
// Server-only.

import "server-only";
import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/admin";

const TRIAL_DURATION_MS = 48 * 60 * 60 * 1000;

export type PremiumReason = "subscription" | "trial" | "none";

export type PremiumStatus = {
  isPremium: boolean;
  reason: PremiumReason;
  trialEndsAt?: Date;
};

/**
 * Évalue le statut premium d'un user.
 * Mémoïsé par requête (React cache) — sûr d'appeler plusieurs fois dans
 * le même rendu sans déclencher plusieurs requêtes DB.
 *
 * @param userId UUID de l'utilisateur Supabase (auth.users.id)
 */
export const isPremium = cache(async function isPremium(
  userId: string,
): Promise<PremiumStatus> {
  const supabase = createAdminClient();
  const now = new Date();

  // 1. Abonnement Stripe actif ?
  const { data: sub, error: subError } = await supabase
    .from("subscriptions")
    .select("status, current_period_end")
    .eq("user_id", userId)
    .maybeSingle();

  if (subError) {
    console.error(
      `[premium] lookup subscriptions failed for user=${userId}: ${subError.message}`,
    );
    // En cas d'erreur DB on dégrade vers "pas premium" plutôt que de
    // crasher le rendu. Le user verra le paywall, plus safe que de
    // laisser passer.
    return { isPremium: false, reason: "none" };
  }

  if (sub && (sub.status === "active" || sub.status === "trialing")) {
    const rawEnd =
      typeof sub.current_period_end === "string" ? sub.current_period_end : null;
    const periodEnd = rawEnd ? new Date(rawEnd) : null;
    if (periodEnd && !Number.isNaN(periodEnd.getTime()) && periodEnd > now) {
      return { isPremium: true, reason: "subscription" };
    }
  }

  // 2. Trial 48h post-confirmation email ?
  const { data: userResp, error: userError } =
    await supabase.auth.admin.getUserById(userId);

  if (userError) {
    console.error(
      `[premium] auth.admin.getUserById failed for user=${userId}: ${userError.message}`,
    );
    return { isPremium: false, reason: "none" };
  }

  const emailConfirmedAt = userResp.user?.email_confirmed_at;
  if (typeof emailConfirmedAt === "string" && emailConfirmedAt.length > 0) {
    const confirmedDate = new Date(emailConfirmedAt);
    if (!Number.isNaN(confirmedDate.getTime())) {
      const trialEnd = new Date(confirmedDate.getTime() + TRIAL_DURATION_MS);
      if (trialEnd > now) {
        return { isPremium: true, reason: "trial", trialEndsAt: trialEnd };
      }
    }
  }

  // 3. Ni sub, ni trial actif.
  return { isPremium: false, reason: "none" };
});
