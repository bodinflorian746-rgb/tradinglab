// Trend-following 3 — projection des cibles pour sortir en 2 fois : le plan de la leçon
// (HL 4 480$, HH 4 660$, repli 4 550$, entrée 4 565$, SL 4 510$). Extensions Fibonacci
// 1.272 et 1.618 de la jambe de repli (HH → creux), calculées : 4 690$ et 4 728$.
// TP 1 = HH 4 660$, TP 2 = extension 1.618. Bougies : scenarios.ts (« fib-tp »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { usd } from "@/app/components/lessons/trade";
import { fmtRR, pivots, tradeMath } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const ENTRY = 4565, SL = 4510;

export default function FibTPProjectionDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["fib-tp"];
  const piv = pivots(cs, 2);
  const hh = piv.find((q) => q.name === "HH")!;
  const c = cs.reduce((b, k, i) => (i > hh.index && i < hh.index + 12 && k.l < cs[b].l ? i : b), hh.index + 1);
  const leg = hh.price - cs[c].l;
  const e1272 = cs[c].l + 1.272 * leg, e1618 = cs[c].l + 1.618 * leg;
  const entryI = cs.findIndex((k) => k.c === ENTRY);
  const rr = (tp: number) => tradeMath(ENTRY, SL, tp).rr;
  const chip = (n: string, tp: number) => ({ label: `${n} ${usd(tp)} : R/R ${fmtRR(rr(tp))}`, tone: "bull" as const, data: { rr: fmtRR(rr(tp)), entry: ENTRY, sl: SL, tp } });
  return (
    <LessonChart
      id="FibTPProjectionDiagram"
      title="Sortir en 2 fois : HH puis extension 1.618"
      panels={[{
        key: "h4", subtitle: `XAU/USD H4 — extensions de la jambe ${usd(hh.price)} → ${usd(cs[c].l)}`,
        decimals: 1, height: 320, candles: cs,
        levels: [
          { key: "e1618", price: e1618, from: entryI, label: `TP 2 · 1.618 = ${usd(e1618)}`, short: "TP 2 · 1.618", tone: "bull", dashed: true },
          { key: "e1272", price: e1272, from: entryI, label: `1.272 = ${usd(e1272)}`, short: "1.272", tone: "fib", dashed: true, faint: true },
          { key: "tp1", price: hh.price, from: hh.index, label: `TP 1 · HH ${usd(hh.price)}`, short: "TP 1 · HH", tone: "bull", dashed: true },
          { key: "entry", price: ENTRY, from: entryI, label: `Entrée ${usd(ENTRY)}`, short: "Entrée", tone: "entry" },
          { key: "sl", price: SL, from: entryI, label: `SL ${usd(SL)}`, short: "SL", tone: "bear", dashed: true },
        ],
        markers: [{ key: "pin", i: entryI, price: cs[entryI].l, label: "Pin bar", tone: "bull", side: "below" }],
        chips: [chip("TP 1", hh.price), chip("TP 2", Math.round(e1618))],
      }]}
      caption="Extension = creux du repli + ratio × (HH − creux du repli)."
    />
  );
}
