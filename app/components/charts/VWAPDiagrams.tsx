// Trading Avancé 11 — VWAP. Bougies et volumes : lib/lessons/scenarios-volume.ts ; chaque VWAP est
// calculé ici avec la formule de la leçon, Σ(prix typique × volume) ÷ Σ volume depuis sa bougie
// d'ancrage (lib/lessons/volume.ts), sur les bougies et les volumes affichés. L'audit le recalcule.
//  - VWAPCalcDiagram : l'exemple chiffré (trois périodes) contre la moyenne simple ;
//  - VWAPNasdaqPlanDiagram : retour sur l'ancienne résistance et le VWAP de séance, confirmation, plan (animé) ;
//  - VWAPGoldPlanDiagram : or, retour sous l'ancien support et le VWAP, creux local cassé, plan (animé) ;
//  - AnchoredVWAPDiagram : VWAP ancré sur une publication, comparé au VWAP de séance (animé).

import { LessonChart, type LCChip, type LCLevel } from "@/app/components/lessons/LessonChart";
import { Cards, LessonSchema, Matrix } from "@/app/components/lessons/LessonSchema";
import { tradeSetup } from "@/app/components/lessons/trade";
import { fmtNum, fmtPrice, fmtRR, tradeMath } from "@/lib/lessons/chart-analysis";
import { AVW_ANCHOR, AVW_TOUCH, VWN_TRADE, VWX_TRADE } from "@/lib/lessons/volume-meta";
import { vwap, type VCandle } from "@/lib/lessons/volume";
import CANDLES from "@/lib/lessons/generated/candles.json";

const C = CANDLES as unknown as Record<string, VCandle[]>;
const vol = { key: "vol", kind: "volume" as const, label: "Volume" };
/** Points d'indice : « 27 155 » */
const pts = (x: number) => fmtPrice(x, 0, "$").replace("$", "");
const usd = (x: number) => fmtPrice(x, 0, "$");

/** Exemple de la leçon : trois périodes, prix et volumes */
export const VWAP_EXAMPLE = [
  { price: 100, volume: 100 },
  { price: 102, volume: 200 },
  { price: 104, volume: 500 },
];

export function VWAPCalcDiagram() {
  const rows = VWAP_EXAMPLE.map((r) => ({ ...r, pv: r.price * r.volume }));
  const sv = rows.reduce((s, r) => s + r.volume, 0), spv = rows.reduce((s, r) => s + r.pv, 0);
  const vw = spv / sv, mean = rows.reduce((s, r) => s + r.price, 0) / rows.length;
  const n = (x: number) => fmtPrice(x, 0, "$").replace("$", "");
  const eur = (x: number) => `${fmtNum(x, 2)} €`;
  return (
    <LessonSchema
      id="VWAPCalcDiagram"
      title="VWAP et moyenne simple, sur les mêmes prix"
      caption="Le VWAP donne plus de poids au prix qui a concentré le volume : ici 104 €, avec 500 des 800 échanges."
    >
      <Matrix
        head={["Prix", "Volume", "Prix × volume"]}
        rows={[
          ...rows.map((r, i) => ({ label: `Période ${i + 1}`, cells: [{ text: eur(r.price) }, { text: n(r.volume), tone: r.volume === Math.max(...rows.map((q) => q.volume)) ? ("zone" as const) : undefined }, { text: n(r.pv) }] })),
          { label: "Total", cells: [{ text: "—" }, { text: n(sv) }, { text: n(spv) }] },
        ]}
      />
      <Cards
        cols={2}
        mobileCols={2}
        items={[
          { title: "VWAP", value: eur(vw), text: `${n(spv)} ÷ ${n(sv)}`, tone: "fib" },
          { title: "Moyenne simple", value: eur(mean), text: `(${rows.map((r) => r.price).join(" + ")}) ÷ ${rows.length}`, tone: "neutral" },
        ]}
      />
    </LessonSchema>
  );
}

/** Plan en points d'indice : niveaux et puces (risque, gain, R/R recalculé par l'audit) */
function pointsPlan(t: { entry: number; sl: number; tp: number }, from: number, tpName = "TP"): { levels: LCLevel[]; chips: LCChip[] } {
  const m = tradeMath(t.entry, t.sl, t.tp);
  return {
    levels: [
      { key: "entry", price: t.entry, from, label: `Entrée ${pts(t.entry)}`, short: "Entrée", tone: "entry" },
      { key: "sl", price: t.sl, from, label: `SL ${pts(t.sl)}`, short: "SL", tone: "bear", dashed: true },
      { key: "tp", price: t.tp, from, label: `${tpName} ${pts(t.tp)}`, short: "TP", tone: "bull", dashed: true },
    ],
    chips: [
      { label: `Risque ${Math.abs(t.entry - t.sl)} points`, tone: "bear", data: { calc: "risque" } },
      { label: `Gain visé ${Math.abs(t.tp - t.entry)} points`, tone: "bull", data: { calc: "gain" } },
      { label: `R/R ${fmtRR(m.rr)}`, tone: "entry", data: { rr: fmtRR(m.rr), entry: t.entry, sl: t.sl, tp: t.tp } },
    ],
  };
}

