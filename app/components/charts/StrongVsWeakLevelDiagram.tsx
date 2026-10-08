// Support / résistance 1 bloc 2 — niveau fort vs niveau faible (XAU/USD H4, support 4 500 $) :
// 4 touches franches avec rebonds nets (niveau fort, prioritaire) contre 2 touches molles sans
// amplitude après le rebond (niveau faible, à exclure). Touches et rebonds calculés.
// Bougies : scenarios.ts (« sr-strong », « sr-weak »).

import { LessonChart, type LCPanel } from "@/app/components/lessons/LessonChart";
import { usd } from "@/app/components/lessons/trade";
import type { Candle } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const Z = { y1: 4495, y2: 4510 };

function panel(key: "sr-strong" | "sr-weak", title: string): LCPanel {
  const cs = CANDLES[key] as Candle[];
  const touches = cs.map((k, i) => (k.l <= Z.y2 && k.c >= Z.y1 && (i === 0 || cs[i - 1].l > Z.y2) ? i : -1)).filter((i) => i >= 0);
  const rebounds = touches.map((t, n) => Math.max(...cs.slice(t, touches[n + 1] ?? cs.length).map((k) => k.h)) - cs[t].l);
  return {
    key, title, decimals: 0, height: 220, candles: cs,
    subtitle: `${touches.length} touches · rebonds de ${usd(Math.min(...rebounds))} à ${usd(Math.max(...rebounds))}`,
    zones: [{ key: "sup", ...Z, label: `Support ${usd(4500)}`, short: "Support", tone: "zone", role: "support" }],
    markers: touches.map((i, n) => ({ key: `t${n}`, i, price: cs[i].l, label: `Touche ${n + 1}`, short: `T${n + 1}`, tone: "neutral" as const, side: "below" as const })),
  };
}

export default function StrongVsWeakLevelDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  return (
    <LessonChart
      id="StrongVsWeakLevelDiagram"
      title="Niveau fort ou niveau faible"
      caption="Le nombre de touches et la qualité des réactions distinguent les niveaux exploitables des niveaux marginaux."
      panels={[panel("sr-strong", "✓ Niveau fort : touches franches"), panel("sr-weak", "✗ Niveau faible : touches molles")]}
      rows={[2]}
      sharedScale
    />
  );
}
