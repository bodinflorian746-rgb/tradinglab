// Price action 3 — plan de trade : engulfing haussier dans la zone Fibonacci
// 0.5 / 0.618 du rebond 4 500$ → 4 720$, XAU/USD H4. Entrée 4 630$ (cassure du
// plus haut de la bougie englobante), SL 4 590$ (5$ sous son plus bas), TP 4 720$
// (ancien plus haut). Bougies : scenarios.ts (« engulfing-setup ») ; Fibonacci,
// corps et R/R calculés.

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { tradeSetup, usd } from "@/app/components/lessons/trade";
import { fibLevel } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

export default function EngulfingSetupDiagram(_props: { locale?: "fr" | "es" | "en" } = {}) {
  const candles = CANDLES["engulfing-setup"];
  const n = candles.length;
  const [k1, k2] = [candles[n - 2], candles[n - 1]];
  const lowI = candles.reduce((b, k, i) => (k.l < candles[b].l ? i : b), 0);
  const highI = candles.reduce((b, k, i) => (k.h > candles[b].h ? i : b), 0);
  const A = candles[lowI].l, B = candles[highI].h;
  const f50 = fibLevel(A, B, 0.5), f618 = fibLevel(A, B, 0.618);
  const t = tradeSetup({ entry: k2.h, sl: k2.l - 5, tp: B, unit: "$", from: n - 2 });
  const body = (k: { o: number; c: number }) => Math.abs(k.c - k.o);
  return (
    <LessonChart
      id="EngulfingSetupDiagram"
      title="Engulfing haussier sur la zone Fibonacci"
      panels={[{
        key: "h4", subtitle: `XAU/USD H4 — rebond ${usd(A)} → ${usd(B)}, correction dans la zone 0.5 / 0.618`,
        decimals: 1, height: 320, candles,
        zones: [{ key: "fib", y1: f618, y2: f50, from: highI, label: "Fibonacci 0.5-0.618", short: "Fibo 0.5-0.618", tone: "fib", kind: "fib" }],
        levels: t.levels,
        markers: [{ key: "eng", i: n - 1, price: k2.l, label: "Engulfing", tone: "bull", side: "below" }],
        chips: [{ label: `Corps : ${usd(body(k1))} puis ${usd(body(k2))}` }, ...t.chips],
      }]}
      caption="La 2e bougie ouvre à la clôture de la 1re et clôture au-dessus de son ouverture : son corps englobe entièrement le corps rouge."
    />
  );
}
