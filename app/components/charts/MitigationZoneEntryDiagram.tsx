// SMC 3 / SMC 5 — zone de mitigation après un CHoCH baissier (EUR/USD H1) : structure
// HL 1.1720 / HH 1.1780, breakout du HL (CHoCH), creux 1.1690, retour sur l'ex-HL
// devenu résistance, rejet → entrée short 1.1718, SL au-dessus de la zone, TP sur la
// projection. Étiquettes posées sur les vrais pivots. Bougies : scenarios.ts (« mitigation »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { tradeSetup } from "@/app/components/lessons/trade";
import { fmtPrice, pivots } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);

export default function MitigationZoneEntryDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["mitigation"];
  const piv = pivots(cs, 2);
  const hl = piv.filter((q) => q.side === "l" && q.index < piv.find((x) => x.name === "HH")!.index).at(-1)!;
  const hh = piv.find((q) => q.name === "HH")!;
  const choch = cs.findIndex((k, i) => i > hh.index && k.c < hl.price);
  const low = piv.find((q) => q.side === "l" && q.index > choch)!;
  const retest = cs.findIndex((k, i) => i > low.index && k.h >= hl.price);
  const zone = { y1: hl.price, y2: hl.price + 0.0006 };
  const entry = cs[retest].c;
  const t = tradeSetup({ entry, sl: zone.y2 + 0.0006, tp: low.price - (hh.price - low.price) * 0.5, from: retest, names: { tp: "TP projection" } });
  return (
    <LessonChart
      id="MitigationZoneEntryDiagram"
      title="Après le CHoCH, l'ex-HL devient résistance"
      panels={[{
        key: "h1", subtitle: `EUR/USD H1 — ex-HL ${p(hl.price)} retesté par en dessous`,
        decimals: 5, height: 300, candles: cs,
        zones: [{ key: "mitig", ...zone, from: hl.index, label: "Zone de mitigation", short: "Mitigation", tone: "zone", kind: "zone" }],
        levels: t.levels,
        markers: [
          { key: "hl", i: hl.index, price: hl.price, label: "HL", pivot: "HL", tone: "neutral", side: "below" },
          { key: "hh", i: hh.index, price: hh.price, label: "HH", pivot: "HH", tone: "neutral", side: "above" },
          { key: "choch", i: choch, price: cs[choch].l, label: "CHoCH", tone: "bear", side: "below" },
          { key: "rej", i: retest, price: cs[retest].h, label: "Rejet", tone: "bear", side: "above" },
        ],
        chips: t.chips,
      }]}
      caption="Entrée au retest de la zone avec signal de rejet ; stop serré au-delà de la zone."
    />
  );
}
