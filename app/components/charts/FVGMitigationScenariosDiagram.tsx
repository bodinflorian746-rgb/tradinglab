// ICT 2 — FVG haussier 1.0840-1.0860 (EUR/USD), les trois cas de l'exemple du texte, sur
// le même début de graphique :
// A rebond immédiat : retour à 1.0860, mèche, bougie verte de force, départ vers 1.0920 ;
// B mitigation profonde : mèche à 1.0842, clôture 1.0855, reprise (stop 1.0838) ;
// C invalidation : traversée sans réaction, clôture 1.0825 sous le dernier swing low 1.0828.
// FVG, swing low et clôtures lus sur les bougies. Bougies : scenarios.ts (« fvg-case-a/b/c »).

import { LessonChart, type LCPanel } from "@/app/components/lessons/LessonChart";
import { fmtPrice, largestFvg, type Candle } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);
const KEYS = ["fvg-case-a", "fvg-case-b", "fvg-case-c"] as const;

export function FVGMitigationScenariosDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const sets = KEYS.map((k) => CANDLES[k] as Candle[]);
  const fvg = largestFvg(sets[0], "bull")!;
  const swing = Math.min(...sets[0].slice(0, fvg.i).map((k) => k.l));
  const swingAt = sets[0].findIndex((k) => k.l === swing);
  const start = sets[0].length - 5; // 1re bougie propre à chaque cas
  const base = (key: string, cs: Candle[]) => ({
    key, decimals: 5, candles: cs, height: 260,
    zones: [{ key: "fvg", y1: fvg.y1, y2: fvg.y2, from: fvg.i - 1, label: `FVG ${p(fvg.y1)}-${p(fvg.y2)}`, short: "FVG", tone: "bull" as const, kind: "fvg", src: `${KEYS[0]}:${fvg.i}`, role: "fvg" as const }],
  });
  const [a, b, c] = sets;
  const aTouch = start, bWick = start + 1, cBreak = c.findIndex((k, i) => i >= start && k.c < swing);
  const panels: LCPanel[] = [
    {
      ...base("a", a), title: "A. Rebond immédiat", subtitle: "FVG fresh, setup A+",
      markers: [
        { key: "touch", i: aTouch, price: a[aTouch].l, label: `Mèche ${p(a[aTouch].l)}`, short: "Mèche", tone: "bull", side: "below", role: "low" },
        { key: "top", i: a.length - 1, price: a[a.length - 1].h, label: `Repart vers ${p(a[a.length - 1].h)}`, short: "Reprise", tone: "bull", side: "above", role: "high" },
      ],
    },
    {
      ...base("b", b), title: "B. Mitigation profonde", subtitle: "Rejet net, setup actif",
      levels: [{ key: "stop", price: 1.0838, from: bWick, label: `Stop ${p(1.0838)}`, short: "Stop", tone: "bear", dashed: true }],
      markers: [{ key: "wick", i: bWick, price: b[bWick].l, label: `Mèche ${p(b[bWick].l)}, clôture ${p(b[bWick].c)}`, short: `Mèche ${p(b[bWick].l)}`, tone: "bull", side: "below", role: "pinbar", dir: "bull" }],
    },
    {
      ...base("c", c), title: "C. Invalidation", subtitle: "Pas de trade",
      levels: [{ key: "swing", price: swing, from: swingAt, to: cBreak, label: `Swing low ${p(swing)}`, short: "Swing low", tone: "neutral", dashed: true, role: "bos", ref: swingAt, dir: "bear" }],
      markers: [{ key: "close", i: cBreak, price: c[cBreak].c, label: `Clôture ${p(c[cBreak].c)}`, short: "Clôture", tone: "bear", side: "below", role: "close" }],
    },
  ];
  return (
    <LessonChart
      id="FVGMitigationScenariosDiagram"
      title="Un FVG haussier, trois issues"
      caption="FVG rempli ≠ setup mort. FVG rempli sans réaction + structure cassée = invalidation."
      panels={panels}
      rows={[3]}
      sharedScale
    />
  );
}
