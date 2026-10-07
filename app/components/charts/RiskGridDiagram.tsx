// Trading Débutant 8 — grille de risque : montant risqué par trade selon le capital
// (texte de la leçon). Barres à l'échelle des euros : partie pleine = idéal, barre
// entière = maximum. Les montants sont calculés à partir des pourcentages.

import { Bars, LessonSchema } from "@/app/components/lessons/LessonSchema";

const ROWS = [
  { capital: 300, ideal: [3], max: 5 },
  { capital: 500, ideal: [2, 3], max: 5 },
  { capital: 1000, ideal: [2, 3], max: 3 },
  { capital: 2000, ideal: [2], max: 2 },
];
const eur = (x: number) => `${Math.round(x).toLocaleString("fr-FR").replace(/ /g, " ")} €`;
const pct = (a: number[]) => a.join("-") + " %";

export function RiskGridDiagram() {
  return (
    <LessonSchema id="RiskDiagram" title="Risque par trade : idéal et maximum selon le capital" caption="Le pourcentage baisse quand le capital monte, le montant en euros augmente.">
      <Bars items={ROWS.map((r) => {
        const idealEur = (r.capital * Math.max(...r.ideal)) / 100, maxEur = (r.capital * r.max) / 100;
        const idealTxt = r.ideal.length > 1 ? `${eur((r.capital * r.ideal[0]) / 100).replace(" €", "")}-${eur(idealEur)}` : eur(idealEur);
        return {
          label: `Capital ${eur(r.capital)}`,
          note: r.ideal.length === 1 && r.max === r.ideal[0] ? `${pct(r.ideal)} (idéal = max)` : `idéal ${pct(r.ideal)}, max ${r.max} %`,
          value: maxEur, inner: idealEur, tone: "bull" as const,
          display: r.ideal.length === 1 && idealEur === maxEur ? eur(maxEur) : `idéal ${idealTxt} · max ${eur(maxEur)}`,
        };
      })} />
    </LessonSchema>
  );
}
