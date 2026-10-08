// ICT 4 bloc 3 — un displacement bearish (EUR/USD M15), exemple du texte : depuis 1.1780, mèche
// de sweep à 1.1792, puis 3 bougies baissières consécutives à grands corps (9, 10 et 10 pips, ils
// ne rétrécissent pas), sans mèche haute, jusqu'à 1.1748 en moins d'une heure, deux FVG bearish
// laissés dans la chute. Sweep, displacement et FVG vérifiés par l'audit (rôles).
// Bougies : scenarios.ts (« disp-eur », jusqu'au displacement).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice, fvgAt, pips } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);
const EQH = 1.178;

/** Bougies de « disp-eur » : sweep, puis les 3 bougies du displacement */
export const DISP = { sweep: 5, first: 6, last: 8 };

export function DisplacementImpulseDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["disp-eur"].slice(0, DISP.last + 2);
  const seq = cs.slice(DISP.first, DISP.last + 1);
  const bodies = seq.map((k) => pips(k.o, k.c, 0.0001));
  const low = Math.min(...seq.map((k) => k.l));
  const fvgs = [DISP.first, DISP.first + 1].map((i) => ({ i, ...fvgAt(cs, i, "bear")! }));
  return (
    <LessonChart
      id="DisplacementImpulseDiagram"
      title="Un displacement : une séquence, pas une bougie"
      caption={`${seq.length} bougies baissières aux corps de ${bodies.slice(0, -1).join(", ")} et ${bodies.at(-1)} pips, sans mèche haute : le marché ne reprend pas son souffle.`}
      panels={[{
        key: "m15", title: "EUR/USD M15", decimals: 5, height: 290, candles: cs,
        levels: [{ key: "eqh", price: EQH, to: DISP.sweep, label: `Equal highs ${p(EQH)}`, short: "EQH", tone: "zone", dashed: true }],
        zones: fvgs.map((g, n) => ({ key: `fvg${n}`, y1: g.y1, y2: g.y2, from: g.i - 1, label: `FVG ${n + 1} : ${p(g.y1)}-${p(g.y2)}`, short: `FVG ${n + 1}`, tone: "bear" as const, kind: "fvg", src: `disp-eur:${g.i}`, role: "fvg" as const })),
        markers: [
          { key: "sweep", i: DISP.sweep, price: cs[DISP.sweep].h, label: `Sweep ${p(cs[DISP.sweep].h)}`, short: "Sweep", tone: "zone", side: "above", role: "sweep", ref: EQH, dir: "bear" },
          { key: "disp", i: DISP.last, price: low, label: `Displacement → plus bas ${p(low)}`, short: "Displacement", tone: "bear", side: "below", role: "displacement", span: [DISP.first, DISP.last] },
        ],
      }]}
    />
  );
}
