// ICT 3 — range Asia 1.1710-1.1725 (7 bougies calmes), sweep sous 1.1710 jusqu'à
// 1.1702 (London Open), réintégration, impulsion haussière jusqu'à 1.1750.
// Bougies : scenarios.ts (« asia-range-sweep »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);

export function AsiaRangeSweepDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["asia-range-sweep"];
  const ASIA_END = 6, SWEEP = 7, REIN = 8;
  const asiaHigh = Math.max(...cs.slice(0, ASIA_END + 1).map((k) => k.h));
  const asiaHighAt = cs.findIndex((k, i) => i <= ASIA_END && k.h === asiaHigh);
  const sweepLow = cs[SWEEP].l;
  const peak = Math.max(...cs.map((k) => k.h));
  const peakAt = cs.findIndex((k) => k.h === peak);
  return (
    <LessonChart
      id="AsiaRangeSweepDiagram"
      title="Range Asia → sweep Londres → expansion"
      caption="La cible n'était pas le breakout baissier, c'était la liquidité sous le range Asia."
      panels={[{
        key: "m15", title: "EUR/USD M15", decimals: 5, height: 280, candles: cs,
        zones: [
          { key: "asia", y1: 1.171, y2: 1.1725, from: 0, to: ASIA_END, label: "Range Asia", short: "Range Asia", tone: "sky" },
        ],
        levels: [
          { key: "asialow", price: 1.171, to: SWEEP, label: `Stops sous ${p(1.171)}`, short: "Stops", tone: "zone", dashed: true },
        ],
        markers: [
          { key: "asiaH", i: asiaHighAt, price: asiaHigh, label: `Haut Asia ${p(asiaHigh)}`, short: "Haut Asia", tone: "sky", side: "above", role: "high" },
          { key: "sweep", i: SWEEP, price: sweepLow, label: `Sweep ${p(sweepLow)} : stops déclenchés`, short: "Sweep", tone: "bear", side: "below", role: "sweep", ref: 1.171, dir: "bull" },
          { key: "imp", i: REIN + 1, price: cs[REIN + 1].l, label: "Impulsion haussière", short: "Impulsion", tone: "bull", side: "below", role: "impulse", span: [REIN, REIN + 2] },
          { key: "peak", i: peakAt, price: peak, label: `Expansion → ${p(peak)}`, short: "Expansion", tone: "bull", side: "above", role: "high" },
        ],
      }]}
    />
  );
}
