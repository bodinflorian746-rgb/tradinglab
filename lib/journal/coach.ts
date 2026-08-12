// ─────────────────────────────────────────────────────────────────────────────
//  COACH RÉEL — Scores discipline / exécution / psychologie + niveau + objectif
// ─────────────────────────────────────────────────────────────────────────────
//  Fonctions PURES (sans I/O, sans IA) calculées sur les trades disponibles.
//  Tout est EXPLICABLE : chaque score expose ses composantes (label + valeur +
//  poids). On n'invente jamais : si l'échantillon est trop faible, la composante
//  ou le score vaut null → l'UI affiche "pas assez de données".
//
//  Remplace le mock getMockAnalysis() pour le coach de la page Journal.
// ─────────────────────────────────────────────────────────────────────────────

import type { TradeEntry } from "./types";
import { computeCoachInsights, type CoachInsights } from "./insights";

// Seuils d'échantillon (conservateurs) — documentés dans le rapport.
const MIN_PLAN = 4; // trades avec followed_plan renseigné pour scorer la discipline
const MIN_DECISIVE = 4; // trades gagnés/perdus pour scorer l'exécution
const MIN_EMOTION = 4; // trades avec emotion_before pour scorer la psychologie
const MIN_R = 3; // valeurs de R pour juger qualité R/R et stabilité
const MIN_LEVEL_TRADES = 5; // en-dessous : niveau plancher "débutant"

const GOOD_BEFORE = ["calm", "confident"];
const RISKY_BEFORE = ["fomo", "euphoric", "frustrated", "impatient"];
const CALM_DURING = ["calm", "confident"];
const RISKY_MISTAKES = ["revenge_trading", "overtrading", "fomo"];

function clamp(n: number, lo = 0, hi = 100): number {
  return Math.max(lo, Math.min(hi, n));
}
function pct(part: number, whole: number): number {
  return whole > 0 ? Math.round((part / whole) * 100) : 0;
}
function isDecisive(e: TradeEntry): boolean {
  return e.result === "win" || e.result === "loss";
}
function num(v: number | null | undefined): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

// Une composante explicable d'un score.
export interface ScorePart {
  key: string; // clé i18n (coach.parts.<key>)
  value: number; // 0-100
  weight: number; // poids relatif (0-1)
}

export interface ScoreResult {
  score: number | null; // 0-100, ou null si pas assez de données
  enough: boolean;
  parts: ScorePart[]; // composantes effectivement calculées
}

export type LevelKey =
  | "debutant"
  | "en_progression"
  | "discipline"
  | "confirme"
  | "avance";

export type ObjectiveKey =
  | "respect_plan"
  | "reduce_mistake"
  | "calm_entries"
  | "keep_consistency";

export interface CoachReport {
  tradesAnalyzed: number;
  discipline: ScoreResult;
  execution: ScoreResult;
  psychology: ScoreResult;
  overall: number | null; // moyenne des sous-scores disponibles
  level: { key: LevelKey; nextKey: LevelKey | null; progress: number };
  objective: {
    key: ObjectiveKey;
    x: string | null; // clé (ex. erreur) à interpoler dans le libellé
    progress: number;
    target: number;
  } | null;
}

// Combine des composantes en un score pondéré (renormalise sur celles
// réellement disponibles). null si aucune composante.
function combine(parts: ScorePart[]): number | null {
  if (parts.length === 0) return null;
  const wsum = parts.reduce((s, p) => s + p.weight, 0);
  if (wsum === 0) return null;
  return Math.round(parts.reduce((s, p) => s + p.value * p.weight, 0) / wsum);
}

// Écart-type d'un échantillon (pour la stabilité des résultats).
function stdev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const variance =
    values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

