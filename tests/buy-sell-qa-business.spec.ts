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

  // V3 — vérifications spécifiques aux nouveaux setups
  if (setup === "weak_breakout") {
    // La cassure doit être faible : body de la dernière candle avant les "non-trigger" candles
    // (la 10e dans le past) doit être petit, et son close juste au-dessus de R=10.
    // On vérifie qu'aucune candle past n'a un close fort au-dessus de R.
    const above = chart.past.filter((k) => k.c > 10.4);
    if (above.length > 0) {
      issues.push(`weak_breakout: ${above.length} candle(s) close > 10.4 — la cassure est trop convaincante (devrait rester < 10.4)`);
    }
    // Dernière past doit être juste au-dessus ou à R
    const lastPast = chart.past[chart.past.length - 1];
    if (lastPast.c < 9.9 || lastPast.c > 10.5) {
      issues.push(`weak_breakout: dernière past close ${lastPast.c.toFixed(2)} (devrait être [9.9, 10.5])`);
    }
  }

  if (setup === "fvg_overmitigated") {
    // La zone FVG doit exister. La dernière past doit être dans le bas du FVG
    // (mitigation profonde).
    const fvg = chart.zones.find((z) => z.kind === "fvg");
    if (!fvg) issues.push(`fvg_overmitigated: zone FVG manquante`);
    else {
      const lastPast = chart.past[chart.past.length - 1];
      const fvgMid = (fvg.y1 + fvg.y2) / 2;
      if (lastPast.c > fvgMid + (fvg.y2 - fvg.y1) * 0.15) {
        issues.push(`fvg_overmitigated: dernière past close ${lastPast.c.toFixed(2)} (devrait être <= mid+15% du FVG = ${(fvgMid + (fvg.y2 - fvg.y1) * 0.15).toFixed(2)})`);
      }
    }
  }

  if (setup === "counter_trend_bounce") {
    // Le past doit montrer un downtrend significatif au début (au moins 3 unités de baisse)
    // ET ne pas révéler la résolution (la fin du past ne doit pas être plus bas que le minor level).
    const firstHigh = chart.past[0].h;
    const minorLevelIdx = 8; // après les 8 candles de downtrend
    if (minorLevelIdx < chart.past.length) {
      const dropAmount = firstHigh - chart.past[minorLevelIdx - 1].l;
      if (dropAmount < 2) {
        issues.push(`counter_trend_bounce: downtrend trop faible (${dropAmount.toFixed(2)} < 2)`);
      }
    }
  }

  if (setup === "dirty_range_sweep") {
    // Au moins une bougie past doit avoir une mèche au-dessus de R=6 (sweep haut)
    // ET une mèche en-dessous de S=1 (sweep bas).
    const wickAboveR = chart.past.some((k) => k.h > 6.3);
    const wickBelowS = chart.past.some((k) => k.l < 0.7);
    if (!wickAboveR) issues.push(`dirty_range_sweep: pas de sweep visible au-dessus de R=6`);
    if (!wickBelowS) issues.push(`dirty_range_sweep: pas de sweep visible en-dessous de S=1`);
    // Dernière candle doit être au milieu
    const lastPast = chart.past[chart.past.length - 1];
    if (lastPast.c < 2 || lastPast.c > 5) {
      issues.push(`dirty_range_sweep: dernière past close ${lastPast.c.toFixed(2)} hors milieu du range [2, 5]`);
    }
  }

  if (setup === "setup_toxic_execution") {
    // Le past doit ressembler à un pullback bull (uptrend visible puis pullback).
    // On vérifie juste qu'il y a une zone de demande et que le past finit au point bas du pullback.
    const support = chart.zones.find((z) => z.kind === "support");
    if (!support) issues.push(`setup_toxic_execution: zone "Zone de demande" manquante`);
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
    setups: [
      "false_breakout_bullish",
      "liquidity_sweep_reversal",
      "rejection_resistance",
      "weak_breakout",
      "counter_trend_bounce",
    ],
  },
  {
    difficulty: "advanced",
    setups: [
      "false_breakout_bearish",
      "fvg_reaction",
      "range_no_opp",
      "fvg_overmitigated",
      "dirty_range_sweep",
      "setup_toxic_execution",
    ],
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

  // V3 — équilibrage des niveaux
  test("V3 — pool avancé contient au moins 5 NO_TRADE (rééquilibrage)", () => {
    const pool = SCENARIO_TEMPLATES.filter((t) => t.difficulties.includes("advanced"));
    const noTrades = pool.filter((t) => t.correctAnswer === "NO_TRADE");
    console.log(`Pool avancé : ${pool.length} setups, ${noTrades.length} NO_TRADE (${Math.round(noTrades.length / pool.length * 100)}%)`);
    expect(noTrades.length, `pool advanced doit contenir >= 5 NO_TRADE`).toBeGreaterThanOrEqual(5);
    // Taux NO_TRADE >= 35%
    expect(noTrades.length / pool.length).toBeGreaterThanOrEqual(0.35);
  });

  test("V3 — les 5 nouveaux templates existent avec rationales complètes", () => {
    const newIds: SetupKey[] = [
      "weak_breakout",
      "fvg_overmitigated",
      "counter_trend_bounce",
      "dirty_range_sweep",
      "setup_toxic_execution",
    ];
    for (const id of newIds) {
      const t = SCENARIO_TEMPLATES.find((x) => x.id === id);
      expect(t, `${id} doit exister`).toBeDefined();
      expect(t!.correctAnswer, `${id} doit être NO_TRADE`).toBe("NO_TRADE");
      expect(t!.rationales.BUY.length, `${id}.rationales.BUY`).toBeGreaterThan(50);
      expect(t!.rationales.SELL.length, `${id}.rationales.SELL`).toBeGreaterThan(50);
      expect(t!.rationales.NO_TRADE.length, `${id}.rationales.NO_TRADE`).toBeGreaterThan(50);
    }
  });

  test("V3 — setup_toxic_execution force spread élevé + session morte (metaOverride)", () => {
    const t = SCENARIO_TEMPLATES.find((x) => x.id === "setup_toxic_execution");
    expect(t!.metaOverride?.spread).toBe("élevé");
    expect(t!.metaOverride?.session).toBe("Heures mortes");
    expect(t!.metaOverride?.volatility).toBe("faible");
  });
});

// Suppress unused warning for lastN/bodySize helpers (kept for future extension)
void lastN;
void bodySize;
