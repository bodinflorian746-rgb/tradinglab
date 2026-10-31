// Stratégie Wyckoff appliqué. Bougies : lib/lessons/scenarios-nouvelles.ts. Or : un même range suivi d'une
// leçon à l'autre (H1 « wa-gold », M15 « wa-m15 ») ; NASDAQ (décalé de +7 000 points) : la distribution.
//  - leçon 1 : WARangeDiagram (baisse, SC, AR, ST, bornes du range) ;
//  - leçon 2 : WASpringSequenceDiagram (Spring, SOS, LPS, animé), WADistributionDiagram (UTAD, SOW, LPSY,
//    animé), WAConfirmationDiagram (sommet local du LPS cassé en M15, animé) ;
//  - leçon 3 : WAGoldPlanDiagram (3 914 / 3 902 / 3 938, objectif avant la résistance du range),
//    WARefusedDiagram (entrée tardive 3 922 $, R/R 1:0,8), WANasdaqPlanDiagram (27 205 / 27 245 / 27 125),
//    WAFailedSpringDiagram (pas de réintégration : pas d'achat).

import { LessonChart, type LCMarker, type LCZone } from "@/app/components/lessons/LessonChart";
import { pts, tradeSetup, usd } from "@/app/components/lessons/trade";
import type { Candle } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const C = CANDLES as unknown as Record<string, Candle[]>;
/** Repères de l'or H1 : SC 6, AR 10, ST 14, fin du range 18, Spring 21, sommet local 24, SOS 28, LPS 31 */
const G = { sc: 6, ar: 10, st: 14, end: 18, spring: 21, local: 24, sos: 28, lps: 31 } as const;
/** Repères de l'or M15 : LPS 4, sommet local 6, entrée 9, sommet 11, entrée tardive 14 */
const M = { lps: 4, high: 6, entry: 9, high2: 11, late: 14 } as const;
/** Repères du NASDAQ H1 : BC 6, AR 10, support local 22, UTAD 26, SOW 29, LPSY 33, entrée 34 */
const D = { bc: 6, ar: 10, local: 22, utad: 26, sow: 29, lpsy: 33, entry: 34 } as const;

const goldZones = (to?: number): LCZone[] => [
  { key: "sup", y1: 3880, y2: 3900, from: G.sc, to, label: `Support ${usd(3880)} – ${usd(3900)}`, short: "Support", tone: "bull", role: "support" },
  { key: "res", y1: 3940, y2: 3960, from: G.ar, label: `Résistance ${usd(3940)} – ${usd(3960)}`, short: "Résistance", tone: "bear", role: "resistance" },
];
const resChip = { label: `Résistance du range ${usd(3940)} – ${usd(3960)} (H1)`, tone: "bear" as const };

export function WARangeDiagram() {
  const cs = C["wa-gold"].slice(0, G.end + 1);
  return (
    <LessonChart
      id="WARangeDiagram"
      title="Or H1 : le range après la baisse"
      caption="L'or baisse jusqu'à 3 880 $, rebondit à 3 960 $, revient vers 3 890 $ puis remonte à 3 940 $. Support 3 880 – 3 900 $ et résistance 3 940 – 3 960 $, chacun touché deux fois : la zone de travail."
      panels={[{
        key: "h1", title: "XAU/USD H1 · zone de travail", decimals: 0, height: 270, candles: cs, slots: cs.length + 3,
        zones: goldZones(),
        markers: [
          { key: "sc", i: G.sc, price: cs[G.sc].l, label: `SC ${usd(cs[G.sc].l)}`, short: "SC", tone: "bear", side: "below", role: "swing-low" },
          { key: "ar", i: G.ar, price: cs[G.ar].h, label: `AR ${usd(cs[G.ar].h)}`, short: "AR", tone: "neutral", side: "above", role: "swing-high" },
          { key: "st", i: G.st, price: cs[G.st].l, label: `ST ${usd(cs[G.st].l)}`, short: "ST", tone: "neutral", side: "below", role: "swing-low" },
        ],
      }]}
    />
  );
}

