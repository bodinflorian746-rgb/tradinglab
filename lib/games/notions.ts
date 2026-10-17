// Notions des mini-jeux, rattachées à la leçon qui les enseigne.
//
// Niveaux des jeux (décision PO) :
// - Débutant : une seule notion par manche (plus le vocabulaire de base de la leçon Débutant 3 :
//   bougie, support / résistance, tendance), graphique propre, notions des leçons Débutant seulement.
// - Intermédiaire : au moins deux notions combinées (structure + niveau + signal de bougie) et un
//   niveau ou un signal trompeur à écarter, notions jusqu'aux leçons Intermédiaire.
// - Avancé : lecture fine et conflits (UT supérieure contre UT inférieure, news, sweep, faux breakout,
//   clôture contre mèche, R/R insuffisant), notions des leçons Avancé et des Stratégies.
// Contrôle : scripts/audit-jeux/notions-niveaux.ts.

export type Difficulty = "beginner" | "intermediate" | "advanced";
export type LessonLevel = "debutant" | "intermediaire" | "avance" | "strategies";

export interface Notion {
  label:  string;
  level:  LessonLevel;
  /** Leçon (ou stratégie) qui l'enseigne : « debutant/lecon3 », « strategies/macro-trading » */
  lesson: string;
  /** Vocabulaire de base (leçon Débutant 3) : ne compte pas comme notion de la manche */
  base?:  true;
}

