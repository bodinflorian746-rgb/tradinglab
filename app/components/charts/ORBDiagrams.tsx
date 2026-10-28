// Stratégie Opening Range Breakout (NASDAQ M5, séance de New York). Bougies : lib/lessons/scenarios-nouvelles.ts
// (niveaux du texte décalés de +7 000 points) : une séance suivie d'une leçon à l'autre (« orb-main »), et
// trois séances de contre-exemples.
//  - leçon 1 : ORBRangeDiagram (le range des 15 premières minutes, animé) ;
//  - leçon 2 : ORBBearishBreakDiagram, ORBH1TrendDiagram (structure H1, résistance 27 250),
//    ORBBreakoutRetestDiagram (mèche, clôture, retest, sommet cassé, animé) ;
//  - leçon 3 : ORBPlanDiagram (entrée 27 172, stop 27 140, objectif 27 236 avant la résistance H1) ;
//  - leçon 4 : ORBNoRetestDiagram (trade refusé), ORBFakeBreakoutDiagram (scénario abandonné).

import { LessonChart, type LCLevel, type LCPanel } from "@/app/components/lessons/LessonChart";
import { pts, tradeSetup } from "@/app/components/lessons/trade";
import type { Candle } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const C = CANDLES as unknown as Record<string, Candle[]>;
const HIGH = 27150, LOW = 27080;
/** Bornes de l'Opening Range, fixées à la fin de la 3e bougie M5 (9 h 45) */
const OR_LEVELS: LCLevel[] = [
  { key: "orH", price: HIGH, from: 0, label: `Haut du range ${pts(HIGH)}`, short: "Haut", tone: "zone", dashed: true },
  { key: "orL", price: LOW, from: 0, label: `Bas du range ${pts(LOW)}`, short: "Bas", tone: "zone", dashed: true },
];
const OR_CHIP = { label: "9 h 30 – 9 h 45 à New York = 15 h 30 – 15 h 45 à Paris", tone: "neutral" as const };
/** Repères de la séance suivie : mèche 4, clôture au-dessus 7 (plus haut 27 170), creux du retest 9, entrée 11 */
const S = { wick: 4, brk: 7, retest: 9, entry: 11 } as const;
const panelOf = (key: string, title: string, cs: Candle[], extra: Partial<LCPanel>): LCPanel =>
  ({ key, title, decimals: 0, height: 260, candles: cs, slots: Math.max(cs.length + 3, 14), levels: OR_LEVELS, ...extra });

export function ORBRangeDiagram() {
  const cs = C["orb-main"].slice(0, 7);
  return (
    <LessonChart
      id="ORBRangeDiagram"
      title="L'Opening Range des 15 premières minutes"
      caption="Trois bougies M5 entre 9 h 30 et 9 h 45 (New York) : plus haut 27 150, plus bas 27 080. L'Opening Range mesure 70 points ; ses deux bornes sont fixées pour la séance."
      panels={[panelOf("m5", "NASDAQ M5 · ouverture américaine", cs, {
        markers: [
          { key: "h", i: 0, price: cs[0].h, label: `Plus haut ${pts(cs[0].h)}`, short: "Plus haut", tone: "neutral", side: "above", role: "high" },
          { key: "l", i: 1, price: cs[1].l, label: `Plus bas ${pts(cs[1].l)}`, short: "Plus bas", tone: "neutral", side: "below", role: "low" },
        ],
        chips: [OR_CHIP, { label: `Largeur ${pts(HIGH - LOW)} points`, tone: "zone" }],
        anim: [{ candles: 2 }, { show: ["h", "l"] }, { show: ["orH", "orL"] }, { candles: cs.length - 1 }],
      })]}
    />
  );
}

export function ORBBearishBreakDiagram() {
  const cs = C["orb-bear"];
  return (
    <LessonChart
      id="ORBBearishBreakDiagram"
      title="Breakout baissier : une clôture sous le range"
      caption="Même Opening Range, 27 080 – 27 150. Une bougie M5 clôture à 27 065, sous le bas du range : première confirmation de sortie baissière, à vérifier avec le contexte H1."
      panels={[panelOf("m5", "NASDAQ M5 · sortie par le bas", cs, {
        markers: [{ key: "out", i: 5, price: cs[5].c, label: `Clôture ${pts(cs[5].c)} sous le range`, short: "Clôture", tone: "bear", side: "below", role: "close" }],
      })]}
    />
  );
}

export function ORBH1TrendDiagram() {
  const cs = C["orb-h1"];
  return (
    <LessonChart
      id="ORBH1TrendDiagram"
      title="Le filtre H1 : structure haussière"
      caption="En H1, les creux montent (26 900, 27 020, 27 060) : la structure est haussière, on privilégie les breakouts haussiers de l'Opening Range. La résistance H1 à 27 250, rejetée deux fois, limitera l'objectif."
      panels={[{
        key: "h1", title: "NASDAQ H1 · contexte", decimals: 0, height: 260, candles: cs, slots: cs.length + 2,
        levels: [{ key: "res", price: 27250, from: 14, label: `Résistance H1 ${pts(27250)}`, short: "Résistance", tone: "bear", dashed: true, role: "resistance" }],
        markers: [
          { key: "c1", i: 2, price: cs[2].l, label: `Creux ${pts(cs[2].l)}`, short: "Creux", tone: "neutral", side: "below", role: "swing-low" },
          { key: "c2", i: 10, price: cs[10].l, label: `Higher low ${pts(cs[10].l)}`, short: "Higher low", tone: "bull", side: "below", role: "swing-low" },
          { key: "c3", i: 18, price: cs[18].l, label: `Higher low ${pts(cs[18].l)}`, short: "Higher low", tone: "bull", side: "below", role: "swing-low" },
        ],
      }]}
    />
  );
}

