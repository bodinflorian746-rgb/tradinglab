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
  // Dev bypass : en local (npm run dev), on rend directement les enfants sans
  // vérifier l'accès premium. En prod (NODE_ENV === "production"), comportement
  // strictement inchangé. Voir aussi les 5 layouts (premium)/<sub>/layout.tsx
  // qui appliquent le même bypass au niveau redirect serveur.
  // .app-bg : applique la palette globale validée (dégradé + halos) à TOUT le
  // premium via cet unique wrapper. Règles couleur-only définies dans
  // globals.css, scopées sous .app-bg → aucun impact layout/UX.
  if (process.env.NODE_ENV !== "production") {
    return <div className="app-bg">{children}</div>;
  }

  const { isPremium, reason } = await requirePremium();

  if (isPremium) {
    return <div className="app-bg">{children}</div>;
  }

  const paywallReason: PaywallReason =
    reason === "not_logged_in" ? "not_logged_in" : "trial_expired";

  return (
    <div className="app-bg relative min-h-screen">
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
