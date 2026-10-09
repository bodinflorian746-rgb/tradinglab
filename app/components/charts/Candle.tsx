// Bougie de signal avec son contexte (Trading Intermédiaire 2, 3, 6) : le niveau d'abord prouvé
// (deux touches antérieures, chacune suivie d'une réaction nette : règle PO, un support ou une
// résistance n'existe que si le graphique le montre), puis deux bougies d'approche et la bougie
// du signal au contact. Prix écrits (sans unité, schéma de principe), continuité ouverture =
// clôture précédente.

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

// Historique du niveau, en distances au niveau : [ouverture, extrême opposé au niveau, extrême
// côté niveau, clôture]. Touches aux bougies 2 et 7 (à 0,1 et 0,05 du niveau), réactions jusqu'à
// plus de 2 au-delà ; la dernière clôture rejoint l'ouverture de la 1re bougie d'approche (x).
const HISTORY = (x: number): number[][] => [
  [3.4, 3.6, 2.4, 2.6], [2.6, 2.8, 0.8, 1.0], [1.0, 1.5, 0.1, 1.3], [1.3, 2.6, 1.2, 2.4], [2.4, 3.2, 2.3, 3.0],
  [3.0, 3.1, 1.9, 2.0], [2.0, 2.1, 0.7, 0.9], [0.9, 1.6, 0.05, 1.4], [1.4, Math.max(x, 1.4) + 0.2, 1.3, x],
];
function withHistory(s: { cs: K[]; level: number; side: "support" | "resistance" }): K[] {
  const L = s.level, sup = s.side === "support";
  const x = Math.round(Math.abs(s.cs[0].o - L) * 100) / 100;
  const at = (d: number) => Math.round((sup ? L + d : L - d) * 100) / 100;
  const hist = HISTORY(x).map(([o, far, near, c]) => ({ o: at(o), c: at(c), h: sup ? at(far) : at(near), l: sup ? at(near) : at(far) }));
  return [...hist, ...s.cs];
}

export function Candle({ type = "bullish", label, caption }: { type?: CandleType; label?: string; caption?: string; className?: string }) {
  const s = SHAPES[type];
  const cs = withHistory(s);
  const sig = cs[cs.length - 1];
  return (
    <LessonChart
      id="Candle"
      title={label}
      panels={[{
        key: type, decimals: 2, height: 220, candleWidth: 16, candles: cs, slots: cs.length + 1,
        levels: [{ key: "lvl", price: s.level, label: s.side === "support" ? "Support" : "Résistance", tone: s.side === "support" ? "bull" : "bear", dashed: true }],
        markers: [{ key: "sig", i: cs.length - 1, price: s.side === "support" ? sig.h : sig.l, label: "Signal", tone: "entry", side: s.side === "support" ? "above" : "below", ...(type.startsWith("pin") ? { role: "pinbar" as const, dir: s.side === "support" ? "bull" as const : "bear" as const } : {}) }],
      }]}
      caption={caption}
    />
  );
}
