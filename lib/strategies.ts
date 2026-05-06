export type StrategyLevel = "debutant" | "intermediaire" | "avance";

export interface StrategyModule {
  id:          string;
  title:       string;
  subtitle:    string;
  level:       StrategyLevel;
  order:       number;
  lessonCount: number;
  isFree:      boolean;
}

export const STRATEGY_MODULES: StrategyModule[] = [
  {
    id:          "price-action",
    title:       "Price Action",
    subtitle:    "Lis le marché brut sans indicateurs — bougies, pin bars, engulfing et setup multi-timeframe.",
    level:       "debutant",
    order:       1,
    lessonCount: 4,
    isFree:      true,
  },
  {
    id:          "support-resistance",
    title:       "Support / Résistance & Range",
    subtitle:    "Identifie les zones de prix qui comptent et trade les marchés latéraux — polarité, range, breakout vs fakeout.",
    level:       "debutant",
    order:       2,
    lessonCount: 4,
    isFree:      true,
  },
  {
    id:          "trend-following",
    title:       "Trend Following",
    subtitle:    "Trade dans le sens du marché avec des pullbacks disciplinés — tendance, retracement, sortie sur structure.",
    level:       "debutant",
    order:       3,
    lessonCount: 4,
    isFree:      true,
  },
  {
    id:          "smc",
    title:       "SMC : Penser institutionnel",
    subtitle:    "Comprends comment les institutions structurent leurs positions et aligne-toi — Supply/Demand, BOS, CHoCH, confluences.",
    level:       "intermediaire",
    order:       4,
    lessonCount: 5,
    isFree:      true,
  },
  {
    id:          "reversal",
    title:       "Reversal & Retournements",
    subtitle:    "Identifie et trade les retournements aux extrêmes — Fibonacci 0.618/0.786, divergences, confirmations combinées.",
    level:       "intermediaire",
    order:       5,
    lessonCount: 4,
    isFree:      true,
  },
  {
    id:          "multi-timeframe",
    title:       "Multi-timeframe Process",
    subtitle:    "Méthode top-down disciplinée pour transformer une lecture macro en exécution précise — Daily → H4 → H1 → entrée.",
    level:       "intermediaire",
    order:       6,
    lessonCount: 5,
    isFree:      true,
  },
  {
    id:          "ict",
    title:       "ICT complet",
    subtitle:    "L'arsenal institutionnel pro — Order Block, FVG, Liquidity sweeps, Killzones, OTE, Power of 3.",
    level:       "avance",
    order:       7,
    lessonCount: 6,
    isFree:      true,
  },
  {
    id:          "macro-trading",
    title:       "Macro Trading",
    subtitle:    "Trade les news majeures et les régimes de marché — FOMC Fade, NFP Overreaction, Régime Risk-off, filtre macro pré-trade.",
    level:       "avance",
    order:       8,
    lessonCount: 4,
    isFree:      true,
  },
];