export function WASpringSequenceDiagram() {
  const cs = C["wa-gold"];
  const marks: LCMarker[] = [
    { key: "spring", i: G.spring, price: cs[G.spring].l, label: `Spring ${usd(cs[G.spring].l)}`, short: "Spring", tone: "zone", side: "below", role: "sweep", ref: 3880, dir: "bull" },
    { key: "local", i: G.local, price: cs[G.local].h, label: `Sommet local ${usd(cs[G.local].h)}`, short: "Sommet", tone: "neutral", side: "above", role: "swing-high" },
    { key: "sos", i: G.sos, price: cs[G.sos].c, label: "SOS", short: "SOS", tone: "bull", side: "above", role: "bos", ref: G.local, dir: "bull" },
    { key: "lps", i: G.lps, price: cs[G.lps].l, label: `LPS ${usd(cs[G.lps].l)}`, short: "LPS", tone: "bull", side: "below", role: "swing-low" },
  ];
  return (
    <LessonChart
      id="WASpringSequenceDiagram"
      title="Spring, signe de force, puis LPS"
      caption="Le prix passe brièvement sous le support jusqu'à 3 865 $ et réintègre le range : Spring potentiel. Il dépasse ensuite le sommet local 3 925 $ (SOS), puis corrige vers 3 905 $ sans repasser sous le Spring : un higher low, le LPS potentiel."
      panels={[{
        key: "h1", title: "XAU/USD H1 · la transition", decimals: 0, height: 290, candles: cs, slots: cs.length + 2,
        zones: goldZones(), markers: marks,
        anim: [{ candles: G.end }, { show: ["sup", "res"] }, { candles: G.spring }, { show: "spring" }, { candles: G.local + 2 }, { show: "local" }, { candles: G.sos }, { show: "sos" }, { candles: G.lps + 2 }, { show: "lps" }],
      }]}
    />
  );
}

const nqZones: LCZone[] = [
  { key: "res", y1: 27296, y2: 27300, from: D.bc, label: `Résistance ${pts(27300)}`, short: "Résistance", tone: "bear", role: "resistance" },
  { key: "sup", y1: 27100, y2: 27104, from: D.ar, label: `Support ${pts(27100)}`, short: "Support", tone: "bull", role: "support" },
];
const nqMarkers = (cs: Candle[]): LCMarker[] => [
  { key: "utad", i: D.utad, price: cs[D.utad].h, label: `UTAD ${pts(cs[D.utad].h)}`, short: "UTAD", tone: "zone", side: "above", role: "sweep", ref: 27300, dir: "bear" },
  { key: "local", i: D.local, price: cs[D.local].l, label: `Support local ${pts(cs[D.local].l)}`, short: "Support local", tone: "neutral", side: "below", role: "swing-low" },
  { key: "sow", i: D.sow, price: cs[D.sow].c, label: "SOW", short: "SOW", tone: "bear", side: "below", role: "bos", ref: D.local, dir: "bear" },
  { key: "lpsy", i: D.lpsy, price: cs[D.lpsy].h, label: `LPSY ${pts(cs[D.lpsy].h)}`, short: "LPSY", tone: "bear", side: "above", role: "high" },
];

export function WADistributionDiagram() {
  const cs = C["wa-nq"].slice(0, D.entry + 1);
  return (
    <LessonChart
      id="WADistributionDiagram"
      title="UTAD, signe de faiblesse, puis LPSY"
      caption="Après une hausse, range entre 27 100 et 27 300. Le prix dépasse brièvement 27 300 jusqu'à 27 340 et revient : UTAD potentiel. Il casse ensuite le support local 27 180 (SOW), puis rebondit vers 27 230 sans retrouver ses sommets : LPSY potentiel."
      panels={[{
        key: "h1", title: "NASDAQ H1 · la distribution", decimals: 0, height: 290, candles: cs, slots: cs.length + 2,
        zones: nqZones, markers: nqMarkers(cs),
        anim: [{ candles: 20 }, { show: ["res", "sup"] }, { candles: D.local + 2 }, { show: "local" }, { candles: D.utad }, { show: "utad" }, { candles: D.sow }, { show: "sow" }, { candles: D.entry }, { show: "lpsy" }],
      }]}
    />
  );
}

const m15Markers = (cs: Candle[]): LCMarker[] => [
  { key: "lps", i: M.lps, price: cs[M.lps].l, label: `LPS ${usd(cs[M.lps].l)}`, short: "LPS", tone: "bull", side: "below", role: "swing-low" },
  { key: "high", i: M.high, price: cs[M.high].h, label: `Sommet local ${usd(cs[M.high].h)}`, short: "Sommet", tone: "neutral", side: "above", role: "swing-high" },
];

export function WAConfirmationDiagram() {
  const cs = C["wa-m15"].slice(0, M.entry + 1);
  return (
    <LessonChart
      id="WAConfirmationDiagram"
      title="La confirmation M15 après le LPS"
      caption="En M15, l'or forme le creux du LPS à 3 905 $, puis un sommet local à 3 912 $. Une bougie clôture au-dessus : c'est le déclencheur du scénario d'achat."
      panels={[{
        key: "m15", title: "XAU/USD M15 · déclencheur", decimals: 0, height: 240, candles: cs, slots: cs.length + 4,
        markers: [...m15Markers(cs), { key: "go", i: M.entry, price: cs[M.entry].c, label: `Clôture au-dessus de ${usd(cs[M.high].h)}`, short: "Déclencheur", tone: "bull", side: "above", role: "bos", ref: M.high, dir: "bull" }],
        anim: [{ candles: M.lps + 2 }, { show: "lps" }, { candles: M.high + 2 }, { show: "high" }, { candles: M.entry }, { show: "go" }],
      }]}
    />
  );
}

