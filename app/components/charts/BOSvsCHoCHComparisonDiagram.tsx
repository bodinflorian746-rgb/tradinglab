// SMC 2 / Trend-following 4 — même structure de départ (HL 1.1700, HH 1.1780, HL 1.1750,
// HH 1.1820), breakout opposé : clôture au-dessus du dernier HH = BOS (continuation) ;
// clôture sous le dernier HL = CHoCH (premier signal de retournement). Pivots calculés.
// Bougies : scenarios.ts (« bos-case », « choch-case »).

import { LessonChart, type LCPanel } from "@/app/components/lessons/LessonChart";
import { fmtPrice, pivots } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);

function panel(key: "bos-case" | "choch-case"): LCPanel {
  const cs = CANDLES[key];
  const bos = key === "bos-case";
  const piv = pivots(cs, 2);
  const hh = piv.filter((q) => q.name === "HH")[0];
  const hl = piv.filter((q) => q.name === "HL")[0];
  const lvl = bos ? hh : hl;
  const brk = cs.findIndex((k, i) => i > hh.index && (bos ? k.c > hh.price : k.c < hl.price));
  return {
    key, title: bos ? "BOS : breakout du dernier HH" : "CHoCH : breakout du dernier HL",
    subtitle: bos ? "Continuation : la structure HH / HL reste intacte" : "Premier signal de retournement possible",
    decimals: 5, height: 250, candles: cs,
    levels: [{ key: "lvl", price: lvl.price, from: lvl.index, label: `${bos ? "HH" : "HL"} ${p(lvl.price)}`, tone: bos ? "bull" : "zone", dashed: true }],
    markers: [
      ...piv.filter((q) => q.name && q.index <= hh.index).map((q) => ({ key: `p${q.index}`, i: q.index, price: q.price, label: q.name!, pivot: q.name, tone: "neutral" as const, side: q.side === "h" ? "above" as const : "below" as const })),
      { key: "brk", i: brk, price: bos ? cs[brk].h : cs[brk].l, label: bos ? "BOS" : "CHoCH", tone: bos ? "bull" : "zone", side: bos ? "above" : "below" },
    ],
  };
}

export default function BOSvsCHoCHComparisonDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  return (
    <LessonChart
      id="BOSvsCHoCHComparisonDiagram"
      title="Même structure, breakout opposé"
      panels={[panel("bos-case"), panel("choch-case")]}
      rows={[2]}
      sharedScale
      caption="La nature du niveau cassé dicte le signal : un HH cassé confirme la tendance, un HL cassé la remet en cause."
    />
  );
}
