// Deux usages :
// - Intermédiaire 9 (par défaut) — Fibonacci en action sur EUR/USD : swing 1.0800 (vrai creux, précédé
//   d'une baisse) → 1.0980, repères 0 % (swing high) et 100 % (swing low) affichés,
//   niveaux 23.6 % = 1.0937, 38.2 % = 1.0911, 50 % = 1.0890, 61.8 % = 1.0869 et 78.6 %, retracement
//   arrêté sur 1.0870 (61.8 % + support historique 1.0868-1.0876, rejeté deux fois pendant la
//   montée puis cassé) : on attend un signal de bougie.
// - Trend-following 3 (variant « tf3 ») — le plan : HL 1.0780, HH 1.0960, 0.618 = 1.0849, 0.786 = 1.0819,
//   pin bar sur 1.0850 ; long 1.0865, SL 1.0810, TP 1.0960 puis 1.1028 (R/R 1,73 et 2,96).
// Niveaux et R/R calculés. Bougies : scenarios.ts (« fib-int9 », « tf3-pullback »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { tradeSetup } from "@/app/components/lessons/trade";
import { fibLevel, fmtPrice, fmtRR, tradeMath } from "@/lib/lessons/chart-analysis";
import { xauToEur } from "@/lib/lessons/eur-from-xau";
import CANDLES from "@/lib/lessons/generated/candles.json";

const px = (x: number) => fmtPrice(x, 4);

const p = (x: number) => fmtPrice(x, 4);
// 0 % (le swing high) et 100 % (le swing low) affichés comme sur l'outil de TradingView
const RATIOS = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
const pct = (r: number) => `${+(r * 100).toFixed(1)} %`; // point décimal pour les niveaux de Fibonacci (décision PO 18)

export function FibonacciDiagram({ variant = "int9" }: { variant?: "int9" | "tf3"; className?: string; locale?: "fr" | "es" | "en" }) {
  if (variant === "tf3") {
    const cs = CANDLES["tf3-pullback"];
    const lo = Math.min(...cs.map((k) => k.l)), hi = Math.max(...cs.map((k) => k.h));
    const hiAt = cs.findIndex((k) => k.h === hi), loAt = cs.findIndex((k) => k.l === lo), pin = cs.length - 1;
    const f618 = fibLevel(lo, hi, 0.618), f786 = fibLevel(lo, hi, 0.786);
    const t = tradeSetup({ entry: xauToEur(4565), sl: xauToEur(4510), tp: xauToEur(4728), from: pin, tpOffscale: true, names: { entry: "Entrée long", tp: "TP 2 (1.618)" } });
    return (
      <LessonChart
        id="FibonacciDiagram"
        title="Plan : pullback sur le 0.618"
        caption="SL sous le 0.786 avec marge ; TP 1 sur le HH précédent, TP 2 sur l'extension 1.618 du repli."
        panels={[{
          key: "h4", title: "EUR/USD H4", decimals: 5, height: 300, candles: cs,
          levels: [
            { key: "f618", price: f618, from: hiAt, label: `Fibo 0.618 = ${px(f618)}`, short: "Fibo 0.618", tone: "fib", dashed: true, role: "fib", ref: `${loAt}:${hiAt}:0.618` },
            { key: "f786", price: f786, from: hiAt, label: `Fibo 0.786 = ${px(f786)}`, short: "Fibo 0.786", tone: "fib", dashed: true, role: "fib", ref: `${loAt}:${hiAt}:0.786` },
            { key: "tp1", price: hi, from: pin, label: `TP 1 HH ${px(hi)}`, short: "TP 1", tone: "bull", dashed: true },
            ...t.levels,
          ],
          offscale: t.offscale,
          markers: [
            // repères du tracé Fibonacci : 100 % sur le HL, 0 % sur le HH
            { key: "f100", i: loAt, price: lo, label: `100 % · HL ${px(lo)}`, short: "100 %", tone: "fib", side: "below", role: "swing-low" },
            { key: "f0", i: hiAt, price: hi, label: `0 % · HH ${px(hi)}`, short: "0 %", tone: "fib", side: "above", role: "swing-high" },
            { key: "pin", i: pin, price: cs[pin].l, label: `Pin bar sur ${px(cs[pin].l)}`, short: "Pin bar", tone: "bull", side: "below", role: "pinbar", dir: "bull" },
          ],
          chips: [...t.chips, { label: `R/R TP 1 : ${fmtRR(tradeMath(xauToEur(4565), xauToEur(4510), hi).rr)}`, tone: "entry" }],
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
  // la zone part de son 1er test (1re mèche qui l'atteint pendant la montée)
  const supFrom = cs.findIndex((k, i) => i > loAt && k.h >= SUPPORT.y1);
  return (
    <LessonChart
      id="FibonacciDiagram"
      title="Fibonacci en action sur EUR/USD"
      caption="Fibonacci identifie la zone d'attention, pas l'entrée automatique : on attend un signal de bougie."
      panels={[{
        key: "h1", title: `EUR/USD, swing ${p(lo)} → ${p(hi)}`, decimals: 5, height: 300, candles: cs,
        zones: [{ key: "sup", ...SUPPORT, from: supFrom, label: `Ancienne résistance → support ${p(SUPPORT.y1)}-${p(SUPPORT.y2)}`, short: "Ex-résistance", tone: "bull", role: "support" }],
        // niveaux prolongés vers la droite depuis le swing high (le 100 % depuis le swing low)
        levels: RATIOS.map((r) => ({ key: `f${r}`, price: Number(fibLevel(lo, hi, r).toFixed(5)), from: r === 1 ? loAt : hiAt, label: `Fibo ${pct(r)} = ${p(fibLevel(lo, hi, r))}`, short: `Fibo ${pct(r)}`, tone: r === 0.618 ? "fib" as const : "neutral" as const, dashed: r !== 0.618, role: "fib" as const, ref: `${loAt}:${hiAt}:${r}` })),
        markers: [{ key: "stop", i: stop, price: cs[stop].l, label: `Arrêt sur ${p(cs[stop].l)} : 61.8 % + support`, short: "61.8 % + support", tone: "fib", side: "below" }],
      }]}
    />
  );
}
