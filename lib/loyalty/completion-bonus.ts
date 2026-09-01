// Bonus mensuel de complétion — logique PURE (aucun accès DB, testable
// unitairement, à l'image de lib/loyalty/points.ts et master-validation.ts).
// Partagée entre la Server Action de crédit (déclenchement, membres/actions.ts)
// et la lecture membre (progression affichée, lib/loyalty/member.ts).
//
// Fuseau : mois calendaire UTC — cf. justification détaillée dans la migration
// supabase/migrations/20260901160000_group_completion_bonus.sql (aucune
// convention de fuseau horaire n'existe ailleurs dans le projet).

/**
 * rule_slug technique du bonus dans points_ledger — ne peut jamais entrer en
 * collision avec un slug de règle réel : deriveRuleSlug()
 * (lib/loyalty/master-validation.ts) retire systématiquement les underscores
 * en bord de chaîne, donc aucun label admin ne peut dériver vers un slug
 * commençant par "__".
 */
export const COMPLETION_BONUS_SLUG = "__completion_bonus__";
export const COMPLETION_BONUS_LABEL = "Bonus mensuel de complétion";

export type MonthRange = { start: string; end: string; daysRemaining: number };

/**
 * Bornes [début, fin) du mois calendaire UTC contenant `nowMs`, en ISO — pour
 * un filtre `gte(start) / lt(end)` sur points_ledger.created_at. `end` est
 * exclusif (1er du mois suivant à 00:00 UTC). `daysRemaining` est arrondi au
 * jour supérieur, jamais 0 (au moins 1 tant qu'on est dans le mois).
 */
export function utcMonthRange(nowMs: number): MonthRange {
  const now = new Date(nowMs);
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  const daysRemaining = Math.max(1, Math.ceil((end.getTime() - nowMs) / 86_400_000));
  return { start: start.toISOString(), end: end.toISOString(), daysRemaining };
}

/**
 * Un ensemble de bonus est complété quand CHAQUE slug requis a été crédité au
 * moins une fois ce mois-ci. Un ensemble vide n'est jamais considéré complet
 * (configuration dégénérée — validateCompletionBonusParams empêche de toute
 * façon d'enregistrer un ensemble vide, cf. lib/loyalty/master-validation.ts).
 */
export function isCompletionSetFulfilled(
  requiredSlugs: readonly string[],
  creditedSlugsThisMonth: ReadonlySet<string>,
): boolean {
  return requiredSlugs.length > 0 && requiredSlugs.every((slug) => creditedSlugsThisMonth.has(slug));
}
