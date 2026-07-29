// Calcul pur des points (aucun accès DB, aucune dépendance serveur → testable
// unitairement). Le solde et le niveau ne sont JAMAIS stockés : ils dérivent du
// registre (points_ledger), source de vérité.

import type { LedgerKind, PointsLedgerEntry, Tier } from "@/lib/loyalty/types";

/** Sous-ensemble minimal d'une opération nécessaire au calcul. */
export type LedgerAmount = Pick<PointsLedgerEntry, "kind" | "amount">;

/** Kinds considérés comme des dépenses/débits (n'entrent jamais dans le gagné). */
const SPENDING_KINDS: ReadonlySet<LedgerKind> = new Set<LedgerKind>([
  "purchase",
  "manual_debit",
]);

/**
 * Solde restant = somme signée de TOUTES les opérations.
 */
export function computeBalance(entries: readonly LedgerAmount[]): number {
  return entries.reduce((sum, e) => sum + e.amount, 0);
}

/**
 * Total historique des points GAGNÉS (base du calcul de niveau).
 *
 * Règle (décision produit) : toute opération de montant positif compte comme
 * gagnée, SAUF les dépenses/débits (purchase, manual_debit). Ainsi une
 * correction ou une annulation créditrice compte, mais une dépense ne fait
 * jamais baisser le total → le niveau ne régresse jamais après une dépense.
 */
export function computeEarnedTotal(entries: readonly LedgerAmount[]): number {
  return entries.reduce((sum, e) => {
    if (e.amount > 0 && !SPENDING_KINDS.has(e.kind)) return sum + e.amount;
    return sum;
  }, 0);
}

/**
 * Décompose un ensemble d'opérations en crédits / débits / net.
 *   credited = somme des montants positifs
 *   debited  = somme des montants négatifs (valeur ≤ 0)
 *   net      = credited + debited (= solde de l'ensemble)
 *
 * Sémantique canonique réutilisée par la console Super Admin (agrégats). Une
 * dépense (montant négatif) alimente `debited`, jamais `credited`.
 */
export function summarizeLedger(entries: readonly LedgerAmount[]): {
  credited: number;
  debited: number;
  net: number;
} {
  let credited = 0;
  let debited = 0;
  for (const e of entries) {
    if (e.amount > 0) credited += e.amount;
    else if (e.amount < 0) debited += e.amount;
  }
  return { credited, debited, net: credited + debited };
}

/** Seuils de niveau, basés sur le total historique gagné. */
export const TIER_THRESHOLDS = { silver: 100, gold: 200 } as const;

/** Bonus de niveau (préparés pour plus tard, non appliqués en phase 1). */
export const TIER_BONUS_RATE: Record<Tier, number> = {
  bronze: 0,
  silver: 0.25,
  gold: 0.5,
};

/**
 * Niveau à partir du total historique gagné :
 *   Bronze < 100 ; Argent 100–199 ; Or ≥ 200.
 */
export function tierForEarned(earnedTotal: number): Tier {
  if (earnedTotal >= TIER_THRESHOLDS.gold) return "gold";
  if (earnedTotal >= TIER_THRESHOLDS.silver) return "silver";
  return "bronze";
}
