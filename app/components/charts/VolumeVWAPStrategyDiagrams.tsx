// Stratégie Volume Profile + VWAP (4 leçons) : un seul trade EUR/USD, suivi de leçon en leçon sur les
// mêmes bougies (lib/lessons/scenarios-strat-volume.ts) ; profil, Value Area, LVN, VWAP et CVD calculés
// par LessonChart (lib/lessons/volume.ts) sur les bougies et les volumes affichés. L'audit
// (scripts/audit-lecons/data-strat-volume.ts) vérifie chaque chiffre du texte sur ces données.
//  - leçon 1 : VSVStructureDiagram (structure H1), VSVProfileZoneDiagram (profil, zone d'intérêt, LVN) ;
//  - leçon 2 : VSVVwapZoneDiagram (retour dans la zone, VWAP de séance, animé), VSVGoldSellDiagram (or, animé) ;
//  - leçon 3 : VSVConfirmationDiagram (confirmation M15 et invalidation, animé), VSVAbsorptionDiagram
//    (contrat future : absorption, delta, CVD, animé) ;
//  - leçon 4 : VSVRefusedPlanDiagram (R/R 1:1,1), VSVRetainedPlanDiagram (second retour, animé),
//    VSVOutcomesDiagram (issues A et B, animé).

import { LessonChart, type LCLevel, type LCPanel, type LCZone } from "@/app/components/lessons/LessonChart";
import { tradeSetup, usd } from "@/app/components/lessons/trade";
import { fmtPrice } from "@/lib/lessons/chart-analysis";
import { vwap, type VCandle } from "@/lib/lessons/volume";
import { VSV_FUT_BASIS, VSV_FUT_FROM, VSV_H1, VSV_M15, VSV_PLAN, VSV_PROFILE, VSV_REFUSED, VSV_RES, VSV_ROW, VSV_ZONE, VSX, VSX_PROFILE, VSX_ROW } from "@/lib/lessons/strat-volume-meta";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);
const C = CANDLES as unknown as Record<string, VCandle[]>;
const vol = { key: "vol", kind: "volume" as const, label: "Volume" };
const M = VSV_M15;

/** Zone d'intérêt : ancienne résistance cassée, au même endroit que le POC */
const zone = (from: number, label = `Zone d'intérêt ${p(VSV_ZONE[0])} – ${p(VSV_ZONE[1])}`): LCZone =>
  ({ key: "zone", y1: VSV_ZONE[0], y2: VSV_ZONE[1], from, label, short: "Zone", tone: "zone", role: "support" });
/** VWAP de séance, ancré à l'ouverture de la séance */
const seance = (cs: VCandle[]) => ({ key: "vwap", values: vwap(cs, M.session), tone: "fib" as const, label: "VWAP de séance", short: "VWAP", vwap: M.session });
/** Creux d'invalidation (1.0845) */
const invalidation = (from: number): LCLevel =>
  ({ key: "inval", price: C["vsv-m15"][M.low].l, from, label: `Invalidation ${p(C["vsv-m15"][M.low].l)}`, short: "Invalidation", tone: "bear", dashed: true });

// ─── Leçon 1 ────────────────────────────────────────────────────────────────

export function VSVStructureDiagram() {
  const cs = C["vsv-h1"];
  const H = VSV_H1;
  return (
    <LessonChart
      id="VSVStructureDiagram"
      title="EUR/USD H1 : une structure haussière"
      caption="Creux 1.0800, sommet 1.0860 rejeté deux fois, creux plus haut à 1.0830, clôture au-dessus de 1.0860, puis sommet plus haut à 1.0910. Le prix corrige maintenant : on cherche un achat pendant la correction."
      panels={[{
        key: "h1", title: "EUR/USD H1 · structure", decimals: 5, height: 280, candles: cs,
        levels: [
          { key: "res", price: 1.086, from: H.res1, to: H.brk, label: `Résistance ${p(1.086)} (deux rejets)`, short: "Résistance", tone: "bear", dashed: true, role: "resistance" },
          { key: "top", price: VSV_RES, from: H.top1, label: `Sommet ${p(VSV_RES)}`, short: "Sommet", tone: "neutral", dashed: true, role: "resistance" },
        ],
        markers: [
          { key: "creux0", i: H.low0, price: cs[H.low0].l, label: `Creux ${p(cs[H.low0].l)}`, short: "Creux", tone: "neutral", side: "below", role: "swing-low" },
          { key: "creux1", i: H.low1, price: cs[H.low1].l, label: `Creux plus haut ${p(cs[H.low1].l)}`, short: "Creux", tone: "bull", side: "below", role: "swing-low" },
          { key: "brk", i: H.brk, price: cs[H.brk].c, label: `Clôture au-dessus de ${p(1.086)}`, short: "Breakout", tone: "bull", side: "above", role: "close" },
        ],
      }]}
    />
  );
}

