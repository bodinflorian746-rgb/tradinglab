// Wrapper Server Component pour gater une section premium.
//
// Si l'utilisateur a accès (abo actif ou trial 48h) → render children
// normalement. Sinon → render children blurrés + inert + overlay paywall.
//
// Utilisation : wrapper d'un layout (typiquement app/[locale]/(premium)/layout.tsx).

import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import { requirePremium } from "@/lib/auth/require-premium";
import { PremiumPaywall, type PaywallReason } from "./PremiumPaywall";

type PremiumGateProps = {
  children: ReactNode;
  locale: Locale;
};

export async function PremiumGate({ children, locale }: PremiumGateProps) {
  const { isPremium, reason } = await requirePremium();

  if (isPremium) {
    return <>{children}</>;
  }

  const paywallReason: PaywallReason =
    reason === "not_logged_in" ? "not_logged_in" : "trial_expired";

  return (
    <div className="relative min-h-screen">
      {/*
        Contenu blurré derrière. `inert` (React 19) bloque clavier + souris +
        AT, en plus du pointer-events/select. aria-hidden pour screen readers.
      */}
      <div
        aria-hidden="true"
        inert
        className="pointer-events-none select-none [filter:blur(8px)]"
      >
        {children}
      </div>

      <PremiumPaywall locale={locale} reason={paywallReason} />
    </div>
  );
}
