// Trading Débutant 9 — à quoi ressemble chaque biais (tableau de la leçon) :
// FOMO (achat au sommet), vengeance (−1R puis −3R), ancrage (SL déplacé, −5R au
// lieu de −1R), excès de confiance (+5R effacés par un trade aux lots ×5).
// Bougies : scenarios.ts (« bias-fomo », « bias-anchor ») ; résultats en R calculés.

import { LessonChart, type LCPanel } from "@/app/components/lessons/LessonChart";
import { fmtNum } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const cumul = (rs: number[]) => rs.reduce<number[]>((acc, r) => [...acc, acc[acc.length - 1] + r], [0]);
const R = (n: number) => `${n > 0 ? "+" : n < 0 ? "−" : ""}${fmtNum(Math.abs(n), 1)}R`;

export function BiasDiagram() {
  const fomo = CANDLES["bias-fomo"];
  const top = fomo.reduce((b, k, i) => (k.h > fomo[b].h ? i : b), 0);
  const anchor = CANDLES["bias-anchor"];
  const entry = anchor[0].c, risk = 1, exit = anchor[anchor.length - 1].c;
  const revenge = cumul([-1, -3]);
  const confidence = cumul([1, 1, 1, 1, 1, -5]);
  const panels: LCPanel[] = [
    {
      key: "fomo", title: "FOMO", subtitle: "Le marché monte fort, tu achètes en urgence",
      decimals: 2, height: 200, candles: fomo,
      levels: [{ key: "achat", price: fomo[top].c, from: top, label: "Achat", tone: "entry" }],
      markers: [{ key: "top", i: top, price: fomo[top].h, label: "Achat au sommet", tone: "bear", side: "above" }],
      chips: [{ label: "Juste avant le retournement", tone: "bear" }],
    },
    {
      key: "vengeance", title: "Vengeance trading", subtitle: "Tu perds un trade, tu ré-ouvres immédiatement, plus gros",
      decimals: 0, height: 200, line: revenge,
      levels: [{ key: "zero", price: 0, label: "0R", tone: "neutral", dashed: true, faint: true }],
      markers: [
        { key: "t1", i: 1, price: revenge[1], label: "Trade 1 : −1R", tone: "bear", side: "above", dot: true },
        { key: "t2", i: 2, price: revenge[2], label: "Trade 2, lots ×3 : −3R", short: "Lots ×3 : −3R", tone: "bear", side: "above", dot: true },
      ],
      chips: [{ label: `Total ${R(revenge[2])} en 2 trades`, tone: "bear" }],
    },
    {
      key: "ancrage", title: "Ancrage", subtitle: "Le prix descend, tu déplaces le SL au lieu de couper",
      decimals: 2, height: 200, candles: anchor,
      levels: [
        { key: "entry", price: entry, label: "Achat", tone: "entry" },
        { key: "sl", price: entry - risk, label: "SL prévu (−1R)", short: "SL prévu", tone: "bear", dashed: true },
        { key: "exit", price: exit, from: anchor.length - 1, label: `Sortie ${R((exit - entry) / risk)}`, tone: "bear" },
      ],
      chips: [{ label: `${R((exit - entry) / risk)} au lieu du −1R prévu`, tone: "bear" }],
    },
    {
      key: "confiance", title: "Excès de confiance", subtitle: "5 trades gagnants d'affilée, tu te sens invincible",
      decimals: 0, height: 200, line: confidence,
      levels: [{ key: "zero", price: 0, label: "0R", tone: "neutral", dashed: true, faint: true }],
      markers: [
        { key: "peak", i: 5, price: confidence[5], label: "5 gains : +5R", tone: "bull", side: "above", dot: true },
        { key: "loss", i: 6, price: confidence[6], label: "Lots ×5 : −5R", tone: "bear", side: "above", dot: true },
      ],
      chips: [{ label: "Un seul trade efface tout", tone: "bear" }],
    },
  ];
  return <LessonChart id="BiasDiagram" title="Les biais sur le graphique" panels={panels} rows={[2, 2]} />;
}
