// ─────────────────────────────────────────────────────────────────────────────
//  MODE DÉMO LOCAL — JOURNAL IA  (DEV UNIQUEMENT)
// ─────────────────────────────────────────────────────────────────────────────
//  But : valider toute l'UX du Journal SANS Supabase (pas d'insert, pas d'upload).
//
//  ⚠️  Ce module est strictement isolé et ne s'active JAMAIS en production :
//      isMockEnvEnabled() / isDevMissingTable() retournent false dès que
//      NODE_ENV === "production". Aucune donnée mock ne peut fuiter en prod,
//      même si NEXT_PUBLIC_JOURNAL_MOCK_MODE=true est laissé par erreur.
//
//  Activation en dev :
//    1) variable d'env  NEXT_PUBLIC_JOURNAL_MOCK_MODE=true   (interrupteur manuel)
//    2) OU table Supabase absente (bascule auto le temps de la session locale)
//
//  Pour désactiver avant prod : retirer la variable d'env. Le garde NODE_ENV
//  suffit de toute façon à neutraliser ce fichier en build de production.
// ─────────────────────────────────────────────────────────────────────────────

import type { TradeEntryView } from "./types";

const IS_DEV = process.env.NODE_ENV !== "production";

// Interrupteur manuel (dev only).
export function isMockEnvEnabled(): boolean {
  return IS_DEV && process.env.NEXT_PUBLIC_JOURNAL_MOCK_MODE === "true";
}

// Détecte une erreur "table absente" pour basculer en mock auto (dev only).
export function isDevMissingTable(
  error: { code?: string; message?: string } | null,
): boolean {
  if (!IS_DEV || !error) return false;
  const code = error.code ?? "";
  const msg = (error.message ?? "").toLowerCase();
  return (
    code === "42P01" || // undefined_table (Postgres)
    code === "PGRST205" || // table introuvable dans le cache PostgREST
    msg.includes("does not exist") ||
    msg.includes("schema cache")
  );
}

