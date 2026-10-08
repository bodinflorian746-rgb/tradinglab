// Multi-UT 1 bloc 4 — exécution LTF (M5) dans la zone H1 1.1765-1.1780 : sweep haussier
// à 1.1778, réintégration, CHoCH baissier (clôture sous 1.1765), entrée short.
// Bougies : scenarios.ts (« ltf-exec-m5 »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { tradeSetup } from "@/app/components/lessons/trade";
import { fmtPrice } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);
const SWEEP_I = 4;

export function LTFExecutionDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["ltf-exec-m5"];
  const choch = cs.findIndex((k, i) => i > SWEEP_I && k.c < 1.1765);
  const t = tradeSetup({ entry: cs[choch].c, sl: cs[SWEEP_I].h + 0.0005, tp: 1.1700, tpOffscale: true, names: { entry: "CHoCH → entrée short" } });
  return (
    <LessonChart
      id="LTFExecutionDiagram"
      title="M5 : sweep → CHoCH → entrée short"
      caption="Le LTF donne le timing précis. L'entrée n'arrive qu'après le déclencheur dans la zone préparée."
      panels={[{
        key: "m5", title: "EUR/USD M5 — dans la zone H1 1.1765-1.1780", decimals: 5, height: 280, candles: cs,
        zones: [{ key: "zone", y1: 1.1765, y2: 1.178, label: "Zone H1", short: "Zone H1", tone: "zone" }],
        levels: t.levels,
        offscale: t.offscale,
        markers: [
          { key: "sweep", i: SWEEP_I, price: cs[SWEEP_I].h, label: `Sweep ${p(cs[SWEEP_I].h)}`, short: "Sweep", tone: "zone", side: "above" },
          { key: "choch", i: choch, price: cs[choch].l, label: `CHoCH ${p(cs[choch].c)}`, short: "CHoCH", tone: "bear", side: "below" },
        ],
        chips: t.chips,
      }]}
    />
  );
}
