// ICT 4 bloc 3 & ICT 5 bloc 3 (fusionnés avec ICTDisplacementSetupDiagram) — EUR/USD H1 :
// calm approach, equal highs 1.1780, sweep à 1.1792 (crée le FVG), displacement baissier,
// retour dans le FVG, rejet → entrée short. FVG et niveaux calculés.
// Bougies : scenarios.ts (« disp-setup-h1 »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { tradeSetup } from "@/app/components/lessons/trade";
import { fmtPrice, largestFvg } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);
const SWEEP_I = 4;

export function DisplacementSetupDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["disp-setup-h1"];
  const fvg = largestFvg(cs, "bear")!;
  const low = Math.min(...cs.map((k) => k.l));
  const lowAt = cs.findIndex((k) => k.l === low);
  // Pic dans le FVG (retour)
  const back = cs.reduce((b, k, i) =>
    i > lowAt && k.h >= fvg.y1 && (b < 0 || cs[b].h < k.h) ? i : b, -1);
  const rej = back + 1;
  const t = tradeSetup({ entry: cs[rej].c, sl: fvg.y2 + 0.0008, tp: 1.1695, tpOffscale: true, names: { tp: "TP liquidité basse" } });
  return (
    <LessonChart
      id="DisplacementSetupDiagram"
      title="Displacement → FVG → entrée"
      caption="L'entrée se prend au retour dans le FVG, jamais dans le displacement lui-même."
      panels={[{
        key: "h1", title: "EUR/USD H1", decimals: 5, height: 300, candles: cs,
        zones: [{ key: "fvg", y1: fvg.y1, y2: fvg.y2, from: fvg.i - 1, label: `FVG ${p(fvg.y1)}-${p(fvg.y2)}`, short: "FVG", tone: "bear", kind: "fvg", src: `disp-setup-h1:${fvg.i}` }],
        levels: t.levels,
        offscale: t.offscale,
        markers: [
          { key: "sweep", i: SWEEP_I, price: cs[SWEEP_I].h, label: `Sweep ${p(cs[SWEEP_I].h)}`, short: "Sweep", tone: "zone", side: "above" },
          { key: "low", i: lowAt, price: low, label: p(low), tone: "neutral", side: "below" },
          { key: "back", i: back, price: cs[back].h, label: `Retour FVG ${p(cs[back].h)}`, short: "Retour", tone: "zone", side: "above" },
          { key: "rej", i: rej, price: cs[rej].l, label: "Rejet", tone: "bear", side: "below" },
        ],
        chips: t.chips,
      }]}
    />
  );
}
