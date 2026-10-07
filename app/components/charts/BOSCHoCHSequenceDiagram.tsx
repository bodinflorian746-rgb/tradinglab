// SMC 2 / SMC 5 — séquence de retournement haussier en 3 étapes (doctrine PO) :
// 1. CHoCH : clôture au-dessus du dernier LH de la tendance baissière (1er signal) ;
// 2. nouvelle structure : un HL se forme ;
// 3. BOS : clôture au-dessus du sommet laissé par le CHoCH (confirmation).
// EUR/USD H4, bougies : scenarios.ts (« choch-sequence ») ; pivots calculés.

import { LessonChart, type LCMarker } from "@/app/components/lessons/LessonChart";
import { fmtPrice, pivots } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);

export default function BOSCHoCHSequenceDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const candles = CANDLES["choch-sequence"];
  const piv = pivots(candles, 2);
  const lastLH = piv.filter((q) => q.name === "LH").at(-1)!;
  const chochI = candles.findIndex((k, i) => i > lastLH.index && k.c > lastLH.price);
  const hh = piv.find((q) => q.side === "h" && q.index > chochI)!;
  const hl = piv.find((q) => q.side === "l" && q.index > hh.index)!;
  const bosI = candles.findIndex((k, i) => i > hl.index && k.c > hh.price);
  const structure: LCMarker[] = piv.filter((q) => q.name && q.index < chochI).map((q) => ({
    key: `p${q.index}`, i: q.index, price: q.price, label: q.name!, pivot: q.name, tone: "neutral", side: q.side === "h" ? "above" : "below",
  }));
  return (
    <LessonChart
      id="BOSCHoCHSequenceDiagram"
      title="Séquence de retournement en 3 étapes"
      panels={[{
        key: "h4", subtitle: "EUR/USD H4 — de la tendance baissière (LH / LL) au retournement confirmé",
        decimals: 5, height: 340, candles,
        levels: [
          { key: "lh", price: lastLH.price, from: lastLH.index, to: chochI, label: `Dernier LH ${p(lastLH.price)}`, short: "Dernier LH", tone: "zone", dashed: true },
          { key: "hh", price: hh.price, from: hh.index, to: bosI, label: `Sommet du CHoCH ${p(hh.price)}`, short: "Sommet CHoCH", tone: "bull", dashed: true },
        ],
        markers: [
          ...structure,
          { key: "choch", i: chochI, price: candles[chochI].l, label: "1 · CHoCH", tone: "zone", side: "below" },
          { key: "hl", i: hl.index, price: hl.price, label: "2 · HL", pivot: "HL", tone: "sky", side: "below" },
          { key: "bos", i: bosI, price: candles[bosI].h, label: "3 · BOS", tone: "bull", side: "above" },
        ],
        chips: [
          { label: "1 · CHoCH : premier signal, sortie des ventes", tone: "zone" },
          { label: "2 · Nouvelle structure : pas encore d'inversion" },
          { label: "3 · BOS dans le nouveau sens : retournement confirmé", tone: "bull" },
        ],
      }]}
    />
  );
}
