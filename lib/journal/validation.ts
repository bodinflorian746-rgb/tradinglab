// Validation côté serveur des inputs du formulaire Journal.
// AUCUNE confiance dans le client : on revalide tout, on borne les enums sur
// les constantes de types.ts, et on renvoie des CODES d'erreur (mappés vers un
// message localisé côté UI via le dictionnaire journal.errors).
//
// Seuls les champs de la section "Essentiel" sont obligatoires. Tout le reste
// est optionnel (les enums hors liste → null sans bloquer).
// Pas de dépendance externe (zod non utilisé dans le projet — décision validée).

import {
  DIRECTIONS,
  TIMEFRAMES,
  TRADE_TYPES,
  RESULTS,
  PLATFORMS,
  SETUPS,
  MARKET_TRENDS,
  SESSIONS,
  FOLLOWED_PLAN,
  MAIN_MISTAKES,
  EMOTIONS_BEFORE,
  EMOTIONS_DURING,
  EMOTIONS_AFTER,
  type ValidatedTrade,
} from "./types";

// Clé = nom du champ (form name) ; valeur = code d'erreur (clé dans journal.errors).
export type FieldErrors = Record<string, string>;

function getStr(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function optStr(formData: FormData, key: string): string | null {
  const s = getStr(formData, key);
  return s.length > 0 ? s : null;
}

// Enum optionnel : "" → null ; valeur hors liste → null (ignorée sans bloquer).
function optEnum<T extends readonly string[]>(
  formData: FormData,
  key: string,
  allowed: T,
): T[number] | null {
  const s = getStr(formData, key);
  return (allowed as readonly string[]).includes(s) ? (s as T[number]) : null;
}

// Nombre optionnel. null si vide, le nombre si valide, "invalid" sinon.
function optNum(formData: FormData, key: string): number | null | "invalid" {
  const s = getStr(formData, key);
  if (!s) return null;
  const n = Number(s.replace(",", "."));
  return Number.isFinite(n) ? n : "invalid";
}

export interface ValidationResult {
  data?: ValidatedTrade;
  errors?: FieldErrors;
}

const NUMERIC_FIELDS = [
  "account_capital",
  "entry_price",
  "stop_loss",
  "take_profit",
  "risk_percent",
  "risk_amount",
  "r_multiple",
  "fees",
] as const;

export function validateTradeInput(formData: FormData): ValidationResult {
  const errors: FieldErrors = {};

  // ── Obligatoires (section Essentiel) ──
  const asset = getStr(formData, "asset");
  if (!asset) errors.asset = "asset";

  const direction = getStr(formData, "direction");
  if (!(DIRECTIONS as readonly string[]).includes(direction)) errors.direction = "direction";

  const timeframe = getStr(formData, "timeframe");
  if (!(TIMEFRAMES as readonly string[]).includes(timeframe)) errors.timeframe = "timeframe";

  const tradeType = getStr(formData, "trade_type");
  if (!(TRADE_TYPES as readonly string[]).includes(tradeType)) errors.trade_type = "trade_type";

  const result = getStr(formData, "result");
  if (!(RESULTS as readonly string[]).includes(result)) errors.result = "result";

  const rawDate = getStr(formData, "trade_date");
  let tradeDateIso = "";
  if (!rawDate) {
    errors.trade_date = "trade_date";
  } else {
    const d = new Date(rawDate);
    if (Number.isNaN(d.getTime())) errors.trade_date = "trade_date";
    else tradeDateIso = d.toISOString();
  }

  // ── Optionnels numériques ──
  const nums: Partial<Record<(typeof NUMERIC_FIELDS)[number], number | null>> = {};
  for (const f of NUMERIC_FIELDS) {
    const v = optNum(formData, f);
    if (v === "invalid") errors[f] = "number";
    else nums[f] = v;
  }

  if (Object.keys(errors).length > 0) return { errors };

  const data: ValidatedTrade = {
    asset: asset.slice(0, 40),
    direction: direction as ValidatedTrade["direction"],
    timeframe: timeframe as ValidatedTrade["timeframe"],
    trade_type: tradeType as ValidatedTrade["trade_type"],
    result: result as ValidatedTrade["result"],
    trade_date: tradeDateIso,

    platform: optEnum(formData, "platform", PLATFORMS),
    setup: optEnum(formData, "setup", SETUPS),
    market_trend: optEnum(formData, "market_trend", MARKET_TRENDS),
    session: optEnum(formData, "session", SESSIONS),
    entry_reason: optStr(formData, "entry_reason"),
    exit_reason: optStr(formData, "exit_reason"),

    account_capital: nums.account_capital ?? null,
    entry_price: nums.entry_price ?? null,
    stop_loss: nums.stop_loss ?? null,
    take_profit: nums.take_profit ?? null,
    risk_percent: nums.risk_percent ?? null,
    risk_amount: nums.risk_amount ?? null,
    r_multiple: nums.r_multiple ?? null,
    fees: nums.fees ?? null,

    followed_plan: optEnum(formData, "followed_plan", FOLLOWED_PLAN),
    emotion_before: optEnum(formData, "emotion_before", EMOTIONS_BEFORE),
    emotion_during: optEnum(formData, "emotion_during", EMOTIONS_DURING),
    emotion_after: optEnum(formData, "emotion_after", EMOTIONS_AFTER),
    perceived_mistake: optEnum(formData, "perceived_mistake", MAIN_MISTAKES),

    user_comment: optStr(formData, "user_comment"),
  };

  return { data };
}