export function VSVProfileZoneDiagram() {
  const cs = C["vsv-h1"];
  const H = VSV_H1;
  return (
    <LessonChart
      id="VSVProfileZoneDiagram"
      title="Profil de la consolidation et zone d'intérêt"
      caption="Fixed Range Volume Profile du creux 1.0830 jusqu'au sommet 1.0910, calculé sur les bougies et les volumes affichés. Le POC tombe sur l'ancienne résistance 1.0860 : la zone d'intérêt 1.0855 – 1.0865 réunit le support et le volume. Au-dessus, la LVN puis la résistance 1.0910."
      panels={[{
        key: "h1", title: "EUR/USD H1 · profil, zone et objectifs", decimals: 5, height: 300, candles: cs,
        profile: { key: "profil", from: VSV_PROFILE[0], to: VSV_PROFILE[1], row: VSV_ROW, show: ["poc", "vah", "val", "lvn"] },
        zones: [zone(H.brk)],
        levels: [{ key: "res", price: VSV_RES, from: H.top1, label: `Résistance H1 ${p(VSV_RES)}`, short: "Résistance", tone: "bear", dashed: true, role: "resistance" }],
        subs: [vol],
      }]}
    />
  );
}

// ─── Leçon 2 ────────────────────────────────────────────────────────────────

export function VSVVwapZoneDiagram() {
  const all = C["vsv-m15"];
  const cs = all.slice(0, M.back + 1);
  return (
    <LessonChart
      id="VSVVwapZoneDiagram"
      title="Le retour dans la zone, avec le VWAP de séance"
      caption="En M15, le VWAP de séance part de l'ouverture de la séance. Quand le prix revient dans la zone d'intérêt, le VWAP passe à 1.0862 : structure, support, POC et VWAP au même endroit. Il manque encore la confirmation."
      panels={[{
        key: "m15", title: "EUR/USD M15 · retour vers le support", decimals: 5, height: 260, candles: cs, slots: cs.length + 3,
        series: [seance(cs)],
        zones: [zone(0)],
        levels: [{ key: "poc", price: 1.086, label: `POC H1 ${p(1.086)}`, short: "POC", tone: "zone", dashed: true }],
        markers: [
          { key: "ouverture", i: M.session, price: cs[M.session].h, label: "Ouverture de la séance", short: "Séance", tone: "neutral", side: "above", role: "high" },
          { key: "retour", i: M.back, price: cs[M.back].l, label: `Retour dans la zone · VWAP ${p(vwap(cs, M.session)[M.back]!)}`, short: "Retour", tone: "fib", side: "below", role: "low" },
        ],
        subs: [vol],
        anim: [{ candles: M.session - 1 }, { show: ["zone", "poc"] }, { candles: M.session }, { show: ["ouverture", "vwap"] }, { candles: M.back }, { show: "retour" }],
      }]}
    />
  );
}

export function VSVGoldSellDiagram() {
  const cs = C["vsv-xau"];
  const r = VSX.rebound;
  return (
    <LessonChart
      id="VSVGoldSellDiagram"
      title="Or : rebond vers la résistance, en tendance baissière"
      caption="Sommets et creux descendants. Sous 3 900 $, le marché a beaucoup échangé (concentration vers 3 898 $). Après l'impulsion baissière, le prix rebondit jusqu'à 3 900 $, où passe le VWAP de séance : zone de vente à surveiller, sans entrer avant une confirmation baissière."
      panels={[{
        key: "xau", title: "XAU/USD H1 · depuis l'ouverture de la séance", decimals: 0, height: 290, candles: cs, slots: cs.length + 3,
        series: [{ key: "vwap", values: vwap(cs, 0), tone: "fib", label: "VWAP de séance", short: "VWAP", vwap: 0 }],
        profile: { key: "profil", from: VSX_PROFILE[0], to: VSX_PROFILE[1], row: VSX_ROW, unit: "$", show: ["poc"] },
        levels: [{ key: "res", price: 3900, from: VSX.res1, label: `Résistance ${usd(3900)}`, short: "Résistance", tone: "bear", dashed: true, role: "resistance" }],
        markers: [
          { key: "impulsion", i: VSX.low, price: cs[VSX.low].l, label: "Impulsion baissière", short: "Impulsion", tone: "bear", side: "below", role: "swing-low" },
          { key: "rebond", i: r, price: cs[r].h, label: `Rebond sur la zone · VWAP ${usd(vwap(cs, 0)[r]!)}`, short: "Rebond", tone: "fib", side: "above", role: "high" },
        ],
        subs: [vol],
        anim: [{ candles: VSX_PROFILE[1] }, { show: ["profil", "poc", "res"] }, { candles: VSX.low }, { show: "impulsion" }, { candles: r }, { show: ["vwap", "rebond"] }],
      }]}
    />
  );
}

