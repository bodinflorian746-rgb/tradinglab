// Intermédiaire 1, SMC 2, Trend-following 4 — le BOS (EUR/USD H4, exemple d'Intermédiaire 1) :
// tendance haussière HH / HL, dernier HH 1.0950, repli (HL), puis clôture nette au-dessus de 1.0950
// (au moins 15-20 pips) sans réintégration dans les bougies suivantes : la tendance continue.
// Pivots et distance calculés. Bougies : scenarios.ts (« bos-eur »). Les leçons n'utilisent que la
// version haussière (prop trend gardée pour compatibilité).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice, pips, pivots } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);

export function BOSDiagram(_props: { trend?: "bullish" | "bearish"; className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["bos-eur"];
  const named = pivots(cs, 2).filter((q) => q.name === "HH" || q.name === "HL");
  const hh = named.filter((q) => q.name === "HH").at(-1)!;
  const bos = cs.findIndex((k, i) => i > hh.index && k.c > hh.price);
  const dist = pips(cs[bos].c, hh.price, 0.0001);
  return (
    <LessonChart
      id="BOSDiagram"
      title="BOS : la tendance confirme"
      caption="Un BOS est une information, pas un signal d'entrée : on continue à chercher des achats sur les retracements."
      panels={[{
        key: "h4", title: "EUR/USD H4, tendance haussière", decimals: 5, height: 260, candles: cs,
        levels: [{ key: "hh", price: hh.price, from: hh.index, label: `Dernier HH ${p(hh.price)}`, short: "Dernier HH", tone: "zone", dashed: true }],
        markers: [
          ...named.map((q) => ({ key: `p${q.index}`, i: q.index, price: q.price, label: q.name!, pivot: q.name!, tone: "bull" as const, side: q.side === "h" ? "above" as const : "below" as const })),
          { key: "bos", i: bos, price: cs[bos].h, label: `BOS : clôture ${dist} pips au-dessus`, short: "BOS", tone: "bull", side: "above" },
        ],
      }]}
    />
  );
}