export function WAGoldPlanDiagram() {
  const cs = C["wa-m15"].slice(0, M.entry + 1);
  const t = tradeSetup({ entry: 3914, sl: 3902, tp: 3938, unit: "$", from: M.entry, expect: ">=2" });
  return (
    <LessonChart
      id="WAGoldPlanDiagram"
      title="Plan d'achat sur l'or"
      caption="Entrée à 3 914 $ après la clôture M15 au-dessus de 3 912 $, stop à 3 902 $ sous le creux du LPS, objectif à 3 938 $ avant la résistance du range (3 940 $) : 12 $ de risque pour 24 $ de gain."
      panels={[{
        key: "m15", title: "XAU/USD M15 · plan retenu", decimals: 0, height: 270, candles: cs, slots: cs.length + 5,
        levels: t.levels, markers: m15Markers(cs), chips: [...t.chips, resChip],
      }]}
    />
  );
}

export function WARefusedDiagram() {
  const cs = C["wa-m15"];
  const t = tradeSetup({ entry: 3922, sl: 3902, tp: 3938, unit: "$", from: M.late, expect: "<2" });
  return (
    <LessonChart
      id="WARefusedDiagram"
      title="Entrée tardive : R/R de 1:0,8, refusée"
      caption="Attendre que le prix casse le sommet 3 920 $ fait entrer à 3 922 $. Le stop reste sous le LPS (3 902 $, 20 $), mais la résistance du range commence 18 $ plus haut : objectif 3 938 $, 16 $ de gain. Sous 1:2, le trade est refusé."
      panels={[{
        key: "m15", title: "XAU/USD M15 · plan refusé", decimals: 0, height: 270, candles: cs, slots: cs.length + 4,
        levels: t.levels,
        markers: [...m15Markers(cs), { key: "late", i: M.late, price: cs[M.late].c, label: `Clôture au-dessus de ${usd(cs[M.high2].h)}`, short: "Entrée tardive", tone: "neutral", side: "above", role: "bos", ref: M.high2, dir: "bull" }],
        chips: [...t.chips, resChip],
      }]}
    />
  );
}

export function WANasdaqPlanDiagram() {
  const cs = C["wa-nq"].slice(0, D.entry + 1);
  const t = tradeSetup({ entry: 27205, sl: 27245, tp: 27125, unit: "pts", from: D.entry, expect: ">=2" });
  return (
    <LessonChart
      id="WANasdaqPlanDiagram"
      title="Plan de vente sur le NASDAQ"
      caption="Après l'UTAD et le SOW, vente à 27 205 sur la confirmation M15 du LPSY, stop à 27 245 au-dessus du sommet du LPSY (27 230), objectif à 27 125 au-dessus du support du range (27 100) : 40 points de risque pour 80 points de gain."
      panels={[{
        key: "h1", title: "NASDAQ H1 · plan de vente", decimals: 0, height: 290, candles: cs, slots: cs.length + 4,
        zones: nqZones, levels: t.levels, chips: t.chips,
        // (confirmation nommée : l'entrée, à 25 points sous le LPSY, ne laisse pas la place à une bougie H1 plus grande)
        markers: [...nqMarkers(cs).filter((m) => m.key !== "local"), { key: "conf", i: D.entry, price: cs[D.entry].c, label: "Engulfing baissier", short: "Engulfing", tone: "bear", side: "below", role: "close" }],
      }]}
    />
  );
}

export function WAFailedSpringDiagram() {
  const cs = C["wa-failed"];
  const OUT = G.end + 4;
  return (
    <LessonChart
      id="WAFailedSpringDiagram"
      title="Le Spring qui échoue"
      caption="L'or passe sous le support de 3 880 $, mais ne réintègre pas le range : il accélère vers le bas. Sans réintégration, ce n'est pas un Spring confirmé : pas d'achat."
      panels={[{
        key: "h1", title: "XAU/USD H1 · pas de réintégration", decimals: 0, height: 270, candles: cs, slots: cs.length + 2,
        zones: goldZones(OUT - 1),
        markers: [{ key: "out", i: OUT, price: cs[OUT].c, label: `Clôture ${usd(cs[OUT].c)} sous le support`, short: "Pas de Spring", tone: "bear", side: "below", role: "close" }],
      }]}
    />
  );
}