// Jeu de données fictif (5 trades) — couvre scalp / intraday / swing, plusieurs
// timeframes (M5→W1), plusieurs setups (Order Block ×2 → setup le plus utilisé),
// émotions & erreurs variées (Entrée trop tôt ×2 → erreur la plus fréquente),
// et un trade déjà "analysé par l'IA" pour visualiser le bloc feedback.
export const MOCK_TRADES: TradeEntryView[] = [
  {
    id: "mock-1",
    user_id: "mock-user",
    asset: "XAUUSD",
    direction: "sell",
    timeframe: "M15",
    trade_type: "scalp",
    result: "win",
    trade_date: "2026-06-17T09:30:00.000Z",
    platform: "mt5",
    setup: "order_block",
    market_trend: "bearish",
    session: "london",
    entry_reason: "Rejet de l'Order Block H1, clôture M15 sous le support.",
    exit_reason: "TP atteint sur la liquidité inférieure.",
    account_capital: 10000,
    entry_price: 2348.5,
    stop_loss: 2353.0,
    take_profit: 2337.0,
    risk_percent: 1,
    risk_amount: 100,
    r_multiple: 2.4,
    fees: 3.5,
    followed_plan: "yes",
    emotion_before: "confident",
    emotion_during: "calm",
    emotion_after: "satisfied",
    perceived_mistake: "none",
    user_comment: "Trade modèle : patience sur la confirmation, exécution propre.",
    screenshot_url: null,
    ai_status: "analyzed",
    ai_summary: "Entrée alignée sur ton scénario, gestion du risque cohérente.",
    ai_feedback:
      "Ton entrée semble cohérente avec ton scénario : tu as attendu la confirmation de clôture sur l'Order Block. Le ratio risque/rendement est solide (2.4R). Tu as respecté ton plan.",
    ai_mistakes: [],
    ai_score: 82,
    ai_recommendations: [
      "Continue à attendre la clôture avant d'entrer.",
      "Documente la zone H1 en capture pour fiabiliser ta relecture.",
    ],
    created_at: "2026-06-17T09:35:00.000Z",
    updated_at: "2026-06-17T09:35:00.000Z",
    screenshot_signed_url: null,
  },
  {
    id: "mock-2",
    user_id: "mock-user",
    asset: "EURUSD",
    direction: "buy",
    timeframe: "H1",
    trade_type: "intraday",
    result: "loss",
    trade_date: "2026-06-16T13:00:00.000Z",
    platform: "tradingview",
    setup: "breakout",
    market_trend: "range",
    session: "new_york",
    entry_reason: "Anticipation de la cassure du range, sans attendre le retest.",
    exit_reason: "Faux breakout, stop touché.",
    account_capital: 10000,
    entry_price: 1.0742,
    stop_loss: 1.0728,
    take_profit: 1.078,
    risk_percent: 1,
    risk_amount: 100,
    r_multiple: -1,
    fees: 2,
    followed_plan: "no",
    emotion_before: "impatient",
    emotion_during: "stressed",
    emotion_after: "frustrated",
    perceived_mistake: "entry_too_early",
    user_comment: "Entré avant la cassure, sans confirmation claire. Trade hors plan.",
    screenshot_url: null,
    ai_status: "pending",
    ai_summary: null,
    ai_feedback: null,
    ai_mistakes: null,
    ai_score: null,
    ai_recommendations: null,
    created_at: "2026-06-16T13:05:00.000Z",
    updated_at: "2026-06-16T13:05:00.000Z",
    screenshot_signed_url: null,
  },
  {
    id: "mock-3",
    user_id: "mock-user",
    asset: "NAS100",
    direction: "buy",
    timeframe: "M5",
    trade_type: "scalp",
    result: "loss",
    trade_date: "2026-06-16T15:20:00.000Z",
    platform: "ctrader",
    setup: "retest",
    market_trend: "bullish",
    session: "new_york",
    entry_reason: "Retest d'un niveau cassé en tendance haussière.",
    exit_reason: "Pullback profond, stop trop proche déclenché.",
    account_capital: 10000,
    entry_price: 19850,
    stop_loss: 19838,
    take_profit: 19895,
    risk_percent: 0.5,
    risk_amount: 50,
    r_multiple: -1,
    fees: 1.5,
    followed_plan: "partial",
    emotion_before: "stressed",
    emotion_during: "hesitant",
    emotion_after: "frustrated",
    perceived_mistake: "bad_stop",
    user_comment: "Stop placé trop près du prix, sorti sur un simple pullback.",
    screenshot_url: null,
    ai_status: "pending",
    ai_summary: null,
    ai_feedback: null,
    ai_mistakes: null,
    ai_score: null,
    ai_recommendations: null,
    created_at: "2026-06-16T15:25:00.000Z",
    updated_at: "2026-06-16T15:25:00.000Z",
    screenshot_signed_url: null,
  },
  {
    id: "mock-4",
    user_id: "mock-user",
    asset: "BTCUSD",
    direction: "sell",
    timeframe: "W1",
    trade_type: "swing",
    result: "break_even",
    trade_date: "2026-06-14T18:00:00.000Z",
    platform: "mt4",
    setup: "liquidity_sweep",
    market_trend: "uncertain",
    session: "asia",
    entry_reason: "Balayage de liquidité au-dessus du dernier sommet hebdo.",
    exit_reason: "Sorti à break-even par prudence avant la macro.",
    account_capital: 10000,
    entry_price: 67200,
    stop_loss: 68100,
    take_profit: 65000,
    risk_percent: 1.5,
    risk_amount: 150,
    r_multiple: 0,
    fees: 8,
    followed_plan: "partial",
    emotion_before: "calm",
    emotion_during: "stressed",
    emotion_after: "relieved",
    perceived_mistake: "entry_too_early",
    user_comment: "Bon contexte mais entrée un peu prématurée sur le sweep.",
    screenshot_url: null,
    ai_status: "pending",
    ai_summary: null,
    ai_feedback: null,
    ai_mistakes: null,
    ai_score: null,
    ai_recommendations: null,
    created_at: "2026-06-14T18:05:00.000Z",
    updated_at: "2026-06-14T18:05:00.000Z",
    screenshot_signed_url: null,
  },
  {
    id: "mock-5",
    user_id: "mock-user",
    asset: "GBPUSD",
    direction: "buy",
    timeframe: "M30",
    trade_type: "intraday",
    result: "open",
    trade_date: "2026-06-18T07:45:00.000Z",
    platform: "tradingview",
    setup: "order_block",
    market_trend: "bullish",
    session: "london",
    entry_reason: "Réaction sur Order Block M30 en tendance haussière.",
    exit_reason: null,
    account_capital: 10000,
    entry_price: 1.271,
    stop_loss: 1.2685,
    take_profit: 1.276,
    risk_percent: 1,
    risk_amount: 100,
    r_multiple: null,
    fees: null,
    followed_plan: "yes",
    emotion_before: "calm",
    emotion_during: "confident",
    emotion_after: "neutral",
    perceived_mistake: "none",
    user_comment: "Position en cours, je laisse courir vers le TP.",
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
  },
];
