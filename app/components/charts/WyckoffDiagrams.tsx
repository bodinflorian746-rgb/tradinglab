// Trading Avancé 13 — La méthode Wyckoff. Bougies : lib/lessons/scenarios-nouvelles.ts (NASDAQ décalé de
// +7 000 points) ; la distribution type est l'accumulation type renversée.
//  - WyckoffCycleDiagram : accumulation, markup, distribution, markdown (courbe, animé) ;
//  - WyckoffAccumulationDiagram : PS, SC, AR, ST, Spring, SOS, LPS et phases A à E (animé) ;
//  - WyckoffDistributionDiagram : PSY, BC, AR, ST, UTAD, SOW, LPSY (animé) ;
//  - WyckoffNasdaqDiagram : l'exemple du NASDAQ, Spring 26 960 puis SOS et LPS 27 070 (animé).

import { LessonChart, type LCMarker, type LCPanel } from "@/app/components/lessons/LessonChart";
import { pts } from "@/app/components/lessons/trade";
import type { Candle } from "@/lib/lessons/chart-analysis";
import { WYCKOFF_CYCLE } from "@/lib/lessons/nouvelles-meta";
import CANDLES from "@/lib/lessons/generated/candles.json";

const C = CANDLES as unknown as Record<string, Candle[]>;
/** Repères de l'accumulation type (et de la distribution, renversée) */
const W = { ps: 3, sc: 7, ar: 10, st: 13, spring: 23, sos: 26, lps: 29 } as const;
const MIRROR = 2 * 1.0875;
const phases = [
  { label: "Phase A : arrêt de la tendance", tone: "neutral" as const },
  { label: "B : construction du range", tone: "neutral" as const },
  { label: "C : test", tone: "zone" as const },
  { label: "D : signes de force ou de faiblesse", tone: "zone" as const },
  { label: "E : sortie du range", tone: "neutral" as const },
];

export function WyckoffCycleDiagram() {
  const v = WYCKOFF_CYCLE;
  return (
    <LessonChart
      id="WyckoffCycleDiagram"
      title="Les quatre étapes d'un cycle"
      caption="Après une baisse, le marché construit un range d'accumulation, puis développe une tendance haussière (markup). Après la hausse, un range de distribution, puis une tendance baissière (markdown). Un modèle de lecture, pas un cycle obligatoire."
      panels={[{
        key: "cycle", title: "Schéma du cycle", decimals: 4, height: 240, line: v,
        zones: [
          { key: "acc", y1: 1.0805, y2: 1.085, from: 8, to: 17, label: "Accumulation", short: "Accumulation", tone: "bull" },
          { key: "dist", y1: 1.1, y2: 1.105, from: 26, to: 35, label: "Distribution", short: "Distribution", tone: "bear" },
        ],
        segments: [
          { key: "up", i1: 17, p1: v[17], i2: 25, p2: v[25], tone: "bull", arrow: true, label: "Markup", short: "Markup" },
          { key: "down", i1: 35, p1: v[35], i2: 43, p2: v[43], tone: "bear", arrow: true, label: "Markdown", short: "Markdown" },
        ],
        anim: [{ candles: 7 }, { candles: 17 }, { show: "acc" }, { candles: 25 }, { show: "up" }, { candles: 35 }, { show: "dist" }, { candles: 43 }, { show: "down" }],
      }]}
    />
  );
}

/** Accumulation (sens haussier) ou distribution (renversée) : mêmes indices, rôles inversés */
function schema(bull: boolean): LCPanel {
  const cs = C[bull ? "wy-acc" : "wy-dist"];
  const f = (x: number) => (bull ? x : Number((MIRROR - x).toFixed(5)));
  const low = bull ? "low" as const : "high" as const, swingLow = bull ? "swing-low" as const : "swing-high" as const, swingHigh = bull ? "swing-high" as const : "swing-low" as const;
  const at = (i: number, kind: "low" | "high") => (kind === "low" ? cs[i].l : cs[i].h);
  const m = (key: string, i: number, label: string, role: LCMarker["role"], side: "low" | "high", tone: LCMarker["tone"], extra: Partial<LCMarker> = {}): LCMarker =>
    ({ key, i, price: at(i, side), label, short: label, tone, side: side === "low" ? "below" : "above", role, ...extra });
  const ext = bull ? ["low", "high"] as const : ["high", "low"] as const;
  return {
    key: bull ? "acc" : "dist", title: bull ? "Accumulation type · EUR/USD H4" : "Distribution type · EUR/USD H4", decimals: 5, height: 300, candles: cs, slots: cs.length + 2,
    zones: [
      { key: "bas", y1: Math.min(f(1.08), f(1.0812)), y2: Math.max(f(1.08), f(1.0812)), from: W.sc, label: bull ? "Support du range" : "Résistance du range", short: bull ? "Support" : "Résistance", tone: bull ? "bull" : "bear", role: bull ? "support" : "resistance" },
      { key: "haut", y1: Math.min(f(1.0876), f(1.088)), y2: Math.max(f(1.0876), f(1.088)), from: W.ar, to: W.sos - 1, label: bull ? "Résistance du range" : "Support du range", short: bull ? "Résistance" : "Support", tone: bull ? "bear" : "bull", role: bull ? "resistance" : "support" },
    ],
    markers: [
      m("ps", W.ps, bull ? "PS" : "PSY", low, ext[0], "neutral"),
      m("sc", W.sc, bull ? "SC" : "BC", swingLow, ext[0], bull ? "bear" : "bull"),
      m("ar", W.ar, "AR", swingHigh, ext[1], "neutral"),
      m("st", W.st, "ST", swingLow, ext[0], "neutral"),
      m("spring", W.spring, bull ? "Spring" : "UTAD", "sweep", ext[0], "zone", { ref: f(1.08), dir: bull ? "bull" : "bear" }),
      { key: "sos", i: W.sos, price: cs[W.sos].c, label: bull ? "SOS" : "SOW", short: bull ? "SOS" : "SOW", tone: bull ? "bull" : "bear", side: bull ? "above" : "below", role: "bos", ref: W.ar, dir: bull ? "bull" : "bear" },
      m("lps", W.lps, bull ? "LPS" : "LPSY", swingLow, ext[0], bull ? "bull" : "bear"),
    ],
    chips: phases,
    anim: [{ candles: W.ps }, { show: "ps" }, { candles: W.sc + 2 }, { show: ["sc", "bas"] }, { candles: W.ar + 2 }, { show: ["ar", "haut"] }, { candles: W.st + 2 }, { show: "st" },
      { candles: W.spring }, { show: "spring" }, { candles: W.sos }, { show: "sos" }, { candles: W.lps + 2 }, { show: "lps" }, { candles: cs.length - 1 }],
  };
}

