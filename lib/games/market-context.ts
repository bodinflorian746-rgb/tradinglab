// Contexte de marché cohérent pour les mini-jeux : actif, session, volatilité
// et spread sont tirés ensemble, de façon réaliste, et un scénario dont le
// texte cite une news, une heure ou un actif impose ce qu'il faut.

import { pick, type Asset, type Session, type Spread, type Volatility } from "./shared";

export type GameKey = "bsnt" | "ftm" | "ps" | "btt";

/** Actifs tradés dans chaque session (pas d'indice US quand son marché au comptant est fermé). */
export const SESSION_ASSETS: Record<Session, readonly Asset[]> = {
  "Asie":          ["EUR/USD", "XAU/USD", "BTC/USD"],
  "Londres":       ["EUR/USD", "XAU/USD", "BTC/USD", "NASDAQ"],
  "Overlap":       ["EUR/USD", "XAU/USD", "BTC/USD", "NASDAQ"],
  "New York":      ["EUR/USD", "XAU/USD", "BTC/USD", "NASDAQ"],
  "Heures mortes": ["EUR/USD", "XAU/USD", "BTC/USD"],
};

/** Volatilité selon la session (tirage pondéré par répétition). */
export const SESSION_VOLATILITY: Record<Session, readonly Volatility[]> = {
  "Asie":          ["faible", "faible", "normale"],
  "Londres":       ["faible", "normale", "normale", "élevée"],
  "Overlap":       ["normale", "élevée"],
  "New York":      ["faible", "normale", "élevée"],
  "Heures mortes": ["faible", "faible", "normale"],
};

/** Spread selon la session : large en heures creuses, serré au cœur du marché. */
export const SESSION_SPREAD: Record<Session, readonly Spread[]> = {
  "Asie":          ["faible", "élevé"],
  "Londres":       ["faible", "faible", "élevé"],
  "Overlap":       ["faible"],
  "New York":      ["faible", "faible", "élevé"],
  "Heures mortes": ["élevé"],
};

/** Sessions calmes : pas de volatilité élevée sans catalyseur. */
export const CALM_SESSIONS: ReadonlySet<Session> = new Set<Session>(["Asie", "Heures mortes"]);

export interface ContextRule {
  assets?:     readonly Asset[];
  sessions?:   readonly Session[];
  volatility?: Volatility;
  spread?:     Spread;
  /** Le texte annonce une news : la volatilité et le spread peuvent sortir des normes de la session. */
  news?:       boolean;
}

const NY_OR_OVERLAP: readonly Session[] = ["New York", "Overlap"];

/**
 * Contraintes par scénario, dérivées de son texte (news, heure, actif cité,
 * « ouverture du lundi », « avant London open », « pips »).
 */
export const CONTEXT_RULES: Record<string, ContextRule> = {
  // BUY / SELL / NO TRADE
  "bsnt/trade_before_news":            { sessions: ["New York"], news: true },           // NFP / FOMC / CPI
  // Trouve l'erreur
  "ftm/trade_before_news":             { sessions: NY_OR_OVERLAP, news: true },          // NFP dans 18 min
  "ftm/risk_not_reduced_news":         { assets: ["EUR/USD"], sessions: ["Overlap"], news: true },   // 14h20, NFP, EUR/USD
  "ftm/position_held_through_event":   { assets: ["XAU/USD"], sessions: ["New York"], news: true },  // 19h55, FOMC, XAU/USD
  "ftm/oversized_position":            { assets: ["XAU/USD"] },
  "ftm/size_not_adapted_to_vol":       { assets: ["XAU/USD"] },
  "ftm/volatility_ignored":            { assets: ["BTC/USD"] },                          // « volatilité explosive sur BTC »
  "ftm/fomo_after_pump":               { assets: ["BTC/USD"] },                          // « pomper 5 % en 3 bougies »
  "ftm/weekend_gap_exposure":          { assets: ["EUR/USD"], sessions: ["New York"], spread: "élevé" }, // vendredi 22h45, clôture
  "ftm/bad_spread":                    { sessions: ["Heures mortes"] },                  // 3h du matin
  // Place ton Stop
  "ps/asia_high_sweep":                { assets: ["EUR/USD", "XAU/USD"], sessions: ["Londres"] },   // avant London open
  "ps/news_vol_expansion":             { sessions: ["New York"], news: true },           // après FOMC
  "ps/news_imminent_wide":             { sessions: NY_OR_OVERLAP, news: true },          // NFP dans 5 min
  "ps/news_imminent_wide_sell":        { assets: ["EUR/USD"], sessions: ["New York"], news: true },  // FOMC, EUR/USD
  "ps/weekly_open_volatility":         { assets: ["EUR/USD", "XAU/USD"], sessions: ["Asie"] },      // lundi, marchés FX
  "ps/weekly_open_volatility_sell":    { assets: ["EUR/USD", "XAU/USD"], sessions: ["Asie"] },
  "ps/equal_lows_trap":                { assets: ["EUR/USD"] },                          // « à quelques pips près »
  "ps/multi_swing_low":                { assets: ["EUR/USD"] },                          // « quelques pips »
};

export interface MarketContext {
  asset:      Asset;
  session:    Session;
  volatility: Volatility;
  spread:     Spread;
}

/**
 * Tire un contexte cohérent : la session d'abord (compatible avec les
 * contraintes), puis un actif tradé dans cette session, puis la volatilité et
 * le spread typiques de la session.
 */
export function pickMarketContext(
  rng: () => number,
  base: { assets: readonly Asset[]; sessions: readonly Session[] },
  rule: ContextRule = {},
): MarketContext {
  const assetsWanted = rule.assets ?? base.assets;
  const sessions = (rule.sessions ?? base.sessions).filter((s) =>
    (rule.news || rule.volatility !== "élevée" || !CALM_SESSIONS.has(s))
    && (rule.spread !== "faible" || s !== "Heures mortes")
    && (rule.news || rule.spread !== "élevé" || s !== "Overlap")
    && assetsWanted.some((a) => SESSION_ASSETS[s].includes(a)),
  );
  const session = pick(sessions.length ? sessions : rule.sessions ?? base.sessions, rng);
  const assets = assetsWanted.filter((a) => SESSION_ASSETS[session].includes(a));
  const asset = pick(assets.length ? assets : assetsWanted, rng);
  const volatility = rule.volatility ?? pick(SESSION_VOLATILITY[session], rng);
  const spread = rule.spread ?? pick(SESSION_SPREAD[session], rng);
  return { asset, session, volatility, spread };
}

/** Règle d'un scénario, fusionnée avec ses éventuelles surcharges de template. */
export function contextRule(
  game: GameKey,
  id: string,
  extra: Partial<Pick<ContextRule, "volatility" | "spread">> & { asset?: Asset; session?: Session } = {},
): ContextRule {
  const r = CONTEXT_RULES[`${game}/${id}`] ?? {};
  return {
    ...r,
    ...(extra.asset ? { assets: [extra.asset] } : {}),
    ...(extra.session ? { sessions: [extra.session] } : {}),
    ...(extra.volatility ? { volatility: extra.volatility } : {}),
    ...(extra.spread ? { spread: extra.spread } : {}),
  };
}
