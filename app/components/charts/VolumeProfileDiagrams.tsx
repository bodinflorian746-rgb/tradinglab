// Trading Avancé 10 — Volume Profile. Bougies et volumes : lib/lessons/scenarios-volume.ts ; profil,
// POC, Value Area, HVN, LVN calculés par LessonChart (lib/lessons/volume.ts) sur les bougies et les
// volumes affichés. L'audit (scripts/audit-lecons) refait les calculs et vérifie les chiffres du texte.
//  - VolumeProfileDiagram : le profil d'un range EUR/USD (POC 1.0850, Value Area 1.0835 – 1.0865,
//    concentration secondaire 1.0820, LVN 1.0870 – 1.0885) ;
//  - ValueAreaExitDiagram : sortie de la Value Area par le haut, rejet ou acceptation (animé) ;
//  - VolumeProfileTradeDiagram : l'exemple pratique (support 1.0850, POC 1.0852, entrée M15) ;
//  - LVNTargetDiagram : NASDAQ, breakout au-dessus de 27 100, LVN 27 120 – 27 180, HVN 27 200 (animé).

import { LessonChart, type LCPanel } from "@/app/components/lessons/LessonChart";
import { tradeSetup } from "@/app/components/lessons/trade";
import { fmtPrice, type Candle } from "@/lib/lessons/chart-analysis";
import { LVN_BREAK, LVN_PROFILE, LVN_ROW, VP_ROW, VPT_LOCAL_HIGH, VPT_PROFILE, VPT_ROW, VPT_TRADE, aggregateV } from "@/lib/lessons/volume-meta";
import type { VCandle } from "@/lib/lessons/volume";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);
const C = CANDLES as unknown as Record<string, VCandle[]>;
const vol = { key: "vol", kind: "volume" as const, label: "Volume" };

export function VolumeProfileDiagram() {
  const cs = C["vp-range"];
  return (
    <LessonChart
      id="VolumeProfileDiagram"
      title="Le profil de volume d'un range"
      caption="Chaque barre horizontale : le volume échangé dans cette zone de prix, calculé à partir des bougies et des volumes affichés dessous. La plus longue est le POC ; la Value Area regroupe environ 70 % du volume."
      panels={[{
        key: "vp", title: "EUR/USD H1 · un range entre 1.0800 et 1.0900", decimals: 5, height: 300, candles: cs,
        profile: { key: "profil", from: 0, to: cs.length - 1, row: VP_ROW },
        subs: [vol],
      }]}
    />
  );
}

/** Sortie de la Value Area : même range (même profil), puis rejet ou acceptation */
function exitPanel(key: "va-rejet" | "va-acceptation", n: number): LCPanel {
  const cs = C[key];
  const out = n + 2, back = n + 3;
  const rejet = key === "va-rejet";
  return {
    key, decimals: 5, height: 260, candles: cs,
    title: rejet ? "Rejet : le prix réintègre la zone de valeur" : "Acceptation : le prix reste à l'extérieur",
    profile: { key: "profil", from: 0, to: n - 1, row: VP_ROW, show: ["vah", "poc", "val"] },
    markers: [
      { key: "sortie", i: out, price: cs[out].c, label: "Clôture au-dessus de la VAH", short: "Hors VA", tone: "bull", side: "above", role: "close" },
      rejet
        ? { key: "retour", i: back, price: cs[back].c, label: "Retour dans la Value Area", short: "Retour", tone: "bear", side: "below", role: "close" }
        : { key: "retour", i: back, price: cs[back].l, label: "Retest de la VAH tenu", short: "Retest", tone: "bull", side: "below", role: "low" },
    ],
    anim: [{ candles: n - 1 }, { show: "profil" }, { show: ["vah", "poc", "val"] }, { candles: out }, { show: "sortie" }, { candles: back }, { show: "retour" }, { candles: cs.length - 1 }],
  };
}

export function ValueAreaExitDiagram() {
  const n = C["vp-range"].length;
  return (
    <LessonChart
      id="ValueAreaExitDiagram"
      title="Sortie de la Value Area : rejet ou acceptation"
      caption="Même range et même profil que plus haut. Après une clôture au-dessus de la VAH, regarde si le prix revient dans la zone de valeur ou s'il tient au-dessus."
      panels={[exitPanel("va-rejet", n), exitPanel("va-acceptation", n)]}
      rows={[1, 1]}
    />
  );
}

