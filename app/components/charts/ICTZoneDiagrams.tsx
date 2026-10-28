// Trading Avancé 14 — ICT/SMC, les zones complémentaires (EUR/USD H1). Bougies : lib/lessons/scenarios-nouvelles.ts ;
// chaque zone correspond aux bougies : Order Block = corps d'une bougie (src « ob:i »), FVG = écart de mèche à
// mèche, BPR = chevauchement des deux FVG, CE = milieu de la zone (rôles vérifiés par l'audit).
//  - BreakerBlockDiagram : OB 1.0850 – 1.0860, liquidité prise, cassure de structure, retest et rejet (animé) ;
//  - MitigationBlockDiagram : lower high sans prise de liquidité, cassure du creux, retour et rejet (animé) ;
//  - IFVGDiagram : FVG haussier 1.0850 – 1.0860 traversé, puis résistance (animé) ;
//  - CEDiagram : FVG 1.0840 – 1.0860, CE 1.0850 ;
//  - BPRDiagram : FVG haussier 1.0840 – 1.0860 et baissier 1.0850 – 1.0870, BPR 1.0850 – 1.0860 ;
//  - PremiumDiscountDiagram : range 1.0800 – 1.0900, milieu 1.0850.

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice, type Candle } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const C = CANDLES as unknown as Record<string, Candle[]>;
const p = (x: number) => fmtPrice(x, 4);
const body = (k: Candle) => [Math.min(k.o, k.c), Math.max(k.o, k.c)] as const;

export function BreakerBlockDiagram() {
  const cs = C["ict-breaker"];
  const OB = 8, TOP = 4, LIQ = 12, BOS = 16, REJ = 19;
  const [y1, y2] = body(cs[OB]);
  return (
    <LessonChart
      id="BreakerBlockDiagram"
      title="Bearish Breaker sur EUR/USD"
      caption="L'Order Block haussier (1.0850 – 1.0860) lance une impulsion qui dépasse le sommet 1.0880 et prend la liquidité au-dessus. Le prix redescend, traverse l'OB et casse le dernier creux en clôture : la zone devient un Breaker. Au retour, elle rejette le prix."
      panels={[{
        key: "h1", title: "EUR/USD H1 · Breaker Block", decimals: 5, height: 280, candles: cs, slots: cs.length + 2,
        zones: [{ key: "breaker", y1, y2, from: OB, label: `Breaker ${p(y1)} – ${p(y2)}`, short: "Breaker", tone: "bear", role: "ob", src: `ob:${OB}` }],
        levels: [{ key: "sommet", price: cs[TOP].h, from: TOP, to: LIQ, label: `Sommet précédent ${p(cs[TOP].h)}`, short: "Sommet", tone: "neutral", dashed: true }],
        markers: [
          { key: "liq", i: LIQ, price: cs[LIQ].h, label: "Liquidité prise", short: "Liquidité", tone: "zone", side: "above", role: "high" },
          { key: "bos", i: BOS, price: cs[BOS].c, label: "Cassure de structure", short: "BOS", tone: "bear", side: "below", role: "bos", ref: OB, dir: "bear" },
          { key: "rejet", i: REJ, price: cs[REJ].h, label: "Rejet du Breaker", short: "Rejet", tone: "bear", side: "above", role: "rejet", ref: "breaker", dir: "bear" },
        ],
        anim: [{ candles: OB + 3 }, { show: ["breaker", "sommet"] }, { candles: LIQ }, { show: "liq" }, { candles: BOS }, { show: "bos" }, { candles: REJ }, { show: "rejet" }, { candles: cs.length - 1 }],
      }]}
    />
  );
}