// ─── Leçon 3 ────────────────────────────────────────────────────────────────

export function VSVConfirmationDiagram() {
  const cs = C["vsv-m15"].slice(0, M.confirm + 1);
  return (
    <LessonChart
      id="VSVConfirmationDiagram"
      title="Confirmation en M15 et niveau d'invalidation"
      caption="Le prix atteint 1.0860, descend jusqu'à 1.0845, rebondit et forme un sommet local à 1.0870. Après une légère correction sans casser 1.0845, une bougie clôture au-dessus de 1.0870 : reprise haussière à court terme. Sous 1.0845, l'hypothèse tombe."
      panels={[{
        key: "m15", title: "EUR/USD M15 · réaction dans la zone", decimals: 5, height: 270, candles: cs, slots: cs.length + 3,
        series: [seance(cs)],
        zones: [zone(0)],
        levels: [invalidation(M.low)],
        markers: [
          { key: "creux", i: M.low, price: cs[M.low].l, label: `Creux ${p(cs[M.low].l)}`, short: "Creux", tone: "neutral", side: "below", role: "swing-low" },
          { key: "sommet", i: M.high, price: cs[M.high].h, label: `Sommet local ${p(cs[M.high].h)}`, short: "Sommet", tone: "neutral", side: "above", role: "swing-high" },
          { key: "signal", i: M.confirm, price: cs[M.confirm].c, label: `Clôture au-dessus de ${p(cs[M.high].h)}`, short: "Sommet cassé", tone: "bull", side: "above", role: "bos", ref: M.high, dir: "bull" },
        ],
        anim: [{ candles: M.back }, { show: ["zone", "vwap"] }, { candles: M.low + 1 }, { show: "creux" }, { candles: M.high + 2 }, { show: "sommet" }, { candles: M.confirm }, { show: ["signal", "inval"] }],
      }]}
    />
  );
}

/** Repères du contrat future : bougies M15 de la séance (indices du comptant moins VSV_FUT_FROM) */
export const VSV_FUT = { absorb: M.back - VSV_FUT_FROM, low: M.low - VSV_FUT_FROM, confirm: M.confirm - VSV_FUT_FROM };

export function VSVAbsorptionDiagram() {
  const cs = C["vsv-fut"];
  const F = VSV_FUT;
  return (
    <LessonChart
      id="VSVAbsorptionDiagram"
      title="Sur le contrat future : absorption et CVD"
      caption={`Même séance sur le contrat future EUR/USD, qui cote ici environ ${Math.round(VSV_FUT_BASIS * 1e4)} pips au-dessus de la paire au comptant. Au contact de la zone, de fortes ventes agressives ne font plus baisser le prix : absorption possible. Le creux suivant, plus bas, se fait avec moins de ventes : le CVD forme un creux plus haut.`}
      panels={[{
        key: "fut", title: "Future EUR/USD M15 · Order Flow", decimals: 5, height: 230, candles: cs, slots: cs.length + 3,
        markers: [
          { key: "absorption", i: F.absorb, price: cs[F.absorb].l, label: "Fortes ventes, pas de nouvelle baisse", short: "Absorption", tone: "bull", side: "below", role: "low" },
          { key: "creux", i: F.low, price: cs[F.low].l, label: "Creux plus bas du prix", short: "Creux", tone: "neutral", side: "below", role: "swing-low" },
        ],
        subs: [
          { key: "delta", kind: "delta", label: "Delta" },
          { key: "cvd", kind: "cvd", label: "CVD", marks: [
            { key: "cvd1", i: F.absorb, label: "Creux du CVD", short: "Creux", tone: "neutral" },
            { key: "cvd2", i: F.low, label: "Creux plus haut", short: "Plus haut", tone: "bull" },
          ] },
        ],
        anim: [{ candles: F.absorb - 2 }, { candles: F.absorb }, { show: ["absorption", "cvd1"] }, { candles: F.low }, { show: ["creux", "cvd2"] }, { candles: F.confirm }],
      }]}
    />
  );
}

// ─── Leçon 4 ────────────────────────────────────────────────────────────────

