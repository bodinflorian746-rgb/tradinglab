// ICT 2 — tous les FVG ne se valent pas. EUR/USD H1 :
// - FVG qualifié : equal highs sous la résistance H4 1.1780, sweep à 1.1792, impulsion
//   baissière ; FVG bearish 1.1758-1.1770 (bas de la bougie 1 → haut de la bougie 3) ; deux sommets
//   (equal highs) marqués sous la résistance ;
// - FVG hors contexte : gap laissé en milieu de range, que le prix retraverse.
// FVG calculés sur les bougies (scenarios.ts « pd-qualified », « pd-range »).

import { LessonChart, type LCPanel } from "@/app/components/lessons/LessonChart";
import { fmtPrice, largestFvg, pivots } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);

function fvgPanel(key: "pd-qualified" | "pd-range"): LCPanel {
  const cs = CANDLES[key];
  const g = largestFvg(cs, "bear")!;
  const i = g.i;
  const qualified = key === "pd-qualified";
  const sweep = qualified ? cs.reduce((b, k, j) => (k.h > cs[b].h ? j : b), 0) : -1;
  const through = cs.findIndex((k, j) => j > i + 1 && k.c > g.y2);
  return {
    key, title: qualified ? "FVG qualifié" : "FVG hors contexte",
    subtitle: qualified ? "Né juste après un sweep de liquidité, dans une impulsion claire" : "Laissé par une bougie au milieu d'un range",
    decimals: 5, height: 250, candles: cs,
    zones: [{ key: "fvg", y1: g.y1, y2: g.y2, from: i - 1, label: `FVG ${p(g.y1)}-${p(g.y2)}`, short: "FVG", tone: qualified ? "bear" : "neutral", kind: "fvg", src: `${key}:${i}`, role: "fvg" }],
    levels: qualified ? [{ key: "res", price: 1.1780, label: "Résistance H4 1.1780", short: "Résistance H4", tone: "neutral", dashed: true, faint: true }] : [],
    markers: qualified
      ? [
        { key: "sweep", i: sweep, price: cs[sweep].h, label: `Sweep ${p(cs[sweep].h)}`, short: "Sweep", tone: "zone", side: "above", role: "sweep", ref: 1.178, dir: "bear" },
        { key: "imp", i, price: cs[i].l, label: "Impulsion", tone: "bear", side: "below", role: "impulse", span: [i, i] },
        ...pivots(cs.slice(0, sweep), 2).filter((q) => q.side === "h" && q.price >= 1.1778).map((q) => ({ key: `eqh${q.index}`, i: q.index, price: q.price, label: "EQH", tone: "zone" as const, side: "above" as const, role: "swing-high" as const })),
      ]
      : [{ key: "through", i: through, price: cs[through].c, label: "Clôture au-dessus : traversé sans réaction", short: "Traversé", tone: "neutral", side: "above", role: "close" }],
  };
}

export function PDArrayContextDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  return (
    <LessonChart
      id="PDArrayContextDiagram"
      title="Tous les FVG ne se valent pas"
      panels={[fvgPanel("pd-qualified"), fvgPanel("pd-range")]}
      rows={[2]}
      caption="Le contexte, c'est ce qui s'est passé juste avant : sweep, BOS, CHoCH. Un FVG seul, hors contexte, n'a pas de valeur prédictive."
    />
  );
}
