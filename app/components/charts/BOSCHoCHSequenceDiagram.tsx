// SMC 2 / SMC 5 — séquence de retournement haussier (doctrine PO), dans l'ordre du texte :
// 1. CHoCH : clôture au-dessus du dernier LH de la tendance baissière (1er signal, sortie des ventes) ;
// 2. nouvelle structure : un HL se forme (pas encore d'inversion) ;
// 3. BOS : clôture au-dessus du sommet laissé par le CHoCH (retournement confirmé) ;
// 4. mitigation : retour sur l'ex-LH devenu support, bougie de rejet → entrée.
// EUR/USD H4, bougies : scenarios.ts (« choch-sequence ») ; pivots, cassures et rejet calculés et
// vérifiés par l'audit (rôles).

import { LessonChart, type LCMarker } from "@/app/components/lessons/LessonChart";
import { fmtPrice, pivots } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);

export default function BOSCHoCHSequenceDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  // à partir de 2 bougies avant le sommet 1.1850 : LH 1.1820 et LL 1.1720 restent nommés par comparaison
  const candles = CANDLES["choch-sequence"].slice(6);
  const piv = pivots(candles, 2);
  const lastLH = piv.filter((q) => q.name === "LH").at(-1)!;
  const chochI = candles.findIndex((k, i) => i > lastLH.index && k.c > lastLH.price);
  const hh = piv.find((q) => q.side === "h" && q.index > chochI)!;
  const hl = piv.find((q) => q.side === "l" && q.index > hh.index)!;
  const bosI = candles.findIndex((k, i) => i > hl.index && k.c > hh.price);
  const zone = { y1: Number((lastLH.price - 0.0005).toFixed(5)), y2: Number((lastLH.price + 0.0005).toFixed(5)) };
  const mitig = candles.findIndex((k, i) => i > bosI + 1 && k.l <= zone.y2);
  const structure: LCMarker[] = piv.filter((q) => q.name && q.index < chochI).map((q) => ({
    key: `p${q.index}`, i: q.index, price: q.price, label: q.name!, pivot: q.name, tone: "neutral", side: q.side === "h" ? "above" : "below",
  }));
  return (
    <LessonChart
      id="BOSCHoCHSequenceDiagram"
      title="Séquence de retournement : CHoCH, nouvelle structure, BOS, mitigation"
      panels={[{
        key: "h4", subtitle: "EUR/USD H4 — de la tendance baissière (LH / LL) au retournement confirmé",
        decimals: 5, height: 360, candles,
        zones: [{ key: "exlh", ...zone, from: lastLH.index, label: `4 · Entrée : ex-LH ${p(lastLH.price)} devenu support`, short: "4 · Ex-LH", tone: "sky" }],
        levels: [
          { key: "lh", price: lastLH.price, from: lastLH.index, to: chochI, tone: "zone", dashed: true, role: "choch", ref: lastLH.index, dir: "bull" },
          { key: "hh", price: hh.price, from: hh.index, to: bosI, label: `Sommet du CHoCH ${p(hh.price)}`, short: "Sommet", tone: "bull", dashed: true, role: "bos", ref: hh.index, dir: "bull" },
        ],
        markers: [
          ...structure,
          { key: "choch", i: chochI, price: candles[chochI].c, label: "1 · CHoCH : sortie des ventes", short: "1 · CHoCH", tone: "zone", side: "below" },
          { key: "hl", i: hl.index, price: hl.price, label: "2 · HL : nouvelle structure", short: "2 · HL", pivot: "HL", tone: "sky", side: "below" },
          { key: "bos", i: bosI, price: candles[bosI].c, label: "3 · BOS : retournement confirmé", short: "3 · BOS", tone: "bull", side: "above" },
          { key: "mitig", i: mitig, price: candles[mitig].l, label: "Rejet", tone: "sky", side: "below", role: "rejet", ref: "exlh", dir: "bull" },
        ],
      }]}
      caption="Pas d'inversion au CHoCH : on attend la nouvelle structure et le BOS, puis le retour sur le niveau cassé."
    />
  );
}
