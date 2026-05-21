// QA métier "Quel stop va survivre ?"
//
// Pour chaque setup, sur 5 seeds, on vérifie :
// 1) Les 3 stops sont bien dans la zone valide (côté entry attendu).
// 2) Le stop TIGHT se fait SWEEP par les futures candles (sinon il n'est
//    pas pédagogiquement "trop serré").
// 3) Le stop LOGICAL SURVIT aux futures (sinon il n'est pas logique).
// 4) Le stop WIDE SURVIT aussi (sinon il est défectueux).
// 5) Le RR du stop LOGICAL est >= 1.5 (sinon ce n'est pas un bon trade).
// 6) Le RR du stop WIDE est < 1.5 (sinon il n'est pas pénalisé).

import { test, expect } from "@playwright/test";
import {
  buildPlaceStopChart,
  computeHits,
  PLACE_STOP_TEMPLATES,
  type Difficulty,
  type PlaceStopSetupKey,
} from "../lib/games/place-stop";

const QA_PLAN: { difficulty: Difficulty; setups: PlaceStopSetupKey[] }[] = [
  {
    difficulty: "beginner",
    setups: ["pullback_bull", "pullback_bear", "bounce_support"],
  },
  {
    difficulty: "intermediate",
    setups: ["fakeout_above_resistance", "sweep_low_reversal", "fvg_continuation"],
  },
  {
    difficulty: "advanced",
    setups: ["rejection_resistance", "fakeout_above_resistance", "high_vol_pullback"],
  },
];

function audit(setup: PlaceStopSetupKey, difficulty: Difficulty, seed: number): string[] {
  const issues: string[] = [];
  const chart = buildPlaceStopChart(setup, seed, "normale", difficulty);

  // Récupération des 3 stops par TYPE
  const tight   = chart.stops.find((s) => s.type === "tight");
  const logical = chart.stops.find((s) => s.type === "logical");
  const wide    = chart.stops.find((s) => s.type === "wide");

  if (!tight)   issues.push(`tight stop manquant`);
  if (!logical) issues.push(`logical stop manquant`);
  if (!wide)    issues.push(`wide stop manquant`);
  if (!tight || !logical || !wide) return issues;

  // Critère 1 : tous les stops du bon côté de l'entry
  for (const s of chart.stops) {
    if (chart.direction === "BUY" && s.price >= chart.entry) {
      issues.push(`${s.id} (${s.type}) prix ${s.price.toFixed(2)} >= entry ${chart.entry.toFixed(2)} (BUY → doit être en dessous)`);
    }
    if (chart.direction === "SELL" && s.price <= chart.entry) {
      issues.push(`${s.id} (${s.type}) prix ${s.price.toFixed(2)} <= entry ${chart.entry.toFixed(2)} (SELL → doit être au-dessus)`);
    }
  }

  // Critère 2/3/4 : hits cohérents
  const hits = computeHits(chart);
  const tightHit   = hits[tight.id];
  const logicalHit = hits[logical.id];
  const wideHit    = hits[wide.id];

  if (tightHit === null) {
    issues.push(`tight (${tight.id}) a SURVÉCU — devrait être balayé par les futures candles`);
  }
  if (logicalHit !== null) {
    issues.push(`logical (${logical.id}) a été TOUCHÉ bougie ${logicalHit + 1} — devrait survivre`);
  }
  if (wideHit !== null) {
    issues.push(`wide (${wide.id}) a été TOUCHÉ bougie ${wideHit + 1} — devrait survivre (et juste avoir un mauvais RR)`);
  }

  // Critère 5/6 : RR
  if (chart.tp !== null) {
    const tpDistance = Math.abs(chart.tp - chart.entry);
    const rrLogical = tpDistance / Math.abs(chart.entry - logical.price);
    const rrWide    = tpDistance / Math.abs(chart.entry - wide.price);
    if (rrLogical < 2.0) {
      issues.push(`RR logical = 1:${rrLogical.toFixed(2)} (< 2.0 — pas assez généreux)`);
    }
    if (rrWide > 1.7) {
      issues.push(`RR wide = 1:${rrWide.toFixed(2)} (> 1.7 — n'est pas suffisamment pénalisé)`);
    }
  }

  // Critère 7 : ordre visuel A > B > C (prix décroissants)
  for (let i = 0; i < chart.stops.length - 1; i++) {
    if (chart.stops[i].price < chart.stops[i + 1].price) {
      issues.push(`ordre A/B/C cassé : ${chart.stops[i].id}=${chart.stops[i].price.toFixed(2)} < ${chart.stops[i + 1].id}=${chart.stops[i + 1].price.toFixed(2)}`);
    }
  }

  return issues;
}

test.describe("QA métier place-stop V2 — Quel stop va survivre ?", () => {
  for (const { difficulty, setups } of QA_PLAN) {
    for (const setup of setups) {
      test(`coherence stops — ${difficulty} / ${setup}`, () => {
        const allIssues: string[] = [];
        for (let s = 1; s <= 5; s++) {
          const issues = audit(setup, difficulty, s * 1000 + 13);
          for (const i of issues) {
            allIssues.push(`[seed=${s * 1000 + 13}] ${i}`);
          }
        }
        if (allIssues.length > 0) {
          console.log(`⚠️ ${difficulty}/${setup} :\n  ` + allIssues.join("\n  "));
        }
        expect(allIssues, allIssues.join("\n")).toEqual([]);
      });
    }
  }

  test("templates : chaque setup a 3 lessons + appartient à au moins 1 difficulté", () => {
    for (const t of PLACE_STOP_TEMPLATES) {
      expect(t.lessons.beginner,    `${t.id}.lessons.beginner`).toBeTruthy();
      expect(t.lessons.intermediate,`${t.id}.lessons.intermediate`).toBeTruthy();
      expect(t.lessons.advanced,    `${t.id}.lessons.advanced`).toBeTruthy();
      expect(t.difficulties.length, `${t.id}.difficulties non vide`).toBeGreaterThan(0);
    }
  });

  test("pool beginner contient au moins 4 setups", () => {
    const pool = PLACE_STOP_TEMPLATES.filter((t) => t.difficulties.includes("beginner"));
    expect(pool.length).toBeGreaterThanOrEqual(4);
  });

  test("pool advanced contient au moins 6 setups", () => {
    const pool = PLACE_STOP_TEMPLATES.filter((t) => t.difficulties.includes("advanced"));
    expect(pool.length).toBeGreaterThanOrEqual(6);
  });

  test("la spread avancé < intermediate < beginner (ambiguité croissante)", () => {
    // On vérifie qu'en avancé, les stops sont plus proches les uns des autres.
    // Pour ça on génère le même setup en 3 difficultés et on compare l'écart
    // entre le stop le plus haut et le plus bas (range).
    const ranges: Record<Difficulty, number> = { beginner: 0, intermediate: 0, advanced: 0 };
    for (const d of ["beginner", "intermediate", "advanced"] as Difficulty[]) {
      const c = buildPlaceStopChart("pullback_bull", 42, "normale", d);
      const prices = c.stops.map((s) => s.price);
      ranges[d] = Math.max(...prices) - Math.min(...prices);
    }
    console.log(`Ranges ABC : beginner=${ranges.beginner.toFixed(2)}, intermediate=${ranges.intermediate.toFixed(2)}, advanced=${ranges.advanced.toFixed(2)}`);
    expect(ranges.advanced).toBeLessThan(ranges.intermediate);
    expect(ranges.intermediate).toBeLessThan(ranges.beginner);
  });
});
