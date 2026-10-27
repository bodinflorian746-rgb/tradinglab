// Reversal 2 — plan d'exécution de l'ETE EUR/USD H1 (épaule gauche 1.0920, tête 1.0960, épaule droite
// 1.0925, ligne de cou ≈ 1.0878 ; exemple passé de l'or à EUR/USD, décision PO 9). Décision PO 8 : la cible
// reste à la projection (measured move 82 pips → 1.0796). Prise sur le breakout (clôture 1.0870, SL au-dessus
// de l'épaule droite), le R/R est trop faible (≈ 1:1,2) : pas d'entrée. Le prix revient tester la ligne de
// cou par en dessous et la rejette : entrée short à la clôture de la bougie de rejet, SL 6 pips au-dessus
// de sa mèche. Swings, ligne de cou, projection et R/R calculés. Bougies : scenarios.ts (« hs-retest »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import type { LCStep } from "@/app/components/lessons/lesson-anim";
import { tradeSetup } from "@/app/components/lessons/trade";
import { fmtRR, fmtPrice, lineAt, pips, pivots, tradeMath } from "@/lib/lessons/chart-analysis";
import { EUR_PIP, eurToXau, xauToEur } from "@/lib/lessons/eur-from-xau";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);
/** SL de l'entrée sur breakout : 5 pips au-dessus de l'épaule droite */
const SL_SHOULDER_MARGIN = 5;
/** SL de l'entrée au retest : 6 pips au-dessus de la mèche du retest */
const SL_RETEST_MARGIN = 6;

export default function HSTradeExecutionDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const candles = CANDLES["hs-retest"];
  const n = candles.length;
  const piv = pivots(candles.slice(0, n - 3), 2);
  const head = piv.filter((q) => q.side === "h").reduce((a, b) => (b.price > a.price ? b : a));
  const ls = piv.filter((q) => q.side === "h" && q.index < head.index).at(-1)!;
  const rs = piv.filter((q) => q.side === "h" && q.index > head.index)[0];
  const t1 = piv.filter((q) => q.side === "l" && q.index > ls.index && q.index < head.index).at(-1)!;
  const t2 = piv.filter((q) => q.side === "l" && q.index > head.index && q.index < rs.index)[0];
  // ligne de cou arrondie au pip (calcul en dollars, comme le scénario d'origine)
  const neck = xauToEur(Math.round(eurToXau((t1.price + t2.price) / 2)));
  const neckAt = (i: number) => lineAt(t1.index, t1.price, t2.index, t2.price, i);
  const mm = Number((neck - (head.price - neck)).toFixed(5));
  const bo = candles.findIndex((k, i) => i > rs.index && k.c < neck);
  const breakEntry = candles[bo].c, breakSl = Number((rs.price + SL_SHOULDER_MARGIN * EUR_PIP).toFixed(5));
  const breakRR = tradeMath(breakEntry, breakSl, mm).rr;
  const last = n - 1, retest = candles[last];
  // Animation : épaule gauche, tête, épaule droite, la ligne de cou, le breakout (refusé : R/R trop faible),
  // puis le retest rejeté et le plan de l'entrée au retest
  const anim: LCStep[] = [
    { candles: ls.index + 1 }, { show: "ls" }, { candles: head.index + 1 }, { show: "head" }, { candles: rs.index + 1 }, { show: ["rs", "neck"] },
    { candles: bo }, { show: "bo" }, { candles: last }, { show: "retest" },
  ];
  const t = tradeSetup({
    entry: retest.c, sl: Number((retest.h + SL_RETEST_MARGIN * EUR_PIP).toFixed(5)), tp: mm, from: last, expect: ">2",
    names: { entry: "Entrée au retest", tp: "TP projection" },
  });
  return (
    <LessonChart
      id="HSTradeExecutionDiagram"
      title="Exécuter un ETE : cible à la projection, entrée au retest"
      panels={[{
        key: "h1", subtitle: "EUR/USD H1 — breakout de la ligne de cou, puis retest rejeté",
        decimals: 5, height: 340, candles, anim,
        segments: [{ key: "neck", i1: t1.index, p1: neckAt(t1.index), i2: last, p2: neckAt(last), tone: "neutral", dashed: true, label: `Ligne de cou ≈ ${p(neck)}`, short: "Ligne de cou" }],
        levels: t.levels,
        markers: [
          { key: "ls", i: ls.index, price: ls.price, label: "Épaule G.", tone: "neutral", side: "above" },
          { key: "head", i: head.index, price: head.price, label: "Tête", tone: "neutral", side: "above" },
          { key: "rs", i: rs.index, price: rs.price, label: "Épaule D.", tone: "neutral", side: "above" },
          { key: "bo", i: bo, price: breakEntry, label: `Breakout ${p(breakEntry)} : R/R trop faible`, short: "Breakout", tone: "bear", side: "below", role: "close" },
          { key: "retest", i: last, price: retest.h, label: "Retest rejeté", short: "Retest", tone: "bear", side: "above" },
        ],
        chips: [
          { label: `Sur le breakout, SL ${p(breakSl)} : R/R ${fmtRR(breakRR)}, pas d'entrée`, tone: "bear", data: { rr: fmtRR(breakRR), entry: breakEntry, sl: breakSl, tp: mm, expect: "<2" } },
          ...t.chips,
        ],
      }]}
      caption={`Hauteur tête → ligne de cou : ${pips(head.price, neck, EUR_PIP)} pips, reportée sous la ligne de cou (${p(mm)}). La cible reste à la projection ; c'est l'entrée au retest qui rend le R/R exploitable.`}
    />
  );
}
