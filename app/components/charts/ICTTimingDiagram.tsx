// ICT 5 bloc 4 — timing : XAU/USD M15, range Asia 4 642-4 655 (6 bougies calmes), London
// Open sweep au-dessus du range (stops pris à 4 668 $), displacement bearish jusqu'à
// 4 608 $ avec FVG. Même schéma que KillzonesTimeline mais sens baissier.
// Bougies : scenarios.ts (« ict-timing-bear »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { usd } from "@/app/components/lessons/trade";
import { largestFvg } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const ASIA_END = 5, SWEEP_I = 6;

export function ICTTimingDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["ict-timing-bear"];
  const fvg = largestFvg(cs, "bear");
  const low = Math.min(...cs.map((k) => k.l));
  const lowAt = cs.findIndex((k) => k.l === low);
  return (
    <LessonChart
      id="ICTTimingDiagram"
      title="Setup ICT + Killzone : XAU/USD en London Open"
      caption="Setup ICT + timing Killzone = setup premium. Hors Killzone : probabilité de continuation très faible."
      panels={[{
        key: "m15", title: "XAU/USD M15", decimals: 0, height: 280, candles: cs,
        zones: [
          { key: "asia", y1: 4642, y2: 4655, from: 0, to: ASIA_END, label: "Range Asia 4642-4655", short: "Range Asia", tone: "sky" },
          ...(fvg ? [{ key: "fvg", y1: fvg.y1, y2: fvg.y2, from: fvg.i - 1, label: `FVG ${usd(fvg.y1)}-${usd(fvg.y2)}`, short: "FVG", tone: "bear" as const, kind: "fvg", src: `ict-timing-bear:${fvg.i}` }] : []),
        ],
        levels: [
          { key: "asiaH", price: 4655, to: SWEEP_I, label: `Stops au-dessus ${usd(4655)}`, short: "Stops", tone: "zone", dashed: true },
        ],
        markers: [
          { key: "sweep", i: SWEEP_I, price: cs[SWEEP_I].h, label: `London Open : sweep ${usd(cs[SWEEP_I].h)}`, short: "Sweep", tone: "zone", side: "above" },
          { key: "low", i: lowAt, price: low, label: usd(low), tone: "bear", side: "below" },
        ],
        chips: [
          { label: `Sweep → ${usd(cs[SWEEP_I].h)} : stops au-dessus du range Asia pris`, tone: "zone" },
          { label: `Displacement → ${usd(low)}`, tone: "bear" },
        ],
      }]}
    />
  );
}
