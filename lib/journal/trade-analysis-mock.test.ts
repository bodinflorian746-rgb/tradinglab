import { describe, expect, it } from "vitest";
import { getTradeScore, buildTradeAnalysis } from "./trade-analysis-mock";
import type { TradeEntryView } from "./types";
import type { Dictionaries } from "@/i18n/dictionaries";

type JournalDict = Dictionaries["journal"];

// Dictionnaire minimal : seule tradeAnalysis.notAvailableOpen est lue sur le
// chemin "trade encore ouvert" (le seul exercé par ces tests).
const T = { tradeAnalysis: { notAvailableOpen: "Analyse indisponible : ce trade est encore ouvert." } } as unknown as JournalDict;

function makeEntry(overrides: Partial<TradeEntryView> = {}): TradeEntryView {
  return {
    id: "t1",
    user_id: "u1",
    asset: "EURUSD",
    direction: "buy",
    timeframe: "H1",
    trade_type: "intraday",
    result: "open",
    trade_date: "2026-06-18T07:45:00.000Z",
    platform: null,
    setup: null,
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
    r_multiple: null,
    fees: null,
    followed_plan: null,
    emotion_before: null,
    emotion_during: null,
    emotion_after: null,
    perceived_mistake: null,
    user_comment: null,
    screenshot_url: null,
    ai_status: "pending",
    ai_summary: null,
    ai_feedback: null,
    ai_mistakes: null,
    ai_score: null,
    ai_recommendations: null,
    created_at: "2026-06-18T07:46:00.000Z",
    updated_at: "2026-06-18T07:46:00.000Z",
    screenshot_signed_url: null,
    ...overrides,
  };
}

describe("getTradeScore — garde trade encore ouvert", () => {
  it("renvoie null pour un trade result=\"open\", même avec un ai_score présent", () => {
    const e = makeEntry({ result: "open", ai_score: 90 });
    expect(getTradeScore(e)).toBeNull();
  });

  it("renvoie un score numérique pour un trade clôturé (win)", () => {
    const e = makeEntry({ result: "win" });
    expect(getTradeScore(e)).not.toBeNull();
    expect(typeof getTradeScore(e)).toBe("number");
  });

  it("renvoie un score numérique pour un trade clôturé (loss)", () => {
    const e = makeEntry({ result: "loss" });
    expect(getTradeScore(e)).not.toBeNull();
  });

  it("renvoie un score numérique pour un trade clôturé (break_even)", () => {
    const e = makeEntry({ result: "break_even" });
    expect(getTradeScore(e)).not.toBeNull();
  });
});

describe("buildTradeAnalysis — garde trade encore ouvert", () => {
  it("renvoie score=null, good/improve vides et le message 'indisponible' pour result=\"open\"", () => {
    const e = makeEntry({ result: "open" });
    const a = buildTradeAnalysis(e, T, "fr");
    expect(a.score).toBeNull();
    expect(a.good).toEqual([]);
    expect(a.improve).toEqual([]);
    expect(a.coachAdvice).toBe(T.tradeAnalysis.notAvailableOpen);
    expect(a.impact).toBe("");
  });

  it("renvoie une analyse complète (score non nul) pour un trade clôturé", () => {
    const e = makeEntry({ result: "win", followed_plan: "yes" });
    const a = buildTradeAnalysis(e, T, "fr");
    expect(a.score).not.toBeNull();
    expect(a.coachAdvice).not.toBe(T.tradeAnalysis.notAvailableOpen);
  });
});