export function MitigationBlockDiagram() {
  const cs = C["ict-mitigation"];
  const TOP = 2, LOW = 5, LH = 8, BOS = 11, REJ = 15;
  const [y1, y2] = body(cs[LH]);
  return (
    <LessonChart
      id="MitigationBlockDiagram"
      title="Mitigation Block sur EUR/USD"
      caption="Le prix forme un lower high sans dépasser 1.0880 : aucune liquidité prise au-dessus. La dernière bougie haussière avant la chute marque l'origine du mouvement. Après la cassure du creux 1.0840, le retour dans cette zone est rejeté."
      panels={[{
        key: "h1", title: "EUR/USD H1 · Mitigation Block", decimals: 5, height: 270, candles: cs, slots: cs.length + 2,
        zones: [{ key: "mb", y1, y2, from: LH, label: `Mitigation Block ${p(y1)} – ${p(y2)}`, short: "Mitigation", tone: "bear", role: "ob", src: `ob:${LH}`, dir: "bear" }],
        markers: [
          { key: "top", i: TOP, price: cs[TOP].h, label: `Sommet ${p(cs[TOP].h)}`, short: "Sommet", tone: "neutral", side: "above", role: "swing-high" },
          { key: "lh", i: LH, price: cs[LH].h, label: `Lower high ${p(cs[LH].h)}`, short: "Lower high", tone: "bear", side: "above", role: "swing-high" },
          { key: "low", i: LOW, price: cs[LOW].l, label: `Creux ${p(cs[LOW].l)}`, short: "Creux", tone: "neutral", side: "below", role: "swing-low" },
          { key: "bos", i: BOS, price: cs[BOS].c, label: `Cassure du creux ${p(cs[LOW].l)}`, short: "BOS", tone: "bear", side: "below", role: "bos", ref: LOW, dir: "bear" },
          { key: "rejet", i: REJ, price: cs[REJ].h, label: "Rejet", short: "Rejet", tone: "bear", side: "above", role: "rejet", ref: "mb", dir: "bear" },
        ],
        anim: [{ candles: LOW + 2 }, { show: ["top", "low"] }, { candles: LH + 2 }, { show: ["lh", "mb"] }, { candles: BOS }, { show: "bos" }, { candles: REJ }, { show: "rejet" }, { candles: cs.length - 1 }],
      }]}
    />
  );
}

export function IFVGDiagram() {
  const cs = C["ict-ifvg"];
  const F = 3, OUT = 10, REJ = 15;
  const y1 = cs[F - 1].h, y2 = cs[F + 1].l;
  return (
    <LessonChart
      id="IFVGDiagram"
      title="Inverse FVG : un FVG haussier devenu résistance"
      caption="Un FVG haussier se forme entre 1.0850 et 1.0860. Plus tard, le prix le traverse et clôture en dessous. Au rebond, la même zone joue le rôle opposé : elle rejette le prix, comme un support devenu résistance."
      panels={[{
        key: "h1", title: "EUR/USD H1 · IFVG", decimals: 5, height: 270, candles: cs, slots: cs.length + 2,
        zones: [{ key: "ifvg", y1, y2, from: F - 1, label: `FVG ${p(y1)} – ${p(y2)} → IFVG`, short: "IFVG", tone: "fib", role: "fvg" }],
        markers: [
          { key: "out", i: OUT, price: cs[OUT].c, label: "Clôture sous le FVG", short: "Clôture dessous", tone: "bear", side: "below", role: "close" },
          { key: "rejet", i: REJ, price: cs[REJ].h, label: "Rejet de l'IFVG", short: "Rejet", tone: "bear", side: "above", role: "rejet", ref: "ifvg", dir: "bear" },
        ],
        anim: [{ candles: F + 1 }, { show: "ifvg" }, { candles: OUT }, { show: "out" }, { candles: REJ }, { show: "rejet" }, { candles: cs.length - 1 }],
      }]}
    />
  );
}

export function CEDiagram() {
  const cs = C["ict-ce"];
  const F = 3, BACK = 9;
  const y1 = cs[F - 1].h, y2 = cs[F + 1].l, mid = Number(((y1 + y2) / 2).toFixed(5));
  return (
    <LessonChart
      id="CEDiagram"
      title="Le Consequent Encroachment : le milieu du FVG"
      caption={`FVG haussier de ${p(y1)} à ${p(y2)} : son CE vaut (${p(y1)} + ${p(y2)}) ÷ 2 = ${p(mid)}. Ici, le prix revient jusqu'au CE et repart ; ailleurs, il peut réagir plus haut ou plus bas dans la zone.`}
      panels={[{
        key: "h1", title: "EUR/USD H1 · FVG et CE", decimals: 5, height: 250, candles: cs, slots: cs.length + 2,
        zones: [{ key: "fvg", y1, y2, from: F - 1, label: `FVG ${p(y1)} – ${p(y2)}`, short: "FVG", tone: "fib", role: "fvg" }],
        levels: [{ key: "ce", price: mid, from: F - 1, label: `CE ${p(mid)}`, short: "CE", tone: "zone", dashed: true, role: "ce", ref: "fvg" }],
        markers: [{ key: "back", i: BACK, price: cs[BACK].l, label: "Réaction sur le CE", short: "Réaction", tone: "bull", side: "below", role: "low" }],
      }]}
    />
  );
}

