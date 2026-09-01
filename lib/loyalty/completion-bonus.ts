// Bonus mensuel de complétion — logique PURE (aucun accès DB, testable
// unitairement, à l'image de lib/loyalty/points.ts et master-validation.ts).
// Partagée entre la Server Action de crédit (déclenchement, membres/actions.ts)
// et la lecture membre (progression affichée, lib/loyalty/member.ts).
//
// Cycle : fenêtre glissante de 30 jours ANCRÉE SUR L'ADHÉSION du membre
// (group_memberships.joined_at) — PAS le mois calendaire. Un membre qui
// rejoint le 29 du mois aurait eu 2 jours pour compléter ses actions avec un
// cycle calendaire ; l'ancrage sur l'adhésion garantit 30 jours pleins à
// chaque membre, dès son premier jour. Cycle 0 = [joinedAt, joinedAt+30j),
// cycle 1 = [+30j, +60j), etc. — cf. justification complète dans la
// migration supabase/migrations/20260901160000_group_completion_bonus.sql.

/**
 * rule_slug technique du bonus dans points_ledger — ne peut jamais entrer en
 * collision avec un slug de règle réel : deriveRuleSlug()
 * (lib/loyalty/master-validation.ts) retire systématiquement les underscores
 * en bord de chaîne, donc aucun label admin ne peut dériver vers un slug
 * commençant par "__".
 */
export const COMPLETION_BONUS_SLUG = "__completion_bonus__";
export const COMPLETION_BONUS_LABEL = "Bonus de complétion";

export const CYCLE_LENGTH_DAYS = 30;
const CYCLE_LENGTH_MS = CYCLE_LENGTH_DAYS * 24 * 60 * 60 * 1000;

export type MembershipCycle = {
  /** 0-indexé : 0 = premier cycle depuis l'adhésion, 1 = deuxième, etc. */
  cycleNumber: number;
  start: string; // ISO, inclus
  end: string; // ISO, exclusif
  daysRemaining: number;
};

/**
 * Cycle en cours pour un membre dont l'adhésion (group_memberships.joined_at)
 * a eu lieu à `joinedAtMs`, évalué à l'instant `nowMs`.
 *
 * `Math.max(0, ...)` absorbe un `nowMs` légèrement antérieur à `joinedAtMs`
 * (lecture DB vs horloge applicative, écart de quelques ms) → traité comme
 * "tout début du cycle 0", jamais un cycle négatif.
 *
 * `daysRemaining` arrondi au jour supérieur, jamais 0 (au moins 1 tant qu'on
 * est dans le cycle).
 */
export function membershipCycleWindow(joinedAtMs: number, nowMs: number): MembershipCycle {
  const elapsedMs = Math.max(0, nowMs - joinedAtMs);
  const cycleNumber = Math.floor(elapsedMs / CYCLE_LENGTH_MS);
  const startMs = joinedAtMs + cycleNumber * CYCLE_LENGTH_MS;
  const endMs = startMs + CYCLE_LENGTH_MS;
  const daysRemaining = Math.max(1, Math.ceil((endMs - nowMs) / 86_400_000));
  return {
    cycleNumber,
    start: new Date(startMs).toISOString(),
    end: new Date(endMs).toISOString(),
    daysRemaining,
  };
}

/**
 * Un ensemble de bonus est complété quand CHAQUE slug requis a été crédité au
 * moins une fois dans le cycle en cours. Un ensemble vide n'est jamais
 * considéré complet (configuration dégénérée — validateCompletionBonusParams
 * empêche de toute façon d'enregistrer un ensemble vide, cf.
 * lib/loyalty/master-validation.ts).
 */
export function isCompletionSetFulfilled(
  requiredSlugs: readonly string[],
  creditedSlugsThisCycle: ReadonlySet<string>,
): boolean {
  return requiredSlugs.length > 0 && requiredSlugs.every((slug) => creditedSlugsThisCycle.has(slug));
}
