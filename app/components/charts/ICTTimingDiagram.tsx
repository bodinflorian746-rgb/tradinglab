// ICT 5 bloc 4 — le timing reste essentiel (XAU/USD M15), exemple du texte : range Asia
// 4 642-4 655 $, à l'ouverture de London mèche de sweep au-dessus de 4 655 $, puis
// displacement baissier de 38 $ qui laisse un FVG. Setup complet ET en Killzone.
// Range, sweep, displacement et FVG calculés. Bougies : scenarios.ts (« ict-timing-bear »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { usd } from "@/app/components/lessons/trade";
import { largestFvg } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const SWEEP = 6; // 6 bougies de range Asia, puis l'ouverture de London

export function ICTTimingDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["ict-timing-bear"];
  const asia = cs.slice(0, SWEEP);
  const lo = Math.min(...asia.map((k) => k.l)), hi = Math.max(...asia.map((k) => k.h));
  const fvg = largestFvg(cs, "bear")!;
  const last = cs.length - 1;
  const disp = Math.round(cs[SWEEP].c - cs[last].c);
  return (
    <LessonChart
      id="ICTTimingDiagram"
      title="Setup ICT en Killzone = setup premium"
      caption="La même séquence à 03h UTC aurait probablement échoué : le volume manquait pour soutenir le displacement."
      panels={[{
        key: "m15", title: "XAU/USD M15, ouverture de London", decimals: 0, height: 280, candles: cs,
        zones: [
          { key: "asia", y1: lo, y2: hi, from: 0, to: SWEEP - 1, label: `Range Asia ${usd(lo)}-${usd(hi)}`, short: "Range Asia", tone: "sky" },
          { key: "fvg", y1: fvg.y1, y2: fvg.y2, from: fvg.i - 1, label: `FVG ${usd(fvg.y1)}-${usd(fvg.y2)}`, short: "FVG", tone: "bear", kind: "fvg", src: `ict-timing-bear:${fvg.i}` },
        ],
        markers: [
          { key: "sweep", i: SWEEP, price: cs[SWEEP].h, label: `Sweep au-dessus de ${usd(hi)}`, short: "Sweep", tone: "zone", side: "above" },
          { key: "end", i: last, price: cs[last].l, label: usd(cs[last].c), tone: "bear", side: "below" },
        ],
        chips: [{ label: `Displacement baissier de ${usd(disp)}`, tone: "bear" }],
      }]}
    />
  );
}
