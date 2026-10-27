// Trend-following 3 bloc 3 — la confluence multi-éléments (EUR/USD H4) : support de l'UT
// supérieure en bas (1.0770-1.0785), impulsion 1.0780 → 1.0960, Order Block (dernière bougie
// baissière de l'impulsion) dans l'OTE 0.618-0.786, chute qui laisse un FVG baissier au-dessus,
// retour dans l'OTE sur l'OB et rejet ; cible : le FVG. OTE, OB et FVG calculés.
// Bougies : scenarios.ts (« pb-conf »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fibLevel, largestFvg, orderBlock, fmtPrice } from "@/lib/lessons/chart-analysis";
import { xauToEur } from "@/lib/lessons/eur-from-xau";
import CANDLES from "@/lib/lessons/generated/candles.json";

const px = (x: number) => fmtPrice(x, 4);

export default function PullbackContinuationDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["pb-conf"];
  const lo = Math.min(...cs.map((k) => k.l)), hi = Math.max(...cs.map((k) => k.h));
  const loAt = cs.findIndex((k) => k.l === lo), hiAt = cs.findIndex((k) => k.h === hi);
  const ote = { y1: fibLevel(lo, hi, 0.786), y2: fibLevel(lo, hi, 0.618) };
  const obI = cs.findIndex((k, i) => i > loAt && i < hiAt && k.c < k.o);
  const ob = orderBlock(cs, obI);
  const fvg = largestFvg(cs, "bear")!;
  const rej = cs.reduce((b, k, i) => (i > fvg.i + 1 && k.l < cs[b].l ? i : b), fvg.i + 2);
  return (
    <LessonChart
      id="PullbackContinuationDiagram"
      title="Quatre éléments, une même zone"
      caption="Ancrage en bas, retracement dans l'OTE, trace institutionnelle à l'entrée, déséquilibre à combler en cible."
      panels={[{
        key: "h4", title: "EUR/USD H4", decimals: 5, height: 300, candles: cs,
        // Animation : le support de l'UT supérieure, l'impulsion (100 % puis 0 %) et son OB, l'OTE, la chute et son FVG, puis le rejet sur l'OB
        anim: [{ show: "htf" }, { candles: loAt }, { show: "f100" }, { candles: hiAt }, { show: ["f0", "ob"] }, { show: "ote" }, { candles: fvg.i + 1 }, { show: "fvg" }, { candles: rej }, { show: "rej" }],
        zones: [
          { key: "htf", y1: xauToEur(4470), y2: xauToEur(4485), label: "Support UT supérieure", short: "Support", tone: "bull" },
          { key: "ote", ...ote, from: hiAt, label: `OTE ${px(ote.y1)}-${px(ote.y2)}`, short: "OTE", tone: "fib" },
          { key: "ob", ...ob, from: obI, label: `OB ${px(ob.y1)}-${px(ob.y2)}`, short: "OB", tone: "zone", kind: "ob", src: `pb-conf:${obI}`, role: "ob", dir: "bull" },
          { key: "fvg", y1: fvg.y1, y2: fvg.y2, from: fvg.i - 1, label: `FVG cible ${px(fvg.y1)}-${px(fvg.y2)}`, short: "FVG cible", tone: "bear", kind: "fvg", src: `pb-conf:${fvg.i}`, role: "fvg" },
        ],
        markers: [
          { key: "f100", i: loAt, price: lo, label: "Fibo 100 %", tone: "fib", side: "below", role: "swing-low" },
          { key: "f0", i: hiAt, price: hi, label: "Fibo 0 %", tone: "fib", side: "above", role: "swing-high" },
          { key: "rej", i: rej, price: cs[rej].l, label: "Rejet sur l'OB", short: "Rejet", tone: "bull", side: "below", role: "rejet", ref: "ob", dir: "bull" },
        ],
      }]}
    />
  );
}
