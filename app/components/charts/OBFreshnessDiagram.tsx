// SMC 3 bloc 2 — OB frais vs OB mitigé (EUR/USD H4), même Order Block (corps 1.1745-1.1752) :
// à gauche, le premier retour n'a jamais retraversé le corps (moins de 20 bougies) : réaction
// attendue ; à droite, le prix a retraversé tout le corps : ordres exécutés, OB consommé.
// Retraversée et âge calculés. Bougies : scenarios.ts (« smc-ob », « ob-mitigated »).

import { LessonChart, type LCPanel } from "@/app/components/lessons/LessonChart";
import { fmtPrice, type Candle } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";
import { obLayout } from "./OrderBlockDiagram";

const p = (x: number) => fmtPrice(x, 4);

function panel(key: "smc-ob" | "ob-mitigated", title: string): LCPanel {
  const cs = CANDLES[key] as Candle[];
  const { obI, ob } = obLayout(cs);
  const through = cs.findIndex((k, i) => i > obI + 1 && k.c < ob.y1);
  const touch = cs.findIndex((k, i) => i > obI + 2 && k.l <= ob.y2);
  return {
    key, title, decimals: 5, height: 230, candles: cs,
    subtitle: through > 0 ? `Corps retraversé ${through - obI} bougies après sa formation` : `Retour ${touch - obI} bougies après, corps jamais retraversé`,
    zones: [{ key: "ob", ...ob, from: obI, label: `OB ${p(ob.y1)}-${p(ob.y2)}`, short: "OB", tone: through > 0 ? "neutral" : "zone", kind: "ob", src: `${key}:${obI}`, role: "ob", dir: "bull" }],
    markers: [through > 0
      ? { key: "m", i: through, price: cs[through].c, label: "Clôture sous l'OB : consommé", short: "Consommé", tone: "bear", side: "below", role: "close" }
      : { key: "m", i: touch, price: cs[touch].l, label: "Premier retour : rejet", short: "Rejet", tone: "bull", side: "below", role: "rejet", ref: "ob", dir: "bull" }],
  };
}

export default function OBFreshnessDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  return (
    <LessonChart
      id="OBFreshnessDiagram"
      title="OB frais ou OB mitigé"
      caption="Un OB frais (moins de 20 bougies H4, jamais retraversé) réagit mieux ; un OB mitigé n'est plus exploitable."
      panels={[panel("smc-ob", "✓ OB frais"), panel("ob-mitigated", "✗ OB mitigé")]}
      rows={[2]}
      sharedScale
    />
  );
}
