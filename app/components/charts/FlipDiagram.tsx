// Support / résistance 3 blocs 1 et 3 — le flip de polarité, plan de la leçon (EUR/USD H4) :
// résistance 1.1850 touchée 3 fois, breakout clôturé à 1.1878 (28 pips au-dessus), 4 bougies sans
// réintégration, retest et pin bar (mèche 1.1842, clôture 1.1858) ; long 1.1858, SL 1.1830,
// TP 1.1950. Breakout, distance et R/R calculés. Bougies : scenarios.ts (« flip-pin »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { tradeSetup } from "@/app/components/lessons/trade";
import { fmtPrice, pips } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);
const LEVEL = 1.185;

export default function FlipDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["flip-pin"];
  const brk = cs.findIndex((k) => k.c > LEVEL + 0.0015);
  const pin = cs.length - 1;
  const t = tradeSetup({ entry: cs[pin].c, sl: 1.183, tp: 1.195, from: pin, tpOffscale: true, expect: ">3.2", names: { entry: "Entrée long", tp: "TP résistance H4" } });
  return (
    <LessonChart
      id="FlipDiagram"
      title="Résistance cassée, support au retest"
      caption="Breakout franc, pas de réintégration, retest avec signal de rejet : la zone a inversé son rôle."
      panels={[{
        key: "h4", title: "EUR/USD H4", decimals: 5, height: 290, candles: cs,
        levels: [{ key: "lvl", price: LEVEL, label: `Résistance → support ${p(LEVEL)}`, short: "Niveau inversé", tone: "zone" }, ...t.levels],
        offscale: t.offscale,
        markers: [
          { key: "brk", i: brk, price: cs[brk].c, label: `Breakout : clôture ${p(cs[brk].c)} (+${pips(cs[brk].c, LEVEL, 0.0001)} pips)`, short: "Breakout", tone: "bull", side: "above", role: "close" },
          { key: "pin", i: pin, price: cs[pin].l, label: `Retest : pin bar ${p(cs[pin].l)}`, short: "Pin bar", tone: "bull", side: "below", role: "pinbar", dir: "bull" },
        ],
        chips: t.chips,
      }]}
    />
  );
}
