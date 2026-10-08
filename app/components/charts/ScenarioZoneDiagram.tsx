// Multi-UT 3 bloc 3 et Multi-UT 5 bloc 3 (fusionné avec H1ZonePreparationDiagram) — le H1
// prépare la zone (EUR/USD H1) : support 1.1760 cassé par une chute qui laisse un FVG bearish
// 1.1750-1.1760, puis remontée progressive : impulsions de plus en plus courtes, corrections de plus
// en plus longues (texte de Multi-UT 3).
// Aucun signal d'entrée : le scénario attend l'UT inférieure. FVG et corps calculés.
// Bougies : scenarios.ts (« zone-prep-h1 »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice, largestFvg, pips } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);

export function ScenarioZoneDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["zone-prep-h1"];
  const fvg = largestFvg(cs, "bear")!;
  const low = cs.reduce((b, k, i) => (k.l < cs[b].l ? i : b), 0);
  const ups = cs.map((k, i) => (i > low && k.c > k.o ? pips(k.c, k.o, 0.0001) : -1)).filter((b) => b >= 0);
  // corrections : suites de bougies baissières pendant la remontée (profondeur en pips, durée en bougies)
  const corr: { pips: number; n: number }[] = [];
  cs.forEach((k, i) => {
    if (i <= low || k.c >= k.o) return;
    if (i > 0 && cs[i - 1].c < cs[i - 1].o && i - 1 > low) { const c = corr[corr.length - 1]; c.pips = Math.round(c.pips + pips(k.o, k.c, 0.0001)); c.n++; }
    else corr.push({ pips: pips(k.o, k.c, 0.0001), n: 1 });
  });
  return (
    <LessonChart
      id="ScenarioZoneDiagram"
      title="La zone est tracée avant que le prix l'atteigne"
      caption="Le ralentissement à l'approche est un signe d'intérêt, pas un signal d'entrée : on attend l'UT inférieure."
      panels={[{
        key: "h1", title: "EUR/USD H1, biais baissier", decimals: 5, height: 280, candles: cs,
        levels: [{ key: "sup", price: fvg.y2, to: fvg.i, label: `Ancien support ${p(fvg.y2)}`, short: "Ancien support", tone: "neutral", dashed: true }],
        zones: [{ key: "fvg", y1: fvg.y1, y2: fvg.y2, from: fvg.i - 1, label: `Zone ${p(fvg.y1)}-${p(fvg.y2)} (FVG)`, short: "Zone + FVG", tone: "zone", kind: "fvg", src: `zone-prep-h1:${fvg.i}` }],
        markers: [
          { key: "brk", i: fvg.i, price: cs[fvg.i].l, label: "Support cassé", tone: "bear", side: "below" },
          { key: "slow", i: cs.length - 1, price: cs[cs.length - 1].l, label: "Bougies de plus en plus courtes", short: "Ralentissement", tone: "zone", side: "below" },
        ],
        chips: [
          { label: `Impulsions : ${ups.join(", ")} pips`, tone: "zone" },
          { label: `Corrections : ${corr.map((c) => `${c.pips} pips${c.n > 1 ? ` (${c.n} bougies)` : ""}`).join(", ")}`, tone: "neutral" },
        ],
      }]}
    />
  );
}