export function WyckoffAccumulationDiagram() {
  return (
    <LessonChart
      id="WyckoffAccumulationDiagram"
      title="Les événements d'une accumulation"
      caption="Phase A : PS, puis SC (ventes intenses), AR (rebond) et ST (nouveau test) dessinent le range. Phase B : le prix oscille entre les bornes. Phase C : le Spring passe sous le support et revient. Phase D : le SOS casse le sommet de l'AR, le LPS teste le support. Phase E : le prix quitte le range."
      panels={[schema(true)]}
    />
  );
}

export function WyckoffDistributionDiagram() {
  return (
    <LessonChart
      id="WyckoffDistributionDiagram"
      title="Les événements d'une distribution"
      caption="Le modèle inverse : PSY, puis BC (achats intenses), AR (réaction) et ST dessinent le range. L'UTAD dépasse la résistance et revient, le SOW casse le creux de l'AR, le LPSY est un rebond faible avant la sortie par le bas."
      panels={[schema(false)]}
    />
  );
}

/** Repères de l'exemple du NASDAQ */
const N = { sc: 8, ar: 12, st: 16, spring: 25, local: 28, sos: 32, lps: 35 } as const;

export function WyckoffNasdaqDiagram() {
  const cs = C["wy-nq"];
  return (
    <LessonChart
      id="WyckoffNasdaqDiagram"
      title="Une accumulation possible sur le NASDAQ"
      caption="Chute de 27 300 à 27 000, creux à 26 980, rebond vers 27 180, retour vers 27 020. Le prix passe brièvement à 26 960 puis réintègre 27 000 : Spring potentiel. Il dépasse ensuite le sommet local 27 100 (SOS) et corrige vers 27 070, un higher low, sans revenir sous le bas du range (LPS)."
      panels={[{
        key: "h1", title: "NASDAQ H1 · range après la baisse", decimals: 0, height: 340, candles: cs, slots: cs.length + 2,
        zones: [
          { key: "bas", y1: 26980, y2: 27020, from: N.sc, label: `Support du range ${pts(26980)} – ${pts(27020)}`, short: "Support", tone: "bull", role: "support" },
          { key: "haut", y1: 27170, y2: 27180, from: N.ar, label: `Résistance du range ${pts(27170)} – ${pts(27180)}`, short: "Résistance", tone: "bear", role: "resistance" },
        ],
        // sommet local en ligne de niveau (étiquette dans la colonne) : la place au-dessus des bougies reste au SOS
        levels: [{ key: "local", price: cs[N.local].h, from: N.local, to: N.sos, label: `Sommet local ${pts(cs[N.local].h)}`, short: "Sommet local", tone: "neutral", dashed: true }],
        markers: [
          { key: "sc", i: N.sc, price: cs[N.sc].l, label: `Creux ${pts(cs[N.sc].l)}`, short: "SC", tone: "bear", side: "below", role: "swing-low" },
          { key: "ar", i: N.ar, price: cs[N.ar].h, label: `Rebond ${pts(cs[N.ar].h)}`, short: "AR", tone: "neutral", side: "above", role: "swing-high" },
          { key: "st", i: N.st, price: cs[N.st].l, label: `Retour ${pts(cs[N.st].l)}`, short: "ST", tone: "neutral", side: "below", role: "swing-low" },
          { key: "spring", i: N.spring, price: cs[N.spring].l, label: `Spring ${pts(cs[N.spring].l)}`, short: "Spring", tone: "zone", side: "below", role: "sweep", ref: 26980, dir: "bull" },
          { key: "sos", i: N.sos, price: cs[N.sos].c, label: `SOS : clôture au-dessus de ${pts(cs[N.local].h)}`, short: "SOS", tone: "bull", side: "above", role: "bos", ref: N.local, dir: "bull" },
          { key: "lps", i: N.lps, price: cs[N.lps].l, label: `LPS ${pts(cs[N.lps].l)}`, short: "LPS", tone: "bull", side: "below", role: "swing-low" },
        ],
        anim: [{ candles: N.sc + 2 }, { show: ["sc", "bas"] }, { candles: N.ar + 2 }, { show: ["ar", "haut"] }, { candles: N.st + 2 }, { show: "st" }, { candles: N.spring }, { show: "spring" },
          { candles: N.local + 2 }, { show: "local" }, { candles: N.sos }, { show: "sos" }, { candles: N.lps + 2 }, { show: "lps" }, { candles: cs.length - 1 }],
      }]}
    />
  );
}

