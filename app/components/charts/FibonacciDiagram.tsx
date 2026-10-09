// Deux usages :
// - Intermédiaire 9 (par défaut) — Fibonacci en action sur EUR/USD : swing 1.0800 → 1.0980,
//   niveaux 23,6 % = 1.0937, 38,2 % = 1.0911, 50 % = 1.0890, 61,8 % = 1.0869 et 78,6 %, retracement
//   arrêté sur 1.0870 (61,8 % + support historique 1.0868-1.0876, rejeté deux fois pendant la
//   montée puis cassé) : on attend un signal de bougie.
// - Trend-following 3 (variant « tf3 ») — le plan : HL 4 480, HH 4 660, 0.618 = 4 549, 0.786 = 4 519,
//   pin bar sur 4 550 ; long 4 565, SL 4 510, TP 4 660 puis 4 728 (R/R 1,73 et 2,96).
// Niveaux et R/R calculés. Bougies : scenarios.ts (« fib-int9 », « tf3-pullback »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { tradeSetup, usd } from "@/app/components/lessons/trade";
import { fibLevel, fmtPrice, fmtRR, tradeMath } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);
const RATIOS = [0.236, 0.382, 0.5, 0.618, 0.786];
const pct = (r: number) => `${(r * 100).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %`;

export function FibonacciDiagram({ variant = "int9" }: { variant?: "int9" | "tf3"; className?: string; locale?: "fr" | "es" | "en" }) {
  if (variant === "tf3") {
    const cs = CANDLES["tf3-pullback"];
    const lo = Math.min(...cs.map((k) => k.l)), hi = Math.max(...cs.map((k) => k.h));
    const hiAt = cs.findIndex((k) => k.h === hi), loAt = cs.findIndex((k) => k.l === lo), pin = cs.length - 1;
    const f618 = fibLevel(lo, hi, 0.618), f786 = fibLevel(lo, hi, 0.786);
    const t = tradeSetup({ entry: 4565, sl: 4510, tp: 4728, unit: "$", from: pin, tpOffscale: true, names: { entry: "Entrée long", tp: "TP 2 (1.618)" } });
    return (
      <LessonChart
        id="FibonacciDiagram"
        title="Plan : pullback sur le 0.618"
        caption="SL sous le 0.786 avec marge ; TP 1 sur le HH précédent, TP 2 sur l'extension 1.618 du repli."
        panels={[{
          key: "h4", title: "XAU/USD H4", decimals: 1, height: 300, candles: cs,
          levels: [
            { key: "f618", price: f618, from: hiAt, label: `Fibo 0.618 = ${usd(f618)}`, short: "Fibo 0.618", tone: "fib", dashed: true, role: "fib", ref: `${loAt}:${hiAt}:0.618` },
            { key: "f786", price: f786, from: hiAt, label: `Fibo 0.786 = ${usd(f786)}`, short: "Fibo 0.786", tone: "fib", dashed: true, role: "fib", ref: `${loAt}:${hiAt}:0.786` },
            { key: "tp1", price: hi, from: pin, label: `TP 1 HH ${usd(hi)}`, short: "TP 1", tone: "bull", dashed: true },
            ...t.levels,
          ],
          offscale: t.offscale,
          markers: [{ key: "pin", i: pin, price: cs[pin].l, label: `Pin bar sur ${usd(cs[pin].l)}`, short: "Pin bar", tone: "bull", side: "below", role: "pinbar", dir: "bull" }],
          chips: [...t.chips, { label: `R/R TP 1 : ${fmtRR(tradeMath(4565, 4510, hi).rr)}`, tone: "entry" }],
        }]}
      />
    );
  }
  const cs = CANDLES["fib-int9"];
  const lo = Math.min(...cs.map((k) => k.l)), hi = Math.max(...cs.map((k) => k.h));
  const hiAt = cs.findIndex((k) => k.h === hi);
  const stop = cs.reduce((b, k, i) => (i > hiAt && k.l < cs[b].l ? i : b), hiAt + 1);
  const loAt = cs.findIndex((k) => k.l === lo);
  // support historique : ancienne résistance rejetée deux fois pendant la montée (mèches à 1.0875 et
  // 1.0876), cassée, puis retestée par le retracement
  const SUPPORT = { y1: 1.0868, y2: 1.0876 };
  return (
    <LessonChart
      id="FibonacciDiagram"
      title="Fibonacci en action sur EUR/USD"
      caption="Fibonacci identifie la zone d'attention, pas l'entrée automatique : on attend un signal de bougie."
      panels={[{
        key: "h1", title: `EUR/USD, swing ${p(lo)} → ${p(hi)}`, decimals: 5, height: 300, candles: cs,
        zones: [{ key: "sup", ...SUPPORT, from: 3, label: `Support historique ${p(SUPPORT.y1)}-${p(SUPPORT.y2)}`, short: "Support", tone: "bull", role: "support" }],
        levels: RATIOS.map((r) => ({ key: `f${r}`, price: Number(fibLevel(lo, hi, r).toFixed(5)), from: hiAt, label: `Fibo ${pct(r)} = ${p(fibLevel(lo, hi, r))}`, short: `Fibo ${pct(r)}`, tone: r === 0.618 ? "fib" as const : "neutral" as const, dashed: r !== 0.618, role: "fib" as const, ref: `${loAt}:${hiAt}:${r}` })),
        markers: [{ key: "stop", i: stop, price: cs[stop].l, label: `Arrêt sur ${p(cs[stop].l)} : 61,8 % + support`, short: "61,8 % + support", tone: "fib", side: "below" }],
      }]}
    />
  );
}
