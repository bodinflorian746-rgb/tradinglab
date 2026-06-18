// Types & constantes du Journal de trading IA.
// Source de vérité des valeurs autorisées (alignées sur les CHECK SQL).
// Toutes les valeurs sont des clés canoniques (stables, lisibles par l'IA) ;
// les libellés FR/EN/ES vivent dans dictionaries/<locale>/journal.json.

export const DIRECTIONS = ["buy", "sell"] as const;
export type Direction = (typeof DIRECTIONS)[number];

export const TIMEFRAMES = ["M1", "M5", "M15", "M30", "H1", "H4", "D1", "W1"] as const;
export type Timeframe = (typeof TIMEFRAMES)[number];

export const TRADE_TYPES = ["scalp", "intraday", "swing"] as const;
export type TradeType = (typeof TRADE_TYPES)[number];

export const RESULTS = ["win", "loss", "break_even", "open"] as const;
export type TradeResult = (typeof RESULTS)[number];

export const PLATFORMS = ["tradingview", "mt4", "mt5", "ctrader", "other"] as const;
export type Platform = (typeof PLATFORMS)[number];

// Setup technique utilisé.
export const SETUPS = [
  "order_block",
  "fair_value_gap",
  "liquidity_sweep",
  "breakout",
  "retest",
  "support_resistance",
  "trend_following",
  "reversal",
  "news_macro",
  "other",
] as const;
export type Setup = (typeof SETUPS)[number];

// Contexte de marché.
export const MARKET_TRENDS = ["bullish", "bearish", "range", "uncertain"] as const;
export type MarketTrend = (typeof MARKET_TRENDS)[number];

export const SESSIONS = ["asia", "london", "new_york", "other"] as const;
export type Session = (typeof SESSIONS)[number];

// Respect du plan.
export const FOLLOWED_PLAN = ["yes", "partial", "no"] as const;
export type FollowedPlan = (typeof FOLLOWED_PLAN)[number];

// Erreur principale ressentie (remplace la saisie libre dans perceived_mistake).
export const MAIN_MISTAKES = [
  "entry_too_early",
  "entry_too_late",
  "bad_stop",
  "tp_too_close",
  "out_of_plan",
  "revenge_trading",
  "overtrading",
  "fomo",
  "exit_too_early",
  "none",
  "other",
] as const;
export type MainMistake = (typeof MAIN_MISTAKES)[number];

// Émotions (listes distinctes par phase).
export const EMOTIONS_BEFORE = [
  "calm",
  "confident",
  "stressed",
  "impatient",
  "fomo",
  "euphoric",
  "tired",
  "frustrated",
] as const;
export type EmotionBefore = (typeof EMOTIONS_BEFORE)[number];

export const EMOTIONS_DURING = [
  "calm",
  "stressed",
  "hesitant",
  "impatient",
  "confident",
  "frustrated",
] as const;
export type EmotionDuring = (typeof EMOTIONS_DURING)[number];

export const EMOTIONS_AFTER = [
  "satisfied",
  "frustrated",
  "relieved",
  "angry",
  "neutral",
  "motivated",
] as const;
export type EmotionAfter = (typeof EMOTIONS_AFTER)[number];

export const AI_STATUSES = ["pending", "analyzed", "failed", "skipped"] as const;
export type AiStatus = (typeof AI_STATUSES)[number];

// Ligne brute telle que stockée en base (snake_case Supabase).
export interface TradeEntry {
  id: string;
  user_id: string;

  // ── Essentiel ──
  asset: string;
  direction: Direction;
  timeframe: Timeframe;
  trade_type: TradeType;
  result: TradeResult;
  trade_date: string;

  // ── Analyse du setup ──
  platform: Platform | null;
  setup: Setup | null;
  market_trend: MarketTrend | null;
  session: Session | null;
  entry_reason: string | null;
  exit_reason: string | null;

  // ── Gestion du risque ──
  account_capital: number | null;
  entry_price: number | null;
  stop_loss: number | null;
  take_profit: number | null;
  risk_percent: number | null;
  risk_amount: number | null;
  r_multiple: number | null;
  fees: number | null;

  // ── Psychologie ──
  followed_plan: FollowedPlan | null;
  emotion_before: EmotionBefore | null;
  emotion_during: EmotionDuring | null;
  emotion_after: EmotionAfter | null;
  perceived_mistake: MainMistake | null;

  // ── Notes & capture ──
  user_comment: string | null;
  screenshot_url: string | null; // chemin objet Storage (bucket privé)

  // ── Analyse IA (structure V1, remplie en V2) ──
  ai_status: AiStatus;
  ai_summary: string | null;
  ai_feedback: string | null;
  ai_mistakes: string[] | null;
  ai_score: number | null;
  ai_recommendations: string[] | null;

  created_at: string;
  updated_at: string;
}

// Entrée enrichie pour l'affichage : URL signée résolue depuis le chemin Storage.
export type TradeEntryView = TradeEntry & {
  screenshot_signed_url: string | null;
};

// Champs validés prêts à insérer (exactement les colonnes éditables par l'utilisateur).
export interface ValidatedTrade {
  asset: string;
  direction: Direction;
  timeframe: Timeframe;
  trade_type: TradeType;
  result: TradeResult;
  trade_date: string; // ISO 8601
  platform: Platform | null;
  setup: Setup | null;
  market_trend: MarketTrend | null;
  session: Session | null;
  entry_reason: string | null;
  exit_reason: string | null;
  account_capital: number | null;
  entry_price: number | null;
  stop_loss: number | null;
  take_profit: number | null;
  risk_percent: number | null;
  risk_amount: number | null;
  r_multiple: number | null;
  fees: number | null;
  followed_plan: FollowedPlan | null;
  emotion_before: EmotionBefore | null;
  emotion_during: EmotionDuring | null;
  emotion_after: EmotionAfter | null;
  perceived_mistake: MainMistake | null;
  user_comment: string | null;
}

export interface JournalStats {
  total: number;
  wins: number;
  losses: number;
  breakEven: number;
  open: number;
  closed: number; // wins + losses + breakEven
  winrate: number; // % sur trades clôturés (0 si aucun)
  avgR: number | null; // moyenne des r_multiple renseignés
  topMistakes: { key: MainMistake; count: number }[]; // exclut 'none'
  topSetup: { key: Setup; count: number } | null; // setup le plus utilisé
}
