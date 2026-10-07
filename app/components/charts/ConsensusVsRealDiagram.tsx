// Macro Débutant 3 — le marché réagit à la surprise, pas au chiffre. EUR/USD M1
// autour du NFP, trois cas sur la même échelle : réel = consensus (pas de
// surprise), réel > consensus (dollar ↑ → EUR/USD ↓), réel < consensus
// (dollar ↓ → EUR/USD ↑). Mouvement en pips calculé sur la bougie de publication.

import { LessonChart, type LCPanel } from "@/app/components/lessons/LessonChart";
import { pips } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const PIP = 0.0001;
const RELEASE = 6; // 7e minute : publication

const CASES = [
  { key: "nfp-egal", title: "Réel = consensus", subtitle: "NFP 200k · attendu 200k", usd: "Pas de surprise" },
  { key: "nfp-positif", title: "Réel > consensus", subtitle: "NFP 350k · attendu 200k", usd: "Dollar ↑" },
  { key: "nfp-negatif", title: "Réel < consensus", subtitle: "NFP 100k · attendu 200k", usd: "Dollar ↓" },
] as const;

export const ConsensusVsRealDiagram = (_props: { locale?: "fr" | "es" | "en" } = {}) => {
  const panels: LCPanel[] = CASES.map((c) => {
    const candles = CANDLES[c.key];
    const k = candles[RELEASE];
    const move = pips(k.c, k.o, PIP);
    const sign = k.c > k.o ? "+" : "−";
    const strong = move >= 50;
    return {
      key: c.key, title: c.title, subtitle: c.subtitle, decimals: 5, height: 240,
      candles,
      markers: [{ key: "nfp", i: RELEASE, price: k.h, label: "NFP", tone: "zone", side: "above" }],
      chips: [
        { label: c.usd, tone: strong ? "zone" : undefined },
        { label: `EUR/USD ${sign}${move} pips`, tone: !strong ? undefined : k.c > k.o ? "bull" : "bear", data: { move: `${sign}${move}`, open: k.o, close: k.c } },
      ],
    };
  });
  return (
    <LessonChart
      id="ConsensusVsRealDiagram"
      title="Le marché réagit à la surprise, pas au chiffre"
      panels={panels}
      rows={[3]}
      sharedScale
      caption="EUR/USD en M1, même échelle de prix pour les trois cas. Plus l'écart avec le consensus est grand, plus le mouvement est violent."
    />
  );
};
