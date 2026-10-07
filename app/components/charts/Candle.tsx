// Bougie de signal avec son contexte (Trading Intermédiaire 2, 3, 6) : deux bougies
// d'approche puis la bougie du signal, au contact d'un support ou d'une résistance.
// Prix écrits (sans unité, schéma de principe), continuité ouverture = clôture précédente.

import { LessonChart } from "@/app/components/lessons/LessonChart";
import type { Candle as K } from "@/lib/lessons/chart-analysis";

type CandleType = "bullish" | "bearish" | "pin-bull" | "pin-bear" | "doji";

// Bougies d'approche (2) puis signal ; niveau = support (bas) ou résistance (haut)
const SHAPES: Record<CandleType, { cs: K[]; level: number; side: "support" | "resistance" }> = {
  "pin-bull": { cs: [{ o: 101.2, h: 101.4, l: 100.0, c: 100.2 }, { o: 100.2, h: 100.5, l: 99.1, c: 99.3 }, { o: 99.3, h: 99.8, l: 97.0, c: 99.6 }], level: 97.6, side: "support" },
  "pin-bear": { cs: [{ o: 98.8, h: 100.0, l: 98.6, c: 99.8 }, { o: 99.8, h: 100.9, l: 99.5, c: 100.7 }, { o: 100.7, h: 103.0, l: 100.2, c: 100.4 }], level: 102.4, side: "resistance" },
  bullish: { cs: [{ o: 101.0, h: 101.2, l: 99.8, c: 100.0 }, { o: 100.0, h: 100.2, l: 98.4, c: 98.7 }, { o: 98.7, h: 101.4, l: 98.2, c: 101.2 }], level: 98.2, side: "support" },
  bearish: { cs: [{ o: 99.0, h: 100.2, l: 98.8, c: 100.0 }, { o: 100.0, h: 101.6, l: 99.8, c: 101.3 }, { o: 101.3, h: 101.8, l: 98.6, c: 98.8 }], level: 101.8, side: "resistance" },
  doji: { cs: [{ o: 101.0, h: 101.2, l: 99.8, c: 100.0 }, { o: 100.0, h: 100.2, l: 98.8, c: 99.0 }, { o: 99.0, h: 100.1, l: 97.9, c: 99.05 }], level: 97.9, side: "support" },
};

export function Candle({ type = "bullish", label, caption }: { type?: CandleType; label?: string; caption?: string; className?: string }) {
  const s = SHAPES[type];
  const sig = s.cs[s.cs.length - 1];
  return (
    <LessonChart
      id="Candle"
      title={label}
      panels={[{
        key: type, decimals: 2, height: 200, candleWidth: 30, candles: s.cs, slots: 4,
        levels: [{ key: "lvl", price: s.level, label: s.side === "support" ? "Support" : "Résistance", tone: s.side === "support" ? "bull" : "bear", dashed: true }],
        markers: [{ key: "sig", i: 2, price: s.side === "support" ? sig.h : sig.l, label: "Signal", tone: "entry", side: s.side === "support" ? "above" : "below" }],
      }]}
      caption={caption}
    />
  );
}
