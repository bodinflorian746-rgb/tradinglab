// SMC 3 bloc 1 et Avancé 3 — identifier un Order Block haussier (EUR/USD H1), les 4 étapes du
// texte : impulsion directionnelle, dernière bougie baissière avant l'impulsion, BOS au-dessus du
// sommet précédent, zone = corps de la bougie opposée. OB, BOS et sommet calculés sur les bougies.
// Bougies : scenarios.ts (« smc-ob », comme le plan d'exécution).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice, lastOpposite, orderBlock, pivots } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);

export function obLayout(cs: { o: number; h: number; l: number; c: number }[]) {
  // creux de départ de l'impulsion : le plus bas avant le plus haut du graphique
  const hiI = cs.reduce((b, k, i) => (k.h > cs[b].h ? i : b), 0);
  const lowI = cs.reduce((b, k, i) => (i < hiI && k.l < cs[b].l ? i : b), 0);
  const impulse = cs.findIndex((k, i) => i > lowI && k.c > k.o);
  const obI = lastOpposite(cs, impulse, "bull");
  const prevHigh = pivots(cs.slice(0, obI + 1), 1).filter((q) => q.side === "h").at(-1) ?? { index: 0, price: Math.max(...cs.slice(0, obI).map((k) => k.h)) };
  const bos = cs.findIndex((k, i) => i > obI && k.c > prevHigh.price);
  return { obI, impulse, ob: orderBlock(cs, obI), prevHigh, bos };
}

export function OrderBlockDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["smc-ob"];
  const { obI, impulse, ob, prevHigh, bos } = obLayout(cs);
  return (
    <LessonChart
      id="OrderBlockDiagram"
      title="Identifier un Order Block en 4 étapes"
      caption="Sans BOS, la bougie opposée n'est qu'une zone de réaction, pas un Order Block."
      panels={[{
        key: "h1", title: "EUR/USD H1, Order Block haussier", decimals: 5, height: 280, candles: cs,
        zones: [{ key: "ob", ...ob, from: obI, label: `4 · Zone = corps ${p(ob.y1)}-${p(ob.y2)}`, short: "4 · Zone OB", tone: "zone", kind: "ob", src: `smc-ob:${obI}` }],
        levels: [{ key: "prev", price: prevHigh.price, from: prevHigh.index, to: bos, label: `Sommet précédent ${p(prevHigh.price)}`, short: "Sommet", tone: "neutral", dashed: true }],
        markers: [
          { key: "opp", i: obI, price: cs[obI].l, label: "2 · Dernière bougie baissière", short: "2 · Bougie opposée", tone: "bear", side: "below" },
          { key: "imp", i: impulse + 1, price: cs[impulse + 1].l, label: "1 · Impulsion", tone: "bull", side: "below" },
          { key: "bos", i: bos, price: cs[bos].h, label: "3 · BOS", tone: "bull", side: "above" },
        ],
      }]}
    />
  );
}
