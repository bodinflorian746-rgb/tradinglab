// Trading Débutant 8 — risque par trade selon le capital : la même règle pour tous, 1 % (prudent) à 2 %
// (maximum) du capital, quel que soit le capital (décision PO du 2026-10-15, comme le jeu « Trouve
// l'erreur »). Barres à l'échelle des euros : partie pleine = 1 %, barre entière = 2 %. Les montants
// sont calculés à partir des pourcentages.

import { Bars, LessonSchema } from "@/app/components/lessons/LessonSchema";

const CAPITALS = [300, 700, 2000];
const PRUDENT = 1, MAX = 2;
const eur = (x: number) => `${Math.round(x).toLocaleString("fr-FR").replace(/ /g, " ")} €`;

export function RiskGridDiagram() {
  return (
    <LessonSchema id="RiskDiagram" title="Risque par trade : 1 à 2 % du capital" caption="Le pourcentage ne change pas avec le capital : c'est le montant en euros qui grandit avec lui.">
      <Bars items={CAPITALS.map((capital) => {
        const low = (capital * PRUDENT) / 100, high = (capital * MAX) / 100;
        return {
          label: `Capital ${eur(capital)}`,
          note: `${PRUDENT} % prudent, ${MAX} % maximum`,
          value: high, inner: low, tone: "bull" as const,
          display: `${eur(low)} à ${eur(high)}`,
        };
      })} />
    </LessonSchema>
  );
}
