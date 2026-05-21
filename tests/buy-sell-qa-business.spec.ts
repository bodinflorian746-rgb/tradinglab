// QA métier : pour 3 setups par niveau, on inspecte le chart généré et on
// vérifie 9 critères de cohérence trading (cf. spec V2).
//
// On charge le moteur DIRECTEMENT (côté Node, pas via Playwright web).

import { test, expect } from "@playwright/test";
import {
  buildChart,
  SCENARIO_TEMPLATES,
  type Difficulty,
  type SetupKey,
  type Candle,
  type BuySellChart,
} from "../lib/games/buy-sell-no-trade";

interface QACheck {
  setup:      SetupKey;
  difficulty: Difficulty;
  chart:      BuySellChart;
  issues:     string[];
}

function lastN<T>(arr: T[], n: number): T[] {
  return arr.slice(Math.max(0, arr.length - n));
}

function bodySize(k: Candle): number {
  return Math.abs(k.c - k.o);
}

function isGreen(k: Candle): boolean {
  return k.c > k.o;
}

function audit(setup: SetupKey, difficulty: Difficulty, seed: number): QACheck {
  const chart = buildChart(setup, seed, "normale", difficulty);
  const issues: string[] = [];

  // 1) Au moins 8 bougies dans le past (sinon impossible de juger le contexte)
  if (chart.past.length < 8) {
    issues.push(`past trop court : ${chart.past.length} bougies (< 8)`);
  }

  // 2) Au moins 3 bougies dans le future (sinon le reveal n'apporte rien)
  if (chart.future.length < 3) {
    issues.push(`future trop court : ${chart.future.length} bougies (< 3)`);
  }

  // 3) Continuité past/future : le close de la dernière past ≈ open de la 1re future
  if (chart.past.length > 0 && chart.future.length > 0) {
    const lastPastClose = chart.past[chart.past.length - 1].c;
    const firstFutOpen  = chart.future[0].o;
    const gap = Math.abs(lastPastClose - firstFutOpen);
    const range = chart.domain.max - chart.domain.min;
    if (gap > range * 0.1) {
      issues.push(`discontinuité past→future : gap ${gap.toFixed(2)} sur range ${range.toFixed(2)}`);
    }
  }

  // 4) Domain encadre toutes les valeurs visibles + futures
  const all = [...chart.past, ...chart.future];
  for (const k of all) {
    if (k.h > chart.domain.max + 0.01) issues.push(`high ${k.h.toFixed(2)} > domain.max ${chart.domain.max.toFixed(2)}`);
    if (k.l < chart.domain.min - 0.01) issues.push(`low ${k.l.toFixed(2)} < domain.min ${chart.domain.min.toFixed(2)}`);
  }

  // 5) Cohérence template-spécifique : le past NE doit PAS révéler la résolution.
  //    Pour les setups de continuation/breakout, le past finit AU déclencheur (pas
  //    de "5 follow-through" déjà visibles).
  if (setup === "breakout_bullish_clean") {
    // Past doit contenir le breakout candle (close au-dessus de R=10) mais pas plus
    // de 1 candle de follow-through.
    const aboveR = chart.past.filter((k) => k.c > 10).length;
    if (difficulty === "beginner" && aboveR > 2) {
      issues.push(`beginner: ${aboveR} candles au-dessus de R = follow-through visible (max 2)`);
    }
    if (difficulty !== "beginner" && aboveR > 1) {
      issues.push(`${difficulty}: ${aboveR} candles au-dessus de R = trop de follow-through (max 1)`);
    }
    // La dernière past doit être le breakout (verte au-dessus de R)
    const lastPast = chart.past[chart.past.length - 1];
    if (difficulty !== "beginner" && !(isGreen(lastPast) && lastPast.c > 10)) {
      issues.push(`dernière past devrait être le breakout candle (verte close > 10)`);
    }
  }

  if (setup === "breakout_bearish_clean") {
    const belowS = chart.past.filter((k) => k.c < 0).length;
    if (difficulty === "beginner" && belowS > 2) {
      issues.push(`beginner: ${belowS} candles sous S = follow-through visible (max 2)`);
    }
    if (difficulty !== "beginner" && belowS > 1) {
      issues.push(`${difficulty}: ${belowS} candles sous S = trop de follow-through (max 1)`);
    }
  }

  if (setup === "false_breakout_bullish") {
    // Past doit montrer un breakout APPARENT (close au-dessus de R=10), pas le drop.
    // Aucune candle past ne doit déjà être profondément sous R (sinon le piège est
    // déjà révélé).
    const lastPast = chart.past[chart.past.length - 1];
    if (lastPast.c < 9.3) {
      issues.push(`false breakout: dernière past close ${lastPast.c.toFixed(2)} (devrait être >= 9.3 pour ne pas trahir le piège)`);
    }
  }

  if (setup === "false_breakout_bearish") {
    const lastPast = chart.past[chart.past.length - 1];
    if (lastPast.c > 0.7) {
      issues.push(`false breakout bear: dernière past close ${lastPast.c.toFixed(2)} (devrait être <= 0.7)`);
    }
  }

  if (setup === "liquidity_sweep_reversal") {
    // Past doit contenir le sweep candle (longue mèche basse + close au-dessus du low).
    // Le low du sweep doit être SOUS le précédent low (L=1).
    const sweepCandle = chart.past[chart.past.length - (difficulty === "beginner" ? 2 : 1)];
    if (sweepCandle.l >= 1) {
      issues.push(`sweep: la mèche basse ${sweepCandle.l.toFixed(2)} devrait être < 1 (précédent low)`);
    }
    if (sweepCandle.c <= 1) {
      issues.push(`sweep: close ${sweepCandle.c.toFixed(2)} devrait être > 1 (rejet de la liquidité)`);
    }
  }

  if (setup === "fvg_reaction") {
    // Past doit montrer le pullback dans le FVG (zone visible) sans la résolution.
    // Aucune candle future ne doit déjà être tombée dans le past.
    // Pas de critère spécifique simple — on vérifie juste que la zone FVG est dans le domain.
    const fvg = chart.zones.find((z) => z.kind === "fvg");
    if (!fvg) issues.push(`fvg_reaction: zone FVG manquante`);
  }

  if (setup === "trade_before_news") {
    // Past doit être calme (volatilité tassée). Aucune candle past ne doit déjà
    // montrer le spike.
    const maxRange = Math.max(...chart.past.map((k) => k.h - k.l));
    if (maxRange > 1.5) {
      issues.push(`news: past contient une candle de range ${maxRange.toFixed(2)} (devrait être < 1.5, marché serré avant news)`);
    }
  }

  if (setup === "range_no_opp") {
    // Past doit osciller dans [S=1, R=6]. Dernière candle dans le milieu du range.
    const lastPast = chart.past[chart.past.length - 1];
    if (lastPast.c < 1.5 || lastPast.c > 5.5) {
      issues.push(`range: dernière past close ${lastPast.c.toFixed(2)} hors zone neutre [1.5, 5.5]`);
    }
  }

  return { setup, difficulty, chart, issues };
}

