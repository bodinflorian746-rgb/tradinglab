// Insights "coach" calculés sur les VRAIS trades (fonctions pures, sans I/O).
//
// Objectif : remplacer le contenu mock du Command Center par des constats
// réellement dérivés des trades disponibles. Tout est calculé à partir des
// champs déjà présents (result, setup, session, direction, perceived_mistake,
// followed_plan, emotion_before). Aucune invention : si l'échantillon est trop
// faible, on renvoie `null` pour la métrique concernée (l'UI affiche alors un
// état "pas assez de données").
//
// Convention identique à computeStats : on renvoie des CLÉS canoniques ; le
// mapping vers les libellés localisés se fait côté composant (dictionnaire).

import {
  WEEKDAYS,
  type TradeEntry,
  type MainMistake,
  type EmotionBefore,
  type Setup,
  type Session,
  type Direction,
  type Weekday,
} from "./types";

// Seuils — volontairement conservateurs pour ne pas tirer de conclusions sur
// 1-2 trades. MIN_SAMPLE = trades décisifs (gagnés+perdus) minimum pour ouvrir
// l'analyse ; MIN_GROUP = trades décisifs minimum dans un groupe pour le classer.
export const INSIGHTS_MIN_SAMPLE = 5;
export const INSIGHTS_MIN_GROUP = 3;

// Un trade est "décisif" s'il est gagné ou perdu (le break-even et l'ouvert ne
// départagent pas un setup). Le winrate des groupes se calcule sur ces trades.
function isDecisive(e: TradeEntry): boolean {
  return e.result === "win" || e.result === "loss";
}

// Heure UTC du trade, en clé "00".."23". Le timestamp enregistré (trade_date)
// est en UTC (timestamptz) ; aucun fuseau utilisateur n'est stocké aujourd'hui,
// donc on regroupe sur l'heure UTC — stable quel que soit le fuseau du serveur
// qui exécute ce calcul (contrairement à Date.getHours(), qui dépend de l'hôte).
function hourKeyOf(e: TradeEntry): string | null {
  const d = new Date(e.trade_date);
  if (Number.isNaN(d.getTime())) return null;
  return String(d.getUTCHours()).padStart(2, "0");
}

// Jour de la semaine du trade (UTC), même raison que hourKeyOf ci-dessus.
function weekdayKeyOf(e: TradeEntry): Weekday | null {
  const d = new Date(e.trade_date);
  if (Number.isNaN(d.getTime())) return null;
  return WEEKDAYS[d.getUTCDay()];
}

export interface RankedGroup {
  key: string; // clé canonique (setup / session / direction)
  winrate: number; // % sur trades décisifs du groupe
  trades: number; // nb de trades décisifs
}

export interface CountedKey<K extends string> {
  key: K;
  count: number;
}

export interface PlanVsResult {
  yesWinrate: number;
  yesTrades: number;
  noWinrate: number; // "no" + "partial" regroupés (= n'a pas respecté pleinement)
  noTrades: number;
}

export interface CoachInsights {
  sampleSize: number; // nb de trades décisifs
  enough: boolean; // sampleSize >= INSIGHTS_MIN_SAMPLE

  bestSetup: RankedGroup | null;
  worstSetup: RankedGroup | null;
  bestSession: RankedGroup | null;
  worstSession: RankedGroup | null;
  bestDirection: RankedGroup | null;
  worstDirection: RankedGroup | null;
  bestHour: RankedGroup | null; // clé "00".."23" (heure UTC de début)
  worstHour: RankedGroup | null;
  bestAsset: RankedGroup | null; // clé = actif brut (ex. "EURUSD")
  worstAsset: RankedGroup | null;
  bestWeekday: RankedGroup | null; // clé = Weekday ("mon", "tue", …)
  worstWeekday: RankedGroup | null;

  topMistake: CountedKey<MainMistake> | null;
  plan: PlanVsResult | null;
  winEmotion: CountedKey<EmotionBefore> | null; // émotion la + associée aux gains
  lossEmotion: CountedKey<EmotionBefore> | null; // émotion la + associée aux pertes
}

