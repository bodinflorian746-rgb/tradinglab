// Analyse IA du Journal — V2 (branchée).
//
// Analyse le COMPORTEMENT du trader sur un trade DÉJÀ CLÔTURÉ, jamais le
// marché. Déclenchée uniquement à la demande explicite de l'utilisateur
// (bouton "Analyse" → clic sur "Lancer l'analyse IA" dans la modale), jamais
// automatiquement à la sauvegarde d'un trade.
//
// Défense en profondeur contre tout glissement vers du conseil en
// investissement (5 couches, aucune n'est redondante — chacune couvre un
// mode de défaillance différent) :
//   1. Le prompt système (JOURNAL_AI_SYSTEM_PROMPT) interdit explicitement
//      toute prédiction de marché / promesse de gain / conseil financier.
//   2. Le format de sortie est un JSON à schéma FERMÉ (isAiAnalysisShape) :
//      aucun champ libre type "recommandation"/"conseil" n'existe — une
//      réponse qui ne colle pas exactement au schéma est rejetée, jamais
//      affichée telle quelle.
//   3. Un filtre de sécurité post-génération (scanForForbiddenAdvice) scanne
//      tous les champs texte à la recherche de motifs de conseil de marché
//      avant tout affichage — dernier rempart si les couches 1-2 échouent.
//   4. Aucune donnée de marché live n'est jamais envoyée au prompt : seuls
//      les champs déjà saisis par l'utilisateur sur CE trade (buildUserPrompt).
//   5. Persistance uniquement du JSON validé + filtré — jamais du texte brut
//      non vérifié.

import Anthropic, { APIConnectionTimeoutError } from "@anthropic-ai/sdk";
import type { TradeEntry } from "./types";

// ── Garde-fous (non négociables) ────────────────────────────────────────────
// L'IA analyse le COMPORTEMENT du trader, jamais le marché.
//
// Schéma de sortie MODIFIÉ par rapport au V1 (raison : couche de défense n°2
// ci-dessus). L'ancien schéma { summary, feedback, mistakes, score,
// recommendations } avait un champ "recommendations" au nom trop ouvert —
// un champ nommé "recommandation" invite structurellement le modèle à y
// glisser un avis directionnel. Remplacé par { summary, strengths[],
// mistakes[], behavioral_advice, score } : "strengths" et "behavioral_advice"
// restent volontairement descriptifs du comportement passé, jamais d'une
// action future. Le reste du prompt (règles strictes, ton) est inchangé.
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

