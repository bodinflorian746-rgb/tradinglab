// Test d'intégration RÉEL — fait un VRAI appel réseau à l'API Anthropic.
// Volontairement séparé de ai.test.ts (qui, lui, mocke tout et ne fait jamais
// d'appel réseau). Ce fichier ne s'exécute QUE si ANTHROPIC_API_KEY est
// configurée (describe.skipIf) : absent → skip silencieux, aucun impact sur
// `npx vitest run` en local ou en CI.
//
// Lancer isolément une fois la clé posée dans .env.local :
//   npx vitest run lib/journal/ai.integration.test.ts
import { describe, expect, it } from "vitest";
import { analyzeTrade, isAiConfigured } from "./ai";
import type { TradeEntry } from "./types";

// Trade de test réaliste : clôturé (result !== "open"), avec une erreur
// perçue claire et un contexte suffisant pour que l'IA ait matière à analyser.
const TEST_ENTRY: TradeEntry = {
  id: "integration-test-trade",
  user_id: "integration-test-user",
  asset: "XAUUSD",
  direction: "sell",
  timeframe: "M15",
  trade_type: "scalp",
  result: "loss",
  trade_date: "2026-06-16T13:00:00.000Z",
  platform: "tradingview",
  setup: "breakout",
  market_trend: "range",
  session: "new_york",
  entry_reason: "Anticipation de la cassure du range, sans attendre le retest.",
  exit_reason: "Faux breakout, stop touché.",
  account_capital: 10000,
  entry_price: 2356.0,
  stop_loss: 2360.5,
  take_profit: 2345.0,
  risk_percent: 1,
  risk_amount: 100,
  r_multiple: -1,
  fees: 3.2,
  followed_plan: "no",
  emotion_before: "impatient",
  emotion_during: "stressed",
  emotion_after: "frustrated",
  perceived_mistake: "entry_too_early",
  user_comment: "Entré avant la cassure réelle, sans confirmation claire. Trade hors plan.",
  screenshot_url: null,
  ai_status: "pending",
  ai_summary: null,
  ai_feedback: null,
  ai_mistakes: null,
  ai_score: null,
  ai_recommendations: null,
  created_at: "2026-06-16T13:05:00.000Z",
  updated_at: "2026-06-16T13:05:00.000Z",
};

describe.skipIf(!isAiConfigured())("analyzeTrade — intégration réelle (vrai appel réseau Claude Haiku 4.5)", () => {
  it(
    "appelle réellement l'API, respecte le schéma JSON strict, et n'est pas bloqué par le filtre de sécurité sur un cas normal",
    async () => {
      const result = await analyzeTrade(TEST_ENTRY);

      // Si la clé est absente/invalide, ce test échoue avec un reason
      // explicite (api_error/not_configured) plutôt que de passer à tort.
      if (!result.ok) {
        throw new Error(`analyzeTrade a échoué : reason="${result.reason}" (vérifie ANTHROPIC_API_KEY)`);
      }

      expect(result.ok).toBe(true);
      const { data } = result;

      // Schéma JSON strict respecté (déjà validé en interne par
      // isAiAnalysisShape, ré-affirmé ici pour la lisibilité du rapport).
      expect(typeof data.summary).toBe("string");
      expect(data.summary.trim().length).toBeGreaterThan(0);
      expect(Array.isArray(data.strengths)).toBe(true);
      expect(data.strengths.every((s) => typeof s === "string")).toBe(true);
      expect(Array.isArray(data.mistakes)).toBe(true);
      expect(data.mistakes.every((s) => typeof s === "string")).toBe(true);
      expect(typeof data.behavioral_advice).toBe("string");
      expect(data.behavioral_advice.trim().length).toBeGreaterThan(0);
      expect(typeof data.score).toBe("number");
      expect(data.score).toBeGreaterThanOrEqual(0);
      expect(data.score).toBeLessThanOrEqual(100);

      // reason === "blocked_content" n'aurait jamais pu produire result.ok===true,
      // donc le fait d'arriver ici confirme déjà que le filtre de sécurité n'a
      // rien bloqué sur ce cas normal. On le documente explicitement :
      console.log("[integration-test] analyse IA reçue, filtre de sécurité : RAS (aucun blocage)");
      console.log("[integration-test] score:", data.score);
      console.log("[integration-test] summary:", data.summary);
      console.log("[integration-test] strengths:", data.strengths);
      console.log("[integration-test] mistakes:", data.mistakes);
      console.log("[integration-test] behavioral_advice:", data.behavioral_advice);
    },
    30_000, // timeout étendu : vrai appel réseau, pas un mock instantané.
  );
});
