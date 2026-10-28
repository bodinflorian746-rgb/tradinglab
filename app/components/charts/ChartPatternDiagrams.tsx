// Trading Intermédiaire 10 — Les figures chartistes. Bougies : lib/lessons/scenarios-nouvelles.ts (prix du
// texte, NASDAQ décalé de +7 000 points).
//  - BullFlagDiagram : mât 27 000 → 27 200, canal du drapeau, clôture au-dessus, invalidation 27 120 (animé) ;
//  - TrianglesDiagram : ascendant (EUR/USD, chiffres du texte), descendant, symétrique ;
//  - DoubleTopDiagram : sommets 3 950 $ et 3 948 $, ligne de cou 3 920 $, hauteur et objectif 3 890 $ (animé) ;
//  - DoubleTopPlanDiagram : vente au marché refusée (1:1,87) et Sell Limit au retest retenu (1:2,31).

import { LessonChart, type LCPanel } from "@/app/components/lessons/LessonChart";
import { pts, tradeSetup, usd } from "@/app/components/lessons/trade";
import { fmtPrice, lineAt, type Candle } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const C = CANDLES as unknown as Record<string, Candle[]>;
const p = (x: number) => fmtPrice(x, 4);

export function BullFlagDiagram() {
  const cs = C["fig-flag"];
  // canal du drapeau : sommets 11 et 14, creux 10 et 16, prolongés jusqu'à la bougie du breakout (18)
  const top = (i: number) => lineAt(11, cs[11].h, 14, cs[14].h, i), bot = (i: number) => lineAt(10, cs[10].l, 16, cs[16].l, i);
  return (
    <LessonChart
      id="BullFlagDiagram"
      title="Drapeau haussier sur le NASDAQ"
      caption="Le mât : de 27 000 à 27 200 points. Le drapeau : une correction organisée dans un petit canal descendant, entre 27 180 et 27 120. Une clôture au-dessus du canal signale une tentative de continuation ; sous 27 120, le dernier creux du drapeau, la figure est invalidée."
      panels={[{
        key: "m15", title: "NASDAQ M15 · drapeau haussier", decimals: 0, height: 280, candles: cs, slots: cs.length + 3,
        segments: [
          { key: "mat", i1: 1, p1: cs[1].c, i2: 8, p2: cs[8].h, tone: "bull", arrow: true, label: `Mât ${pts(27000)} → ${pts(27200)}`, short: "Mât" },
          { key: "haut", i1: 11, p1: top(11), i2: 18, p2: top(18), tone: "zone", dashed: true, label: "Drapeau", short: "Drapeau" },
          { key: "bas", i1: 10, p1: bot(10), i2: 18, p2: bot(18), tone: "zone", dashed: true },
        ],
        levels: [{ key: "inval", price: cs[16].l, from: 16, label: `Invalidation ${pts(cs[16].l)}`, short: "Invalidation", tone: "bear", dashed: true }],
        markers: [{ key: "breakout", i: 18, price: cs[18].c, label: "Clôture au-dessus du drapeau", short: "Breakout", tone: "bull", side: "above", role: "close" }],
        anim: [{ candles: 8 }, { show: "mat" }, { candles: 16 }, { show: ["haut", "bas", "inval"] }, { candles: 18 }, { show: "breakout" }, { candles: cs.length - 1 }],
      }]}
    />
  );
}

export function TrianglesDiagram() {
  const asc = C["fig-tri-asc"], desc = C["fig-tri-desc"], sym = C["fig-tri-sym"];
  const panel = (key: string, title: string, cs: Candle[], extra: Partial<LCPanel>): LCPanel => ({ key, title, decimals: 5, height: 220, candles: cs, slots: cs.length + 2, ...extra });
  return (
    <LessonChart
      id="TrianglesDiagram"
      title="Les trois triangles"
      caption="Ascendant : résistance 1.0900, creux à 1.0840, 1.0860 puis 1.0880, et clôture au-dessus de 1.0900. Descendant : support horizontal et sommets descendants. Symétrique : sommets descendants et creux ascendants, le prix se contracte jusqu'à la sortie."
      rows={[3]}
      panels={[
        panel("asc", "Triangle ascendant", asc, {
          levels: [{ key: "res", price: 1.09, from: 2, to: 16, label: `Résistance ${p(1.09)}`, short: "Résistance", tone: "bear", dashed: true, role: "resistance" }],
          segments: [{ key: "pente", i1: 5, p1: asc[5].l, i2: 14, p2: asc[14].l, tone: "bull", dashed: true }],
          markers: [
            { key: "out", i: 16, price: asc[16].c, label: "Clôture au-dessus", short: "Sortie", tone: "bull", side: "above", role: "close" },
          ],
        }),
        panel("desc", "Triangle descendant", desc, {
          levels: [{ key: "sup", price: 1.08, from: 5, to: 16, label: `Support ${p(1.08)}`, short: "Support", tone: "bull", dashed: true, role: "support" }],
          segments: [{ key: "pente", i1: 2, p1: desc[2].h, i2: 13, p2: desc[13].h, tone: "bear", dashed: true }],
          markers: [{ key: "out", i: 16, price: desc[16].c, label: "Clôture en dessous", short: "Sortie", tone: "bear", side: "below", role: "close" }],
        }),
        panel("sym", "Triangle symétrique", sym, {
          segments: [
            { key: "haut", i1: 2, p1: sym[2].h, i2: 12, p2: sym[12].h, tone: "bear", dashed: true },
            { key: "bas", i1: 5, p1: sym[5].l, i2: 14, p2: sym[14].l, tone: "bull", dashed: true },
          ],
          markers: [{ key: "out", i: 16, price: sym[16].c, label: "Sortie par le haut", short: "Sortie", tone: "bull", side: "above", role: "close" }],
        }),
      ]}
    />
  );
}

