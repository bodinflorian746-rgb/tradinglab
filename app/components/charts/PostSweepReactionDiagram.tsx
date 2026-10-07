// ICT 1 — le signal = la réaction après le sweep (EUR/USD M15, plan de la leçon) : equal
// highs 1.1780, dernier creux local 1.1762, sweep à 1.1792 refermé sous 1.1780
// (réintégration), bougie impulsive baissière de 35 pts qui casse 1.1762 → short 1.1758,
// SL 1.1795 (au-dessus du sweep), TP 1.1695 (liquidité basse). Corps, pivots et R/R
// calculés. Bougies : scenarios.ts (« ict-sweep-m15 »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { tradeSetup } from "@/app/components/lessons/trade";
import { fmtPrice, pivots } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);
const EQH = 1.178;

export function PostSweepReactionDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["ict-sweep-m15"];
  const sweep = cs.findIndex((k) => k.h > EQH);
  const local = pivots(cs, 2).filter((q) => q.side === "l" && q.index < sweep).at(-1)!;
  const imp = sweep + 1;
  const body = Math.round((cs[imp].o - cs[imp].c) / 0.0001);
  const t = tradeSetup({ entry: 1.1758, sl: 1.1795, tp: 1.1695, from: imp, tpOffscale: true, names: { tp: "TP liquidité basse" } });
  return (
    <LessonChart
      id="PostSweepReactionDiagram"
      title="Sweep → réintégration → impulsion"
      caption="Le sweep seul ne déclenche rien : c'est la réaction qui autorise le short."
      panels={[{
        key: "m15", title: "EUR/USD M15", decimals: 5, height: 300, candles: cs,
        levels: [
          { key: "eqh", price: EQH, to: sweep, label: `Equal highs ${p(EQH)}`, short: "Equal highs", tone: "zone" },
          { key: "local", price: local.price, from: local.index, to: imp, label: `Creux local ${p(local.price)}`, short: "Creux local", tone: "neutral", dashed: true },
          ...t.levels,
        ],
        offscale: t.offscale,
        markers: [
          { key: "sweep", i: sweep, price: cs[sweep].h, label: `Sweep ${p(cs[sweep].h)}, clôture sous ${p(EQH)}`, short: "Sweep", tone: "bear", side: "above" },
          { key: "imp", i: imp, price: cs[imp].l, label: `Impulsion ${body} pts`, short: `${body} pts`, tone: "bear", side: "below" },
        ],
        chips: t.chips,
      }]}
    />
  );
}
