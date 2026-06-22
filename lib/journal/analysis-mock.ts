// ─────────────────────────────────────────────────────────────────────────────
//  V0.3 — CENTRE D'ANALYSE DU TRADER  (PROTOTYPE / MOCK TOTAL)
// ─────────────────────────────────────────────────────────────────────────────
//  Données 100% simulées pour tester la PERCEPTION DE VALEUR de la future page
//  "Mon Analyse". Aucun calcul, aucune IA, aucune lecture Supabase.
//
//  Les phrases d'insight (coachIntro, forces, faiblesses, comportements…) sont
//  en français en dur (décision produit V0.3). Les libellés d'UI (titres de
//  sections, etc.) restent i18n dans dictionaries/<locale>/journal.json.
//
//  Branchement réel plus tard (sans nouveau schéma sauf weeklyGoal) :
//   - score / niveau      → fonction de scoring sur followed_plan, mistakes…
//   - progression (deltas)→ computeStats fenêtré par période
//   - behaviors           → group-by sur session / timeframe / setup / heure
//   - strengths/weaknesses→ agrégation de l'analyse IA comportementale
//   - weeklyGoal          → futur stockage dédié (table goals) — hors V0.3
// ─────────────────────────────────────────────────────────────────────────────

import type { Locale } from "@/i18n/config";

export interface ProgressionMetric {
  label: string; // FR (mock)
  value: string;
  delta: string;
  positive: boolean;
}

export interface TraderAnalysis {
  tradesAnalyzed: number;
  coachIntro: string; // FR (mock)
  score: {
    label: string; // FR (mock)
    value: number;
    max: number;
    deltaLabel: string; // FR (mock)
    positive: boolean;
  };
  progression: ProgressionMetric[];
  strengths: string[]; // FR (mock)
  weaknesses: string[]; // FR (mock)
  behaviors: {
    better: string[]; // FR (mock)
    worse: string[]; // FR (mock)
  };
  weeklyGoal: {
    label: string; // FR (mock)
    progress: number;
    target: number;
  };
  level: {
    current: string; // FR (mock)
    next: string; // FR (mock)
    progress: number; // 0-100
  };
}

// Génère l'analyse globale mock localisée. Les nombres/pourcentages sont
// universels ; seuls les libellés textuels sont traduits (fr/es/en).
export function getMockAnalysis(locale: Locale): TraderAnalysis {
  const tx = {
    fr: {
      coachIntro:
        "J'ai analysé tes 23 derniers trades. Voici ce que je remarque dans ton comportement — pas dans le marché.",
      discipline: "Discipline",
      deltaMonth: "+12% ce mois-ci",
      winrate: "Winrate",
      avgRR: "RR moyen",
      strengths: [
        "Bonne patience sur tes entrées",
        "Respect du plan en progression",
        "Risque maîtrisé et constant",
      ],
      weaknesses: [
        "Entrées parfois trop précoces",
        "Tendance au surtrading après une perte",
        "Discipline plus faible en M5",
      ],
      better: ["Session de Londres", "Timeframe H1", "Setup Order Block"],
      worse: ["Timeframe M5", "Après 20h", "Juste après une perte"],
      weeklyGoal: "Ne pas prendre de trade hors plan",
      levelCurrent: "Trader discipliné",
      levelNext: "Trader confirmé",
    },
    en: {
      coachIntro:
        "I analyzed your last 23 trades. Here's what I notice in your behavior — not in the market.",
      discipline: "Discipline",
      deltaMonth: "+12% this month",
      winrate: "Win rate",
      avgRR: "Avg RR",
      strengths: [
        "Good patience on your entries",
        "Improving plan adherence",
        "Steady, controlled risk",
      ],
      weaknesses: [
        "Entries sometimes too early",
        "Tendency to overtrade after a loss",
        "Weaker discipline on M5",
      ],
      better: ["London session", "H1 timeframe", "Order Block setup"],
      worse: ["M5 timeframe", "After 8pm", "Right after a loss"],
      weeklyGoal: "Don't take any out-of-plan trades",
      levelCurrent: "Disciplined trader",
      levelNext: "Seasoned trader",
    },
    es: {
      coachIntro:
        "Analicé tus últimos 23 trades. Esto es lo que observo en tu comportamiento — no en el mercado.",
      discipline: "Disciplina",
      deltaMonth: "+12% este mes",
      winrate: "Winrate",
      avgRR: "RR promedio",
      strengths: [
        "Buena paciencia en tus entradas",
        "Respeto del plan en progresión",
        "Riesgo controlado y constante",
      ],
      weaknesses: [
        "Entradas a veces demasiado tempranas",
        "Tendencia al sobretrading tras una pérdida",
        "Disciplina más baja en M5",
      ],
      better: ["Sesión de Londres", "Timeframe H1", "Setup Order Block"],
      worse: ["Timeframe M5", "Después de las 20h", "Justo después de una pérdida"],
      weeklyGoal: "No tomar ningún trade fuera del plan",
      levelCurrent: "Trader disciplinado",
      levelNext: "Trader consolidado",
    },
  }[locale];

  return {
    tradesAnalyzed: 23,
    coachIntro: tx.coachIntro,
    score: {
      label: tx.discipline,
      value: 72,
      max: 100,
      deltaLabel: tx.deltaMonth,
      positive: true,
    },
    progression: [
      { label: tx.winrate, value: "58%", delta: "+8%", positive: true },
      { label: tx.discipline, value: "72", delta: "+12%", positive: true },
      { label: tx.avgRR, value: "1.9", delta: "+0.4", positive: true },
    ],
    strengths: tx.strengths,
    weaknesses: tx.weaknesses,
    behaviors: { better: tx.better, worse: tx.worse },
    weeklyGoal: { label: tx.weeklyGoal, progress: 4, target: 5 },
    level: { current: tx.levelCurrent, next: tx.levelNext, progress: 72 },
  };
}
