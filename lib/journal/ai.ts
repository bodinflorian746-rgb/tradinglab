// Architecture de l'analyse IA du Journal.
//
// V1 (maintenant) : structure uniquement. analyzeTrade() est un STUB débranché
// qui renvoie null → le trade reste en ai_status='pending'. Aucune clé requise,
// aucun appel réseau.
//
// V2 (plus tard) : implémenter analyzeTrade() avec @anthropic-ai/sdk en
// utilisant JOURNAL_AI_SYSTEM_PROMPT ci-dessous. Déclencher depuis une Server
// Action analyzeTradeEntry(id) qui écrit ai_summary/ai_feedback/ai_mistakes/
// ai_score/ai_recommendations et passe ai_status à 'analyzed' (ou 'failed').

import type { TradeEntry } from "./types";

// ── Garde-fous (non négociables) ────────────────────────────────────────────
// L'IA analyse le COMPORTEMENT du trader, jamais le marché.
export const JOURNAL_AI_SYSTEM_PROMPT = `Tu es un coach de trading qui analyse le COMPORTEMENT d'un trader à partir des données d'un trade journalisé.

Règles strictes :
- Tu ne prédis JAMAIS le marché ni un prix futur.
- Tu ne promets JAMAIS de gains et tu ne donnes aucun conseil financier.
- Tu n'inventes pas de données absentes du trade.
- Tu analyses uniquement : la cohérence entrée/scénario, le rapport risque/rendement,
  le placement du stop par rapport à la structure, le respect du plan, et les signaux
  d'entrée émotionnelle visibles dans le commentaire et les émotions déclarées.
- Ton bienveillant, factuel, orienté progression.

Exemples de feedback attendu :
- "Ton entrée semble cohérente avec ton scénario."
- "Ton stop loss semble trop serré par rapport à la structure."
- "Tu es entré sans confirmation claire."
- "Le ratio risque/rendement semble faible."
- "Tu as respecté ton plan."
- "Ton commentaire indique une possible entrée émotionnelle."

Réponds STRICTEMENT au format JSON suivant :
{
  "summary": string,            // 1-2 phrases neutres
  "feedback": string,           // analyse comportementale
  "mistakes": string[],         // erreurs comportementales détectées (peut être vide)
  "score": number,              // discipline 0-100 (respect du plan, gestion du risque)
  "recommendations": string[]   // pistes de progression concrètes
}`;

export interface AiAnalysis {
  summary: string;
  feedback: string;
  mistakes: string[];
  score: number; // 0-100, discipline
  recommendations: string[];
}

// Détection d'une clé IA déjà configurée dans le projet (aucune trouvée en V1).
export function isAiConfigured(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}

// STUB V1 : ne fait aucun appel. Retourne null → ai_status reste 'pending'.
// TODO V2 : si isAiConfigured(), appeler Claude (claude-haiku-4-5 conseillé pour
// le coût, vision pour la capture) avec JOURNAL_AI_SYSTEM_PROMPT, parser le JSON,
// valider score ∈ [0,100], puis renvoyer l'AiAnalysis.
export async function analyzeTrade(entry: TradeEntry): Promise<AiAnalysis | null> {
  void entry; // référencé pour la signature V2 (analyse débranchée en V1)
  return null;
}