// ── Phase 1 — DISCIPLINE ─────────────────────────────────────────────────────
function computeDiscipline(entries: TradeEntry[]): ScoreResult {
  const planned = entries.filter((e) => e.followed_plan != null);
  const reviewed = entries.filter((e) => e.perceived_mistake != null);
  const enough = planned.length >= MIN_PLAN;
  if (!enough) return { score: null, enough, parts: [] };

  const parts: ScorePart[] = [];

  // Respect du plan : part des trades pleinement dans le plan.
  const yes = planned.filter((e) => e.followed_plan === "yes").length;
  parts.push({ key: "plan_respect", value: pct(yes, planned.length), weight: 0.5 });

  // Hors plan évités : moins de trades "no" = mieux.
  const no = planned.filter((e) => e.followed_plan === "no").length;
  parts.push({
    key: "out_of_plan_avoided",
    value: 100 - pct(no, planned.length),
    weight: 0.2,
  });

  // Trades sans erreur ressentie (hors 'none').
  if (reviewed.length >= MIN_PLAN) {
    const mistakes = reviewed.filter(
      (e) => e.perceived_mistake && e.perceived_mistake !== "none",
    ).length;
    parts.push({
      key: "mistake_free",
      value: 100 - pct(mistakes, reviewed.length),
      weight: 0.3,
    });
  }

  return { score: combine(parts), enough, parts };
}

// ── Phase 2 — EXÉCUTION ──────────────────────────────────────────────────────
function computeExecution(entries: TradeEntry[]): ScoreResult {
  const decisive = entries.filter(isDecisive);
  const enough = decisive.length >= MIN_DECISIVE;
  if (!enough) return { score: null, enough, parts: [] };

  const parts: ScorePart[] = [];

  // Efficacité : winrate sur trades décisifs.
  const wins = decisive.filter((e) => e.result === "win").length;
  parts.push({ key: "winrate", value: pct(wins, decisive.length), weight: 0.35 });

  // Qualité du R/R : part des trades décisifs dont le R réalisé ≥ 1.
  const withR = decisive.filter((e) => num(e.r_multiple));
  if (withR.length >= MIN_R) {
    const goodR = withR.filter((e) => (e.r_multiple as number) >= 1).length;
    parts.push({ key: "rr_quality", value: pct(goodR, withR.length), weight: 0.25 });

    // Stabilité : faible dispersion des R = exécution régulière.
    const sd = stdev(withR.map((e) => e.r_multiple as number));
    parts.push({
      key: "stability",
      value: clamp(Math.round(100 - sd * 30)),
      weight: 0.2,
    });
  }

  // Process documenté : setup défini + SL & TP renseignés.
  const hasSetup = entries.filter((e) => e.setup != null).length;
  const hasSlTp = entries.filter(
    (e) => num(e.stop_loss) && num(e.take_profit),
  ).length;
  const processVal = Math.round(
    (pct(hasSetup, entries.length) + pct(hasSlTp, entries.length)) / 2,
  );
  parts.push({ key: "process", value: processVal, weight: 0.2 });

  return { score: combine(parts), enough, parts };
}

// ── Phase 3 — PSYCHOLOGIE ────────────────────────────────────────────────────
function computePsychology(entries: TradeEntry[]): ScoreResult {
  const withBefore = entries.filter((e) => e.emotion_before != null);
  const enough = withBefore.length >= MIN_EMOTION;
  if (!enough) return { score: null, enough, parts: [] };

  const parts: ScorePart[] = [];

  // Entrées sereines : émotion avant ∈ {calme, confiant}.
  const good = withBefore.filter((e) =>
    GOOD_BEFORE.includes(e.emotion_before as string),
  ).length;
  parts.push({ key: "calm_before", value: pct(good, withBefore.length), weight: 0.4 });

  // Comportements maîtrisés : peu d'émotions/erreurs à risque (sur tous les trades).
  const risky = entries.filter(
    (e) =>
      RISKY_BEFORE.includes(e.emotion_before as string) ||
      (e.perceived_mistake != null &&
        RISKY_MISTAKES.includes(e.perceived_mistake as string)),
  ).length;
  parts.push({
    key: "risk_free",
    value: 100 - pct(risky, entries.length),
    weight: 0.35,
  });

  // Calme en position : émotion pendant ∈ {calme, confiant}.
  const withDuring = entries.filter((e) => e.emotion_during != null);
  if (withDuring.length >= MIN_EMOTION) {
    const calm = withDuring.filter((e) =>
      CALM_DURING.includes(e.emotion_during as string),
    ).length;
    parts.push({ key: "calm_during", value: pct(calm, withDuring.length), weight: 0.25 });
  }

  return { score: combine(parts), enough, parts };
}

