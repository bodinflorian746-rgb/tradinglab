// Surface d'API publique du système Mon Profil Trader.
//
// Usage côté jeu :
//   import { logGameEvent } from "@/lib/trader-profile";
//   logGameEvent({ game: "buy-sell-no-trade", difficulty, skill, outcome });
//
// Usage côté page profil :
//   import { loadProfile, resetProfile } from "@/lib/trader-profile";
//   const snapshot = loadProfile();

import { appendEvent, loadEvents, resetEvents } from "./storage";
import { buildSnapshot } from "./scoring";
import type { GameEvent, TraderProfileSnapshot } from "./types";

export * from "./types";
export { PROFILES, RECOMMENDATIONS_BY_SKILL } from "./profiles";
export {
  computeSkillScores,
  deriveProfile,
  getStrengths,
  getWeaknesses,
  getRecommendations,
  computeGameStats,
  buildSnapshot,
} from "./scoring";

// Append un event. Côté serveur : no-op (sans crash). Côté client : écrit
// dans localStorage.
export function logGameEvent(event: Omit<GameEvent, "timestamp">): void {
  appendEvent({ ...event, timestamp: Date.now() });
}

// Charge le snapshot du profil (skills, profile name, strengths, weaknesses,
// recommendations, recent events). Côté serveur : snapshot vide.
export function loadProfile(): TraderProfileSnapshot {
  return buildSnapshot(loadEvents());
}

export function resetProfile(): void {
  resetEvents();
}
