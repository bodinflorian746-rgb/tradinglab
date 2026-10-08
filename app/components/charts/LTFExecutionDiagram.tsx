// Multi-UT 1 bloc 5 — l'UT inférieure déclenche le trade (process, étape 3) : dans la zone
// H1 1.1765-1.1780, sweep haussier jusqu'à 1.1778, puis bougie de displacement qui casse le
// dernier creux (CHoCH baissier) : entrée short après le breakout local, SL derrière la
// structure. Le texte ne chiffre ni l'entrée ni l'objectif : le schéma n'en invente pas.
// Bougies : scenarios.ts (« ltf-exec-m5 »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);
const Z = { y1: 1.1765, y2: 1.178 };

export function LTFExecutionDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["ltf-exec-m5"];
  const sweep = cs.reduce((b, k, i) => (k.h > cs[b].h ? i : b), 0);
  // dernier creux avant le sweep, cassé par la bougie de displacement
  const lastLow = Math.min(...cs.slice(sweep - 3, sweep).map((k) => k.l));
  const lowAt = cs.findIndex((k, i) => i >= sweep - 3 && k.l === lastLow);
  const choch = cs.findIndex((k, i) => i > sweep && k.c < lastLow);
  return (
    <LessonChart
      id="LTFExecutionDiagram"
      title="Le timing : sweep, CHoCH, entrée"
      caption="L'UT inférieure donne le timing, jamais le contexte : on exécute dans le sens préparé au-dessus."
      panels={[{
        key: "m5", title: "EUR/USD M5, dans la zone H1", decimals: 5, height: 280, candles: cs,
        zones: [{ key: "zone", ...Z, label: `Zone H1 ${p(Z.y1)}-${p(Z.y2)}`, short: "Zone H1", tone: "zone" }],
        levels: [
          { key: "low", price: lastLow, from: lowAt, to: choch, label: `Dernier creux ${p(lastLow)}`, short: "Dernier creux", tone: "neutral", dashed: true, role: "choch", ref: lowAt, dir: "bear" },
          { key: "sl", price: cs[sweep].h + 0.0003, from: choch, label: "SL derrière le sweep", short: "SL", tone: "bear", dashed: true },
        ],
        markers: [
          { key: "sweep", i: sweep, price: cs[sweep].h, label: `Sweep ${p(cs[sweep].h)}`, short: "Sweep", tone: "zone", side: "above", role: "high" },
          { key: "choch", i: choch, price: cs[choch].c, label: "CHoCH : entrée short à la clôture", short: "CHoCH", tone: "bear", side: "below" },
        ],
      }]}
    />
  );
}
