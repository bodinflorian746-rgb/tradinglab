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
import type { Locale } from "@/i18n/config";

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
export function buildTradeAnalysis(e: TradeEntryView, t: JournalDict, locale: Locale): TradeAnalysisView {
  const TX = {
    fr: {
      followedPlan: "Tu as respecté ton plan de trading.",
      setupIdentified: (s: string) => `Le setup ${s} est clairement identifié.`,
      goodRR: "Le ratio risque/rendement est intéressant.",
      calmEntry: "Tu es entré dans un état émotionnel maîtrisé.",
      alignedStructure: "Ton entrée est alignée avec la structure observée.",
      goodFallback: "Trade journalisé avec suffisamment de contexte pour progresser.",
      mistakeAdvice: {
        entry_too_early: "Une confirmation supplémentaire aurait augmenté la probabilité du scénario.",
        entry_too_late: "Anticiper légèrement le signal aurait offert un meilleur point d'entrée.",
        bad_stop: "Un stop placé selon la structure laisserait plus de marge au trade.",
        tp_too_close: "Viser une cible plus structurelle améliorerait ton ratio sur la durée.",
        out_of_plan: "Rester dans ton plan renforcerait ta constance sur ce type de contexte.",
        revenge_trading: "Marquer une pause après une perte protège ta discipline.",
        overtrading: "Sélectionner moins de trades, mais mieux, augmente la qualité moyenne.",
        fomo: "Attendre ton propre signal évite les entrées dictées par l'urgence.",
        exit_too_early: "Laisser respirer le trade jusqu'à ton scénario améliorerait le résultat.",
      } as Record<string, string>,
      backToPlan: "Revenir systématiquement à ton plan renforcerait ta régularité.",
      calmerState: "Entrer dans un état plus calme pourrait améliorer tes décisions.",
      improveFallback: "Continue à documenter ton scénario pour fiabiliser tes relectures.",
      coachLoss: "Une perte bien journalisée vaut une leçon : ton process compte plus que ce trade isolé.",
      coachWin: "Capitalise sur ce qui a fonctionné et reproduis-le avec la même discipline.",
      impactMistake: "Corriger ce point sur tes prochains trades améliorerait ton espérance de gain sans changer ta stratégie.",
      impactGood: "Reproduire cette exécution renforcerait la régularité de tes résultats sur la durée.",
    },
    en: {
      followedPlan: "You stuck to your trading plan.",
      setupIdentified: (s: string) => `The ${s} setup is clearly identified.`,
      goodRR: "The risk/reward ratio is attractive.",
      calmEntry: "You entered in a controlled emotional state.",
      alignedStructure: "Your entry is aligned with the observed structure.",
      goodFallback: "Trade logged with enough context to learn from.",
      mistakeAdvice: {
        entry_too_early: "One more confirmation would have raised the odds of the scenario.",
        entry_too_late: "Anticipating the signal slightly would have given a better entry.",
        bad_stop: "A stop placed off the structure would give the trade more room.",
        tp_too_close: "Aiming for a more structural target would improve your ratio over time.",
        out_of_plan: "Staying in your plan would strengthen your consistency in this kind of context.",
        revenge_trading: "Taking a break after a loss protects your discipline.",
        overtrading: "Picking fewer but better trades raises your average quality.",
        fomo: "Waiting for your own signal avoids entries driven by urgency.",
        exit_too_early: "Letting the trade breathe toward your scenario would improve the outcome.",
      } as Record<string, string>,
      backToPlan: "Consistently coming back to your plan would reinforce your regularity.",
      calmerState: "Entering in a calmer state could improve your decisions.",
      improveFallback: "Keep documenting your scenario to make your reviews more reliable.",
      coachLoss: "A well-logged loss is worth a lesson: your process matters more than this single trade.",
      coachWin: "Build on what worked and repeat it with the same discipline.",
      impactMistake: "Fixing this on your next trades would improve your expectancy without changing your strategy.",
      impactGood: "Repeating this execution would strengthen the consistency of your results over time.",
    },
    es: {
      followedPlan: "Respetaste tu plan de trading.",
      setupIdentified: (s: string) => `El setup ${s} está claramente identificado.`,
      goodRR: "El ratio riesgo/recompensa es interesante.",
      calmEntry: "Entraste en un estado emocional controlado.",
      alignedStructure: "Tu entrada está alineada con la estructura observada.",
      goodFallback: "Trade registrado con suficiente contexto para progresar.",
      mistakeAdvice: {
        entry_too_early: "Una confirmación adicional habría aumentado la probabilidad del escenario.",
        entry_too_late: "Anticipar ligeramente la señal habría dado un mejor punto de entrada.",
        bad_stop: "Un stop colocado según la estructura daría más margen al trade.",
        tp_too_close: "Apuntar a un objetivo más estructural mejoraría tu ratio a largo plazo.",
        out_of_plan: "Mantenerte en tu plan reforzaría tu constancia en este tipo de contexto.",
        revenge_trading: "Hacer una pausa tras una pérdida protege tu disciplina.",
        overtrading: "Seleccionar menos trades, pero mejores, aumenta la calidad media.",
        fomo: "Esperar tu propia señal evita las entradas dictadas por la urgencia.",
        exit_too_early: "Dejar respirar el trade hasta tu escenario mejoraría el resultado.",
      } as Record<string, string>,
      backToPlan: "Volver sistemáticamente a tu plan reforzaría tu regularidad.",
      calmerState: "Entrar en un estado más calmado podría mejorar tus decisiones.",
      improveFallback: "Sigue documentando tu escenario para fiabilizar tus revisiones.",
      coachLoss: "Una pérdida bien registrada vale una lección: tu proceso cuenta más que este trade aislado.",
      coachWin: "Capitaliza lo que funcionó y repítelo con la misma disciplina.",
      impactMistake: "Corregir este punto en tus próximos trades mejoraría tu esperanza de ganancia sin cambiar tu estrategia.",
      impactGood: "Repetir esta ejecución reforzaría la regularidad de tus resultados a largo plazo.",
    },
  }[locale];

  const good: string[] = [];
  const improve: string[] = [];

  // ── Ce qui a été bien fait ──
  if (e.followed_plan === "yes") good.push(TX.followedPlan);
  if (e.setup) good.push(TX.setupIdentified(t.options.setup[e.setup]));
  if (typeof e.r_multiple === "number" && e.r_multiple >= 1.5)
    good.push(TX.goodRR);
  if (["calm", "confident"].includes(e.emotion_before ?? ""))
    good.push(TX.calmEntry);
  if (e.market_trend && ["bullish", "bearish"].includes(e.market_trend))
    good.push(TX.alignedStructure);
  if (good.length === 0) good.push(TX.goodFallback);

  // ── Ce qui aurait pu être amélioré (bienveillant) ──
  if (e.perceived_mistake && TX.mistakeAdvice[e.perceived_mistake])
    improve.push(TX.mistakeAdvice[e.perceived_mistake]);
  if (e.followed_plan === "no" || e.followed_plan === "partial")
    improve.push(TX.backToPlan);
  if (["stressed", "impatient", "fomo", "tired"].includes(e.emotion_before ?? ""))
    improve.push(TX.calmerState);
  if (Array.isArray(e.ai_recommendations))
    for (const rec of e.ai_recommendations) if (improve.length < 4) improve.push(rec);
  if (improve.length === 0) improve.push(TX.improveFallback);

  // ── Conseil du coach ──
  const coachAdvice =
    e.ai_feedback ??
    (e.result === "loss" ? TX.coachLoss : TX.coachWin);

  // ── Impact potentiel sur le résultat ──
  const impact =
    e.perceived_mistake && e.perceived_mistake !== "none"
      ? TX.impactMistake
      : TX.impactGood;

  return { score: getTradeScore(e), good: good.slice(0, 3), improve: improve.slice(0, 3), coachAdvice, impact };
}
