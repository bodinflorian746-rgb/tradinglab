// Trading Intermédiaire 11 — L'ATR. Bougies : lib/lessons/scenarios-nouvelles.ts (amplitudes écrites,
// NASDAQ décalé de +7 000 points) ; l'ATR 14 du sous-panneau est recalculé sur les bougies affichées
// (LessonChart, kind « atr »), les valeurs des repères aussi : l'audit les compare au texte.
//  - ATRReadingDiagram : NASDAQ M15, ATR 35 puis 55 ;
//  - ATRStopDiagram : achat 27 150, creux 27 090, stop 27 085 (65 points, moins de 2 ATR) ;
//  - ATRGoldPlanDiagram : or M15, entrée 3 912 $, stop 3 896 $ (2 ATR de 8 $), objectif 3 944 $ ;
//  - ATRDailyTargetDiagram : EUR/USD D1, ATR 70 pips, 65 pips déjà parcourus, objectif 80 pips plus haut.

import { LessonChart, type LCSub } from "@/app/components/lessons/LessonChart";
import { pts, tradeSetup, usd } from "@/app/components/lessons/trade";
import { atr, fmtNum, fmtPrice, type Candle } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const C = CANDLES as unknown as Record<string, Candle[]>;
const p = (x: number) => fmtPrice(x, 4);
/** Sous-panneau ATR 14, repères à la valeur calculée (« ATR 35 pts », « ATR 8 $ », « ATR 70 pips ») */
const atrSub = (cs: Candle[], marks: { key: string; i: number; tone?: "sky" | "bear" | "bull" }[], unit: "pts" | "$" | "pips"): LCSub => {
  const a = atr(cs);
  const val = (i: number) => (unit === "pips" ? Math.round(a[i]! * 1e4) : Math.round(a[i]!));
  return { key: "atr", kind: "atr", label: "ATR 14", marks: marks.map((m) => ({ key: m.key, i: m.i, tone: m.tone ?? "sky", label: `ATR ${val(m.i)} ${unit}` })) };
};

export function ATRReadingDiagram() {
  const cs = C["atr-reading"];
  const a = atr(cs);
  const hi = a.findIndex((v) => v !== null && Math.round(v) >= 55);
  return (
    <LessonChart
      id="ATRReadingDiagram"
      title="Lire l'ATR : 35 points, puis 55"
      caption="Tant que les bougies M15 du NASDAQ mesurent environ 35 points, l'ATR 14 reste vers 35. Quand elles s'élargissent, l'ATR monte jusqu'à 55 : la volatilité mesurée augmente. L'ATR ne dit rien de la direction, seulement de l'amplitude."
      panels={[{
        key: "m15", title: "NASDAQ M15 · ATR 14", decimals: 0, height: 230, candles: cs,
        subs: [atrSub(cs, [{ key: "a35", i: 25 }, { key: "a55", i: hi, tone: "bear" }], "pts")],
        anim: [{ candles: 25 }, { show: "a35" }, { candles: hi }, { show: "a55" }, { candles: cs.length - 1 }],
      }]}
    />
  );
}

export function ATRStopDiagram() {
  const cs = C["atr-stop"];
  const E = 28, LOW = 25;
  const a = atr(cs)[E]!;
  return (
    <LessonChart
      id="ATRStopDiagram"
      title="La distance du stop face à l'ATR"
      caption="Achat à 27 150, stop à 27 085 sous le creux 27 090 : 65 points. L'ATR M15 vaut 35 points : le stop laisse un peu moins de deux amplitudes moyennes de bougie. Un stop à 5 points serait touché par une simple fluctuation ordinaire."
      panels={[{
        key: "m15", title: "NASDAQ M15 · stop sous le creux", decimals: 0, height: 240, candles: cs, slots: cs.length + 4,
        levels: [
          { key: "entry", price: 27150, from: E, label: `Entrée ${pts(27150)}`, short: "Entrée", tone: "entry" },
          { key: "sl", price: 27085, from: E, label: `Stop ${pts(27085)}`, short: "Stop", tone: "bear", dashed: true },
        ],
        markers: [{ key: "creux", i: LOW, price: cs[LOW].l, label: `Creux ${pts(cs[LOW].l)}`, short: "Creux", tone: "neutral", side: "below", role: "swing-low" }],
        subs: [atrSub(cs, [{ key: "aE", i: E }], "pts")],
        chips: [
          { label: `Stop ${pts(27150 - 27085)} pts ≈ ${fmtNum((27150 - 27085) / a, 1)} ATR`, tone: "bear" },
          { label: `Stop de 5 pts ≈ ${fmtNum(5 / a, 2)} ATR : trop serré`, tone: "neutral" },
        ],
      }]}
    />
  );
}

export function ATRGoldPlanDiagram() {
  const cs = C["atr-gold"];
  const E = 24;
  const t = tradeSetup({ entry: 3912, sl: 3896, tp: 3944, unit: "$", from: E, expect: ">=2" });
  const a = atr(cs)[E]!;
  return (
    <LessonChart
      id="ATRGoldPlanDiagram"
      title="Or M15 : un stop de deux ATR sous le support"
      caption="Résistance 3 948 $ (deux rejets), support 3 900 $ (deux touches). Après la réaction sur le support, achat à 3 912 $, stop à 3 896 $ sous le support, objectif à 3 944 $ avant la résistance. L'ATR M15 vaut 8 $ : le stop de 16 $ en fait deux."
      panels={[{
        key: "m15", title: "XAU/USD M15 · plan et ATR", decimals: 0, height: 270, candles: cs, slots: cs.length + 4,
        levels: [
          { key: "res", price: 3948, from: 3, label: `Résistance ${usd(3948)}`, short: "Résistance", tone: "bear", dashed: true, role: "resistance" },
          { key: "sup", price: 3900, from: 14, label: `Support ${usd(3900)}`, short: "Support", tone: "bull", dashed: true, role: "support" },
          ...t.levels,
        ],
        subs: [atrSub(cs, [{ key: "aE", i: E }], "$")],
        chips: [...t.chips, { label: `Stop ${usd(16)} = ${fmtNum(16 / a, 1)} ATR`, tone: "sky" }],
      }]}
    />
  );
}

export function ATRDailyTargetDiagram() {
  const cs = C["atr-daily"];
  const T = cs.length - 1, Y = T - 1;
  const today = cs[T];
  return (
    <LessonChart
      id="ATRDailyTargetDiagram"
      title="EUR/USD Daily : un objectif face à l'ATR"
      caption="L'ATR journalier vaut 70 pips. Depuis le début de la journée, le prix a déjà parcouru 65 pips (de 1.0830 à 1.0895). Un objectif 80 pips plus haut demanderait une journée bien plus large que d'habitude : possible, mais ambitieux."
      panels={[{
        key: "d1", title: "EUR/USD D1 · ATR 14", decimals: 5, height: 230, candles: cs, slots: cs.length + 3,
        segments: [{ key: "jour", i1: T, p1: today.l, i2: T, p2: today.c, tone: "fib", arrow: true, label: `Parcouru aujourd'hui : ${Math.round((today.c - today.l) * 1e4)} pips`, short: `Parcouru ${Math.round((today.c - today.l) * 1e4)} pips` }],
        offscale: [{ key: "obj", price: Number((today.c + 0.008).toFixed(5)), label: `Objectif ${p(today.c + 0.008)} (+80 pips) ↑`, short: "Objectif ↑", tone: "bull" }],
        subs: [atrSub(cs, [{ key: "aY", i: Y }], "pips")],
      }]}
    />
  );
}
