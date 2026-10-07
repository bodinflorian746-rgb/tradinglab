// Trend-following 2 — erreurs de tracé fréquentes, face au bon tracé (3 HL alignés,
// creux calculés) : 2 points isolés (ligne arbitraire qui traverse les bougies), pente
// irréaliste (impulsion verticale, retour rapide), breakout ignoré (ligne prolongée
// après la cassure). Bougies : scenarios.ts (« tf-trend », « tf-steep », « tf-trend-break »).

import { LessonChart, type LCPanel } from "@/app/components/lessons/LessonChart";
import { lineAt, pivots } from "@/lib/lessons/chart-analysis";
import { TRENDLINE_SHOW } from "@/lib/lessons/scenarios-meta";
import CANDLES from "@/lib/lessons/generated/candles.json";

export default function TrendlineWrongDrawingDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const good = CANDLES["tf-trend"].slice(TRENDLINE_SHOW);
  const hls = pivots(good, 2).filter((q) => q.name === "HL").slice(-3);
  const highs = pivots(good, 2).filter((q) => q.name === "HH");
  const [a, b] = [hls[0], hls[hls.length - 1]];
  const lastG = good.length - 1;
  const steep = CANDLES["tf-steep"];
  // les deux creux de l'impulsion verticale (écrits dans le scénario)
  const sl = [1.1698, 1.1752].map((v) => ({ index: steep.findIndex((k) => k.l === v), price: v }));
  const brk = CANDLES["tf-trend-break"].slice(TRENDLINE_SHOW);
  const lastB = brk.length - 1;
  const lineB = (i: number) => lineAt(a.index, a.price, b.index, b.price, i);
  const breakI = brk.findIndex((k, i) => i > b.index && k.c < lineB(i));
  const panels: LCPanel[] = [
    {
      key: "bon", title: "✓ Bon tracé : 3 HL alignés", decimals: 5, height: 200, candles: good,
      segments: [{ key: "t", i1: a.index, p1: a.price, i2: lastG, p2: lineB(lastG), tone: "bull" }],
      markers: hls.map((q) => ({ key: `hl${q.index}`, i: q.index, price: q.price, label: "HL", pivot: "HL" as const, tone: "bull" as const, side: "below" as const })),
    },
    {
      key: "isoles", title: "✗ 2 points isolés", subtitle: "La ligne ignore les autres pivots et coupe les bougies", decimals: 5, height: 200, candles: good,
      // ligne tirée entre un creux et le bas d'une bougie quelconque, prolongée : elle coupe les bougies suivantes
      segments: [{ key: "t", i1: a.index, p1: a.price, i2: lastG, p2: lineAt(a.index, a.price, highs[0].index, good[highs[0].index].l, lastG), tone: "bear" }],
    },
    {
      key: "pente", title: "✗ Pente irréaliste", subtitle: "Impulsion verticale, retour rapide", decimals: 5, height: 200, candles: steep,
      segments: [{ key: "t", i1: sl[0].index, p1: sl[0].price, i2: steep.length - 1, p2: lineAt(sl[0].index, sl[0].price, sl[1].index, sl[1].price, steep.length - 1), tone: "bear" }],
    },
    {
      key: "breakout", title: "✗ Breakout ignoré", subtitle: "Ligne prolongée alors que le prix a clôturé dessous", decimals: 5, height: 200, candles: brk,
      segments: [
        { key: "t", i1: a.index, p1: a.price, i2: breakI, p2: lineB(breakI), tone: "bull" },
        { key: "t2", i1: breakI, p1: lineB(breakI), i2: lastB, p2: lineB(lastB), tone: "bear", dashed: true },
      ],
      markers: [{ key: "brk", i: breakI, price: brk[breakI].l, label: "Breakout", tone: "bear", side: "below" }],
    },
  ];
  return <LessonChart id="TrendlineWrongDrawingDiagram" title="Erreurs de tracé fréquentes" panels={panels} rows={[2, 2]} />;
}
