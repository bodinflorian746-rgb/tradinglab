// Trading Avancé 15 — ICT/SMC, liquidité et timing. Bougies : lib/lessons/scenarios-nouvelles.ts (NASDAQ
// décalé de +7 000 points ; GBP/USD vers 1.3330).
//  - InducementDiagram : support intermédiaire 3 910 $ cassé, réaction sur le support majeur (animé) ;
//  - SMTDiagram : EUR/USD fait un higher high, GBP/USD un lower high ;
//  - JudasSwingDiagram : range asiatique, sweep du sommet à l'ouverture de Londres, baisse (animé) ;
//  - TurtleSoupDiagram : plus haut de la veille 1.0900, mèche 1.0910, clôture 1.0895 (animé) ;
//  - OpeningGapDiagram : clôture 27 000, ouverture 27 050, milieu 27 025 ;
//  - ICTCombinedDiagram : sweep 1.0910, cassure locale, FVG 1.0880 – 1.0890, vente 1.0883 / 1.0913 / 1.0823 (animé).

import { LessonChart, type LCPanel } from "@/app/components/lessons/LessonChart";
import { pts, tradeSetup, usd } from "@/app/components/lessons/trade";
import { fmtPrice, type Candle } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const C = CANDLES as unknown as Record<string, Candle[]>;
const p = (x: number) => fmtPrice(x, 4);

export function InducementDiagram() {
  const cs = C["ict-inducement"];
  const BRK = 22, REACT = 23;
  return (
    <LessonChart
      id="InducementDiagram"
      title="L'inducement sur l'or"
      caption="En tendance haussière, beaucoup achètent sur le support intermédiaire 3 910 $, stop juste en dessous. Le prix passe sous 3 910 $, déclenche ces stops, puis rejoint le support majeur 3 890 – 3 900 $, où il réagit. Le petit support a servi d'inducement."
      panels={[{
        key: "m15", title: "XAU/USD M15 · deux supports", decimals: 0, height: 290, candles: cs, slots: cs.length + 2,
        zones: [{ key: "majeur", y1: 3890, y2: 3900, from: 2, label: `Support majeur ${usd(3890)} – ${usd(3900)}`, short: "Support majeur", tone: "bull", role: "support" }],
        levels: [{ key: "inter", price: 3910, from: 12, to: BRK, label: `Support intermédiaire ${usd(3910)}`, short: "Inducement", tone: "zone", dashed: true, role: "support" }],
        markers: [
          { key: "stops", i: BRK, price: cs[BRK].l, label: `Stops sous ${usd(3910)} déclenchés`, short: "Stops", tone: "bear", side: "below", role: "low" },
          { key: "react", i: REACT, price: cs[REACT].l, label: "Réaction sur le support majeur", short: "Réaction", tone: "bull", side: "below", role: "low" },
        ],
        anim: [{ candles: 19 }, { show: ["majeur", "inter"] }, { candles: BRK }, { show: "stops" }, { candles: REACT }, { show: "react" }, { candles: cs.length - 1 }],
      }]}
    />
  );
}

export function SMTDiagram() {
  const panel = (key: string, title: string, cs: Candle[], up: boolean): LCPanel => ({
    key, title, decimals: 5, height: 210, candles: cs, slots: cs.length + 2,
    segments: [{ key: `${key}-lien`, i1: 3, p1: cs[3].h, i2: 10, p2: cs[10].h, tone: up ? "bull" : "bear", dashed: true }],
    markers: [
      { key: `${key}-s1`, i: 3, price: cs[3].h, label: `Sommet ${p(cs[3].h)}`, short: "Sommet", tone: "neutral", side: "above", role: "swing-high" },
      { key: `${key}-s2`, i: 10, price: cs[10].h, label: `${up ? "Higher high" : "Lower high"} ${p(cs[10].h)}`, short: up ? "Higher high" : "Lower high", tone: up ? "bull" : "bear", side: "above", role: "swing-high" },
    ],
  });
  return (
    <LessonChart
      id="SMTDiagram"
      title="Divergence SMT entre EUR/USD et GBP/USD"
      caption="Sur la même période, l'EUR/USD dépasse son sommet précédent, le GBP/USD reste sous le sien. Les deux structures ne se confirment pas : la hausse montre peut-être une faiblesse. C'est un contexte, pas un signal d'entrée."
      rows={[2]}
      panels={[panel("eu", "EUR/USD H1", C["ict-smt-eu"], true), panel("gu", "GBP/USD H1", C["ict-smt-gu"], false)]}
    />
  );
}

export function JudasSwingDiagram() {
  const cs = C["ict-judas"];
  const END = 12, SW = 13;
  return (
    <LessonChart
      id="JudasSwingDiagram"
      title="Judas swing sur GBP/USD"
      caption="Pendant la session asiatique, le prix reste entre 1.3320 et 1.3345. À l'ouverture de Londres, il dépasse brièvement le sommet du range puis clôture de nouveau à l'intérieur, avant une baisse plus large. Ce premier mouvement inversé n'apparaît pas tous les jours."
      panels={[{
        key: "m15", title: "GBP/USD M15 · Asie puis Londres", decimals: 5, height: 260, candles: cs, slots: cs.length + 2,
        zones: [{ key: "asie", y1: 1.332, y2: 1.3345, from: 0, to: END, label: `Range asiatique ${p(1.332)} – ${p(1.3345)}`, short: "Range Asie", tone: "zone", role: "range" }],
        markers: [{ key: "judas", i: SW, price: cs[SW].h, label: "Ouverture de Londres : sweep du sommet", short: "Judas swing", tone: "bear", side: "above", role: "sweep", ref: 1.3345, dir: "bear" }],
        anim: [{ candles: END }, { show: "asie" }, { candles: SW }, { show: "judas" }, { candles: cs.length - 1 }],
      }]}
    />
  );
}

