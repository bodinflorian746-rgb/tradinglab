// Trading Intermédiaire 12 — La volatilité. Bougies : lib/lessons/scenarios-nouvelles.ts (NASDAQ décalé de
// +7 000 points) ; ATR 14 recalculé par LessonChart sur les bougies affichées.
//  - VolatilityRegimesDiagram : les quatre environnements (EUR/USD H1, sans niveau) ;
//  - ContractionExpansionDiagram : range 27 100 – 27 140 puis expansion à l'ouverture américaine (animé) ;
//  - NewsSpikeDiagram : news sur EUR/USD, 1.0880 puis 1.0830, stop de 10 pips touché (animé) ;
//  - VolatilityRRDiagram : journées A (ATR 5 $, R/R 1:2,08) et B (ATR 15 $, R/R 1:0,83, refusé).

import { LessonChart, type LCPanel, type LCSub } from "@/app/components/lessons/LessonChart";
import { pts, tradeSetup, usd } from "@/app/components/lessons/trade";
import { atr, fmtPrice, type Candle } from "@/lib/lessons/chart-analysis";
import { NEWS_PRE } from "@/lib/lessons/nouvelles-meta";
import CANDLES from "@/lib/lessons/generated/candles.json";

const C = CANDLES as unknown as Record<string, Candle[]>;
const p = (x: number) => fmtPrice(x, 4);
const atrSub = (cs: Candle[], marks: { key: string; i: number }[], unit: "pts" | "$"): LCSub =>
  ({ key: "atr", kind: "atr", label: "ATR 14", marks: marks.map((m) => ({ key: m.key, i: m.i, tone: "sky", label: `ATR ${Math.round(atr(cs)[m.i]!)} ${unit}` })) });

export function VolatilityRegimesDiagram() {
  const panel = (key: string, title: string): LCPanel => ({ key, title, decimals: 5, height: 170, candles: C[key] });
  return (
    <LessonChart
      id="VolatilityRegimesDiagram"
      title="Quatre environnements de marché"
      caption="Même actif, même unité de temps : une tendance calme aux corrections lisibles, une tendance agitée aux corrections brutales, un range étroit sans élan, et un marché qui fait de grands mouvements dans les deux sens sans direction."
      rows={[2, 2]}
      sharedScale
      panels={[
        panel("vol-calm", "Tendance, volatilité modérée"),
        panel("vol-wild", "Tendance, forte volatilité"),
        panel("vol-range", "Range, faible volatilité"),
        panel("vol-chop", "Agité, sans direction"),
      ]}
    />
  );
}

export function ContractionExpansionDiagram() {
  const cs = C["vol-contraction"];
  const END = 16, OUT = 17, L = cs.length - 1;
  return (
    <LessonChart
      id="ContractionExpansionDiagram"
      title="Contraction, puis expansion"
      caption="Pendant la contraction, le NASDAQ reste entre 27 100 et 27 140 : un range de 40 points, des bougies étroites, un ATR bas. À l'ouverture américaine, le prix franchit 27 140 et les bougies s'élargissent : l'ATR remonte. Reste à voir si le breakout tient ou si le prix réintègre le range."
      panels={[{
        key: "m15", title: "NASDAQ M15 · range puis ouverture américaine", decimals: 0, height: 240, candles: cs, slots: cs.length + 2,
        zones: [{ key: "range", y1: 27100, y2: 27140, from: 0, to: END, label: `Range ${pts(27100)} – ${pts(27140)}`, short: "Range", tone: "zone", role: "range" }],
        markers: [{ key: "out", i: OUT, price: cs[OUT].c, label: `Clôture au-dessus de ${pts(27140)}`, short: "Breakout", tone: "bull", side: "above", role: "close" }],
        subs: [atrSub(cs, [{ key: "a1", i: END }, { key: "a2", i: L }], "pts")],
        anim: [{ candles: END }, { show: ["range", "a1"] }, { candles: OUT }, { show: "out" }, { candles: L }, { show: "a2" }],
      }]}
    />
  );
}

