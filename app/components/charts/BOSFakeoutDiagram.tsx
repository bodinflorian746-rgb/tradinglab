// SMC 2 bloc 5 et Trend-following 4 — faux BOS (EUR/USD H4, même structure que BOSDiagram) :
// à gauche, la mèche perce le HH 1.0950 mais la bougie clôture en dessous, puis le prix réintègre
// (prise de liquidité) ; à droite, la clôture franche au-dessus sans réintégration = BOS.
// Clôtures lues sur les bougies. Bougies : scenarios.ts (« bos-fake », « bos-eur »).

import { LessonChart, type LCPanel } from "@/app/components/lessons/LessonChart";
import { fmtPrice, pivots, type Candle } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);
const HH = 1.095;

function panel(key: "bos-fake" | "bos-eur", title: string, fake: boolean): LCPanel {
  const cs = CANDLES[key] as Candle[];
  const hh = pivots(cs, 2).find((q) => q.side === "h" && q.price === HH)!;
  const k = cs.findIndex((x, i) => i > hh.index && x.h > HH);
  return {
    key, title, decimals: 5, height: 220, candles: cs,
    subtitle: fake ? `Mèche à ${p(cs[k].h)}, clôture ${p(cs[k].c)}` : `Clôture ${p(cs[k].c)}, pas de réintégration`,
    levels: [{ key: "hh", price: HH, from: hh.index, label: `HH ${p(HH)}`, short: "HH", tone: "zone", dashed: true }],
    markers: [fake
      ? { key: "k", i: k, price: cs[k].h, label: "Faux BOS : mèche seule", short: "Faux BOS", tone: "bear", side: "above", role: "sweep", ref: HH, dir: "bear" }
      : { key: "k", i: k, price: cs[k].c, label: "BOS : clôture au-dessus", short: "BOS", tone: "bull", side: "above", role: "bos", ref: hh.index, dir: "bull" }],
  };
}

export default function BOSFakeoutDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  return (
    <LessonChart
      id="BOSFakeoutDiagram"
      title="Mèche ou clôture ?"
      caption="Une mèche qui perce sans clôture franche n'est pas un BOS : c'est souvent une prise de liquidité. Attendre la clôture complète."
      panels={[panel("bos-fake", "✗ La mèche perce, la clôture invalide", true), panel("bos-eur", "✓ Clôture au-dessus : BOS", false)]}
      rows={[2]}
      sharedScale
    />
  );
}