export const NOTIONS = {
  // ─── Débutant : vocabulaire de base (leçon 3, « L'erreur fatale ») ───────────
  bougie:             { label: "Lire une bougie (corps, mèches, couleur)", level: "debutant", lesson: "debutant/lecon3", base: true },
  long_short:         { label: "Acheter / vendre (long, short)", level: "debutant", lesson: "debutant/lecon2", base: true },
  support_resistance: { label: "Support et résistance (définition)", level: "debutant", lesson: "debutant/lecon3", base: true },
  tendance:           { label: "Tendance (sommets et creux de plus en plus hauts ou bas)", level: "debutant", lesson: "debutant/lecon3", base: true },
  // ─── Débutant : notions de manche ─────────────────────────────────────────────
  marteau:            { label: "Marteau", level: "debutant", lesson: "debutant/lecon3" },
  etoile_filante:     { label: "Étoile filante", level: "debutant", lesson: "debutant/lecon3" },
  doji:               { label: "Doji (indécision)", level: "debutant", lesson: "debutant/lecon3" },
  engulfing:          { label: "Engulfing haussier / baissier", level: "debutant", lesson: "debutant/lecon3" },
  meches:             { label: "Lire les mèches (une longue mèche contredit la couleur)", level: "debutant", lesson: "debutant/lecon3" },
  pattern_sans_niveau:{ label: "Un pattern hors d'un niveau clé ne compte pas", level: "debutant", lesson: "debutant/lecon3" },
  spread:             { label: "Spread (bid / ask)", level: "debutant", lesson: "debutant/lecon4" },
  stop_loss:          { label: "Stop loss sous le dernier swing low (au-dessus du swing high)", level: "debutant", lesson: "debutant/lecon5" },
  take_profit:        { label: "Take profit avant la prochaine résistance (support)", level: "debutant", lesson: "debutant/lecon6" },
  rr:                 { label: "Ratio risque / rendement (R/R)", level: "debutant", lesson: "debutant/lecon6" },
  break_even:         { label: "Break even", level: "debutant", lesson: "debutant/lecon7" },
  money_management:   { label: "Risque de 1 à 2 % du capital par trade", level: "debutant", lesson: "debutant/lecon8" },
  sans_stop:          { label: "Trader sans stop loss", level: "debutant", lesson: "debutant/lecon9" },
  surtrading:         { label: "Sur-trader", level: "debutant", lesson: "debutant/lecon9" },
  plan_non_respecte:  { label: "Ne pas respecter son plan (entrer trop tôt, déplacer le stop)", level: "debutant", lesson: "debutant/lecon9" },
  fomo:               { label: "FOMO (acheter en urgence après une forte hausse)", level: "debutant", lesson: "debutant/lecon9" },
  revenge:            { label: "Vengeance trading", level: "debutant", lesson: "debutant/lecon9" },
  ancrage:            { label: "Ancrage (refuser de couper une perte)", level: "debutant", lesson: "debutant/lecon9" },
  overconfidence:     { label: "Excès de confiance (taille multipliée après des gains)", level: "debutant", lesson: "debutant/lecon9" },
  levier:             { label: "Levier", level: "debutant", lesson: "debutant/lecon10" },
  // ─── Intermédiaire ────────────────────────────────────────────────────────────
  structure:          { label: "Structure de marché (BOS, CHoCH, plus hauts et plus bas)", level: "intermediaire", lesson: "intermediaire/lecon1" },
  range:              { label: "Range (bornes, milieu du range)", level: "intermediaire", lesson: "intermediaire/lecon1" },
  zones_cles:         { label: "Zones clés (niveau prouvé par plusieurs touches)", level: "intermediaire", lesson: "intermediaire/lecon2" },
  changement_role:    { label: "Changement de rôle et retest", level: "intermediaire", lesson: "intermediaire/lecon3" },
  pullback:           { label: "Tendance et pullback (trader dans le sens du marché)", level: "intermediaire", lesson: "intermediaire/lecon4" },
  confluence:         { label: "Confluences", level: "intermediaire", lesson: "intermediaire/lecon5" },
  breakout:           { label: "Breakout (clôture au-delà d'un niveau)", level: "intermediaire", lesson: "intermediaire/lecon6" },
  faux_breakout:      { label: "Faux breakout", level: "intermediaire", lesson: "intermediaire/lecon6" },
  multi_ut:           { label: "UT supérieure (analyse multi-unités de temps)", level: "intermediaire", lesson: "intermediaire/lecon7" },
  plan_de_trade:      { label: "Plan de trade", level: "intermediaire", lesson: "intermediaire/lecon8" },
  fibonacci:          { label: "Fibonacci (retracement 50 à 61,8 %)", level: "intermediaire", lesson: "intermediaire/lecon9" },
  // ─── Avancé ───────────────────────────────────────────────────────────────────
  liquidite:          { label: "Liquidité (equal highs / lows, plus hauts et plus bas évidents)", level: "avance", lesson: "avance/lecon1" },
  sweep:              { label: "Sweep de liquidité", level: "avance", lesson: "avance/lecon1" },
  fvg:                { label: "Fair Value Gap (FVG)", level: "avance", lesson: "avance/lecon2" },
  order_block:        { label: "Order Block", level: "avance", lesson: "avance/lecon3" },
  killzones:          { label: "Killzones et sessions (volatilité selon l'heure)", level: "avance", lesson: "avance/lecon4" },
  news:               { label: "News économiques (NFP, FOMC, CPI)", level: "avance", lesson: "avance/lecon4" },
  ote:                { label: "OTE (Optimal Trade Entry)", level: "avance", lesson: "avance/lecon5" },
  chasse_aux_stops:   { label: "Chasse aux stops", level: "avance", lesson: "avance/lecon6" },
  entree_precision:   { label: "Entrées de précision (rejet, retest, sweep et retournement)", level: "avance", lesson: "avance/lecon7" },
  // ─── Stratégies (Avancé seulement) ───────────────────────────────────────────
  macro:              { label: "Macro trading (régime de marché, filtre avant une news)", level: "strategies", lesson: "strategies/macro-trading" },
  volatilite:         { label: "Volatilité (amplitude moyenne, ATR)", level: "strategies", lesson: "strategies/macro-trading" },
} as const satisfies Record<string, Notion>;

export type NotionId = keyof typeof NOTIONS;

/** Niveaux de leçon autorisés par niveau de jeu */
export const ALLOWED_LEVELS: Record<Difficulty, readonly LessonLevel[]> = {
  beginner:     ["debutant"],
  intermediate: ["debutant", "intermediaire"],
  advanced:     ["debutant", "intermediaire", "avance", "strategies"],
};

/** Notions de la manche (hors vocabulaire de base) */
export const roundNotions = (ids: readonly NotionId[]): NotionId[] => ids.filter((id) => !("base" in NOTIONS[id]));

/** Leçons qui enseignent les notions d'un scénario (dans l'ordre des notions, sans doublon) */
export const lessonsOf = (ids: readonly NotionId[]): string[] => [...new Set(ids.map((id) => NOTIONS[id].lesson))];

/** Métadonnées pédagogiques d'un scénario (portées par chaque modèle des 4 jeux) */
export interface Pedagogy {
  /** Notions utilisées (vocabulaire de base compris) */
  notions: readonly NotionId[];
  /** Intermédiaire : le niveau ou le signal trompeur à écarter */
  trap?:   string;
  /** Avancé : le conflit à trancher (UT supérieure contre inférieure, news, sweep, clôture contre mèche…) */
  conflict?: string;
}
