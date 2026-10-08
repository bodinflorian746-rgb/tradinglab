// Avancé 2 et SMC 4 bloc 3 — le Fair Value Gap, haussier et baissier (définitions du texte) :
// 3 bougies, impulsion en B2, gap entre la mèche de B1 et celle de B3 (haussier : haut de B1 →
// bas de B3 ; baissier : bas de B1 → haut de B3), retour du prix dans la zone puis reprise.
// Gaps calculés sur les bougies. Bougies : scenarios.ts (« fvg-bull », « fvg-bear »).

import { LessonChart, type LCPanel } from "@/app/components/lessons/LessonChart";
import { fmtPrice, largestFvg, type Candle } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);

function panel(key: "fvg-bull" | "fvg-bear", side: "bull" | "bear", title: string): LCPanel {
  const cs = CANDLES[key] as Candle[];
  const g = largestFvg(cs, side)!;
  const up = side === "bull";
  const back = cs.findIndex((k, i) => i > g.i + 2 && (up ? k.l <= g.y2 : k.h >= g.y1));
  return {
    key, title, decimals: 5, height: 220, candles: cs,
    zones: [{ key: "fvg", y1: g.y1, y2: g.y2, from: g.i - 1, label: `FVG ${p(g.y1)}-${p(g.y2)}`, short: "FVG", tone: up ? "bull" : "bear", kind: "fvg", src: `${key}:${g.i}`, role: "fvg" }],
    markers: [
      { key: "b1", i: g.i - 1, price: up ? cs[g.i - 1].l : cs[g.i - 1].h, label: "B1", tone: "neutral", side: up ? "below" : "above" },
      { key: "b2", i: g.i, price: up ? cs[g.i].h : cs[g.i].l, label: "B2 : impulsion", short: "B2", tone: up ? "bull" : "bear", side: up ? "above" : "below", role: "impulse", span: [g.i, g.i] },
      { key: "b3", i: g.i + 1, price: up ? cs[g.i + 1].h : cs[g.i + 1].l, label: "B3", tone: "neutral", side: up ? "above" : "below" },
      { key: "back", i: back, price: up ? cs[back].l : cs[back].h, label: "Retour dans le gap", short: "Retour", tone: "zone", side: up ? "below" : "above" },
    ],
  };
}

export function FVGDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  return (
    <LessonChart
      id="FVGDiagram"
      title="Le Fair Value Gap entre 3 bougies"
      caption="Haussier : du haut de B1 au bas de B3. Baissier : du bas de B1 au haut de B3. Le prix revient souvent mitiger le gap."
      panels={[panel("fvg-bull", "bull", "FVG haussier"), panel("fvg-bear", "bear", "FVG baissier")]}
      rows={[2]}
    />
  );
}
