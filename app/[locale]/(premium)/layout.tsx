// Layout du Route Group (premium).
// Wrappe toutes les pages gatées (dashboard, formations, jeux, profil-trader,
// strategies) via PremiumGate. Les parenthèses dans le nom de dossier sont
// la convention Next.js pour un Route Group : aucun impact sur les URLs.
//
// Toute page placée sous ce dossier déclenche la vérif premium.

import type { ReactNode } from "react";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { PremiumGate } from "@/app/components/premium/PremiumGate";

export default async function PremiumLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const raw = (await params).locale;
  const locale: Locale = hasLocale(raw) ? raw : DEFAULT_LOCALE;

  return <PremiumGate locale={locale}>{children}</PremiumGate>;
}
