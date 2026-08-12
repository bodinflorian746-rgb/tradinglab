// Types partagés de la page "Mon Analyse" (app/[locale]/(premium)/journal/analyse).
// Historiquement ce fichier contenait aussi getMockAnalysis(), un générateur de
// données 100% simulées (V0.3). Cette fonction n'était plus appelée par aucune
// page — l'analyse réelle est construite par buildRealAnalysis() dans
// analyse/page.tsx à partir de computeStats/computeCoachReport/computeCoachInsights.
// Seuls les types ci-dessous restent utilisés (CommandCenter.tsx, AnalysisView.tsx,
// analyse/page.tsx).

export interface ProgressionMetric {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
}

export interface TraderAnalysis {
  tradesAnalyzed: number;
  coachIntro: string;
  score: {
    label: string;
    value: number;
    max: number;
    deltaLabel: string;
    positive: boolean;
  };
  progression: ProgressionMetric[];
  strengths: string[];
  weaknesses: string[];
  behaviors: {
    better: string[];
    worse: string[];
  };
  weeklyGoal: {
    label: string;
    progress: number;
    target: number;
  };
  level: {
    current: string;
    next: string;
    progress: number; // 0-100
  };
}
