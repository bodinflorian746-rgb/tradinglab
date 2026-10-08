// SMC 4 bloc 2 et SMC 5 bloc 2 — le sweep (EUR/USD H4, plan de SMC 4) : accumulation entre
// 1.1700 et 1.1750, equal highs 1.1760 (liquidité buy-side) ; une bougie perce 1.1760 (mèche
// 1.1765) et clôture à 1.1745 : réintégration, puis impulsion baissière. Sommets, mèche et
// clôture lus sur les bougies. Bougies : scenarios.ts (« smc4-sweep », jusqu'à l'impulsion opposée).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);
const EQH = 1.176;

export function LiquidityGrabDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const all = CANDLES["smc4-sweep"];
  const sweep = all.findIndex((k) => k.h > EQH);
  const cs = all.slice(0, sweep + 3);
  const tops = cs.map((k, i) => (k.h === EQH ? i : -1)).filter((i) => i >= 0);
  return (
    <LessonChart
      id="LiquidityGrabDiagram"
      title="Le sweep : la mèche prend les stops, la clôture rejette"
      caption="Perçage rapide, mèche agressive, clôture réintégrée sous le niveau : ce n'est pas un breakout, c'est un sweep."
      panels={[{
        key: "h4", title: "EUR/USD H4", decimals: 5, height: 280, candles: cs,
        zones: [{ key: "acc", y1: 1.17, y2: 1.175, to: sweep - 1, label: `Accumulation ${p(1.17)}-${p(1.175)}`, short: "Accumulation", tone: "neutral" }],
        levels: [{ key: "eqh", price: EQH, from: tops[0], label: `Equal highs ${p(EQH)} (BSL)`, short: "BSL", tone: "zone", dashed: true }],
        markers: [
          ...tops.map((i, n) => ({ key: `t${n}`, i, price: EQH, label: "EQH", tone: "zone" as const, side: "above" as const })),
          { key: "sweep", i: sweep, price: all[sweep].h, label: `Sweep ${p(all[sweep].h)}`, short: "Sweep", tone: "bear", side: "above", role: "sweep", ref: EQH, dir: "bear" },
          { key: "imp", i: sweep + 1, price: all[sweep + 1].l, label: "Impulsion opposée", short: "Impulsion", tone: "bear", side: "below", role: "impulse", span: [sweep + 1, sweep + 1] },
        ],
      }]}
    />
  );
}
