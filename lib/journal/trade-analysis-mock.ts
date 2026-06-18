// ─────────────────────────────────────────────────────────────────────────────
//  ANALYSE INDIVIDUELLE D'UN TRADE — MOCK (V1)
// ─────────────────────────────────────────────────────────────────────────────
//  Priorité 3 : génère une analyse pédagogique à partir des données DÉJÀ
//  présentes dans le trade (résultat, setup, plan, émotions, R, erreur, et les
//  champs ai_* s'ils existent). Ton bienveillant, jamais culpabilisant.
//
//  Priorité 4 — structure prête pour le futur (AUCUNE connexion aujourd'hui) :
//   - TradeAnalysisView   : forme d'une analyse individuelle affichable.
//   - TradeAnalysisRecord : une analyse horodatée (source ia/mock).
//   - TradeAnalysisHistory: dernière analyse + historique (liste).
//  Demain : ces enregistrements seront produits par l'IA réelle, stockés (ex.
//  colonne jsonb ai_history) et agrégés pour l'analyse GLOBALE du trader. Les
//  colonnes ai_* existantes (ai_summary/ai_feedback/ai_score/ai_mistakes/
//  ai_recommendations) portent déjà la dernière analyse individuelle.
// ─────────────────────────────────────────────────────────────────────────────

import type { TradeEntryView } from "./types";
import type { Dictionaries } from "@/i18n/dictionaries";

type JournalDict = Dictionaries["journal"];

export interface TradeAnalysisView {
  score: number; // 0-100
  good: string[];
  improve: string[];
  coachAdvice: string;
  impact: string;
}

export interface TradeAnalysisRecord extends TradeAnalysisView {
  id: string;
  createdAt: string; // ISO
  source: "ai" | "mock";
}

export interface TradeAnalysisHistory {
  tradeId: string;
  latest: TradeAnalysisRecord | null;
  history: TradeAnalysisRecord[];
}

// Score simulé : réutilise ai_score s'il existe, sinon dérive des données.
export function getTradeScore(e: TradeEntryView): number {
  if (typeof e.ai_score === "number") return e.ai_score;
  let s = 62;
  if (e.result === "win") s += 16;
  else if (e.result === "loss") s -= 8;
  if (e.followed_plan === "yes") s += 12;
  else if (e.followed_plan === "no") s -= 10;
  if (typeof e.r_multiple === "number" && e.r_multiple >= 1.5) s += 8;
  if (e.perceived_mistake && e.perceived_mistake !== "none") s -= 6;
  if (["calm", "confident"].includes(e.emotion_before ?? "")) s += 4;
  return Math.max(35, Math.min(95, s));
}

// Construit l'analyse pédagogique (mock) à partir du trade + libellés localisés.
export function buildTradeAnalysis(e: TradeEntryView, t: JournalDict): TradeAnalysisView {
  const good: string[] = [];
  const improve: string[] = [];

  // ── Ce qui a été bien fait ──
  if (e.followed_plan === "yes") good.push("Tu as respecté ton plan de trading.");
  if (e.setup) good.push(`Le setup ${t.options.setup[e.setup]} est clairement identifié.`);
  if (typeof e.r_multiple === "number" && e.r_multiple >= 1.5)
    good.push("Le ratio risque/rendement est intéressant.");
  if (["calm", "confident"].includes(e.emotion_before ?? ""))
    good.push("Tu es entré dans un état émotionnel maîtrisé.");
  if (e.market_trend && ["bullish", "bearish"].includes(e.market_trend))
    good.push("Ton entrée est alignée avec la structure observée.");
  if (good.length === 0) good.push("Trade journalisé avec suffisamment de contexte pour progresser.");

  // ── Ce qui aurait pu être amélioré (bienveillant) ──
  const mistakeAdvice: Record<string, string> = {
    entry_too_early: "Une confirmation supplémentaire aurait augmenté la probabilité du scénario.",
    entry_too_late: "Anticiper légèrement le signal aurait offert un meilleur point d'entrée.",
    bad_stop: "Un stop placé selon la structure laisserait plus de marge au trade.",
    tp_too_close: "Viser une cible plus structurelle améliorerait ton ratio sur la durée.",
    out_of_plan: "Rester dans ton plan renforcerait ta constance sur ce type de contexte.",
    revenge_trading: "Marquer une pause après une perte protège ta discipline.",
    overtrading: "Sélectionner moins de trades, mais mieux, augmente la qualité moyenne.",
    fomo: "Attendre ton propre signal évite les entrées dictées par l'urgence.",
    exit_too_early: "Laisser respirer le trade jusqu'à ton scénario améliorerait le résultat.",
  };
  if (e.perceived_mistake && mistakeAdvice[e.perceived_mistake])
    improve.push(mistakeAdvice[e.perceived_mistake]);
  if (e.followed_plan === "no" || e.followed_plan === "partial")
    improve.push("Revenir systématiquement à ton plan renforcerait ta régularité.");
  if (["stressed", "impatient", "fomo", "tired"].includes(e.emotion_before ?? ""))
    improve.push("Entrer dans un état plus calme pourrait améliorer tes décisions.");
  if (Array.isArray(e.ai_recommendations))
    for (const rec of e.ai_recommendations) if (improve.length < 4) improve.push(rec);
  if (improve.length === 0) improve.push("Continue à documenter ton scénario pour fiabiliser tes relectures.");

  // ── Conseil du coach ──
  const coachAdvice =
    e.ai_feedback ??
    (e.result === "loss"
      ? "Une perte bien journalisée vaut une leçon : ton process compte plus que ce trade isolé."
      : "Capitalise sur ce qui a fonctionné et reproduis-le avec la même discipline.");

  // ── Impact potentiel sur le résultat ──
  const impact =
    e.perceived_mistake && e.perceived_mistake !== "none"
      ? "Corriger ce point sur tes prochains trades améliorerait ton espérance de gain sans changer ta stratégie."
      : "Reproduire cette exécution renforcerait la régularité de tes résultats sur la durée.";

  return { score: getTradeScore(e), good: good.slice(0, 3), improve: improve.slice(0, 3), coachAdvice, impact };
}
