// Trading Avancé 7 — Entrées de précision. Même Order Block haussier H1, deux
// entrées détaillées en M15 : au toucher de la zone (SL sous toute la zone) et
// sur la pin bar de rejet (SL sous sa mèche). Zone, entrées, stops, objectif,
// pips et R/R sont calculés à partir des bougies (lib/lessons/models.ts).

import { LessonChart, type LCMarker, type LCPanel } from "@/app/components/lessons/LessonChart";
import { fmtPrice, fmtRR, pips, tradeMath } from "@/lib/lessons/chart-analysis";
import { PIP, precisionModel } from "@/lib/lessons/models";

const p = (x: number) => fmtPrice(x, 4);

export function PrecisionEntryDiagram({ className = "" }: { className?: string; locale?: "fr" | "es" | "en" }) {
  const m = precisionModel();
  const obZone = { key: "ob", y1: m.ob.y1, y2: m.ob.y2, tone: "zone" as const, kind: "ob", src: `precision-entry-h1:${m.obI}` };

  const tradePanel = (key: string, title: string, subtitle: string, t: typeof m.loose, expect: string, marker: LCMarker): LCPanel => {
    const rr = tradeMath(t.entry, t.sl, t.tp).rr;
    return {
      key, title, subtitle, decimals: 5, height: 300,
      candles: m.M15,
      // zone tracée sur H1 (pas une bougie de ce panneau M15)
      zones: [{ key: "ob", y1: m.ob.y1, y2: m.ob.y2, tone: "zone", label: "Order Block H1", short: "OB H1" }],
      levels: [
        { key: "entry", price: t.entry, label: `Entrée ${p(t.entry)}`, tone: "entry" },
        { key: "sl", price: t.sl, label: `SL ${p(t.sl)}`, tone: "bear", dashed: true },
      ],
      offscale: [{ key: "tp", price: t.tp, label: `TP ${p(t.tp)} ↑`, tone: "bull" }],
      markers: [marker],
      chips: [
        { label: `Risque ${pips(t.entry, t.sl, PIP)} pips`, tone: "bear" },
        { label: `Objectif ${pips(t.tp, t.entry, PIP)} pips`, tone: "bull" },
        { label: `R/R ${fmtRR(rr)}`, tone: rr >= 3 ? "bull" : "bear", data: { rr: fmtRR(rr), entry: t.entry, sl: t.sl, tp: t.tp, expect } },
      ],
    };
  };

  const panels: LCPanel[] = [
    {
      key: "h1",
      title: "H1 · le prix revient dans l'Order Block",
      subtitle: "EUR/USD — dernière bougie rouge avant l'impulsion, puis BOS",
      decimals: 5, height: 280,
      candles: m.h1All,
      zones: [{ ...obZone, from: m.obI, label: "Order Block", short: "OB", role: "ob", dir: "bull" }],
      levels: [
        { key: "bos", price: m.prior.price, from: m.prior.index, to: m.bosI, label: `BOS ${p(m.prior.price)}`, short: "BOS", tone: "neutral", dashed: true, role: "bos", ref: m.prior.index, dir: "bull" },
        { key: "top", price: m.top.price, from: m.top.index, label: `Sommet ${p(m.top.price)}`, short: "Sommet", tone: "bull", dashed: true },
      ],
      markers: [{ key: "m15", i: m.H1.length + 0.5, price: Math.min(...m.M15.map((k) => k.l)), label: "Détail M15", tone: "neutral", side: "below" }],
    },
    tradePanel("loose", "M15 · Entrée imprécise", "Entrée dès le toucher de la zone, SL sous toute la zone", m.loose, "<2",
      { key: "touch", i: m.touchI, price: m.M15[m.touchI].h, label: "Toucher", tone: "entry", side: "above" }),
    tradePanel("sharp", "M15 · Entrée de précision", "Entrée à la clôture de la pin bar, SL sous sa mèche", m.sharp, ">3",
      { key: "pin", i: m.pinI, price: m.pin.h, label: "Pin bar", tone: "bull", side: "above", role: "pinbar", dir: "bull" }),
  ];
  return (
    <div className={className}>
      <LessonChart
        id="PrecisionEntryDiagram"
        title="Même Order Block, deux entrées"
        panels={panels}
        rows={[1, 2]}
        caption="SL avec 3 pips de marge sous le niveau ; objectif : le sommet de l'impulsion."
      />
    </div>
  );
}
