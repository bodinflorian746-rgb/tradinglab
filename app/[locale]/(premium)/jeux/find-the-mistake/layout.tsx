// Trouve l'erreur — jeu migré dans la charte v2.
// Garde le verrou premium générique, puis pose la portée .tsx-v2 : la charte
// (games-v2.css) et les polices Space Grotesk / JetBrains Mono ne s'appliquent
// qu'ici. Polices sans préchargement : aucune requête ajoutée aux autres pages.

import type { ReactNode } from "react";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import LockedContentLayout from "@/app/components/premium/LockedContentLayout";
import "@/app/components/games/v2/games-v2.css";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-v2-display", display: "swap", preload: false });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-v2-mono", display: "swap", preload: false });

export default function FindTheMistakeLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return (
    <LockedContentLayout params={params}>
      <div className={`tsx-v2 ${display.variable} ${mono.variable}`}>{children}</div>
    </LockedContentLayout>
  );
}
