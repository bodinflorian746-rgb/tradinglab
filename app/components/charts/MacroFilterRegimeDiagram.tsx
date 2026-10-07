// Macro-trading 4 — le trade doit être aligné avec le régime dominant. XAU/USD en
// régime risk-off établi : H4 en HH / HL vers 4 740$. Pendant un mini-pullback,
// signal bearish M15 (rejet sur résistance locale, breakout du dernier creux mineur) :
// techniquement valide, contre le régime → filtre rouge ; la hausse continue.
// La dernière bougie H4 est l'agrégat exact des 16 bougies M15 détaillées.
// Bougies : scenarios.ts (« regime-h4 », « regime-m15 »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { usd } from "@/app/components/lessons/trade";
import { aggregate, pivots } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

export function MacroFilterRegimeDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const h4 = CANDLES["regime-h4"];
  const m15 = CANDLES["regime-m15"];
  const h4All = [...h4, ...aggregate(m15, 16)];
  const piv = pivots(h4All, 2).filter((q) => q.name);
  const minorLow = m15.findIndex((k, i) => i > 2 && k.l === 4683);
  const sig = m15.findIndex((k, i) => i > minorLow && k.c < m15[minorLow].l);
  const res = m15.reduce((b, k, i) => (i < sig && k.h > m15[b].h ? i : b), 0);
  return (
    <LessonChart
      id="MacroFilterRegimeDiagram"
      title="Un signal contre le régime : filtre rouge"
      panels={[
        {
          key: "h4", title: "H4 · régime risk-off, or haussier", subtitle: "Structure HH / HL qui pointe vers 4 740$",
          decimals: 1, height: 260, candles: h4All,
          markers: [
            ...piv.map((q) => ({ key: `p${q.index}`, i: q.index, price: q.price, label: q.name!, pivot: q.name, tone: "neutral" as const, side: q.side === "h" ? "above" as const : "below" as const })),
            { key: "zoom", i: h4All.length - 1, price: h4All[h4All.length - 1].l, label: "Détail M15", tone: "zone", side: "below" },
          ],
        },
        {
          key: "m15", title: "M15 · le mini-pullback", subtitle: "Rejet sur résistance locale, breakout du dernier creux mineur",
          decimals: 1, height: 260, candles: m15,
          levels: [{ key: "creux", price: m15[minorLow].l, from: minorLow, to: sig, label: `Creux mineur ${usd(m15[minorLow].l)}`, short: "Creux mineur", tone: "neutral", dashed: true }],
          markers: [
            { key: "res", i: res, price: m15[res].h, label: "Rejet", tone: "neutral", side: "above" },
            { key: "sig", i: sig, price: m15[sig].l, label: "Signal bearish", tone: "bear", side: "below" },
          ],
          chips: [{ label: "Contre le régime : pas de trade", tone: "bear" }, { label: "La hausse reprend", tone: "bull" }],
        },
      ]}
      rows={[2]}
      caption="Techniquement, le short M15 est valide. Contre un régime risk-off établi où l'or monte, c'est un trade à contre-courant."
    />
  );
}
