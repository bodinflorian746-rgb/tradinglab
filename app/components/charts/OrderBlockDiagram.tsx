// SMC 3 bloc 1 et Avancé 3 — identifier un Order Block haussier (EUR/USD H4), les 4 étapes du
// texte : impulsion directionnelle (3 bougies à grands corps), dernière bougie baissière avant
// l'impulsion, BOS = clôture au-dessus du sommet précédent (vrai swing), zone = corps de la bougie
// opposée. Sommet, BOS, OB et impulsion calculés sur les bougies, vérifiés par l'audit (rôles).
// Bougies : scenarios.ts (« smc-ob », comme le plan d'exécution).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice, lastOpposite, orderBlock, pivots, type Candle } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);

/** Sommet précédent (1er vrai sommet cassé en clôture), BOS, OB (dernière rouge avant le BOS) et impulsion. */
export function obLayout(cs: Candle[]) {
  const highs = pivots(cs, 2).filter((q) => q.side === "h" && q.index >= 2 && q.index <= cs.length - 3);
  let prevHigh = highs[0], bos = -1;
  for (const q of highs) {
    bos = cs.findIndex((k, i) => i > q.index && k.c > q.price);
    if (bos > 0) { prevHigh = q; break; }
  }
  const obI = lastOpposite(cs, bos, "bull");
  let end = obI + 1;
  while (end + 1 < cs.length && cs[end + 1].c > cs[end + 1].o) end++;
  return { obI, impulse: [obI + 1, end] as [number, number], ob: orderBlock(cs, obI), prevHigh, bos };
}

export function OrderBlockDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  // identification seulement : jusqu'à deux bougies après l'impulsion (le retour dans l'OB est montré plus loin)
  const all = CANDLES["smc-ob"], { impulse: imp } = obLayout(all), cs = all.slice(0, imp[1] + 3);
  const { obI, impulse, ob, prevHigh, bos } = obLayout(cs);
  return (
    <LessonChart
      id="OrderBlockDiagram"
      title="Identifier un Order Block en 4 étapes"
      caption="Sans BOS, la bougie opposée n'est qu'une zone de réaction, pas un Order Block."
      panels={[{
        key: "h4", title: "EUR/USD H4, Order Block haussier", decimals: 5, height: 300, candles: cs,
        zones: [{ key: "ob", ...ob, from: obI, label: `4 · Zone OB ${p(ob.y1)}-${p(ob.y2)}`, short: "4 · Zone OB", tone: "zone", kind: "ob", src: `smc-ob:${obI}`, role: "ob", dir: "bull" }],
        levels: [{ key: "bos", price: prevHigh.price, from: prevHigh.index, to: bos, label: `3 · BOS : clôture au-dessus de ${p(prevHigh.price)}`, short: "3 · BOS", tone: "bull", dashed: true, role: "bos", ref: prevHigh.index, dir: "bull" }],
        markers: [
          { key: "prev", i: prevHigh.index, price: prevHigh.price, label: `Sommet précédent ${p(prevHigh.price)}`, short: "Sommet", tone: "neutral", side: "above", role: "swing-high" },
          { key: "imp", i: impulse[1], price: cs[impulse[1]].h, label: `1 · Impulsion (${impulse[1] - impulse[0] + 1} bougies)`, short: "1 · Impulsion", tone: "bull", side: "above", role: "impulse", span: impulse },
          { key: "opp", i: obI, price: cs[obI].l, label: "2 · Dernière bougie baissière", short: "2 · Bougie opposée", tone: "bear", side: "below" },
        ],
      }]}
    />
  );
}
