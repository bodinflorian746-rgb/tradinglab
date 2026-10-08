// ICT 4 bloc 3 et ICT 5 bloc 3 (fusionné avec ICTDisplacementSetupDiagram) — le displacement
// crée le setup (EUR/USD M15, plan des leçons) : sweep à 1.1792, displacement jusqu'à 1.1748,
// FVG 1.1768-1.1777 ; le prix remonte progressivement dans le FVG, bougie de rejet, puis
// bougie baissière impulsive : short 1.1774, SL 1.1798 (au-dessus du sommet du sweep),
// TP 1.1695 (liquidité basse). FVG et R/R calculés. Bougies : scenarios.ts (« disp-eur »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { tradeSetup } from "@/app/components/lessons/trade";
import { fmtPrice, fvgAt } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";
import { DISP } from "./DisplacementImpulseDiagram";

const p = (x: number) => fmtPrice(x, 4);
const ENTRY = 1.1774;

export function DisplacementSetupDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["disp-eur"];
  const fvg = fvgAt(cs, DISP.first, "bear")!;
  // retour : 1re clôture dans le FVG après le displacement ; rejet : plus haute mèche ensuite
  const back = cs.findIndex((k, i) => i > DISP.last && k.c >= fvg.y1);
  const rej = cs.reduce((b, k, i) => (i > back && i < back + 3 && k.h > cs[b].h ? i : b), back + 1);
  const entryAt = cs.findIndex((k, i) => i > rej && k.l <= ENTRY);
  const t = tradeSetup({ entry: ENTRY, sl: 1.1798, tp: 1.1695, from: entryAt, tpOffscale: true, names: { tp: "TP liquidité basse" } });
  return (
    <LessonChart
      id="DisplacementSetupDiagram"
      title="Displacement → FVG → entrée au retour"
      caption="L'entrée se prend au retour dans le FVG, jamais pendant le displacement."
      panels={[{
        key: "m15", title: "EUR/USD M15", decimals: 5, height: 300, candles: cs,
        zones: [{ key: "fvg", y1: fvg.y1, y2: fvg.y2, from: DISP.first - 1, label: `FVG ${p(fvg.y1)}-${p(fvg.y2)}`, short: "FVG", tone: "bear", kind: "fvg", src: `disp-eur:${DISP.first}` }],
        levels: t.levels,
        offscale: t.offscale,
        markers: [
          { key: "sweep", i: DISP.sweep, price: cs[DISP.sweep].h, label: `Sweep ${p(cs[DISP.sweep].h)}`, short: "Sweep", tone: "zone", side: "above" },
          { key: "disp", i: DISP.last, price: cs[DISP.last].l, label: `Displacement → ${p(cs[DISP.last].l)}`, short: "Displacement", tone: "bear", side: "below" },
          { key: "rej", i: rej, price: cs[rej].h, label: "Rejet dans le FVG", short: "Rejet", tone: "bear", side: "above" },
        ],
        chips: t.chips,
      }]}
    />
  );
}
