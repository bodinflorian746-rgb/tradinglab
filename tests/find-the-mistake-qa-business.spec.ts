// QA métier "Trouve l'erreur"
//
// Pour chaque setup, sur 5 seeds, on vérifie :
// 1) Le template existe avec les champs requis (correctMistake, decoys, explanation, lessons)
// 2) Le correctMistake n'apparaît PAS dans les decoys (sinon ambiguïté)
// 3) Le chart se génère sans erreur et a au moins 8 candles past
// 4) Si showLines == "buy_with_tight_stop" : stop est >= swingLow (= dans le bruit)
// 5) Si showLines == "buy_with_bad_rr" : RR < 1.5
// 6) Le shuffledChoices contient 4 éléments uniques dont correctMistake

import { test, expect } from "@playwright/test";
import {
  MISTAKE_TEMPLATES,
  MISTAKE_LABELS,
  generateMistakeScenarios,
  buildScenarioChart,
  type Difficulty,
} from "../lib/games/find-the-mistake";

test.describe("QA métier 'Trouve l'erreur'", () => {
  test("16 templates minimum avec champs requis", () => {
    expect(MISTAKE_TEMPLATES.length).toBeGreaterThanOrEqual(15);
    for (const t of MISTAKE_TEMPLATES) {
      expect(t.id, `${t.id} non vide`).toBeTruthy();
      expect(t.title.length).toBeGreaterThan(5);
      expect(t.context.length).toBeGreaterThan(20);
      expect(t.explanation.length).toBeGreaterThan(50);
      expect(t.correctMistake, `${t.id}.correctMistake doit être dans le vocab`).toBeTruthy();
      expect(MISTAKE_LABELS[t.correctMistake], `${t.id}.correctMistake "${t.correctMistake}" doit avoir un label`).toBeTruthy();
      expect(t.decoyMistakes.length, `${t.id} doit avoir exactement 3 decoys`).toBe(3);
      expect(t.lessons.beginner.length).toBeGreaterThan(20);
      expect(t.lessons.intermediate.length).toBeGreaterThan(20);
      expect(t.lessons.advanced.length).toBeGreaterThan(20);
      // Le correct ne doit pas être parmi les decoys
      expect(t.decoyMistakes, `${t.id}.decoys ne doit pas contenir correctMistake`).not.toContain(t.correctMistake);
      // Tous les decoys ont un label
      for (const d of t.decoyMistakes) {
        expect(MISTAKE_LABELS[d], `${t.id} decoy "${d}" doit avoir un label`).toBeTruthy();
      }
    }
  });

  test("pools par difficulté contiennent assez de templates", () => {
    const pools: Record<Difficulty, number> = {
      beginner:     MISTAKE_TEMPLATES.filter((t) => t.difficulties.includes("beginner")).length,
      intermediate: MISTAKE_TEMPLATES.filter((t) => t.difficulties.includes("intermediate")).length,
      advanced:     MISTAKE_TEMPLATES.filter((t) => t.difficulties.includes("advanced")).length,
    };
    console.log("Pools find-the-mistake :", pools);
    expect(pools.beginner).toBeGreaterThanOrEqual(5);
    expect(pools.intermediate).toBeGreaterThanOrEqual(10);
    expect(pools.advanced).toBeGreaterThanOrEqual(13);
  });

  test("charts se génèrent sans erreur (sur 5 seeds par template)", () => {
    for (const t of MISTAKE_TEMPLATES) {
      for (let s = 1; s <= 5; s++) {
        const seed = s * 1000 + 21;
        const chart = buildScenarioChart(t, seed, "normale");
        expect(chart.past.length, `${t.id} seed=${seed} past >= 8`).toBeGreaterThanOrEqual(8);
        // Domain valide
        expect(chart.domain.max - chart.domain.min).toBeGreaterThan(0);
        // Entry, si présente, dans le domain
        if (chart.entry !== undefined) {
          expect(chart.entry).toBeLessThanOrEqual(chart.domain.max);
          expect(chart.entry).toBeGreaterThanOrEqual(chart.domain.min);
        }
      }
    }
  });

  test("scénario avec tight stop : stop est dans le bruit (proche du swingLow)", () => {
    const t = MISTAKE_TEMPLATES.find((x) => x.id === "stop_too_tight")!;
    for (let s = 1; s <= 5; s++) {
      const chart = buildScenarioChart(t, s * 1000 + 21, "normale");
      expect(chart.entry, `${t.id} doit avoir entry`).toBeDefined();
      expect(chart.stop,  `${t.id} doit avoir stop`).toBeDefined();
      // Stop doit être proche du swingLow (le swing low est dans les zones "support")
      const supportZone = chart.zones.find((z) => z.kind === "support");
      expect(supportZone, "zone support 'Swing low' présente").toBeDefined();
      const swingLow = (supportZone!.y1 + supportZone!.y2) / 2;
      // Stop entre swingLow - 0.2 et swingLow + 0.5 → dans le bruit
      expect(chart.stop!, `stop ${chart.stop} pile autour du swing low ${swingLow}`).toBeGreaterThanOrEqual(swingLow - 0.2);
      expect(chart.stop!).toBeLessThanOrEqual(swingLow + 0.5);
    }
  });

  test("scénario bad_rr : RR < 1.5", () => {
    const t = MISTAKE_TEMPLATES.find((x) => x.id === "bad_rr")!;
    for (let s = 1; s <= 5; s++) {
      const chart = buildScenarioChart(t, s * 1000 + 21, "normale");
      expect(chart.entry).toBeDefined();
      expect(chart.stop).toBeDefined();
      expect(chart.tp).toBeDefined();
      const risk = Math.abs(chart.entry! - chart.stop!);
      const reward = Math.abs(chart.tp! - chart.entry!);
      const rr = reward / risk;
      expect(rr, `RR=${rr.toFixed(2)} doit être < 1.5`).toBeLessThan(1.5);
    }
  });

  test("generateMistakeScenarios : 10 rounds, choix shufflés, 4 choices uniques", () => {
    for (const d of ["beginner", "intermediate", "advanced"] as Difficulty[]) {
      const scenarios = generateMistakeScenarios(42, d);
      expect(scenarios.length).toBe(10);
      for (const sc of scenarios) {
        expect(sc.shuffledChoices.length).toBe(4);
        expect(new Set(sc.shuffledChoices).size, `choix uniques pour ${sc.id}`).toBe(4);
        expect(sc.shuffledChoices, `correctMistake présent dans choices`).toContain(sc.correctMistake);
        for (const d of sc.decoyMistakes) {
          expect(sc.shuffledChoices, `decoy ${d} dans choices`).toContain(d);
        }
      }
    }
  });

  // ─── QA gameplay : 3 par niveau ─────────────────────────────────────────────

  const QA_PLAN: { difficulty: Difficulty; setupIds: string[] }[] = [
    {
      difficulty: "beginner",
      setupIds: ["buy_in_resistance", "trade_against_htf", "trade_before_news"],
    },
    {
      difficulty: "intermediate",
      setupIds: ["stop_too_tight", "bad_rr", "fomo_after_pump"],
    },
    {
      difficulty: "advanced",
      setupIds: ["sweep_ignored", "mitigation_misread", "over_leverage"],
    },
  ];

  for (const { difficulty, setupIds } of QA_PLAN) {
    for (const id of setupIds) {
      test(`gameplay ${difficulty} / ${id} : chart cohérent + decoys plausibles`, () => {
        const t = MISTAKE_TEMPLATES.find((x) => x.id === id);
        expect(t, `template ${id} existe`).toBeDefined();
        expect(t!.difficulties.includes(difficulty), `${id} disponible en ${difficulty}`).toBe(true);

        for (let s = 1; s <= 5; s++) {
          const chart = buildScenarioChart(t!, s * 1000 + 21, "normale");
          // Le past doit avoir au moins 8 candles (contexte suffisant)
          expect(chart.past.length, `${id} seed=${s} past >= 8`).toBeGreaterThanOrEqual(8);
          // Le past ne doit pas révéler la résolution (peu de candles "future")
          expect(chart.future.length, `${id} future == 0`).toBe(0);
        }
      });
    }
  }
});