export function VolumeProfileTradeDiagram() {
  const h1 = C["vpt-h1"], m15 = C["vpt-m15"];
  const h1All = [...h1, ...aggregateV(m15, 4)];
  const t = tradeSetup({ ...VPT_TRADE, decimals: 4, from: m15.length - 1, tpOffscale: true });
  const creux = m15.reduce((b, k, i) => (k.l < m15[b].l ? i : b), 0);
  const sommet = VPT_LOCAL_HIGH;
  const flip = { key: "support", price: 1.085, label: `Ancienne résistance → support ${p(1.085)}`, short: "Ex-résistance", tone: "bull" as const, dashed: true };
  const panels: LCPanel[] = [
    {
      key: "h1", title: "H1 · tendance haussière, correction vers 1.0850",
      decimals: 5, height: 250, candles: h1All,
      profile: { key: "profil", from: VPT_PROFILE[0], to: VPT_PROFILE[1], row: VPT_ROW, show: ["poc"] },
      levels: [
        { key: "res", price: 1.0895, from: 2, label: `Résistance H1 ${p(1.0895)}`, short: "Résistance", tone: "bear", dashed: true },
        { ...flip, from: 14 },
      ],
      subs: [vol],
    },
    {
      key: "m15", title: "M15 · confirmation et entrée",
      decimals: 5, height: 210, candles: m15, slots: m15.length + 4,
      levels: [{ ...flip, label: `Support H1 ${p(1.085)}`, short: "Support H1" }, ...t.levels],
      offscale: t.offscale,
      markers: [
        { key: "creux", i: creux, price: m15[creux].l, label: "Creux technique", short: "Creux", tone: "neutral", side: "below", role: "swing-low" },
        { key: "cassure", i: m15.length - 1, price: m15[m15.length - 1].c, label: "Cassure du sommet local", short: "Sommet cassé", tone: "entry", side: "above", role: "bos", ref: sommet, dir: "bull" },
      ],
      chips: t.chips,
      anim: [{ candles: 4 }, { show: "support" }, { candles: creux }, { show: "creux" }, { candles: m15.length - 1 }, { show: "cassure" }, { show: ["entry", "sl", "tp"] }],
    },
  ];
  return (
    <LessonChart
      id="VolumeProfileTradeDiagram"
      title="EUR/USD : support et POC au même endroit"
      caption="Le support vient de la structure (résistance touchée deux fois, puis cassée) ; le POC de la consolidation le confirme. L'entrée attend la cassure du sommet local en M15."
      panels={panels}
      rows={[1, 1]}
    />
  );
}

export function LVNTargetDiagram() {
  const cs = C["vp-lvn"] as (Candle & { v: number })[];
  const brk = LVN_BREAK;
  return (
    <LessonChart
      id="LVNTargetDiagram"
      title="NASDAQ : traverser une LVN vers une HVN"
      caption="Peu d'échanges entre 27 120 et 27 180 lors de la descente : après le breakout au-dessus de 27 100, le prix traverse vite cette zone jusqu'à l'HVN de 27 200, qui correspond aussi aux anciens échanges du graphique."
      panels={[{
        key: "lvn", title: "NASDAQ M15 · breakout de la résistance 27 100", decimals: 0, height: 300, candles: cs,
        profile: { key: "profil", from: LVN_PROFILE[0], to: LVN_PROFILE[1], row: LVN_ROW, unit: "pts", show: ["poc", "hvn", "lvn"] },
        levels: [{ key: "res", price: 27100, from: 11, to: brk, label: "Résistance 27 100", short: "Résistance", tone: "bear", dashed: true }],
        markers: [
          { key: "breakout", i: brk, price: cs[brk].c, label: "Clôture au-dessus de 27 100", short: "Breakout", tone: "bull", side: "above", role: "close" },
        ],
        subs: [vol],
        anim: [{ candles: LVN_PROFILE[1] }, { show: "profil" }, { show: ["poc", "hvn0", "lvn0"] }, { show: "res" }, { candles: brk }, { show: "breakout" }, { candles: cs.length - 1 }],
      }]}
    />
  );
}
