// Reversal 1 bloc 3 — valider un double top avec les critères du texte : tendance préalable
// claire, écart ≤ 30 pips entre les sommets (seuil fixe, décision PO), breakout par clôture (pas une mèche), pas de news
// majeure dans les 30 minutes (vérifié dans le calendrier, pas sur le graphique). Quatre cas sur EUR/USD H1 : le premier passe tout, chacun des
// autres rate un critère visible sur le graphique. Écart et clôture calculés.
// Bougies : scenarios.ts (« dt-eur », « dt-range », « dt-gap », « dt-wick »).

import { LessonChart, type LCPanel } from "@/app/components/lessons/LessonChart";
import { fmtPrice, pips, pivots, type Candle } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);
const NECK = 1.18;

const CASES = [
  { key: "dt-eur", title: "✓ Double top valide" },
  { key: "dt-range", title: "✗ Pas de tendance préalable" },
  { key: "dt-gap", title: "✗ Écart supérieur à 30 pips" },
  { key: "dt-wick", title: "✗ Mèche seule sous la ligne de cou" },
] as const;

export default function DTBValidationGridDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const panels: LCPanel[] = CASES.map(({ key, title }) => {
    const cs = CANDLES[key] as Candle[];
    const tops = pivots(cs, 2).filter((q) => q.side === "h").slice(-2);
    const gap = pips(tops[1].price, tops[0].price, 0.0001);
    const last = cs[cs.length - 1];
    const closed = last.c < NECK;
    return {
      key, title, decimals: 5, height: 180, candles: cs,
      subtitle: `Écart ${gap} pips · ${closed ? "clôture sous la ligne de cou" : "mèche, clôture au-dessus"}`,
      levels: [{ key: "neck", price: NECK, from: tops[0].index, label: `Ligne de cou ${p(NECK)}`, short: "Ligne de cou", tone: "zone" as const }],
      markers: tops.map((t, n) => ({ key: `t${n}`, i: t.index, price: t.price, label: `Sommet ${n + 1} ${p(t.price)}`, short: `Sommet ${n + 1}`, tone: "bear" as const, side: "above" as const })),
    };
  });
  return (
    <LessonChart
      id="DTBValidationGridDiagram"
      title="Les critères d'un double top valide"
      caption="Tendance préalable, écart de 30 pips au plus, clôture sous la ligne de cou. Le 4e critère, pas de news majeure dans les 30 minutes, se vérifie dans le calendrier économique, pas sur le graphique."
      panels={panels}
      rows={[2, 2]}
    />
  );
}
