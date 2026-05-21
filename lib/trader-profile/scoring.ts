// Calcul des scores de compétence + dérivation du profil principal +
// génération des recommandations.

import { PROFILES, RECOMMENDATIONS_BY_SKILL } from "./profiles";
import {
  type Difficulty, type GameEvent, type GameId, type Recommendation,
  type SkillId, type SkillScore, type TraderProfileSnapshot,
  SKILL_IDS,
} from "./types";

// Poids par difficulté : avancé pèse 3x plus qu'un débutant.
const DIFFICULTY_WEIGHT: Record<Difficulty, number> = {
  beginner:     0.5,
  intermediate: 1.0,
  advanced:     1.5,
};

// Vitesse de convergence : 5% de nudge par event (à difficulté normale).
// Après ~30 events sur une compétence, le score se stabilise.
const BASE_NUDGE = 0.05;

export function computeSkillScores(events: GameEvent[]): SkillScore[] {
  // Init : tous à 50 (neutre)
  const acc: Record<SkillId, { score: number; count: number }> = {} as never;
  for (const skill of SKILL_IDS) {
    acc[skill] = { score: 50, count: 0 };
  }
  // Tri par timestamp pour appliquer dans l'ordre chronologique
  const sorted = [...events].sort((a, b) => a.timestamp - b.timestamp);
  for (const event of sorted) {
    const dw = DIFFICULTY_WEIGHT[event.difficulty];
    const w  = BASE_NUDGE * dw * (event.weight ?? 1);
    const target = event.outcome === "win" ? 100 : 0;
    const a = acc[event.skill];
    a.score = a.score * (1 - w) + target * w;
    a.count++;
  }
  return SKILL_IDS.map((skill) => ({
    skill,
    score:  Math.round(acc[skill].score),
    events: acc[skill].count,
  }));
}

export function deriveProfile(skills: SkillScore[]) {
  const scoreMap: Record<SkillId, number> = {} as never;
  for (const s of skills) scoreMap[s.skill] = s.score;
  // Profil avec le meilleur match score
  const ranked = PROFILES
    .map((p) => ({ profile: p, score: p.match(scoreMap) }))
    .sort((a, b) => b.score - a.score);
  return ranked[0].profile;
}

export function getStrengths(skills: SkillScore[], minScore = 60, minEvents = 3): SkillScore[] {
  return skills
    .filter((s) => s.score >= minScore && s.events >= minEvents)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

export function getWeaknesses(skills: SkillScore[], maxScore = 40, minEvents = 3): SkillScore[] {
  return skills
    .filter((s) => s.score <= maxScore && s.events >= minEvents)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);
}

export function getRecommendations(weaknesses: SkillScore[]): Recommendation[] {
  return weaknesses.slice(0, 3).map((w) => {
    const rec = RECOMMENDATIONS_BY_SKILL[w.skill];
    return {
      skill:        w.skill,
      reason:       rec.reason,
      gameUrl:      rec.gameUrl,
      gameLabel:    rec.gameLabel,
      lessonUrl:    rec.lessonUrl,
      lessonLabel:  rec.lessonLabel,
    };
  });
}

export function computeGameStats(events: GameEvent[]): Record<GameId, { wins: number; losses: number; total: number }> {
  const games: GameId[] = ["buy-sell-no-trade", "place-stop", "find-the-mistake", "build-the-trade"];
  const stats = {} as Record<GameId, { wins: number; losses: number; total: number }>;
  for (const g of games) stats[g] = { wins: 0, losses: 0, total: 0 };
  for (const e of events) {
    stats[e.game].total++;
    if (e.outcome === "win")  stats[e.game].wins++;
    if (e.outcome === "loss") stats[e.game].losses++;
  }
  return stats;
}

export function buildSnapshot(events: GameEvent[]): TraderProfileSnapshot {
  const skills      = computeSkillScores(events);
  const strengths   = getStrengths(skills);
  const weaknesses  = getWeaknesses(skills);
  const gameStats   = computeGameStats(events);
  const recommendations = getRecommendations(weaknesses);
  const recentEvents = [...events].sort((a, b) => b.timestamp - a.timestamp).slice(0, 8);

  // Si pas assez d'events, fallback sur le profil "neutral"
  const primaryProfile = events.length < 10
    ? PROFILES.find((p) => p.id === "neutral")!
    : deriveProfile(skills);

  return {
    primaryProfile,
    skills,
    strengths,
    weaknesses,
    totalEvents: events.length,
    gameStats,
    recommendations,
    recentEvents,
  };
}
