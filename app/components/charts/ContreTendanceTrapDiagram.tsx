// Multi-UT 2 bloc 1 — le piège de la contre-tendance, exemple du texte (EUR/USD) : Daily
// baissier, résistance Daily/H4 1.1760, prix 1.1715 ; sur M15, breakout haussier à 1.1740,
// sommet 1.1752, puis rejet violent vers 1.1685. Pivots et niveaux lus sur les bougies.
// Bougies : scenarios.ts (« ct-daily », « ct-m15 »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice, pivots, type Candle } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);
const RES = 1.176;

export function ContreTendanceTrapDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const d = CANDLES["ct-daily"] as Candle[], m = CANDLES["ct-m15"] as Candle[];
  const named = pivots(d, 2).filter((q) => q.name === "LH" || q.name === "LL");
  const last = d.length - 1;
  const brk = m.findIndex((k) => k.c > 1.174);
  const top = Math.max(...m.map((k) => k.h)), topAt = m.findIndex((k) => k.h === top);
  const low = Math.min(...m.slice(topAt).map((k) => k.l));
  return (
    <LessonChart
      id="ContreTendanceTrapDiagram"
      title="Un breakout M15 contre un Daily baissier"
      caption="Le breakout M15 existait bien ; le problème venait de la tendance de fond, restée vendeuse."
      panels={[
        {
          key: "daily", title: "EUR/USD Daily", decimals: 5, height: 220, candles: d,
          levels: [{ key: "res", price: RES, label: `Résistance Daily/H4 ${p(RES)}`, short: "Résistance", tone: "zone" }],
          markers: [
            ...named.map((q) => ({ key: `p${q.index}`, i: q.index, price: q.price, label: q.name!, pivot: q.name!, tone: "bear" as const, side: q.side === "h" ? "above" as const : "below" as const })),
            { key: "now", i: last, price: d[last].h, label: `Prix ${p(d[last].c)}`, short: p(d[last].c), tone: "entry", side: "above" },
          ],
        },
        {
          key: "m15", title: "EUR/USD M15", decimals: 5, height: 220, candles: m,
          levels: [{ key: "lvl", price: 1.174, to: brk, label: `Niveau local ${p(1.174)}`, short: p(1.174), tone: "neutral", dashed: true }],
          markers: [
            { key: "brk", i: brk, price: m[brk].l, label: "Breakout haussier", short: "Breakout", tone: "bull", side: "below" },
            { key: "top", i: topAt, price: top, label: p(top), tone: "bull", side: "above" },
            { key: "low", i: m.length - 1, price: low, label: `Rejet vers ${p(low)}`, short: p(low), tone: "bear", side: "below" },
          ],
          chips: [{ label: "Une impulsion locale n'est pas un retournement global", tone: "bear" }],
        },
      ]}
      rows={[1, 1]}
    />
  );
}
