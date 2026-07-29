// Validation/normalisation PURE de la saisie d'un code de points par un membre
// (aucun accès DB → testable unitairement). La vérification d'existence, de
// statut et d'expiration se fait en base (RPC activate_points_code) — ce
// module ne fait que nettoyer l'entrée avant l'appel.

/** Normalise une saisie de code : trim + majuscules (comme activer-code). */
export function normalizeCodeInput(raw: unknown): string {
  if (typeof raw !== "string") return "";
  return raw.trim().toUpperCase();
}

/** Résultats possibles renvoyés par la RPC activate_points_code. */
export type ActivateOutcome = "ok" | "not_found" | "already_used" | "expired" | "group_suspended";

export function isActivateOutcome(value: string): value is ActivateOutcome {
  return (
    value === "ok" ||
    value === "not_found" ||
    value === "already_used" ||
    value === "expired" ||
    value === "group_suspended"
  );
}

/** Résultats possibles renvoyés par la RPC join_group_by_reference_code. */
export type JoinGroupOutcome = "ok" | "not_found" | "already_member" | "group_suspended";

export function isJoinGroupOutcome(value: string): value is JoinGroupOutcome {
  return (
    value === "ok" || value === "not_found" || value === "already_member" || value === "group_suspended"
  );
}

/**
 * Résultats possibles renvoyés par la RPC purchase_shop_item.
 * 'already_processed' : une tentative déjà traitée est rejouée (même
 * idempotency_key, même article) — l'achat existant est renvoyé, aucun
 * second débit.
 * 'idempotency_key_reused' : la clé a déjà été utilisée mais pour un AUTRE
 * article — mésusage rejeté, jamais traité comme un succès.
 */
export type PurchaseOutcome =
  | "ok"
  | "already_processed"
  | "idempotency_key_reused"
  | "not_found"
  | "item_inactive"
  | "group_suspended"
  | "not_member"
  | "insufficient_balance";

export function isPurchaseOutcome(value: string): value is PurchaseOutcome {
  return (
    value === "ok" ||
    value === "already_processed" ||
    value === "idempotency_key_reused" ||
    value === "not_found" ||
    value === "item_inactive" ||
    value === "group_suspended" ||
    value === "not_member" ||
    value === "insufficient_balance"
  );
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Valide une clé d'idempotence d'achat (UUID fourni par le formulaire/client).
 * Une tentative d'achat génère une clé une seule fois ; la même tentative
 * rejouée (double clic, requête répétée) doit renvoyer la même clé — c'est
 * cette clé, transmise telle quelle à la RPC, qui garantit l'idempotence
 * EN BASE (contrainte unique (user_id, idempotency_key)).
 */
export function isValidIdempotencyKey(raw: unknown): raw is string {
  return typeof raw === "string" && UUID_RE.test(raw);
}
