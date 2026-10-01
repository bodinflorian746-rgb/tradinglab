// BUY / SELL / NO TRADE — premier jeu migré dans la charte v2.
// Garde le verrou premium générique, puis pose la portée .tsx-v2 : la charte
// globale (app/styles/tsx-v2.css) et les polices Space Grotesk / JetBrains Mono,
// chargées par le layout racine, ne s'appliquent qu'à l'intérieur.

import type { ReactNode } from "react";
import LockedContentLayout from "@/app/components/premium/LockedContentLayout";

export default function BuySellNoTradeLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return (
    <LockedContentLayout params={params}>
      <div className="tsx-v2">{children}</div>
    </LockedContentLayout>
  );
}
