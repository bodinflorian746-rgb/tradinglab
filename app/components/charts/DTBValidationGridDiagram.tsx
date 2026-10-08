// Reversal 1 bloc 3 — valider un double top avec les critères du texte : tendance préalable
// claire, écart ≤ 0,3 % entre les sommets, breakout par clôture (pas une mèche), pas de news
// majeure dans les 30 minutes. Quatre cas sur EUR/USD H1 : le premier passe tout, chacun des
// autres rate un critère visible sur le graphique. Écart et clôture calculés.
// Bougies : scenarios.ts (« dt-eur », « dt-range », « dt-gap », « dt-wick »).

import { LessonChart, type LCPanel } from "@/app/components/lessons/LessonChart";
import { fmtPrice, pivots, type Candle } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);
const NECK = 1.18;

const CASES = [
  { key: "dt-eur", title: "✓ Double top valide" },
  { key: "dt-range", title: "✗ Pas de tendance préalable" },
  { key: "dt-gap", title: "✗ Écart supérieur à 0,3 %" },
  { key: "dt-wick", title: "✗ Mèche seule sous la ligne de cou" },
] as const;

export default function DTBValidationGridDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const panels: LCPanel[] = CASES.map(({ key, title }) => {
    const cs = CANDLES[key] as Candle[];
    const tops = pivots(cs, 2).filter((q) => q.side === "h").slice(-2);
    const gap = (Math.abs(tops[1].price - tops[0].price) / tops[0].price) * 100;
    const last = cs[cs.length - 1];
    const closed = last.c < NECK;
    return {
      key, title, decimals: 5, height: 180, candles: cs,
      subtitle: `Écart ${gap.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} % · ${closed ? "clôture sous la ligne de cou" : "mèche, clôture au-dessus"}`,
      levels: [{ key: "neck", price: NECK, from: tops[0].index, label: `Ligne de cou ${p(NECK)}`, short: "Ligne de cou", tone: "zone" as const }],
      markers: tops.map((t, n) => ({ key: `t${n}`, i: t.index, price: t.price, label: p(t.price), tone: "bear" as const, side: "above" as const })),
    };
  });
  return (
    <LessonChart
      id="DTBValidationGridDiagram"
      title="Les critères d'un double top valide"
      caption="Tendance préalable, écart ≤ 0,3 % (30 pips sur EUR/USD), clôture sous la ligne de cou, et pas de news majeure dans les 30 minutes."
      panels={panels}
      rows={[2, 2]}
    />
  );
}