// Classe les groupes par winrate (sur trades décisifs). Renvoie best/worst
// seulement si ≥2 groupes qualifiés ET distincts (sinon "pas assez de données").
function rankGroups(
  entries: TradeEntry[],
  keyOf: (e: TradeEntry) => string | null,
): { best: RankedGroup | null; worst: RankedGroup | null } {
  const tally = new Map<string, { wins: number; decisive: number }>();
  for (const e of entries) {
    if (!isDecisive(e)) continue;
    const key = keyOf(e);
    if (!key) continue;
    const g = tally.get(key) ?? { wins: 0, decisive: 0 };
    g.decisive += 1;
    if (e.result === "win") g.wins += 1;
    tally.set(key, g);
  }

  const ranked: RankedGroup[] = [...tally.entries()]
    .filter(([, g]) => g.decisive >= INSIGHTS_MIN_GROUP)
    .map(([key, g]) => ({
      key,
      winrate: Math.round((g.wins / g.decisive) * 100),
      trades: g.decisive,
    }))
    // winrate décroissant, puis plus de trades = plus fiable.
    .sort((a, b) => b.winrate - a.winrate || b.trades - a.trades);

  if (ranked.length < 2) return { best: null, worst: null };
  return { best: ranked[0], worst: ranked[ranked.length - 1] };
}

// Compte la clé la plus fréquente (≥2 occurrences) sur un sous-ensemble.
function topCount<K extends string>(
  entries: TradeEntry[],
  keyOf: (e: TradeEntry) => K | null,
): CountedKey<K> | null {
  const tally = new Map<K, number>();
  for (const e of entries) {
    const key = keyOf(e);
    if (!key) continue;
    tally.set(key, (tally.get(key) ?? 0) + 1);
  }
  const sorted = [...tally.entries()].sort((a, b) => b[1] - a[1]);
  if (sorted.length === 0 || sorted[0][1] < 2) return null;
  return { key: sorted[0][0], count: sorted[0][1] };
}

function planVsResult(entries: TradeEntry[]): PlanVsResult | null {
  let yesWins = 0;
  let yesDec = 0;
  let noWins = 0;
  let noDec = 0;
  for (const e of entries) {
    if (!isDecisive(e) || !e.followed_plan) continue;
    if (e.followed_plan === "yes") {
      yesDec += 1;
      if (e.result === "win") yesWins += 1;
    } else {
      // "no" + "partial" → n'a pas pleinement respecté le plan.
      noDec += 1;
      if (e.result === "win") noWins += 1;
    }
  }
  // Besoin des deux côtés suffisamment fournis pour une comparaison honnête.
  if (yesDec < INSIGHTS_MIN_GROUP || noDec < INSIGHTS_MIN_GROUP) return null;
  return {
    yesWinrate: Math.round((yesWins / yesDec) * 100),
    yesTrades: yesDec,
    noWinrate: Math.round((noWins / noDec) * 100),
    noTrades: noDec,
  };
}

export function computeCoachInsights(entries: TradeEntry[]): CoachInsights {
  const decisive = entries.filter(isDecisive);
  const sampleSize = decisive.length;
  const enough = sampleSize >= INSIGHTS_MIN_SAMPLE;

  const setups = rankGroups(entries, (e) => e.setup as Setup | null);
  const sessions = rankGroups(entries, (e) => e.session as Session | null);
  const directions = rankGroups(entries, (e) => e.direction as Direction);
  const hours = rankGroups(entries, hourKeyOf);
  const assets = rankGroups(entries, (e) => e.asset || null);
  const weekdays = rankGroups(entries, weekdayKeyOf);

  const wins = entries.filter((e) => e.result === "win");
  const losses = entries.filter((e) => e.result === "loss");

  return {
    sampleSize,
    enough,
    bestSetup: setups.best,
    worstSetup: setups.worst,
    bestSession: sessions.best,
    worstSession: sessions.worst,
    bestDirection: directions.best,
    worstDirection: directions.worst,
    bestHour: hours.best,
    worstHour: hours.worst,
    bestAsset: assets.best,
    worstAsset: assets.worst,
    bestWeekday: weekdays.best,
    worstWeekday: weekdays.worst,
    topMistake: topCount<MainMistake>(entries, (e) =>
      e.perceived_mistake && e.perceived_mistake !== "none"
        ? e.perceived_mistake
        : null,
    ),
    plan: planVsResult(entries),
    winEmotion: topCount<EmotionBefore>(wins, (e) => e.emotion_before),
    lossEmotion: topCount<EmotionBefore>(losses, (e) => e.emotion_before),
  };
}
