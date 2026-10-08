// Price action 4 — plan de trade multi-unités de temps EUR/USD (texte de la leçon) :
// Daily en HH / HL (HH 1.1840, HL 1.1720), zone support H4 1.1750-1.1770 (3 touches),
// pin bar M15 au contact (bas 1.1762, clôture 1.1778). Entrée sur la pin bar M15,
// SL 1.1745 (5 pips sous la zone), TP 1.1840 puis 1.1900. R/R calculés.
// Bougies : scenarios.ts (« mtf-daily / -h4 / -m15 »).

import { LessonChart, type LCMarker } from "@/app/components/lessons/LessonChart";
import { fmtPrice, fmtRR, pips, pivots, tradeMath } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const ZONE = { y1: 1.1750, y2: 1.1770 };
const SL = 1.1745, TP1 = 1.1840, TP2 = 1.1900;
const p = (x: number) => fmtPrice(x, 4);

export default function MultiTFEntryDiagram(_props: { locale?: "fr" | "es" | "en" } = {}) {
  const d = CANDLES["mtf-daily"], h4 = CANDLES["mtf-h4"], m15 = CANDLES["mtf-m15"];
  const named = (cs: typeof d): LCMarker[] => pivots(cs, 2).filter((q) => q.name).map((q) => ({
    key: `p${q.index}`, i: q.index, price: q.price, label: q.name!, pivot: q.name, tone: "neutral", side: q.side === "h" ? "above" : "below",
  }));
  // Touches = creux (pivots) dans la zone, plus le contact actuel (dernière bougie)
  const lows = pivots(h4, 2).filter((q) => q.side === "l" && q.price <= ZONE.y2).map((q) => q.index);
  const touches = [...lows, ...(h4[h4.length - 1].l <= ZONE.y2 ? [h4.length - 1] : [])].map((i) => ({ k: h4[i], i }));
  const pin = m15[m15.length - 1];
  const entry = pin.c;
  const rr = (tp: number) => tradeMath(entry, SL, tp).rr;
  const rrChip = (n: string, tp: number) => ({ label: `${n} ${p(tp)} : +${pips(tp, entry, 0.0001)} pips, R/R ${fmtRR(rr(tp))}`, tone: "bull" as const, data: { rr: fmtRR(rr(tp)), entry, sl: SL, tp } });
  return (
    <LessonChart
      id="MultiTFEntryDiagram"
      title="Daily → H4 → M15 : un setup aligné"
      panels={[
        { key: "daily", title: "Daily · le biais", subtitle: "HH / HL : biais long", decimals: 5, height: 220, candles: d, markers: named(d) },
        {
          key: "h4", title: "H4 · la zone", subtitle: `Support ${p(ZONE.y1)}-${p(ZONE.y2)}, ${touches.length} touches`, decimals: 5, height: 220, candles: h4,
          zones: [{ key: "zone", ...ZONE, label: "Zone H4", tone: "bull", kind: "zone", role: "support" }],
          markers: touches.map(({ k, i }, n) => ({ key: `t${i}`, i, price: k.l, label: `Touche ${n + 1}`, short: `T${n + 1}`, tone: "bull" as const, side: "below" as const })),
        },
        {
          key: "m15", title: "M15 · le signal et l'entrée", subtitle: `Pin bar : bas ${p(pin.l)}, clôture ${p(pin.c)}`, decimals: 5, height: 260, candles: m15,
          zones: [{ key: "zone", ...ZONE, tone: "bull", kind: "zone" }],
          levels: [
            { key: "entry", price: entry, from: m15.length - 1, label: `Entrée ${p(entry)}`, short: "Entrée", tone: "entry" },
            { key: "sl", price: SL, label: `SL ${p(SL)}`, short: "SL", tone: "bear", dashed: true },
          ],
          offscale: [
            { key: "tp1", price: TP1, label: `TP 1 ${p(TP1)} ↑`, short: "TP 1 ↑", tone: "bull" },
            { key: "tp2", price: TP2, label: `TP 2 ${p(TP2)} ↑`, short: "TP 2 ↑", tone: "bull" },
          ],
          markers: [{ key: "pin", i: m15.length - 1, price: pin.h, label: "Pin bar", tone: "bull", side: "above", role: "pinbar", dir: "bull" }],
          chips: [{ label: `Risque ${pips(entry, SL, 0.0001)} pips`, tone: "bear" }, rrChip("TP 1", TP1), rrChip("TP 2", TP2)],
        },
      ]}
      rows={[2, 1]}
    />
  );
}
