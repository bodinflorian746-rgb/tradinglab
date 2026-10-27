// Price action 3 — plan de trade : engulfing haussier dans la zone Fibonacci
// 0.5 / 0.618 du rebond 1.0800 → 1.1020, EUR/USD H4 (décision PO 9). Entrée 1.0930 (cassure
// du plus haut de la bougie englobante), SL 1.0890 (5 pips sous son plus bas), TP 1.1020
// (ancien plus haut). Bougies : scenarios.ts (« engulfing-setup ») ; Fibonacci,
// corps et R/R calculés.

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { tradeSetup } from "@/app/components/lessons/trade";
import { fibLevel, fmtPrice, pips } from "@/lib/lessons/chart-analysis";
import { EUR_PIP } from "@/lib/lessons/eur-from-xau";
import CANDLES from "@/lib/lessons/generated/candles.json";

export default function EngulfingSetupDiagram(_props: { locale?: "fr" | "es" | "en" } = {}) {
  const candles = CANDLES["engulfing-setup"];
  const n = candles.length;
  const [k1, k2] = [candles[n - 2], candles[n - 1]];
  const lowI = candles.reduce((b, k, i) => (k.l < candles[b].l ? i : b), 0);
  const highI = candles.reduce((b, k, i) => (k.h > candles[b].h ? i : b), 0);
  const A = candles[lowI].l, B = candles[highI].h;
  const f50 = fibLevel(A, B, 0.5), f618 = fibLevel(A, B, 0.618);
  const t = tradeSetup({ entry: k2.h, sl: Number((k2.l - 5 * EUR_PIP).toFixed(5)), tp: B, from: n - 2 });
  return (
    <LessonChart
      id="EngulfingSetupDiagram"
      title="Engulfing haussier sur la zone Fibonacci"
      panels={[{
        key: "h4", subtitle: `EUR/USD H4 — rebond ${fmtPrice(A, 4)} → ${fmtPrice(B, 4)}, correction dans la zone 0.5 / 0.618`,
        decimals: 5, height: 320, candles,
        // Animation : le rebond (100 % puis 0 %), la zone 0.5-0.618, la correction jusqu'à l'engulfing, puis le plan
        anim: [{ candles: lowI }, { show: "f100" }, { candles: highI }, { show: "f0" }, { show: "fib" }, { candles: n - 1 }, { show: "eng" }, { show: ["entry", "sl", "tp"] }],
        zones: [{ key: "fib", y1: f618, y2: f50, from: highI, label: "Fibonacci 0.5-0.618", short: "Fibo 0.5-0.618", tone: "fib", kind: "fib" }],
        levels: t.levels,
        markers: [
          { key: "f100", i: lowI, price: A, label: `Fibo 100 % · ${fmtPrice(A, 4)}`, short: "Fibo 100 %", tone: "fib", side: "below", role: "swing-low" },
          { key: "f0", i: highI, price: B, label: `Fibo 0 % · ${fmtPrice(B, 4)}`, short: "Fibo 0 %", tone: "fib", side: "above", role: "swing-high" },
          { key: "eng", i: n - 1, price: k2.l, label: "Engulfing", tone: "bull", side: "below", role: "engulfing" },
        ],
        chips: [{ label: `Corps : ${pips(k1.o, k1.c, EUR_PIP)} pips puis ${pips(k2.o, k2.c, EUR_PIP)} pips` }, ...t.chips],
      }]}
      caption="La 2e bougie ouvre à la clôture de la 1re et clôture au-dessus de son ouverture : son corps englobe entièrement le corps rouge."
    />
  );
}