export function NewsSpikeDiagram() {
  const cs = C["vol-news"];
  const N = NEWS_PRE, LOW = N + 2;
  return (
    <LessonChart
      id="NewsSpikeDiagram"
      title="Une news sur EUR/USD"
      caption="Avant la publication, le prix reste vers 1.0850. À la publication, il monte à 1.0880, puis redescend à 1.0830 : 50 pips entre le plus haut et le plus bas, 80 pips parcourus en quelques minutes. Un achat à 1.0850 avec un stop de 10 pips est sorti dès le premier aller-retour."
      panels={[{
        key: "m5", title: "EUR/USD M5 · publication américaine", decimals: 5, height: 260, candles: cs, slots: cs.length + 2,
        levels: [
          { key: "entry", price: 1.085, from: N - 2, label: `Achat ${p(1.085)}`, short: "Achat", tone: "entry" },
          { key: "sl", price: 1.084, from: N - 2, label: `Stop ${p(1.084)} (10 pips)`, short: "Stop", tone: "bear", dashed: true },
        ],
        segments: [{ key: "ampl", i1: N, p1: cs[N].h, i2: LOW, p2: cs[LOW].l, tone: "fib", arrow: true, label: `Amplitude ${Math.round((cs[N].h - cs[LOW].l) * 1e4)} pips`, short: `Amplitude ${Math.round((cs[N].h - cs[LOW].l) * 1e4)} pips` }],
        markers: [
          { key: "haut", i: N, price: cs[N].h, label: `Publication · plus haut ${p(cs[N].h)}`, short: "Plus haut", tone: "bull", side: "above", role: "high" },
          { key: "bas", i: LOW, price: cs[LOW].l, label: `Plus bas ${p(cs[LOW].l)}`, short: "Plus bas", tone: "bear", side: "below", role: "low" },
        ],
        anim: [{ candles: N - 1 }, { show: ["entry", "sl"] }, { candles: N }, { show: "haut" }, { candles: LOW }, { show: ["bas", "ampl"] }, { candles: cs.length - 1 }],
      }]}
    />
  );
}

function dayPanel(k: "a" | "b"): LCPanel {
  const A = k === "a";
  const cs = C[`vol-day-${k}`];
  const E = cs.length - 1, LOW = A ? 26 : 17;
  const t = tradeSetup({ entry: 3910, sl: A ? 3898 : 3880, tp: 3935, unit: "$", from: E, expect: A ? ">2" : "<2" });
  return {
    key: k, title: A ? "Journée A · ATR M15 de 5 $" : "Journée B · ATR M15 de 15 $", decimals: 0, height: 230, candles: cs, slots: 34,
    levels: [
      { key: "res", price: 3940, from: A ? 10 : 6, label: `Résistance ${usd(3940)}`, short: "Résistance", tone: "bear", dashed: true, role: "resistance" },
      { key: "sup", price: 3900, from: 1, label: `Support ${usd(3900)}`, short: "Support", tone: "bull", dashed: true, role: "support" },
      ...t.levels,
    ],
    markers: [{ key: "creux", i: LOW, price: cs[LOW].l, label: `Creux de la réaction ${usd(cs[LOW].l)}`, short: "Creux", tone: "neutral", side: "below", role: "swing-low" }],
    subs: [atrSub(cs, [{ key: "aE", i: E }], "$")],
    chips: t.chips,
  };
}

export function VolatilityRRDiagram() {
  return (
    <LessonChart
      id="VolatilityRRDiagram"
      title="Même support, même objectif, deux volatilités"
      caption="Journée A : le creux de la réaction reste au-dessus du support, le stop sous le support fait 12 $ pour 25 $ d'objectif (environ 1:2,08). Journée B : la réaction descend bien plus bas, le stop cohérent fait 30 $ pour le même objectif de 25 $ (environ 1:0,83) : trade refusé."
      rows={[1, 1]}
      panels={[dayPanel("a"), dayPanel("b")]}
    />
  );
}
