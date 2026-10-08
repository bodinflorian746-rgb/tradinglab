// Price action 3 bloc 3 — la confluence change tout (XAU/USD H4) : à gauche, l'engulfing
// haussier du plan de la leçon, au contact de la zone Fibonacci 0.5 / 0.618 (4 610 $ à 4 584 $)
// du swing 4 500 → 4 720 $ : setup tradable ; à droite, un engulfing isolé en pleine impulsion,
// sans niveau : simple bruit. Fibonacci calculé. Bougies : scenarios.ts (« engulfing-setup »,
// « eng-isolated »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { usd } from "@/app/components/lessons/trade";
import { fibLevel, type Candle } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

export default function EngulfingContextDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const a = CANDLES["engulfing-setup"] as Candle[], b = CANDLES["eng-isolated"] as Candle[];
  const lo = Math.min(...a.map((k) => k.l)), hi = Math.max(...a.map((k) => k.h));
  const hiAt = a.findIndex((k) => k.h === hi);
  const f50 = fibLevel(lo, hi, 0.5), f618 = fibLevel(lo, hi, 0.618);
  const eng = b.findIndex((k, i) => i > 0 && b[i - 1].c < b[i - 1].o && k.c > k.o && k.c >= b[i - 1].o && k.o <= b[i - 1].c);
  return (
    <LessonChart
      id="EngulfingContextDiagram"
      title="Le même engulfing, deux contextes"
      caption="Un engulfing isolé hors contexte structurel n'est qu'une grosse bougie."
      panels={[
        {
          key: "fibo", title: "✓ Sur la zone Fibonacci : tradable", decimals: 1, height: 220, candles: a,
          zones: [{ key: "fib", y1: f618, y2: f50, from: hiAt, label: `Fibo 0.5 / 0.618 (${usd(f50)}-${usd(f618)})`, short: "Fibo 0.5-0.618", tone: "fib" }],
          markers: [{ key: "eng", i: a.length - 1, price: a[a.length - 1].l, label: "Engulfing", tone: "bull", side: "below" }],
        },
        {
          key: "isole", title: "✗ En pleine impulsion : bruit", decimals: 0, height: 220, candles: b,
          markers: [{ key: "eng", i: eng, price: b[eng].l, label: "Engulfing isolé", short: "Isolé", tone: "neutral", side: "below" }],
        },
      ]}
      rows={[2]}
    />
  );
}