Réponds STRICTEMENT au format JSON suivant, et UNIQUEMENT ce JSON (aucun texte
avant/après, aucun bloc markdown) :
{
  "summary": string,              // 1-2 phrases neutres résumant le trade
  "strengths": string[],          // ce qui a été bien fait (peut être vide)
  "mistakes": string[],           // erreurs comportementales déjà commises sur CE trade (peut être vide)
  "behavioral_advice": string,    // un point de progression comportementale (discipline, gestion du risque, émotions) — jamais une action de marché
  "score": number                 // discipline 0-100 (respect du plan, gestion du risque)
}`;

export interface AiAnalysis {
  summary: string;
  strengths: string[];
  mistakes: string[];
  behavioral_advice: string;
  score: number; // 0-100, discipline
}

export type AiAnalysisFailureReason =
  | "not_configured"
  | "api_error"
  | "timeout"
  | "invalid_format"
  | "blocked_content";

export type AiAnalysisResult =
  | { ok: true; data: AiAnalysis }
  | { ok: false; reason: AiAnalysisFailureReason };

const MODEL = "claude-haiku-4-5-20251001";
const REQUEST_TIMEOUT_MS = 20_000;
const MAX_TOKENS = 1024;

// Détection d'une clé IA configurée. Si absente, analyzeTrade() ne tente
// jamais d'appel réseau (voir couche 1 de gestion d'erreur ci-dessous).
export function isAiConfigured(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}

// ── Couche 2 — validation stricte du schéma JSON ────────────────────────────
// Schéma FERMÉ : le nombre et le nom exacts des clés sont vérifiés (pas
// seulement leur présence) — un champ en trop, en moins, ou mal typé fait
// échouer la validation entière. Aucune donnée partiellement valide n'est
// jamais construite à partir d'un JSON non conforme.
const ALLOWED_KEYS = ["summary", "strengths", "mistakes", "behavioral_advice", "score"] as const;

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

export function isAiAnalysisShape(data: unknown): data is AiAnalysis {
  if (!data || typeof data !== "object" || Array.isArray(data)) return false;
  const keys = Object.keys(data as object);
  if (keys.length !== ALLOWED_KEYS.length) return false;
  if (!ALLOWED_KEYS.every((k) => keys.includes(k))) return false;

  const d = data as Record<string, unknown>;
  if (typeof d.summary !== "string" || d.summary.trim().length === 0) return false;
  if (!isStringArray(d.strengths)) return false;
  if (!isStringArray(d.mistakes)) return false;
  if (typeof d.behavioral_advice !== "string" || d.behavioral_advice.trim().length === 0) return false;
  if (typeof d.score !== "number" || !Number.isFinite(d.score) || d.score < 0 || d.score > 100) return false;
  return true;
}

// ── Couche 3 — filtre de sécurité post-génération ───────────────────────────
// Dernier rempart, indépendant des couches 1-2 : même si le prompt système
// est ignoré par le modèle ET que la réponse respecte le schéma JSON, ce
// filtre scanne le CONTENU texte de tous les champs à la recherche de motifs
// de conseil de marché avant tout affichage. Volontairement conservateur :
// un faux positif (analyse légitime bloquée à tort) est un coût acceptable
// face au risque d'afficher un conseil de marché. Ne jamais assouplir ces
// motifs pour réduire les faux positifs sans revalider avec le PO.
const FORBIDDEN_PATTERNS: { label: string; pattern: RegExp }[] = [
  // Impératifs d'achat/vente (fr) — forme grammaticale distincte du récit au
  // passé ("as acheté"/"a vendu") ou des noms ("achat"/"vente"), donc peu de
  // faux positifs attendus sur une analyse comportementale rédigée normalement.
  { label: "fr_buy_sell_imperative", pattern: /\b(achète|achetez|vends|vendez)\b/i },
  // Directives d'entrée/sortie (fr)
  { label: "fr_enter_exit_directive", pattern: /\b(entre|entrez)\s+(sur|maintenant)\b|\b(sors|sortez)\s+(de|maintenant)\b/i },
  // Directives d'achat/vente/position (en)
  { label: "en_buy_sell_directive", pattern: /\b(buy|sell)\s+(now|it|this|here)\b|\bgo\s+(long|short)\b|\btime\s+to\s+(buy|sell)\b|\benter\s+now\b|\bexit\s+now\b/i },
  // Directives d'achat/vente (es)
  { label: "es_buy_sell_directive", pattern: /\b(compra|compre|vende|venda)\b/i },
  // Formulations de recommandation explicite (fr/en/es)
  { label: "recommendation_phrasing", pattern: /je te (recommande|conseille) d[' ]?(acheter|vendre)|i recommend (buying|selling)|you should (buy|sell)|te (recomiendo|aconsejo) (comprar|vender)/i },
  // Mentions de niveaux de prix futurs / objectifs de marché
  { label: "future_price_level", pattern: /\b(objectif|target|niveau|resistance|résistance|support)\s*(de|of)?\s*:?\s*\$?\d/i },
];

export interface SecurityScanResult {
  blocked: boolean;
  matchedLabel?: string;
}

export function scanForForbiddenAdvice(analysis: AiAnalysis): SecurityScanResult {
  const haystack = [analysis.summary, ...analysis.strengths, ...analysis.mistakes, analysis.behavioral_advice].join(
    "\n",
  );
  for (const { label, pattern } of FORBIDDEN_PATTERNS) {
    if (pattern.test(haystack)) {
      return { blocked: true, matchedLabel: label };
    }
  }
  return { blocked: false };
}

// ── Couche 4 — aucune donnée de marché : uniquement les champs saisis par
// l'utilisateur sur CE trade précis (pas de prix live, pas de cotation). ────
function buildUserPrompt(entry: TradeEntry): string {
  const lines: (string | null)[] = [
    `Actif: ${entry.asset}`,
    `Direction: ${entry.direction}`,
    `Résultat: ${entry.result}`,
    entry.setup ? `Setup utilisé: ${entry.setup}` : null,
    entry.r_multiple != null ? `R multiple réalisé: ${entry.r_multiple}` : null,
    entry.followed_plan ? `Respect du plan: ${entry.followed_plan}` : null,
    entry.emotion_before ? `Émotion avant l'entrée: ${entry.emotion_before}` : null,
    entry.emotion_during ? `Émotion pendant le trade: ${entry.emotion_during}` : null,
    entry.emotion_after ? `Émotion après la clôture: ${entry.emotion_after}` : null,
    entry.perceived_mistake ? `Erreur perçue par le trader lui-même: ${entry.perceived_mistake}` : null,
    entry.user_comment ? `Commentaire du trader: ${entry.user_comment}` : null,
  ];
  return lines.filter((l): l is string => l !== null).join("\n");
}

// Claude enrobe parfois sa réponse dans un bloc de code markdown (```json ... ```)
// même quand le prompt l'interdit explicitement (comportement connu du modèle,
// pas fiable à 100% sur ce point précis). Normalisation purement syntaxique
// AVANT le parsing JSON — ne touche ni au schéma strict (couche 2) ni au
// filtre de sécurité (couche 3), qui s'appliquent ensuite sans changement.
function stripMarkdownFence(text: string): string {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```$/);
  return fenceMatch ? fenceMatch[1].trim() : trimmed;
}

// Point d'entrée V2 : appelle réellement Claude Haiku 4.5, applique les
// couches 2 et 3, ne renvoie jamais de contenu non validé.
export async function analyzeTrade(entry: TradeEntry): Promise<AiAnalysisResult> {
  if (!isAiConfigured()) return { ok: false, reason: "not_configured" };

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, timeout: REQUEST_TIMEOUT_MS });

  let raw: string;
  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: JOURNAL_AI_SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserPrompt(entry) }],
    });
    const block = response.content[0];
    if (!block || block.type !== "text") {
      console.error("[journal-ai] réponse Claude sans bloc texte exploitable");
      return { ok: false, reason: "api_error" };
    }
    raw = block.text;
  } catch (err) {
    if (err instanceof APIConnectionTimeoutError) {
      console.error("[journal-ai] appel Claude en timeout");
      return { ok: false, reason: "timeout" };
    }
    console.error("[journal-ai] appel Claude échoué:", err instanceof Error ? err.message : err);
    return { ok: false, reason: "api_error" };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(stripMarkdownFence(raw));
  } catch {
    console.error("[journal-ai] réponse non-JSON reçue de Claude");
    return { ok: false, reason: "invalid_format" };
  }

  if (!isAiAnalysisShape(parsed)) {
    console.error("[journal-ai] JSON reçu ne respecte pas le schéma strict attendu");
    return { ok: false, reason: "invalid_format" };
  }

  const scan = scanForForbiddenAdvice(parsed);
  if (scan.blocked) {
    console.error(`[journal-ai] contenu bloqué par le filtre de sécurité (motif: ${scan.matchedLabel})`);
    return { ok: false, reason: "blocked_content" };
  }

  return { ok: true, data: parsed };
}
