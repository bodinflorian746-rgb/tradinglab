import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { TradeEntry } from "./types";
import type { AiAnalysis } from "./ai";

// ── Mock du SDK Anthropic : AUCUN appel réseau réel dans ces tests. ─────────
// vi.mock est hissé par Vitest au-dessus des imports statiques ci-dessous,
// donc l'import de "./ai" reçoit bien la version mockée du SDK.
const mockCreate = vi.fn();

class MockAPIConnectionTimeoutError extends Error {}

vi.mock("@anthropic-ai/sdk", () => {
  class MockAnthropic {
    messages = { create: mockCreate };
  }
  return {
    default: MockAnthropic,
    APIConnectionTimeoutError: MockAPIConnectionTimeoutError,
  };
});

const { analyzeTrade, isAiConfigured, isAiAnalysisShape, scanForForbiddenAdvice } = await import("./ai");

const ORIGINAL_KEY = process.env.ANTHROPIC_API_KEY;

function setKey(v: string | undefined) {
  if (v === undefined) delete process.env.ANTHROPIC_API_KEY;
  else process.env.ANTHROPIC_API_KEY = v;
}

afterEach(() => {
  setKey(ORIGINAL_KEY);
  mockCreate.mockReset();
});

function makeEntry(overrides: Partial<TradeEntry> = {}): TradeEntry {
  return {
    id: "t1",
    user_id: "u1",
    asset: "EURUSD",
    direction: "buy",
    timeframe: "H1",
    trade_type: "intraday",
    result: "loss",
    trade_date: "2026-06-15T10:30:00.000Z",
    platform: null,
    setup: "order_block",
    market_trend: null,
    session: null,
    entry_reason: null,
    exit_reason: null,
    account_capital: null,
    entry_price: null,
    stop_loss: null,
    take_profit: null,
    risk_percent: null,
    risk_amount: null,
    r_multiple: -1,
    fees: null,
    followed_plan: "no",
    emotion_before: "impatient",
    emotion_during: null,
    emotion_after: null,
    perceived_mistake: "entry_too_early",
    user_comment: "Entré avant confirmation.",
    screenshot_url: null,
    ai_status: "pending",
    ai_summary: null,
    ai_feedback: null,
    ai_mistakes: null,
    ai_score: null,
    ai_recommendations: null,
    created_at: "2026-06-15T10:31:00.000Z",
    updated_at: "2026-06-15T10:31:00.000Z",
    ...overrides,
  };
}

function textResponse(text: string) {
  return { content: [{ type: "text", text }] };
}

const CLEAN_ANALYSIS: AiAnalysis = {
  summary: "Trade perdant lié à une entrée anticipée sans confirmation.",
  strengths: ["Stop loss placé avant l'entrée"],
  mistakes: ["Entrée avant confirmation claire du setup"],
  behavioral_advice: "Attendre la clôture de bougie de confirmation avant d'entrer renforcerait ta discipline.",
  score: 54,
};

describe("isAiConfigured", () => {
  it("false si ANTHROPIC_API_KEY est absente", () => {
    setKey(undefined);
    expect(isAiConfigured()).toBe(false);
  });
  it("true si ANTHROPIC_API_KEY est présente", () => {
    setKey("sk-test-123");
    expect(isAiConfigured()).toBe(true);
  });
});

