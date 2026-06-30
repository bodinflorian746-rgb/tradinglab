// Layout serveur générique qui verrouille un *contenu* premium (une leçon, une
// stratégie, un jeu). Posé dans le dossier feuille de chaque contenu détaillé
// via un simple re-export :
//
//   export { default } from "@/app/components/premium/LockedContentLayout";
//
// Comportement (identique dans TOUS les environnements — dev, Vercel Preview,
// production — pour que la protection ne dépende jamais de NODE_ENV) :
//   - premium / admin / trial 48h actif → on rend le contenu.
//   - anonyme ou non premium → on rend PremiumLockScreen À LA PLACE du contenu.
//     Le contenu premium n'est donc jamais envoyé au client.
//
// Pour prévisualiser un contenu en local sans être premium, se connecter avec
// un compte admin (ADMIN_EMAILS) : requirePremium() court-circuite alors les
// vérifs sub/trial.
//
// Les pages de liste / index (hub formations, niveaux, modules, liste des jeux)
// n'ont PAS ce layout → elles restent librement consultables.

import type { ReactNode } from "react";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { requirePremium } from "@/lib/auth/require-premium";
import { PremiumLockScreen } from "./PremiumLockScreen";
import type { PaywallReason } from "./paywall-strings";

export default async function LockedContentLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const raw = (await params).locale;
  const locale: Locale = hasLocale(raw) ? raw : DEFAULT_LOCALE;

  const { isPremium, reason } = await requirePremium();

  if (isPremium) {
    return <>{children}</>;
  }

  const paywallReason: PaywallReason =
    reason === "not_logged_in" ? "not_logged_in" : "trial_expired";

  return <PremiumLockScreen locale={locale} reason={paywallReason} />;
}
