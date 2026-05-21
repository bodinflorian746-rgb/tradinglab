// Types du système "Mon Profil Trader".
//
// V1 : localStorage uniquement. Conçu pour migrer vers Supabase plus tard
// sans changer la surface d'API publique (logGameEvent, loadProfile).

export type GameId = "buy-sell-no-trade" | "place-stop" | "find-the-mistake" | "build-the-trade";
export type Difficulty = "beginner" | "intermediate" | "advanced";

// 10 compétences trackées globalement.
export type SkillId =
  | "discipline"
  | "lecture_marche"
  | "gestion_risque"
  | "timing"
  | "liquidite"
  | "structure"
  | "psychologie"
  | "execution"
  | "patience"
  | "rr_management";

export const SKILL_LABELS: Record<SkillId, string> = {
  discipline:      "Discipline",
  lecture_marche:  "Lecture marché",
  gestion_risque:  "Gestion du risque",
  timing:          "Timing",
  liquidite:       "Liquidité",
  structure:       "Structure",
  psychologie:     "Psychologie",
  execution:       "Exécution",
  patience:        "Patience",
  rr_management:   "R/R management",
};

export const SKILL_DESCRIPTIONS: Record<SkillId, string> = {
  discipline:      "Refuser les setups médiocres, attendre les bonnes opportunités.",
  lecture_marche:  "Identifier la direction et le contexte HTF correctement.",
  gestion_risque:  "Placer les stops à des distances cohérentes avec la structure.",
  timing:          "Choisir le bon moment d'entrée — pas trop tôt, pas trop tard.",
  liquidite:       "Reconnaître les sweeps, traps et zones de chasse à liquidité.",
  structure:       "Lire les swings, supports, résistances et niveaux clés.",
  psychologie:     "Éviter FOMO, revenge trade, surconfiance.",
  execution:       "Tenir compte du spread, de la session, de la volatilité.",
  patience:        "Attendre les confirmations et laisser courir les trades.",
  rr_management:   "Optimiser le rapport risque/rendement de chaque trade.",
};

// Un event = une décision prise par le joueur dans un jeu. Chaque event nudge
// une compétence vers le haut (win) ou le bas (loss).
export interface GameEvent {
  game:       GameId;
  timestamp:  number;        // ms
  difficulty: Difficulty;
  skill:      SkillId;
  outcome:    "win" | "loss";
  weight?:    number;        // intensité [0.5, 2], défaut 1
}

export interface SkillScore {
  skill:  SkillId;
  score:  number;            // 0-100
  events: number;            // nombre d'events ayant contribué
}

export interface Recommendation {
  skill:       SkillId;
  reason:      string;
  gameUrl:     string;
  gameLabel:   string;
  lessonUrl?:  string;
  lessonLabel?: string;
}

export interface ProfileTemplate {
  id:          string;
  name:        string;
  description: string;
  // Fonction de matching : prend les scores et retourne un score de match 0-100
  match:       (scores: Record<SkillId, number>) => number;
}

export interface TraderProfileSnapshot {
  primaryProfile: ProfileTemplate;
  skills:         SkillScore[];
  strengths:      SkillScore[];    // top 3 avec score >= 60
  weaknesses:     SkillScore[];    // bottom 3 avec score <= 40
  totalEvents:    number;
  gameStats:      Record<GameId, { wins: number; losses: number; total: number }>;
  recommendations: Recommendation[];
  recentEvents:   GameEvent[];     // last 8 events for history
}

export const SKILL_IDS: readonly SkillId[] = [
  "discipline", "lecture_marche", "gestion_risque", "timing", "liquidite",
  "structure", "psychologie", "execution", "patience", "rr_management",
];

export const GAME_LABELS: Record<GameId, string> = {
  "buy-sell-no-trade": "BUY / SELL / NO TRADE",
  "place-stop":         "Quel stop va survivre ?",
  "find-the-mistake":   "Trouve l'erreur",
  "build-the-trade":    "Build the Trade",
};
