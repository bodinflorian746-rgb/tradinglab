// Trend-following 3 — projection des cibles pour sortir en 2 fois : le plan de la leçon
// (HL 1.0780, HH 1.0960, repli 1.0850, entrée 1.0865, SL 1.0810). Extensions Fibonacci
// 1.272 et 1.618 de la jambe de repli (HH → creux), calculées : 1.0990 et 1.1028.
// TP 1 = HH 1.0960, TP 2 = extension 1.618. Bougies : scenarios.ts (« fib-tp »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtRR, pivots, tradeMath, fmtPrice } from "@/lib/lessons/chart-analysis";
import { eurToXau, xauToEur } from "@/lib/lessons/eur-from-xau";
import CANDLES from "@/lib/lessons/generated/candles.json";

const px = (x: number) => fmtPrice(x, 4);

const ENTRY = xauToEur(4565), SL = xauToEur(4510);

export default function FibTPProjectionDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["fib-tp"];
  const piv = pivots(cs, 2);
  const hh = piv.find((q) => q.name === "HH")!;
  const c = cs.reduce((b, k, i) => (i > hh.index && i < hh.index + 12 && k.l < cs[b].l ? i : b), hh.index + 1);
  const leg = hh.price - cs[c].l;
  const e1272 = cs[c].l + 1.272 * leg, e1618 = cs[c].l + 1.618 * leg;
  const entryI = cs.findIndex((k) => k.c === ENTRY);
  const rr = (tp: number) => tradeMath(ENTRY, SL, tp).rr;
  const chip = (n: string, tp: number) => ({ label: `${n} ${px(tp)} : R/R ${fmtRR(rr(tp))}`, tone: "bull" as const, data: { rr: fmtRR(rr(tp)), entry: ENTRY, sl: SL, tp } });
  return (
    <LessonChart
      id="FibTPProjectionDiagram"
      title="Sortir en 2 fois : HH puis extension 1.618"
      panels={[{
        key: "h4", subtitle: `EUR/USD H4 — extensions de la jambe ${px(hh.price)} → ${px(cs[c].l)}`,
        decimals: 5, height: 320, candles: cs,
        levels: [
          { key: "e1618", price: e1618, from: entryI, label: `TP 2 · 1.618 = ${px(e1618)}`, short: "TP 2 · 1.618", tone: "bull", dashed: true, role: "fib", ref: `${hh.index}:${c}:1.618` },
          { key: "e1272", price: e1272, from: entryI, label: `Extension 1.272 = ${px(e1272)}`, short: "Ext. 1.272", tone: "fib", dashed: true, faint: true, role: "fib", ref: `${hh.index}:${c}:1.272` },
          { key: "tp1", price: hh.price, from: hh.index, label: `TP 1 · HH ${px(hh.price)}`, short: "TP 1 · HH", tone: "bull", dashed: true },
          { key: "entry", price: ENTRY, from: entryI, label: `Entrée ${px(ENTRY)}`, short: "Entrée", tone: "entry" },
          { key: "sl", price: SL, from: entryI, label: `SL ${px(SL)}`, short: "SL", tone: "bear", dashed: true },
        ],
        markers: [
          { key: "f100", i: hh.index, price: hh.price, label: "100 % · HH", short: "100 %", tone: "fib", side: "above", role: "swing-high" },
          { key: "f0", i: c, price: cs[c].l, label: "0 % · creux du repli", short: "0 %", tone: "fib", side: "below", role: "swing-low" },
          { key: "pin", i: entryI, price: cs[entryI].l, label: "Pin bar", tone: "bull", side: "below", role: "pinbar", dir: "bull" },
        ],
        chips: [chip("TP 1", hh.price), chip("TP 2", xauToEur(Math.round(eurToXau(e1618))))],
      }]}
      caption="Extension = creux du repli + ratio × (HH − creux du repli)."
    />
  );
}
