// Backtest d'exemple (Trading Avancé 9) : 100 trades, chaque métrique du schéma
// est calculée sur cette liste (winrate, R moyen, profit factor, drawdown max,
// répartition des résultats, courbe du capital).

import { mulberry32 } from "@/lib/games/shared";

/** Résultats en R et nombre de trades : 55 pertes à −1R, 45 gains de +1R à +3R. */
export const BACKTEST_COUNTS: [number, number][] = [[-1, 55], [1, 5], [2, 15], [3, 25]];
/** Risque fixe par trade, en % du capital de départ */
export const BACKTEST_RISK_PCT = 1;
const SEED = 920;

export function backtestTrades(seed = SEED): number[] {
  const list = BACKTEST_COUNTS.flatMap(([r, n]) => Array.from({ length: n }, () => r));
  const rng = mulberry32(seed);
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

export interface BacktestStats {
  n: number;
  wins: number;
  winrate: number;      // %
  avgR: number;
  profitFactor: number;
  /** Capital en % du départ, avant le 1er trade puis après chaque trade */
  equity: number[];
  maxDD: number;        // % depuis un pic
  ddPeak: number;       // indice du pic (equity)
  ddTrough: number;     // indice du creux (equity)
}

export function backtestStats(trades: number[], riskPct = BACKTEST_RISK_PCT): BacktestStats {
  const wins = trades.filter((r) => r > 0).length;
  const gains = trades.filter((r) => r > 0).reduce((a, b) => a + b, 0);
  const losses = -trades.filter((r) => r < 0).reduce((a, b) => a + b, 0);
  const equity = [100];
  for (const r of trades) equity.push(equity[equity.length - 1] + r * riskPct);
  let peak = 0, maxDD = 0, ddPeak = 0, ddTrough = 0;
  equity.forEach((v, i) => {
    if (v > equity[peak]) peak = i;
    const dd = ((equity[peak] - v) / equity[peak]) * 100;
    if (dd > maxDD) { maxDD = dd; ddPeak = peak; ddTrough = i; }
  });
  return {
    n: trades.length, wins, winrate: (wins / trades.length) * 100,
    avgR: trades.reduce((a, b) => a + b, 0) / trades.length,
    profitFactor: gains / losses, equity, maxDD, ddPeak, ddTrough,
  };
}
