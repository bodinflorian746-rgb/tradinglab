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

export const MOCK_ANALYSIS: TraderAnalysis = {
  tradesAnalyzed: 23,
  coachIntro:
    "J'ai analysé tes 23 derniers trades. Voici ce que je remarque dans ton comportement — pas dans le marché.",
  score: {
    label: "Discipline",
    value: 72,
    max: 100,
    deltaLabel: "+12% ce mois-ci",
    positive: true,
  },
  progression: [
    { label: "Winrate", value: "58%", delta: "+8%", positive: true },
    { label: "Discipline", value: "72", delta: "+12%", positive: true },
    { label: "RR moyen", value: "1.9", delta: "+0.4", positive: true },
  ],
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
  behaviors: {
    better: ["Session de Londres", "Timeframe H1", "Setup Order Block"],
    worse: ["Timeframe M5", "Après 20h", "Juste après une perte"],
  },
  weeklyGoal: {
    label: "Ne pas prendre de trade hors plan",
    progress: 4,
    target: 5,
  },
  level: {
    current: "Trader discipliné",
    next: "Trader confirmé",
    progress: 72,
  },
};
