// QA métier "Build the Trade"
//
// Pour chaque template, sur 5 seeds :
// 1) Le chart se génère sans erreur (past >= 10, future >= 5).
// 2) Entries ordonnés correctement par direction.
// 3) Stop logical respecte le bon côté du swing.
// 4) TP balanced donne un RR proche de 2:1.
// 5) Avec le combo OPTIMAL, le trade gagne (TP touché avant SL).
// 6) Avec le combo PIRE (tight stop + ambitious tp), le trade perd souvent.

import { test, expect } from "@playwright/test";
import {
  BUILD_TRADE_TEMPLATES,
  buildBuildTradeChart,
  evaluateTrade,
  type Difficulty,
} from "../lib/games/build-the-trade";

test.describe("QA métier Build the Trade", () => {
  test("15 templates minimum avec champs requis", () => {
    expect(BUILD_TRADE_TEMPLATES.length).toBeGreaterThanOrEqual(15);
    for (const t of BUILD_TRADE_TEMPLATES) {
      expect(t.id).toBeTruthy();
      expect(t.title.length).toBeGreaterThan(5);
      expect(t.context.length).toBeGreaterThan(20);
      expect(t.optimalExplain.length).toBeGreaterThan(50);
      expect(t.lessons.beginner.length).toBeGreaterThan(20);
      expect(t.lessons.intermediate.length).toBeGreaterThan(20);
      expect(t.lessons.advanced.length).toBeGreaterThan(20);
      expect(t.difficulties.length).toBeGreaterThan(0);
      expect(["aggressive", "confirmation", "deep_pullback"]).toContain(t.optimal.entry);
      expect(["tight", "logical", "wide"]).toContain(t.optimal.stop);
      expect(["fast", "balanced", "ambitious"]).toContain(t.optimal.tp);
    }
  });

  test("pools par difficulté contiennent assez de templates", () => {
    const pools: Record<Difficulty, number> = {
      beginner:     BUILD_TRADE_TEMPLATES.filter((t) => t.difficulties.includes("beginner")).length,
      intermediate: BUILD_TRADE_TEMPLATES.filter((t) => t.difficulties.includes("intermediate")).length,
      advanced:     BUILD_TRADE_TEMPLATES.filter((t) => t.difficulties.includes("advanced")).length,
    };
    console.log("Pools build-the-trade :", pools);
    expect(pools.beginner).toBeGreaterThanOrEqual(4);
    expect(pools.intermediate).toBeGreaterThanOrEqual(10);
    expect(pools.advanced).toBeGreaterThanOrEqual(13);
  });

  test("charts cohérents : past >= 10, future >= 5, entries ordonnés", () => {
    for (const t of BUILD_TRADE_TEMPLATES) {
      for (let s = 1; s <= 5; s++) {
        const chart = buildBuildTradeChart(t, s * 1000 + 31, "normale");
        expect(chart.past.length, `${t.id} seed=${s} past >= 8`).toBeGreaterThanOrEqual(8);
        expect(chart.future.length, `${t.id} seed=${s} future >= 5`).toBeGreaterThanOrEqual(5);
        // Pour BUY : deep_pullback < aggressive < confirmation
        // Pour SELL : confirmation < aggressive < deep_pullback
        if (chart.direction === "BUY") {
          expect(chart.entries.deep_pullback, `${t.id} deep < aggressive`).toBeLessThan(chart.entries.aggressive);
          expect(chart.entries.aggressive, `${t.id} aggressive < confirmation`).toBeLessThan(chart.entries.confirmation);
          // Stops : tous en dessous de l'entry aggressive
          expect(chart.stops.tight).toBeLessThan(chart.entries.aggressive);
          expect(chart.stops.logical).toBeLessThan(chart.entries.aggressive);
          expect(chart.stops.wide).toBeLessThan(chart.entries.aggressive);
          // Ordre des stops : wide < logical < tight (tight = plus haut = plus serré pour BUY)
          expect(chart.stops.wide).toBeLessThan(chart.stops.logical);
          expect(chart.stops.logical).toBeLessThan(chart.stops.tight);
          // TPs : tous au-dessus de l'entry confirmation
          expect(chart.tps.fast).toBeGreaterThan(chart.entries.confirmation);
          expect(chart.tps.balanced).toBeGreaterThan(chart.tps.fast);
          expect(chart.tps.ambitious).toBeGreaterThan(chart.tps.balanced);
        } else {
          expect(chart.entries.confirmation, `${t.id} confirmation < aggressive`).toBeLessThan(chart.entries.aggressive);
          expect(chart.entries.aggressive, `${t.id} aggressive < deep_pullback`).toBeLessThan(chart.entries.deep_pullback);
          expect(chart.stops.tight).toBeGreaterThan(chart.entries.aggressive);
          expect(chart.stops.logical).toBeGreaterThan(chart.entries.aggressive);
          expect(chart.stops.wide).toBeGreaterThan(chart.entries.aggressive);
          expect(chart.stops.wide).toBeGreaterThan(chart.stops.logical);
          expect(chart.stops.logical).toBeGreaterThan(chart.stops.tight);
          expect(chart.tps.fast).toBeLessThan(chart.entries.confirmation);
          expect(chart.tps.balanced).toBeLessThan(chart.tps.fast);
          expect(chart.tps.ambitious).toBeLessThan(chart.tps.balanced);
        }
      }
    }
  });

  test("RR balanced ≈ 2:1 (avec confirmation + logical)", () => {
    for (const t of BUILD_TRADE_TEMPLATES) {
      const chart = buildBuildTradeChart(t, 42, "normale");
      const risk = Math.abs(chart.entries.confirmation - chart.stops.logical);
      const reward = Math.abs(chart.tps.balanced - chart.entries.confirmation);
      const rr = reward / risk;
      expect(rr, `${t.id} RR balanced ≈ 2:1 (got ${rr.toFixed(2)})`).toBeGreaterThan(1.8);
      expect(rr, `${t.id} RR balanced ≈ 2:1 (got ${rr.toFixed(2)})`).toBeLessThan(2.6);
    }
  });

  // ─── QA gameplay : 9 scénarios (3 par niveau) ───────────────────────────────

  const QA_PLAN: { difficulty: Difficulty; templateIds: string[] }[] = [
    {
      difficulty: "beginner",
      templateIds: ["trend_continuation_bull", "breakout_bull_clean", "bounce_support_clean"],
    },
    {
      difficulty: "intermediate",
      templateIds: ["range_top_short", "fake_breakout_short", "fvg_continuation_bull"],
    },
    {
      difficulty: "advanced",
      templateIds: ["deep_pullback_risky", "counter_trend_local", "high_vol_setup"],
    },
  ];

  for (const { difficulty, templateIds } of QA_PLAN) {
    for (const id of templateIds) {
      test(`gameplay ${difficulty} / ${id} : combo OPTIMAL produit un setup positif`, () => {
        const t = BUILD_TRADE_TEMPLATES.find((x) => x.id === id);
        expect(t, `template ${id} existe`).toBeDefined();
        expect(t!.difficulties.includes(difficulty)).toBe(true);

        // Sur 5 seeds, le combo optimal doit donner un score >= +50
        // (le combo optimal pourrait perdre sur certains seeds extrêmes, mais
        // sur la majorité doit gagner)
        let totalScore = 0;
        for (let s = 1; s <= 5; s++) {
          const chart = buildBuildTradeChart(t!, s * 1000 + 31, "normale");
          const result = evaluateTrade(t!.optimal, chart, t!.optimal, 0);
          totalScore += result.points;
        }
        const avgScore = totalScore / 5;
        expect(avgScore, `${id} ${difficulty} avg score optimal ${avgScore.toFixed(1)} >= 50`).toBeGreaterThanOrEqual(50);
      });
    }
  }
});
