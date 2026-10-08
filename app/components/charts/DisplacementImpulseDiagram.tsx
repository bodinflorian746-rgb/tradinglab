// ICT 4 — displacement bearish (EUR/USD M15) : 2 bougies calmes, sweep à 1.1792
// refermé sous 1.1780, puis 4 bougies baissières consécutives (displacement) jusqu'à
// 1.1748, avec des FVG laissés dans la chute.
// Bougies : scenarios.ts (« disp-impulse »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice, largestFvg } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);
const SWEEP_I = 2;

export function DisplacementImpulseDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["disp-impulse"];
  const fvg = largestFvg(cs, "bear");
  const low = Math.min(...cs.map((k) => k.l));
  const lowAt = cs.findIndex((k) => k.l === low);
  const disps = cs.slice(SWEEP_I + 1).filter((k) => k.c < k.o).length;
  return (
    <LessonChart
      id="DisplacementImpulseDiagram"
      title="Le displacement : qui prend le contrôle"
      caption="Corps grands, peu de mèches contraires, FVG laissés dans la chute : signature institutionnelle."
      panels={[{
        key: "m15", title: "EUR/USD M15", decimals: 5, height: 280, candles: cs,
        levels: [{ key: "res", price: 1.178, to: SWEEP_I + 1, label: p(1.178), short: p(1.178), tone: "zone", dashed: true }],
        zones: fvg ? [{ key: "fvg", y1: fvg.y1, y2: fvg.y2, from: fvg.i - 1, label: "FVG", tone: "bear", kind: "fvg", src: `disp-impulse:${fvg.i}` }] : [],
        markers: [
          { key: "sweep", i: SWEEP_I, price: cs[SWEEP_I].h, label: `Sweep ${p(cs[SWEEP_I].h)}`, short: "Sweep", tone: "zone", side: "above" },
          { key: "low", i: lowAt, price: low, label: p(low), tone: "bear", side: "below" },
        ],
        chips: [
          { label: `${disps} bougies baissières consécutives`, tone: "bear" },
          { label: fvg ? `FVG ${p(fvg.y1)}-${p(fvg.y2)}` : "FVG dans la chute", tone: "zone" },
        ],
      }]}
    />
  );
}
