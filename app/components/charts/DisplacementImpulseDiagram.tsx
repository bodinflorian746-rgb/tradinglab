// ICT 4 bloc 1 — un displacement bearish (EUR/USD M15), exemple du texte : depuis 1.1780,
// mèche de sweep à 1.1792, puis 4 bougies baissières consécutives à grands corps, sans mèche
// haute notable, jusqu'à 1.1748 en une heure, deux FVG bearish laissés dans la chute.
// Corps, chute et FVG calculés. Bougies : scenarios.ts (« disp-eur », jusqu'au displacement).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice, fvgAt, pips } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);
/** Bougies de « disp-eur » : sweep, puis les 4 bougies du displacement */
export const DISP = { sweep: 5, first: 6, last: 9 };

export function DisplacementImpulseDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["disp-eur"].slice(0, DISP.last + 2);
  const bodies = cs.slice(DISP.first, DISP.last + 1).map((k) => pips(k.o, k.c, 0.0001));
  const low = Math.min(...cs.slice(DISP.first, DISP.last + 1).map((k) => k.l));
  const fvgs = [DISP.first, DISP.first + 1].map((i) => ({ i, ...fvgAt(cs, i, "bear")! }));
  return (
    <LessonChart
      id="DisplacementImpulseDiagram"
      title="Un displacement : une séquence, pas une bougie"
      caption="Corps grands, pas de mèche contraire, FVG laissés derrière : le marché ne reprend pas son souffle."
      panels={[{
        key: "m15", title: "EUR/USD M15", decimals: 5, height: 290, candles: cs,
        levels: [{ key: "eqh", price: 1.178, to: DISP.sweep, label: p(1.178), tone: "zone", dashed: true }],
        zones: fvgs.map((g, n) => ({ key: `fvg${n}`, y1: g.y1, y2: g.y2, from: g.i - 1, label: `FVG ${p(g.y1)}-${p(g.y2)}`, short: `FVG ${n + 1}`, tone: "bear" as const, kind: "fvg", src: `disp-eur:${g.i}` })),
        markers: [
          { key: "sweep", i: DISP.sweep, price: cs[DISP.sweep].h, label: `Sweep ${p(cs[DISP.sweep].h)}`, short: "Sweep", tone: "zone", side: "above" },
          { key: "low", i: DISP.last, price: low, label: p(low), tone: "bear", side: "below" },
        ],
        chips: [
          { label: `4 bougies baissières : corps de ${bodies.join(", ")} pips`, tone: "bear" },
          { label: `Chute jusqu'à ${p(low)} en 1 h`, tone: "bear" },
        ],
      }]}
    />
  );
}
