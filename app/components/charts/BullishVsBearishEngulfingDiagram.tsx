// Price action 3 — engulfing haussier (sur support) vs baissier (sur résistance) :
// la 2e bougie, de sens opposé, englobe entièrement le corps de la 1re ; le
// signal suit la 2e bougie. Bougies : scenarios.ts (« engulfing-bull / -bear »).

import { LessonChart, type LCPanel } from "@/app/components/lessons/LessonChart";
import CANDLES from "@/lib/lessons/generated/candles.json";

function panel(key: "engulfing-bull" | "engulfing-bear"): LCPanel {
  const candles = CANDLES[key];
  const n = candles.length;
  const bull = key === "engulfing-bull";
  const level = bull ? Math.min(...candles.slice(-2).map((k) => k.l)) : Math.max(...candles.slice(-2).map((k) => k.h));
  return {
    key, title: bull ? "Engulfing haussier" : "Engulfing baissier",
    subtitle: bull ? "Rouge puis verte qui englobe le corps rouge, sur un support" : "Verte puis rouge qui englobe le corps vert, sur une résistance",
    decimals: 2, height: 250, candles,
    levels: [{ key: "lvl", price: level, label: bull ? "Support" : "Résistance", tone: bull ? "bull" : "bear", dashed: true, role: bull ? "support" : "resistance" }],
    markers: [
      { key: "k1", i: n - 2, price: bull ? candles[n - 2].l : candles[n - 2].h, label: "Bougie 1", tone: "neutral", side: bull ? "below" : "above" },
      { key: "k2", i: n - 1, price: bull ? candles[n - 1].h : candles[n - 1].l, label: "Bougie 2 : engulfing", short: "Bougie 2", tone: bull ? "bull" : "bear", side: bull ? "above" : "below", role: "engulfing" },
    ],
  };
}

export default function BullishVsBearishEngulfingDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  return (
    <LessonChart
      id="BullishVsBearishEngulfingDiagram"
      title="Engulfing haussier vs baissier"
      panels={[panel("engulfing-bull"), panel("engulfing-bear")]}
      rows={[2]}
      caption="Bougie 2 : de sens opposé à la bougie 1, elle englobe entièrement son corps. Le signal suit la bougie 2."
    />
  );
}