/** Repères du double sommet : sommets 10 et 16, ligne de cou 13, sommet local 21, clôture sous la ligne de cou 23 */
const DT = { t1: 10, t2: 16, neck: 13, local: 21, brk: 23, retest: 26 } as const;

export function DoubleTopDiagram() {
  const cs = C["fig-dt"];
  const neck = cs[DT.neck].l, top = Math.max(cs[DT.t1].h, cs[DT.t2].h), target = neck - (top - neck);
  return (
    <LessonChart
      id="DoubleTopDiagram"
      title="Double sommet sur l'or et objectif de la figure"
      caption="Deux sommets proches de 3 950 $, la ligne de cou sur le creux intermédiaire (3 920 $). La figure se confirme quand une bougie clôture sous la ligne de cou. Sa hauteur (30 $) reportée sous la ligne de cou donne l'objectif théorique, 3 890 $, juste avant le support 3 888 $."
      panels={[{
        key: "h1", title: "XAU/USD H1 · double sommet", decimals: 0, height: 290, candles: cs, slots: cs.length + 5,
        levels: [
          { key: "cou", price: neck, from: DT.neck, label: `Ligne de cou ${usd(neck)}`, short: "Ligne de cou", tone: "zone", dashed: true },
          { key: "sup", price: 3888, from: 1, label: `Support ${usd(3888)}`, short: "Support", tone: "neutral", dashed: true, role: "support" },
          { key: "obj", price: target, from: DT.brk, label: `Objectif ${usd(target)}`, short: "Objectif", tone: "bull", dashed: true, role: "dt-target", ref: `${DT.t1},${DT.t2}` },
        ],
        segments: [{ key: "hauteur", i1: DT.t1, p1: top, i2: DT.t1, p2: neck, tone: "fib", arrow: true, label: `Hauteur ${usd(top - neck)}`, short: "Hauteur", role: "dt-height", ref: `${DT.t1},${DT.t2}` }],
        markers: [
          { key: "s1", i: DT.t1, price: cs[DT.t1].h, label: `Sommet ${usd(cs[DT.t1].h)}`, short: "Sommet 1", tone: "bear", side: "above", role: "swing-high" },
          { key: "s2", i: DT.t2, price: cs[DT.t2].h, label: `Sommet ${usd(cs[DT.t2].h)}`, short: "Sommet 2", tone: "bear", side: "above", role: "swing-high" },
          { key: "brk", i: DT.brk, price: cs[DT.brk].c, label: `Clôture ${usd(cs[DT.brk].c)} sous la ligne de cou`, short: "Confirmation", tone: "bear", side: "below", role: "close" },
        ],
        anim: [{ candles: DT.t1 + 2 }, { show: ["s1", "sup"] }, { candles: DT.t2 + 1 }, { show: ["s2", "cou"] }, { candles: DT.brk }, { show: "brk" }, { show: ["hauteur", "obj"] }],
      }]}
    />
  );
}

export function DoubleTopPlanDiagram() {
  const a = C["fig-dt"], b = C["fig-dt-retest"];
  const refused = tradeSetup({ entry: a[DT.brk].c, sl: 3933, tp: 3890, unit: "$", from: DT.brk, expect: "<2", names: { entry: "Vente au marché" } });
  const kept = tradeSetup({ entry: 3920, sl: 3933, tp: 3890, unit: "$", from: DT.brk, expect: ">2", names: { entry: "Sell Limit" } });
  const local = (cs: Candle[]) => ({ key: "local", i: DT.local, price: cs[DT.local].h, label: `Sommet local ${usd(cs[DT.local].h)}`, short: "Sommet local", tone: "neutral" as const, side: "above" as const, role: "swing-high" as const });
  return (
    <LessonChart
      id="DoubleTopPlanDiagram"
      title="Deux entrées possibles, un seul plan retenu"
      caption="Vendre au marché sur la clôture à 3 918 $ donne 15 $ de risque pour 28 $ de gain (1:1,87) : refusé. Le Sell Limit à 3 920 $, sur le retest de la ligne de cou, garde le même stop (3 933 $, au-dessus du sommet local 3 930 $) et le même objectif (3 890 $) : 13 $ de risque pour 30 $ de gain."
      rows={[1, 1]}
      panels={[
        { key: "a", title: "Vente au marché à la clôture · refusée", decimals: 0, height: 230, candles: a, slots: b.length + 2, levels: refused.levels, markers: [local(a)], chips: refused.chips },
        {
          key: "b", title: "Sell Limit au retest · retenu", decimals: 0, height: 230, candles: b, slots: b.length + 2, levels: kept.levels,
          markers: [local(b), { key: "fill", i: DT.retest, price: b[DT.retest].h, label: `Retest : exécuté à ${usd(3920)}`, short: "Exécuté", tone: "entry", side: "above", role: "high" }],
          chips: kept.chips,
          anim: [{ candles: DT.brk }, { show: ["local", "entry", "sl", "tp"] }, { candles: DT.retest }, { show: "fill" }, { candles: b.length - 1 }],
        },
      ]}
    />
  );
}