export function VSVRefusedPlanDiagram() {
  const cs = C["vsv-m15"].slice(0, M.confirm + 1);
  const t = tradeSetup({ ...VSV_REFUSED, decimals: 4, from: M.confirm, expect: "<2" });
  return (
    <LessonChart
      id="VSVRefusedPlanDiagram"
      title="Premier plan : refusé, R/R trop faible"
      caption="Entrée 1.0872 après la confirmation, stop 1.0842 sous le creux d'invalidation, objectif 1.0906 avant la résistance 1.0910 : 30 pips de risque pour 34 pips de gain. Sous le R/R minimum de 1:2, le trade n'est pas pris."
      panels={[{
        key: "m15", title: "EUR/USD M15 · plan après la confirmation", decimals: 5, height: 280, candles: cs, slots: cs.length + 4,
        zones: [zone(0)],
        levels: [{ key: "res", price: VSV_RES, label: `Résistance H1 ${p(VSV_RES)}`, short: "Résistance", tone: "bear", dashed: true }, ...t.levels],
        markers: [
          { key: "signal", i: M.confirm, price: cs[M.confirm].c, label: "Confirmation", short: "Signal", tone: "bull", side: "below", role: "close" },
        ],
        chips: t.chips,
      }]}
    />
  );
}

export function VSVRetainedPlanDiagram() {
  const cs = C["vsv-m15"];
  const t = tradeSetup({ ...VSV_PLAN, decimals: 4, from: M.entry2, expect: ">2" });
  return (
    <LessonChart
      id="VSVRetainedPlanDiagram"
      title="Second retour dans la zone : le plan retenu"
      caption="Le prix revient dans la zone, forme un creux à 1.0848 au-dessus de l'invalidation, un sommet local à 1.0856, puis clôture au-dessus. Entrée 1.0858, stop 1.0842 sous 1.0845, objectif 1.0906 : 16 pips de risque pour 48 pips de gain."
      panels={[{
        key: "m15", title: "EUR/USD M15 · second retour", decimals: 5, height: 300, candles: cs, slots: cs.length + 4,
        zones: [zone(0)],
        levels: [{ key: "res", price: VSV_RES, label: `Résistance H1 ${p(VSV_RES)}`, short: "Résistance", tone: "bear", dashed: true }, invalidation(M.low), ...t.levels],
        markers: [
          { key: "creux2", i: M.low2, price: cs[M.low2].l, label: `Creux ${p(cs[M.low2].l)}`, short: "Creux", tone: "neutral", side: "below", role: "swing-low" },
          { key: "sommet2", i: M.high2, price: cs[M.high2].h, label: `Sommet local ${p(cs[M.high2].h)}`, short: "Sommet", tone: "neutral", side: "above", role: "swing-high" },
          { key: "signal", i: M.entry2, price: cs[M.entry2].c, label: `Clôture au-dessus de ${p(cs[M.high2].h)}`, short: "Sommet cassé", tone: "bull", side: "above", role: "bos", ref: M.high2, dir: "bull" },
        ],
        chips: t.chips,
        anim: [{ candles: M.confirm }, { show: ["zone", "res", "inval"] }, { candles: M.low2 + 1 }, { show: "creux2" }, { candles: M.high2 + 2 }, { show: "sommet2" }, { candles: M.entry2 }, { show: "signal" }, { show: ["entry", "sl", "tp"] }],
      }]}
    />
  );
}

function outcomePanel(k: "a" | "b"): LCPanel {
  const cs = C[`vsv-m15-${k}`];
  const t = tradeSetup({ ...VSV_PLAN, decimals: 4, from: M.entry2 });
  const hit = cs.findIndex((c, i) => i > M.entry2 && (k === "a" ? c.l <= VSV_PLAN.sl : c.h >= VSV_PLAN.tp));
  return {
    key: k, decimals: 5, height: 220, candles: cs.slice(M.confirm), slots: cs.length - M.confirm + 3,
    title: k === "a" ? "Issue A · le stop est touché" : "Issue B · l'objectif est atteint",
    levels: t.levels.map((l) => ({ ...l, from: M.entry2 - M.confirm })),
    markers: [k === "a"
      ? { key: "fin", i: hit - M.confirm, price: VSV_PLAN.sl, label: `Stop ${p(VSV_PLAN.sl)} : −1R`, short: "−1R", tone: "bear", side: "below" }
      : { key: "fin", i: hit - M.confirm, price: VSV_PLAN.tp, label: `Objectif ${p(VSV_PLAN.tp)} : +3R`, short: "+3R", tone: "bull", side: "above" }],
    anim: [{ candles: M.entry2 - M.confirm }, { show: ["entry", "sl", "tp"] }, { candles: hit - M.confirm }, { show: "fin" }, { candles: cs.length - 1 - M.confirm }],
  };
}

export function VSVOutcomesDiagram() {
  return (
    <LessonChart
      id="VSVOutcomesDiagram"
      title="Deux issues possibles pour le même plan"
      caption="Même entrée, même stop, même objectif. A : le prix repasse sous la zone et touche 1.0842, perte de 1R. B : le prix traverse la LVN et atteint 1.0906, gain de 3R. Un seul trade ne dit rien de la stratégie : il faut un échantillon."
      panels={[outcomePanel("a"), outcomePanel("b")]}
      rows={[1, 1]}
    />
  );
}