export function BPRDiagram() {
  const cs = C["ict-bpr"];
  const UP = 3, DN = 8, BACK = 13;
  const u1 = cs[UP - 1].h, u2 = cs[UP + 1].l, d1 = cs[DN + 1].h, d2 = cs[DN - 1].l;
  const b1 = Math.max(u1, d1), b2 = Math.min(u2, d2);
  return (
    <LessonChart
      id="BPRDiagram"
      title="Balanced Price Range : deux FVG qui se chevauchent"
      caption="Un FVG haussier (1.0840 – 1.0860) se forme pendant la hausse, puis un FVG baissier (1.0850 – 1.0870) pendant la baisse. Leur chevauchement, 1.0850 – 1.0860, forme un BPR potentiel, surveillé lors d'un retour du prix."
      panels={[{
        key: "h1", title: "EUR/USD H1 · BPR", decimals: 5, height: 270, candles: cs, slots: cs.length + 2,
        zones: [
          { key: "fvgUp", y1: u1, y2: u2, from: UP - 1, label: `FVG haussier ${p(u1)} – ${p(u2)}`, short: "FVG haussier", tone: "bull", role: "fvg" },
          { key: "fvgDn", y1: d1, y2: d2, from: DN - 1, label: `FVG baissier ${p(d1)} – ${p(d2)}`, short: "FVG baissier", tone: "bear", role: "fvg" },
          { key: "bpr", y1: b1, y2: b2, from: DN - 1, label: `BPR ${p(b1)} – ${p(b2)}`, short: "BPR", tone: "zone", role: "bpr", ref: "fvgUp,fvgDn" },
        ],
        markers: [{ key: "back", i: BACK, price: cs[BACK].h, label: "Retour dans le BPR", short: "Retour", tone: "zone", side: "above", role: "high" }],
      }]}
    />
  );
}

export function PremiumDiscountDiagram() {
  const cs = C["ict-premium"];
  const NOW = cs.length - 1;
  return (
    <LessonChart
      id="PremiumDiscountDiagram"
      title="Premium et Discount dans un range"
      caption="Range de 1.0800 à 1.0900, chaque borne touchée deux fois. Son milieu, 1.0850, sépare la zone Discount (moitié basse) de la zone Premium (moitié haute). À 1.0880, le prix est en zone Premium : une information de position, pas une direction."
      panels={[{
        key: "h1", title: "EUR/USD H1 · range et milieu", decimals: 5, height: 270, candles: cs, slots: cs.length + 2,
        zones: [
          { key: "premium", y1: 1.085, y2: 1.09, from: 0, label: "Premium", short: "Premium", tone: "bear" },
          { key: "discount", y1: 1.08, y2: 1.085, from: 0, label: "Discount", short: "Discount", tone: "bull" },
        ],
        levels: [
          { key: "rh", price: 1.09, from: 0, label: `Haut du range ${p(1.09)}`, short: "Haut", tone: "bear", dashed: true, role: "range-high" },
          { key: "rl", price: 1.08, from: 0, label: `Bas du range ${p(1.08)}`, short: "Bas", tone: "bull", dashed: true, role: "range-low" },
          { key: "mid", price: 1.085, from: 0, label: `Milieu ${p(1.085)}`, short: "Milieu", tone: "zone", dashed: true, role: "ce", ref: "rh,rl" },
        ],
        markers: [{ key: "now", i: NOW, price: cs[NOW].c, label: `Prix ${p(cs[NOW].c)} : zone Premium`, short: `Prix ${p(cs[NOW].c)}`, tone: "bear", side: "above", role: "close" }],
      }]}
    />
  );
}