// ── Phase 4 — NIVEAU TRADER ──────────────────────────────────────────────────
// Seuils (documentés) : plancher "débutant" sous 5 trades ; ensuite par score
// global, avec un palier de trades requis pour les niveaux élevés (on ne peut
// pas être "avancé" avec 6 trades).
const LEVEL_ORDER: LevelKey[] = [
  "debutant",
  "en_progression",
  "discipline",
  "confirme",
  "avance",
];

function computeLevel(
  total: number,
  overall: number | null,
): CoachReport["level"] {
  let key: LevelKey;
  if (total < MIN_LEVEL_TRADES || overall == null) {
    key = "debutant";
  } else if (overall < 45) {
    key = "en_progression";
  } else if (overall < 60) {
    key = "discipline";
  } else if (overall < 75) {
    key = total >= 15 ? "confirme" : "discipline"; // palier 15 trades
  } else {
    key = total >= 30 ? "avance" : total >= 15 ? "confirme" : "discipline"; // palier 30
  }
  const idx = LEVEL_ORDER.indexOf(key);
  const nextKey = idx < LEVEL_ORDER.length - 1 ? LEVEL_ORDER[idx + 1] : null;
  return { key, nextKey, progress: overall ?? 0 };
}

// ── Phase 5 — OBJECTIF HEBDOMADAIRE ──────────────────────────────────────────
// Généré depuis la faiblesse dominante. Pas de stockage : recalculé à chaque vue.
// La progression est mesurée quand c'est possible (série en cours dans le plan),
// sinon c'est un objectif "en avant" (progress 0) — jamais de progression inventée.
function inPlanStreak(entries: TradeEntry[]): number {
  const sorted = [...entries].sort(
    (a, b) => new Date(b.trade_date).getTime() - new Date(a.trade_date).getTime(),
  );
  let streak = 0;
  for (const e of sorted) {
    if (e.followed_plan === "yes") streak += 1;
    else break;
  }
  return streak;
}

function computeObjective(
  entries: TradeEntry[],
  insights: CoachInsights,
): CoachReport["objective"] {
  if (entries.length < 3) return null;

  const planned = entries.filter((e) => e.followed_plan != null);
  const outOfPlanRate = planned.length
    ? pct(planned.filter((e) => e.followed_plan === "no").length, planned.length)
    : 0;

  // 1) Trop de trades hors plan → objectif respect du plan (progression réelle).
  if (planned.length >= MIN_PLAN && outOfPlanRate >= 30) {
    return {
      key: "respect_plan",
      x: null,
      progress: Math.min(inPlanStreak(entries), 5),
      target: 5,
    };
  }
  // 2) Erreur récurrente → objectif de réduction (objectif en avant).
  if (insights.topMistake) {
    return { key: "reduce_mistake", x: insights.topMistake.key, progress: 0, target: 5 };
  }
  // 3) Émotion de perte à risque → objectif d'entrées calmes.
  if (
    insights.lossEmotion &&
    RISKY_BEFORE.includes(insights.lossEmotion.key)
  ) {
    return { key: "calm_entries", x: null, progress: 0, target: 5 };
  }
  // 4) Sinon : maintenir la régularité (progression = série en cours dans le plan).
  return {
    key: "keep_consistency",
    x: null,
    progress: Math.min(inPlanStreak(entries), 5),
    target: 5,
  };
}

// ── Agrégat ──────────────────────────────────────────────────────────────────
export function computeCoachReport(entries: TradeEntry[]): CoachReport {
  const discipline = computeDiscipline(entries);
  const execution = computeExecution(entries);
  const psychology = computePsychology(entries);

  const available = [discipline.score, execution.score, psychology.score].filter(
    (s): s is number => s != null,
  );
  const overall =
    available.length > 0
      ? Math.round(available.reduce((s, v) => s + v, 0) / available.length)
      : null;

  const insights = computeCoachInsights(entries);

  return {
    tradesAnalyzed: entries.length,
    discipline,
    execution,
    psychology,
    overall,
    level: computeLevel(entries.length, overall),
    objective: computeObjective(entries, insights),
  };
}