const retestMarkers = (cs: Candle[]) => [
  { key: "wick", i: S.wick, price: cs[S.wick].h, label: `Mèche ${pts(cs[S.wick].h)}, clôture dans le range`, short: "Mèche", tone: "neutral" as const, side: "above" as const, role: "high" as const },
  { key: "brk", i: S.brk, price: cs[S.brk].c, label: `Clôture ${pts(cs[S.brk].c)} au-dessus du range`, short: "Clôture", tone: "bull" as const, side: "above" as const, role: "close" as const },
  { key: "retest", i: S.retest, price: cs[S.retest].l, label: `Retest : creux ${pts(cs[S.retest].l)}`, short: "Retest", tone: "entry" as const, side: "below" as const, role: "swing-low" as const },
];

export function ORBBreakoutRetestDiagram() {
  const cs = C["orb-main"];
  return (
    <LessonChart
      id="ORBBreakoutRetestDiagram"
      title="Mèche, clôture, retest : le setup ORB"
      caption="Une première mèche à 27 155 revient dans le range : pas de breakout. Une bougie clôture ensuite à 27 165, le prix revient tester 27 150 (creux 27 145), puis casse le sommet M5 à 27 170 : setup de continuation."
      panels={[panelOf("m5", "NASDAQ M5 · breakout et retest", cs, {
        markers: [...retestMarkers(cs), { key: "go", i: S.entry, price: cs[S.entry].c, label: `Sommet ${pts(cs[S.brk].h)} cassé`, short: "Reprise", tone: "bull", side: "above", role: "bos", ref: S.brk, dir: "bull" }],
        anim: [{ candles: 2 }, { show: ["orH", "orL"] }, { candles: S.wick }, { show: "wick" }, { candles: S.brk }, { show: "brk" }, { candles: S.retest + 1 }, { show: "retest" }, { candles: S.entry }, { show: "go" }],
      })]}
    />
  );
}

export function ORBPlanDiagram() {
  const cs = C["orb-main"];
  const t = tradeSetup({ entry: 27172, sl: 27140, tp: 27236, unit: "pts", from: S.entry, expect: ">=2" });
  return (
    <LessonChart
      id="ORBPlanDiagram"
      title="Le plan ORB complet"
      caption="Entrée à 27 172 sur la reprise après le retest, stop à 27 140 sous le creux du retest (27 145), objectif à 27 236, avant la résistance H1 à 27 250 : 32 points de risque pour 64 points de gain."
      panels={[panelOf("m5", "NASDAQ M5 · entrée, stop et objectif", cs, {
        slots: cs.length + 5,
        levels: [...OR_LEVELS, ...t.levels],
        markers: [retestMarkers(cs)[2]],
        chips: [...t.chips, { label: `Résistance H1 ${pts(27250)}, ${pts(27250 - 27236)} points au-dessus de l'objectif`, tone: "bear" }],
      })]}
    />
  );
}

export function ORBNoRetestDiagram() {
  const cs = C["orb-no-retest"];
  const L = cs.length - 1;
  return (
    <LessonChart
      id="ORBNoRetestDiagram"
      title="Trade refusé : pas de retest"
      caption="Le prix casse 27 150 et file jusqu'à 27 260 sans jamais revenir tester le range. Notre version exige un retest confirmé : pas de trade, même si la hausse continue."
      panels={[panelOf("m5", "NASDAQ M5 · breakout sans retour", cs, {
        markers: [
          { key: "brk", i: 4, price: cs[4].c, label: "Clôture au-dessus du range", short: "Clôture", tone: "bull", side: "below", role: "close" },
          { key: "run", i: L, price: cs[L].h, label: `${pts(cs[L].h)} sans retest : pas de trade`, short: "Pas de trade", tone: "neutral", side: "above", role: "high" },
        ],
      })]}
    />
  );
}

export function ORBFakeBreakoutDiagram() {
  const cs = C["orb-fake"];
  return (
    <LessonChart
      id="ORBFakeBreakoutDiagram"
      title="Faux breakout : le scénario est abandonné"
      caption="Le prix clôture à 27 160 au-dessus du range, revient sur 27 150 sans tenir la zone, puis une bougie clôture à 27 120, de retour dans le range. Le setup d'achat n'est pas confirmé : on l'abandonne, sans le transformer en vente."
      panels={[panelOf("m5", "NASDAQ M5 · retour dans le range", cs, {
        markers: [
          { key: "brk", i: 4, price: cs[4].c, label: `Clôture ${pts(cs[4].c)}`, short: "Clôture", tone: "bull", side: "above", role: "close" },
          { key: "back", i: 6, price: cs[6].c, label: `Clôture ${pts(cs[6].c)} : retour dans le range`, short: "Retour", tone: "bear", side: "below", role: "close" },
        ],
      })]}
    />
  );
}
