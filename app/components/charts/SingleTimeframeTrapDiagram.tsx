// Multi-UT 1 bloc 2 — le piège du graphique unique, exemple du texte (EUR/USD) : Daily en
// LH/LL sous la résistance 1.1820 ; sur M15, breakout haussier local à 1.1760, sommet 1.1775,
// puis rechute vers 1.1700. Pivots et niveaux lus sur les bougies.
// Bougies : scenarios.ts (« stf-daily », « stf-m15 »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice, pivots, type Candle } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);

export function SingleTimeframeTrapDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const d = CANDLES["stf-daily"] as Candle[], m = CANDLES["stf-m15"] as Candle[];
  const named = pivots(d, 2).filter((q) => q.name === "LH" || q.name === "LL");
  const res = named.filter((q) => q.name === "LH").at(-1)!;
  const brk = m.findIndex((k) => k.c > 1.176);
  const top = Math.max(...m.map((k) => k.h)), topAt = m.findIndex((k) => k.h === top);
  const low = Math.min(...m.slice(topAt).map((k) => k.l));
  return (
    <LessonChart
      id="SingleTimeframeTrapDiagram"
      title="Le même moment, deux unités de temps"
      caption="Le signal M15 était techniquement valide ; le problème venait du contexte de l'UT supérieure."
      panels={[
        {
          key: "daily", title: "EUR/USD Daily : structure baissière", decimals: 5, height: 220, candles: d,
          levels: [{ key: "res", price: res.price, from: res.index, label: `Résistance ${p(res.price)}`, short: "Résistance", tone: "zone" }],
          markers: named.map((q) => ({ key: `p${q.index}`, i: q.index, price: q.price, label: q.name!, pivot: q.name!, tone: "bear" as const, side: q.side === "h" ? "above" as const : "below" as const })),
        },
        {
          key: "m15", title: "EUR/USD M15 : le breakout local", decimals: 5, height: 220, candles: m,
          levels: [{ key: "lvl", price: 1.176, to: brk, label: `Niveau local ${p(1.176)}`, short: "Niveau local", tone: "neutral", dashed: true }],
          markers: [
            { key: "brk", i: brk, price: m[brk].c, label: "Breakout haussier : clôture au-dessus", short: "Breakout", tone: "bull", side: "below", role: "close" },
            { key: "top", i: topAt, price: top, label: `Sommet ${p(top)}`, short: "Sommet", tone: "bull", side: "above", role: "high" },
            { key: "low", i: m.length - 1, price: low, label: `Rechute vers ${p(low)}`, short: "Rechute", tone: "bear", side: "below" },
          ],
          chips: [{ label: "« Achat évident » sur M15 = simple retracement sur Daily", tone: "bear" }],
        },
      ]}
      rows={[1, 1]}
    />
  );
}