describe("isAiAnalysisShape — schéma JSON fermé", () => {
  it("accepte un objet conforme au schéma exact", () => {
    expect(isAiAnalysisShape(CLEAN_ANALYSIS)).toBe(true);
  });

  it("rejette un champ supplémentaire (schéma fermé)", () => {
    expect(isAiAnalysisShape({ ...CLEAN_ANALYSIS, recommendation: "achète" })).toBe(false);
  });

  it("rejette un champ manquant", () => {
    const incomplete: Record<string, unknown> = { ...CLEAN_ANALYSIS };
    delete incomplete.score;
    expect(isAiAnalysisShape(incomplete)).toBe(false);
  });

  it("rejette un score hors de [0,100]", () => {
    expect(isAiAnalysisShape({ ...CLEAN_ANALYSIS, score: 150 })).toBe(false);
    expect(isAiAnalysisShape({ ...CLEAN_ANALYSIS, score: -1 })).toBe(false);
  });

  it("rejette un score de mauvais type", () => {
    expect(isAiAnalysisShape({ ...CLEAN_ANALYSIS, score: "54" })).toBe(false);
  });

  it("rejette un tableau contenant un non-string", () => {
    expect(isAiAnalysisShape({ ...CLEAN_ANALYSIS, strengths: ["ok", 42] })).toBe(false);
  });

  it("rejette summary vide", () => {
    expect(isAiAnalysisShape({ ...CLEAN_ANALYSIS, summary: "   " })).toBe(false);
  });

  it("rejette une valeur non-objet", () => {
    expect(isAiAnalysisShape("not an object")).toBe(false);
    expect(isAiAnalysisShape(null)).toBe(false);
    expect(isAiAnalysisShape(["array"])).toBe(false);
  });
});

describe("scanForForbiddenAdvice — filtre de sécurité (couche 3)", () => {
  // ≥ 5 cas bloqués exigés — 7 fournis, couvrant les 3 familles de motifs (fr/en/es).
  const blockedCases: { name: string; analysis: AiAnalysis }[] = [
    {
      name: "impératif d'achat fr dans behavioral_advice",
      analysis: { ...CLEAN_ANALYSIS, behavioral_advice: "Achète maintenant sur XAUUSD pour profiter du rebond." },
    },
    {
      name: "impératif de vente fr dans un mistake",
      analysis: { ...CLEAN_ANALYSIS, mistakes: ["Vends dès l'ouverture de New York."] },
    },
    {
      name: "directive d'entrée fr",
      analysis: { ...CLEAN_ANALYSIS, behavioral_advice: "Entre sur ce setup dès demain matin." },
    },
    {
      name: "directive d'achat en",
      analysis: { ...CLEAN_ANALYSIS, behavioral_advice: "Buy now while the price is low." },
    },
    {
      name: "formulation de recommandation explicite fr",
      analysis: { ...CLEAN_ANALYSIS, summary: "Je te recommande d'acheter sur la prochaine cassure." },
    },
    {
      name: "niveau de prix futur (objectif chiffré)",
      analysis: { ...CLEAN_ANALYSIS, behavioral_advice: "Vise un objectif de 1.0850 sur ce type de setup." },
    },
    {
      name: "directive d'achat es dans strengths",
      analysis: { ...CLEAN_ANALYSIS, strengths: ["Compra en la próxima confirmación."] },
    },
  ];

  for (const { name, analysis } of blockedCases) {
    it(`bloque : ${name}`, () => {
      const result = scanForForbiddenAdvice(analysis);
      expect(result.blocked).toBe(true);
      expect(result.matchedLabel).toBeTruthy();
    });
  }

  // ≥ 2 cas propres exigés — 3 fournis, incluant des formes proches (noms,
  // temps composés) qui ne doivent PAS déclencher le filtre.
  const cleanCases: { name: string; analysis: AiAnalysis }[] = [
    {
      name: "analyse comportementale standard",
      analysis: CLEAN_ANALYSIS,
    },
    {
      name: "noms 'achat'/'vente' (pas l'impératif) ne déclenchent pas le filtre",
      analysis: {
        ...CLEAN_ANALYSIS,
        behavioral_advice: "Cet achat était cohérent avec ta structure ; ta vente a respecté ton plan initial.",
      },
    },
    {
      name: "'buy'/'sell' descriptifs (pas de directive) ne déclenchent pas le filtre",
      analysis: {
        ...CLEAN_ANALYSIS,
        mistakes: ["Your sell entry was slightly early relative to your plan."],
      },
    },
  ];

  for (const { name, analysis } of cleanCases) {
    it(`laisse passer : ${name}`, () => {
      expect(scanForForbiddenAdvice(analysis).blocked).toBe(false);
    });
  }
});