export function TurtleSoupDiagram() {
  const cs = C["ict-turtle"];
  const PDH = 3, TS = 10;
  return (
    <LessonChart
      id="TurtleSoupDiagram"
      title="Turtle soup sur EUR/USD"
      caption="Le plus haut de la veille est à 1.0900. Le prix monte à 1.0910, puis la bougie clôture de nouveau sous 1.0900 : fausse sortie. Le trader attend ensuite une confirmation baissière, avec une invalidation au-dessus de la mèche."
      panels={[{
        key: "h1", title: "EUR/USD H1 · plus haut de la veille", decimals: 5, height: 250, candles: cs, slots: cs.length + 2,
        levels: [{ key: "pdh", price: cs[PDH].h, from: PDH, label: `Plus haut de la veille ${p(cs[PDH].h)}`, short: "Plus haut veille", tone: "neutral", dashed: true }],
        markers: [{ key: "ts", i: TS, price: cs[TS].h, label: `Mèche ${p(cs[TS].h)}, clôture ${p(cs[TS].c)}`, short: "Turtle soup", tone: "bear", side: "above", role: "sweep", ref: cs[PDH].h, dir: "bear" }],
        anim: [{ candles: PDH + 2 }, { show: "pdh" }, { candles: TS }, { show: "ts" }, { candles: cs.length - 1 }],
      }]}
    />
  );
}

export function OpeningGapDiagram() {
  const cs = C["ict-gap"];
  const REF = 6, OPEN = 7;
  return (
    <LessonChart
      id="OpeningGapDiagram"
      title="Un gap d'ouverture sur le NASDAQ"
      caption="La séance de référence clôture à 27 000 points, la suivante ouvre à 27 050 : la zone 27 000 – 27 050 forme le gap. Ses limites et son milieu (27 025) servent de repères ; ici, le prix revient vers le milieu, mais un gap n'est pas forcément comblé."
      panels={[{
        key: "h1", title: "NASDAQ H1 · clôture puis réouverture", decimals: 0, height: 240, candles: cs, slots: cs.length + 2, gaps: [OPEN],
        zones: [{ key: "gap", y1: cs[REF].c, y2: cs[OPEN].o, from: REF, label: `Gap ${pts(cs[REF].c)} – ${pts(cs[OPEN].o)}`, short: "Gap", tone: "fib" }],
        levels: [{ key: "mid", price: (cs[REF].c + cs[OPEN].o) / 2, from: REF, label: `Milieu ${pts((cs[REF].c + cs[OPEN].o) / 2)}`, short: "Milieu", tone: "zone", dashed: true, role: "ce", ref: "gap" }],
        markers: [
          { key: "ref", i: REF, price: cs[REF].c, label: `Clôture de référence ${pts(cs[REF].c)}`, short: "Clôture", tone: "neutral", side: "below", role: "close" },
          { key: "open", i: OPEN, price: cs[OPEN].o, label: `Ouverture ${pts(cs[OPEN].o)}`, short: "Ouverture", tone: "neutral", side: "above" },
        ],
      }]}
    />
  );
}

export function ICTCombinedDiagram() {
  const cs = C["ict-combined"];
  const SW = 24, LOC = 22, F = 26, E = 30;
  const y1 = cs[F + 1].h, y2 = cs[F - 1].l;
  const t = tradeSetup({ entry: 1.0883, sl: 1.0913, tp: 1.0823, decimals: 4, from: E, expect: ">=2", names: { entry: "Vente" } });
  return (
    <LessonChart
      id="ICTCombinedDiagram"
      title="Exemple combiné : sweep, FVG et plan de vente"
      caption="Range H1 de 1.0800 à 1.0900. Le prix monte à 1.0910 pendant que le GBP/USD ne dépasse pas son sommet (divergence SMT), réintègre le range, casse le creux local et laisse un FVG baissier 1.0880 – 1.0890 (CE 1.0885). Au retour dans le FVG, une confirmation baissière donne la vente à 1.0883, stop 1.0913, objectif 1.0823 avant le bas du range."
      panels={[{
        key: "h1", title: "EUR/USD H1 · plan combiné", decimals: 5, height: 300, candles: cs, slots: cs.length + 4,
        zones: [{ key: "fvg", y1, y2, from: F - 1, label: `FVG ${p(y1)} – ${p(y2)} (CE ${p((y1 + y2) / 2)})`, short: "FVG", tone: "fib", role: "fvg" }],
        levels: [{ key: "bas", price: 1.08, from: 10, label: `Bas du range ${p(1.08)}`, short: "Bas du range", tone: "bull", dashed: true, role: "range-low" }, ...t.levels],
        markers: [
          { key: "sweep", i: SW, price: cs[SW].h, label: `Sweep ${p(cs[SW].h)}`, short: "Sweep", tone: "bear", side: "above", role: "sweep", ref: 1.09, dir: "bear" },
          { key: "bos", i: F, price: cs[F].c, label: "Creux local cassé", short: "BOS", tone: "bear", side: "below", role: "bos", ref: LOC, dir: "bear" },
          { key: "conf", i: E, price: cs[E].c, label: "Confirmation baissière", short: "Confirmation", tone: "bear", side: "above", role: "close" },
        ],
        chips: [...t.chips, { label: "GBP/USD : pas de nouveau sommet (SMT)", tone: "neutral" }],
        anim: [{ candles: 20 }, { show: "bas" }, { candles: SW }, { show: "sweep" }, { candles: F + 1 }, { show: ["bos", "fvg"] }, { candles: E }, { show: ["conf", "entry", "sl", "tp"] }],
      }]}
    />
  );
}
