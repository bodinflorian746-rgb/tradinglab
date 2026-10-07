// Trading Débutant 10 — pourquoi le R/R change tout (texte de la leçon) : risque de 20 €
// dans les deux cas ; situation 1 vise 10 € (R/R 1:0,5), situation 2 vise 40 € (R/R 1:2).
// Sur 10 trades à 50 % de winrate : résultats calculés.

import { Bars, Cards, LessonSchema } from "@/app/components/lessons/LessonSchema";
import { fmtRR } from "@/lib/lessons/chart-analysis";

const RISK = 20;
const SITUATIONS = [{ n: 1, gain: 10 }, { n: 2, gain: 40 }];
const signedEur = (x: number) => `${x > 0 ? "+" : x < 0 ? "−" : ""}${Math.abs(x)} €`;

export default function RRComparisonDiagram(_props: { className?: string }) {
  const max = Math.max(RISK, ...SITUATIONS.map((s) => s.gain));
  return (
    <LessonSchema id="RRComparisonDiagram" title="Même risque, gain visé différent" caption="Sur 10 trades avec 50 % de trades gagnants : 5 gains et 5 pertes.">
      <Bars max={max} items={SITUATIONS.flatMap((s) => [
        { label: `Situation ${s.n} · risque`, value: RISK, display: `${RISK} €`, tone: "bear" as const },
        { label: `Situation ${s.n} · gain visé`, note: `R/R ${fmtRR(s.gain / RISK)}`, value: s.gain, display: `${s.gain} €`, tone: "bull" as const },
      ])} />
      <Cards cols={2} items={SITUATIONS.map((s) => {
        const total = 5 * s.gain - 5 * RISK;
        return { title: `Situation ${s.n} sur 10 trades`, value: signedEur(total), text: `5 × ${s.gain} € − 5 × ${RISK} €`, tone: total > 0 ? "bull" as const : "bear" as const };
      })} />
    </LessonSchema>
  );
}
