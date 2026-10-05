import { describe, expect, it } from "vitest";
import { computeCoachInsights, INSIGHTS_MIN_GROUP } from "./insights";
import type { TradeEntry, TradeResult } from "./types";

let seq = 0;
function makeEntry(overrides: Partial<TradeEntry> = {}): TradeEntry {
  seq += 1;
  return {
    id: `t${seq}`,
    user_id: "u1",
    asset: "EURUSD",
    direction: "buy",
    timeframe: "H1",
    trade_type: "intraday",
    result: "win",
    trade_date: "2026-06-15T10:30:00.000Z",
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
    ai_strengths: null,
    created_at: "2026-06-15T10:31:00.000Z",
    updated_at: "2026-06-15T10:31:00.000Z",
    ...overrides,
  };
}

function trades(n: number, result: TradeResult, overrides: Partial<TradeEntry> = {}): TradeEntry[] {
  return Array.from({ length: n }, () => makeEntry({ result, ...overrides }));
}

describe("computeCoachInsights — tranche horaire (bestHour/worstHour)", () => {
  it("classe la meilleure et la pire heure UTC quand l'échantillon est suffisant", () => {
    const entries = [
      ...trades(3, "win", { trade_date: "2026-06-15T10:15:00.000Z" }),
      ...trades(3, "loss", { trade_date: "2026-06-16T20:45:00.000Z" }),
    ];
    const insights = computeCoachInsights(entries);
    expect(insights.bestHour).toEqual({ key: "10", winrate: 100, trades: 3 });
    expect(insights.worstHour).toEqual({ key: "20", winrate: 0, trades: 3 });
  });

  it('renvoie null si un groupe horaire a moins de INSIGHTS_MIN_GROUP trades décisifs', () => {
    expect(INSIGHTS_MIN_GROUP).toBe(3);
    const entries = [
      ...trades(2, "win", { trade_date: "2026-06-15T10:15:00.000Z" }), // < 3 : groupe non qualifié
      ...trades(3, "loss", { trade_date: "2026-06-16T20:45:00.000Z" }),
    ];
    const insights = computeCoachInsights(entries);
    // Un seul groupe qualifié (20h) → pas de comparaison possible.
    expect(insights.bestHour).toBeNull();
    expect(insights.worstHour).toBeNull();
  });

  it("ignore un trade_date invalide sans planter", () => {
    const entries = [
      ...trades(3, "win", { trade_date: "2026-06-15T10:15:00.000Z" }),
      ...trades(3, "loss", { trade_date: "2026-06-16T20:45:00.000Z" }),
      makeEntry({ result: "win", trade_date: "not-a-date" }),
    ];
    const insights = computeCoachInsights(entries);
    expect(insights.bestHour).toEqual({ key: "10", winrate: 100, trades: 3 });
  });
});

describe("computeCoachInsights — actif (bestAsset/worstAsset)", () => {
  it("classe le meilleur et le pire actif quand l'échantillon est suffisant", () => {
    const entries = [
      ...trades(3, "win", { asset: "XAUUSD" }),
      ...trades(3, "loss", { asset: "GBPUSD" }),
    ];
    const insights = computeCoachInsights(entries);
    expect(insights.bestAsset).toEqual({ key: "XAUUSD", winrate: 100, trades: 3 });
    expect(insights.worstAsset).toEqual({ key: "GBPUSD", winrate: 0, trades: 3 });
  });

  it("renvoie null sous le seuil minimum (un seul actif qualifié)", () => {
    const entries = [
      ...trades(2, "win", { asset: "XAUUSD" }),
      ...trades(3, "loss", { asset: "GBPUSD" }),
    ];
    const insights = computeCoachInsights(entries);
    expect(insights.bestAsset).toBeNull();
    expect(insights.worstAsset).toBeNull();
  });
});

describe("computeCoachInsights — jour de la semaine (bestWeekday/worstWeekday)", () => {
  it("classe le meilleur et le pire jour (UTC) quand l'échantillon est suffisant", () => {
    // 2026-06-01/08/15 sont des lundis UTC ; 2026-06-05/12/19 des vendredis UTC.
    const entries = [
      ...["2026-06-01", "2026-06-08", "2026-06-15"].map((d) =>
        makeEntry({ result: "win", trade_date: `${d}T09:00:00.000Z` }),
      ),
      ...["2026-06-05", "2026-06-12", "2026-06-19"].map((d) =>
        makeEntry({ result: "loss", trade_date: `${d}T09:00:00.000Z` }),
      ),
    ];
    const insights = computeCoachInsights(entries);
    expect(insights.bestWeekday).toEqual({ key: "mon", winrate: 100, trades: 3 });
    expect(insights.worstWeekday).toEqual({ key: "fri", winrate: 0, trades: 3 });
  });

  it("renvoie null sous le seuil minimum (un seul jour qualifié)", () => {
    const entries = [
      ...["2026-06-01", "2026-06-08"].map((d) => makeEntry({ result: "win", trade_date: `${d}T09:00:00.000Z` })),
      ...["2026-06-05", "2026-06-12", "2026-06-19"].map((d) =>
        makeEntry({ result: "loss", trade_date: `${d}T09:00:00.000Z` }),
      ),
    ];
    const insights = computeCoachInsights(entries);
    expect(insights.bestWeekday).toBeNull();
    expect(insights.worstWeekday).toBeNull();
  });
});
