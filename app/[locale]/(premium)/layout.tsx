// Layout du Route Group (premium).
//
// Ce groupe ne verrouille PLUS tout en bloc. Modèle d'accès :
//   - Les pages de liste / index (hub formations, niveaux, modules, liste des
//     jeux, listes de stratégies) sont librement consultables par les visiteurs.
//   - Chaque *contenu* détaillé (leçon, stratégie, jeu) est verrouillé par son
//     propre layout feuille (LockedContentLayout).
//   - Les sections strictement personnelles (dashboard, journal, profil-trader,
//     compte) restent intégralement premium via leur layout dédié.
//
// Ce layout ne fait donc qu'appliquer la palette globale `.app-bg` (dégradé +
// halos, règles couleur-only scopées sous .app-bg dans globals.css) à tout le
// premium. Les parenthèses du dossier sont un Route Group Next.js : aucun
// impact sur les URLs.

import type { ReactNode } from "react";

export default function PremiumLayout({ children }: { children: ReactNode }) {
  return <div className="app-bg">{children}</div>;
}