export function VWAPNasdaqPlanDiagram() {
  const cs = C["vwap-nas"];
  const n = cs.length, last = n - 1;
  const top = cs.reduce((b, k, i) => (k.h > cs[b].h ? i : b), 0);
  const creux = cs.reduce((b, k, i) => (i > top && k.l < cs[b].l ? i : b), top);
  const plan = pointsPlan(VWN_TRADE, last);
  return (
    <LessonChart
      id="VWAPNasdaqPlanDiagram"
      title="NASDAQ : correction vers le support et le VWAP de séance"
      caption="Structure haussière (creux 27 000, sommet 27 140, creux 27 080, sommet 27 230). La correction revient sur l'ancienne résistance 27 140, où passe le VWAP de séance ; l'entrée attend la cassure du sommet local de la correction."
      panels={[{
        key: "nas", title: "NASDAQ M15 · depuis l'ouverture de la séance", decimals: 0, height: 300, candles: cs, slots: n + 4,
        series: [{ key: "vwap", values: vwap(cs, 0), tone: "fib", label: "VWAP de séance", short: "VWAP", vwap: 0 }],
        zones: [{ key: "support", y1: 27133, y2: 27140, from: 6, label: "Ancienne résistance → support", short: "Support", tone: "bull" }],
        levels: [{ key: "sommet", price: cs[top].h, from: top, label: `Sommet ${pts(cs[top].h)}`, short: "Sommet", tone: "neutral", dashed: true }, ...plan.levels],
        markers: [
          { key: "creux", i: creux, price: cs[creux].l, label: "Creux local", short: "Creux", tone: "neutral", side: "below", role: "swing-low" },
          { key: "cassure", i: last, price: cs[last].h, label: "Cassure du sommet local", short: "Sommet cassé", tone: "entry", side: "above" },
        ],
        chips: plan.chips,
        subs: [vol],
        anim: [{ candles: top }, { show: "sommet" }, { candles: creux }, { show: ["support", "vwap"] }, { show: "creux" }, { candles: last }, { show: "cassure" }, { show: ["entry", "sl", "tp"] }],
      }]}
    />
  );
}

export function VWAPGoldPlanDiagram() {
  const cs = C["vwap-xau"];
  const n = cs.length, last = n - 1, retest = last - 2;
  const t = tradeSetup({ ...VWX_TRADE, unit: "$", decimals: 0, from: last });
  // support 3 877$ (deux touches pendant l'impulsion) jusqu'à l'entrée, puis l'objectif du plan au même prix
  const sup = cs.findIndex((k) => Math.abs(k.l - VWX_TRADE.tp) <= 1);
  const levels: LCLevel[] = [{ key: "support", price: VWX_TRADE.tp, from: sup - 1, to: last - 1, label: `Support ${usd(VWX_TRADE.tp)}`, short: "Support", tone: "bull", dashed: true }, ...t.levels];
  return (
    <LessonChart
      id="VWAPGoldPlanDiagram"
      title="Or : rebond vers l'ancien support et le VWAP"
      caption="Sommets et creux descendants. Le prix remonte sur l'ancien support 3 900$, où passe le VWAP de séance, échoue, puis casse son creux local : vente, objectif sur le support 3 877$."
      panels={[{
        key: "xau", title: "XAU/USD M15 · depuis l'ouverture de la séance", decimals: 0, height: 300, candles: cs, slots: n + 4,
        series: [{ key: "vwap", values: vwap(cs, 0), tone: "fib", label: "VWAP de séance", short: "VWAP", vwap: 0 }],
        zones: [{ key: "res", y1: 3899, y2: 3902, from: 3, label: "Ancien support → résistance", short: "Résistance", tone: "bear" }],
        levels,
        markers: [
          { key: "echec", i: retest, price: cs[retest].h, label: "Échec sous 3 900$", short: "Échec", tone: "bear", side: "above", role: "high" },
          { key: "cassure", i: last, price: cs[last].l, label: "Cassure du creux local", short: "Creux cassé", tone: "entry", side: "below" },
        ],
        chips: t.chips,
        subs: [vol],
        anim: [{ candles: 9 }, { show: "res" }, { candles: retest }, { show: ["vwap", "echec"] }, { candles: last }, { show: "cassure" }, { show: ["entry", "sl", "tp"] }],
      }]}
    />
  );
}

export function AnchoredVWAPDiagram() {
  const cs = C["avwap-xau"];
  return (
    <LessonChart
      id="AnchoredVWAPDiagram"
      title="VWAP ancré sur une publication"
      caption="Le VWAP ancré part de la bougie de la publication : il donne le prix moyen pondéré depuis l'événement. Quelques heures plus tard, la correction revient le toucher, bien au-dessus du VWAP de séance."
      panels={[{
        key: "avwap", title: "XAU/USD M15 · publication économique", decimals: 0, height: 300, candles: cs,
        series: [
          { key: "seance", values: vwap(cs, 0), tone: "neutral", label: "VWAP de séance", short: "Séance", vwap: 0 },
          { key: "ancre", values: vwap(cs, AVW_ANCHOR), tone: "fib", label: "VWAP ancré (publication)", short: "VWAP ancré", vwap: AVW_ANCHOR },
        ],
        markers: [
          { key: "pub", i: AVW_ANCHOR, price: cs[AVW_ANCHOR].l, label: "Publication", tone: "zone", side: "below", role: "low" },
          { key: "retour", i: AVW_TOUCH, price: cs[AVW_TOUCH].l, label: "Retour sur le VWAP ancré", short: "Retour", tone: "fib", side: "below", role: "low" },
        ],
        subs: [vol],
        anim: [{ candles: AVW_ANCHOR - 1 }, { show: "seance" }, { candles: AVW_ANCHOR }, { show: "pub" }, { show: "ancre" }, { candles: AVW_TOUCH }, { show: "retour" }, { candles: cs.length - 1 }],
      }]}
    />
  );
}
