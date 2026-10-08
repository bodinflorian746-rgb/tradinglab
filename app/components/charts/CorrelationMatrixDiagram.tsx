// Macro Intermédiaire 5 — corrélations entre actifs, en tendance (et non en coefficients
// précis, qui varient) : les trois exemples du texte (EUR/USD - GBP/USD positive forte,
// XAU/USD - DXY négative forte, BTC/USD - Nasdaq positive depuis 2022) et leurs voisins.

import { LessonSchema, Matrix } from "@/app/components/lessons/LessonSchema";
import type { LCTone } from "@/app/components/lessons/LessonChart";

const ASSETS = ["EUR/USD", "GBP/USD", "XAU/USD", "DXY", "Nasdaq", "BTC/USD"];
const SHORT = ["EUR", "GBP", "XAU", "DXY", "NDX", "BTC"];
// ++ positive forte · + positive · 0 faible · − négative · −− négative forte
const M: string[][] = [
  ["", "++", "+", "−−", "+", "+"],
  ["++", "", "+", "−−", "+", "+"],
  ["+", "+", "", "−−", "0", "0"],
  ["−−", "−−", "−−", "", "−", "−"],
  ["+", "+", "0", "−", "", "++"],
  ["+", "+", "0", "−", "++", ""],
];
const tone = (s: string): LCTone | undefined => (s === "++" ? "bull" : s === "+" ? "sky" : s === "−" ? "zone" : s === "−−" ? "bear" : undefined);

export const CorrelationMatrixDiagram = () => (
  <LessonSchema id="CorrelationMatrixDiagram" title="Qui bouge avec qui" caption="EUR = EUR/USD, GBP = GBP/USD, XAU = XAU/USD, NDX = Nasdaq, BTC = BTC/USD. ++ positive forte · + positive · 0 lien faible · − négative · −− négative forte. Les corrélations changent avec le régime de marché.">
    <Matrix head={SHORT} rows={ASSETS.map((a, i) => ({ label: <abbr title={a}>{SHORT[i]}</abbr>, cells: M[i].map((s) => ({ text: s || "·", tone: tone(s) })) }))} />
  </LessonSchema>
);