describe("analyzeTrade — orchestration (SDK mocké, aucun appel réseau)", () => {
  beforeEach(() => {
    setKey("sk-test-123");
  });

  it("ne tente aucun appel réseau si ANTHROPIC_API_KEY est absente", async () => {
    setKey(undefined);
    const result = await analyzeTrade(makeEntry());
    expect(result).toEqual({ ok: false, reason: "not_configured" });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("renvoie ok:true avec les données validées sur une réponse propre", async () => {
    mockCreate.mockResolvedValueOnce(textResponse(JSON.stringify(CLEAN_ANALYSIS)));
    const result = await analyzeTrade(makeEntry());
    expect(result).toEqual({ ok: true, data: CLEAN_ANALYSIS });
  });

  it("accepte une réponse enrobée dans un bloc markdown ```json (comportement réel observé du modèle)", async () => {
    mockCreate.mockResolvedValueOnce(textResponse("```json\n" + JSON.stringify(CLEAN_ANALYSIS, null, 2) + "\n```"));
    const result = await analyzeTrade(makeEntry());
    expect(result).toEqual({ ok: true, data: CLEAN_ANALYSIS });
  });

  it("renvoie reason:'invalid_format' si la réponse n'est pas du JSON", async () => {
    mockCreate.mockResolvedValueOnce(textResponse("Désolé, je ne peux pas répondre."));
    const result = await analyzeTrade(makeEntry());
    expect(result).toEqual({ ok: false, reason: "invalid_format" });
  });

  it("renvoie reason:'invalid_format' si le JSON ne respecte pas le schéma", async () => {
    mockCreate.mockResolvedValueOnce(
      textResponse(JSON.stringify({ ...CLEAN_ANALYSIS, recommendation: "achète EURUSD" })),
    );
    const result = await analyzeTrade(makeEntry());
    expect(result).toEqual({ ok: false, reason: "invalid_format" });
  });

  it("renvoie reason:'blocked_content' si le filtre de sécurité détecte un motif interdit, sans exposer le contenu bloqué", async () => {
    mockCreate.mockResolvedValueOnce(
      textResponse(JSON.stringify({ ...CLEAN_ANALYSIS, behavioral_advice: "Achète maintenant sur XAUUSD." })),
    );
    const result = await analyzeTrade(makeEntry());
    expect(result).toEqual({ ok: false, reason: "blocked_content" });
  });

  it("renvoie reason:'timeout' sur un timeout de connexion", async () => {
    mockCreate.mockRejectedValueOnce(new MockAPIConnectionTimeoutError("timeout"));
    const result = await analyzeTrade(makeEntry());
    expect(result).toEqual({ ok: false, reason: "timeout" });
  });

  it("renvoie reason:'api_error' sur une erreur réseau/API générique", async () => {
    mockCreate.mockRejectedValueOnce(new Error("500 Internal Server Error"));
    const result = await analyzeTrade(makeEntry());
    expect(result).toEqual({ ok: false, reason: "api_error" });
  });

  it("renvoie reason:'api_error' si la réponse n'a aucun bloc texte", async () => {
    mockCreate.mockResolvedValueOnce({ content: [] });
    const result = await analyzeTrade(makeEntry());
    expect(result).toEqual({ ok: false, reason: "api_error" });
  });

  it("envoie uniquement les champs déjà saisis du trade, jamais de donnée de marché live", async () => {
    mockCreate.mockResolvedValueOnce(textResponse(JSON.stringify(CLEAN_ANALYSIS)));
    await analyzeTrade(makeEntry({ user_comment: "Contexte du trade" }));
    const call = mockCreate.mock.calls[0][0];
    expect(call.model).toBe("claude-haiku-4-5-20251001");
    expect(call.system).toContain("Tu ne prédis JAMAIS le marché");
    const userMessage = call.messages[0].content as string;
    expect(userMessage).toContain("EURUSD");
    expect(userMessage).toContain("Contexte du trade");
    // Pas de champ de prix live / cotation dans le prompt envoyé.
    expect(userMessage).not.toMatch(/live|cotation actuelle|prix actuel/i);
  });
});
