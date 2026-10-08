// Intermédiaire 2 et Support / résistance 1 — zones de support et de résistance (format ligne
// validé par le PO) : le prix rebondit plusieurs fois sur le même plancher et est repoussé
// plusieurs fois du même plafond ; les niveaux sont tracés en zones (rectangles), pas en lignes.
// Les prix des niveaux viennent de la leçon (props) ; touches marquées sur la série.

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice } from "@/lib/lessons/chart-analysis";

const parse = (s: string) => Number(s.replace(/[\s$ ]/g, "").replace(",", "."));

export function SupportResistance({ supportPrice = "1.0800", resistancePrice = "1.0950" }: { supportPrice?: string; resistancePrice?: string; className?: string; locale?: "fr" | "es" | "en" }) {
  const S = parse(supportPrice), R = parse(resistancePrice);
  const fx = S < 100, decimals = fx ? 5 : 0;
  const f = (x: number) => (fx ? fmtPrice(x, 4) : `${fmtPrice(Math.round(x), 0)} $`);
  const h = R - S, w = h * 0.06;
  // série : départ au milieu, 3 touches de la résistance et 3 du support
  const shape = [0.45, 0.75, 1, 0.62, 0.3, 0, 0.35, 0.7, 1, 0.66, 0.28, 0, 0.4, 0.78, 1, 0.6, 0.25, 0, 0.42];
  const line = shape.map((t) => Number((S + t * h).toFixed(decimals)));
  const tops = shape.map((t, i) => (t === 1 ? i : -1)).filter((i) => i >= 0);
  const lows = shape.map((t, i) => (t === 0 ? i : -1)).filter((i) => i >= 0);
  return (
    <LessonChart
      id="SupportResistance"
      title="Plancher et plafond répétés"
      caption="Ce sont des zones, pas des lignes : le prix ne respecte jamais un niveau à la bougie près."
      panels={[{
        key: "sr", decimals, height: 240, line,
        zones: [
          { key: "res", y1: R - w, y2: R + w, label: `Résistance ${f(R)}`, short: "Résistance", tone: "bear" },
          { key: "sup", y1: S - w, y2: S + w, label: `Support ${f(S)}`, short: "Support", tone: "bull" },
        ],
        markers: [
          ...tops.map((i, n) => ({ key: `r${n}`, i, price: line[i], label: n ? "Rejet" : "Rejet vers le bas", short: "Rejet", tone: "bear" as const, side: "above" as const, dot: true })),
          ...lows.map((i, n) => ({ key: `s${n}`, i, price: line[i], label: n ? "Rebond" : "Rebond vers le haut", short: "Rebond", tone: "bull" as const, side: "below" as const, dot: true })),
        ],
      }]}
    />
  );
}