// ─── QA pour 9 scénarios (3 par niveau) ───────────────────────────────────────

const QA_PLAN: { difficulty: Difficulty; setups: SetupKey[] }[] = [
  {
    difficulty: "beginner",
    setups: ["breakout_bullish_clean", "pullback_bullish_trend", "trade_before_news"],
  },
  {
    difficulty: "intermediate",
    setups: ["false_breakout_bullish", "liquidity_sweep_reversal", "rejection_resistance"],
  },
  {
    difficulty: "advanced",
    setups: ["false_breakout_bearish", "fvg_reaction", "range_no_opp"],
  },
];

test.describe("QA métier BUY/SELL/NO TRADE V2", () => {
  for (const { difficulty, setups } of QA_PLAN) {
    for (const setup of setups) {
      test(`coherence trading — ${difficulty} / ${setup}`, () => {
        // Audit sur 5 seeds différentes pour couvrir le PRNG
        const allIssues: string[] = [];
        for (let s = 1; s <= 5; s++) {
          const result = audit(setup, difficulty, s * 1000 + 7);
          for (const issue of result.issues) {
            allIssues.push(`[seed=${s * 1000 + 7}] ${issue}`);
          }
        }
        if (allIssues.length > 0) {
          console.log(`⚠️ ${difficulty}/${setup} :\n  ` + allIssues.join("\n  "));
        }
        expect(allIssues, allIssues.join("\n")).toEqual([]);
      });
    }
  }

  test("templates : chaque setup a 3 rationales + 3 lessons + au moins 1 difficulty", () => {
    for (const t of SCENARIO_TEMPLATES) {
      expect(t.rationales.BUY,      `${t.id}.rationales.BUY`).toBeTruthy();
      expect(t.rationales.SELL,     `${t.id}.rationales.SELL`).toBeTruthy();
      expect(t.rationales.NO_TRADE, `${t.id}.rationales.NO_TRADE`).toBeTruthy();
      expect(t.lessons.beginner,    `${t.id}.lessons.beginner`).toBeTruthy();
      expect(t.lessons.intermediate,`${t.id}.lessons.intermediate`).toBeTruthy();
      expect(t.lessons.advanced,    `${t.id}.lessons.advanced`).toBeTruthy();
      expect(t.difficulties.length, `${t.id}.difficulties non vide`).toBeGreaterThan(0);
    }
  });

  test("pool beginner contient au moins 6 setups (variété de session)", () => {
    const pool = SCENARIO_TEMPLATES.filter((t) => t.difficulties.includes("beginner"));
    expect(pool.length).toBeGreaterThanOrEqual(6);
  });

  test("pool advanced inclut les setups à pièges (false breakout, sweep, fvg)", () => {
    const pool = SCENARIO_TEMPLATES.filter((t) => t.difficulties.includes("advanced"));
    const ids = pool.map((t) => t.id);
    expect(ids).toContain("false_breakout_bullish");
    expect(ids).toContain("false_breakout_bearish");
    expect(ids).toContain("liquidity_sweep_reversal");
    expect(ids).toContain("fvg_reaction");
  });
});

// Suppress unused warning for lastN/bodySize helpers (kept for future extension)
void lastN;
void bodySize;
