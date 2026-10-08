// Macro-trading 1 — le signal apparaît après l'essoufflement (exemple du texte) :
// XAU/USD M15, impulsion haussière 4 640$ → 4 705$ après le FOMC, trois mèches hautes
// de 6 à 8$ sans clôture au-dessus de 4 705$, puis correction vers 4 670$.
// Bougies : scenarios.ts (« fomc-exhaustion ») ; mèches mesurées sur les données.

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { usd } from "@/app/components/lessons/trade";
import CANDLES from "@/lib/lessons/generated/candles.json";

const TOP = 4705;

export function FOMCExhaustionDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["fomc-exhaustion"];
  const fomc = cs.findIndex((k) => k.c - k.o > 15);
  const wicks = cs.map((k, i) => ({ i, w: k.h - Math.max(k.o, k.c) })).filter((x) => cs[x.i].h > TOP && x.w >= 6);
  const last = cs.length - 1;
  return (
    <LessonChart
      id="FOMCExhaustionDiagram"
      title="L'essoufflement après l'impulsion FOMC"
      panels={[{
        key: "m15", subtitle: `XAU/USD M15 — impulsion ${usd(cs[fomc].o)} → ${usd(TOP)}`,
        decimals: 1, height: 300, candles: cs,
        levels: [{ key: "top", price: TOP, from: fomc, label: `Aucune clôture au-dessus de ${usd(TOP)}`, short: "Plafond", tone: "zone", dashed: true }],
        markers: [
          { key: "fomc", i: fomc, price: cs[fomc].l, label: "FOMC", tone: "entry", side: "below" },
          { key: "wicks", i: wicks[1]?.i ?? wicks[0].i, price: Math.max(...wicks.map((x) => cs[x.i].h)), label: `${wicks.length} mèches de rejet`, short: "Rejet", tone: "bear", side: "above" },
          { key: "fade", i: last, price: cs[last].l, label: `Correction vers ${usd(cs[last].c)}`, short: "Correction", tone: "bull", side: "below" },
        ],
        chips: [{ label: `Mèches hautes : ${wicks.map((x) => usd(x.w)).join(", ")}`, tone: "bear" }],
      }]}
      caption="L'accélération s'arrête : le prix ne fait plus de nouveau plus haut. L'émotion s'épuise, le fade peut commencer."
    />
  );
}
