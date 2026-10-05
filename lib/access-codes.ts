// Génération de codes d'accès. Source unique réutilisée par la page admin
// (génération en lot) ET par le signup grand public (code trial auto).
// Format TSX-XXXX-XXXX, alphabet sans caractères ambigus (pas de I, O, 0, 1).

import { randomInt } from "node:crypto";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/**
 * Segment aléatoire de `len` caractères, alphabet sans caractères ambigus
 * (pas de I, O, 0, 1). Exporté pour être réutilisé par d'autres générateurs de
 * codes (ex. codes de points du programme de fidélité, cf. lib/loyalty/codes.ts).
 */
export function randomSegment(len: number): string {
  let out = "";
  for (let i = 0; i < len; i++) {
    out += ALPHABET[randomInt(ALPHABET.length)];
  }
  return out;
}

/** Format TSX-XXXX-XXXX (8 chars aléatoires, ~10^12 combinaisons). */
export function generateCode(): string {
  return `TSX-${randomSegment(4)}-${randomSegment(4)}`;
}

// Date très lointaine utilisée pour matérialiser un accès "à vie" (sans
// colonne dédiée pour l'illimité) — déjà le mécanisme existant pour
// broker/lifetime dans app/[locale]/activer-code/actions.ts, réutilisé tel
// quel ici.
const FAR_FUTURE_ISO = "2099-12-31T23:59:59.000Z";

/**
 * Calcule la date de fin d'accès (subscriptions.current_period_end) à poser
 * lors de l'activation d'un code d'accès, selon son type :
 *   • 'broker' / 'lifetime' → date très lointaine (accès à vie, mécanisme
 *     existant, inchangé) ;
 *   • 'duration' → now + durationDays jours (durée choisie par l'admin de
 *     groupe au moment de la génération du code) ;
 *   • 'trial' n'appelle jamais cette fonction (géré séparément via
 *     email_confirmed_at, cf. activer-code/actions.ts).
 * `nowMs` est injecté pour rester pur/déterministe (testable).
 */
export function computeAccessPeriodEnd(
  type: "broker" | "lifetime" | "duration",
  durationDays: number | null,
  nowMs: number,
): string {
  if (type === "duration") {
    const days = durationDays ?? 0;
    return new Date(nowMs + days * 24 * 60 * 60 * 1000).toISOString();
  }
  return FAR_FUTURE_ISO;
}

/** Ligne subscriptions existante (colonnes utiles à la décision), ou null. */
export type ExistingSubscription = {
  status: string | null;
  current_period_end: string | null;
  stripe_subscription_id: string | null;
} | null;

/**
 * Décide si l'activation d'un code peut écrire la ligne subscriptions, selon
 * la règle « ne jamais raccourcir un accès existant » :
 *   • 'keep_stripe' : abonnement Stripe en cours (active/trialing, non échu)
 *     → ne jamais l'écraser (sinon prélèvements orphelins côté Stripe) ;
 *   • 'keep_longer' : accès en cours (active/trialing, non échu) qui finit
 *     au plus tôt à `newEnd` → rien à changer (ex. code durée sur un compte
 *     à vie) ;
 *   • 'write' : aucun accès en cours, accès échu, ou accès plus court.
 * `nowMs` est injecté pour rester pur/déterministe (testable).
 */
export function decideAccessWrite(
  existing: ExistingSubscription,
  newEnd: string,
  nowMs: number,
): "write" | "keep_longer" | "keep_stripe" {
  if (!existing) return "write";
  const endMs = existing.current_period_end ? Date.parse(existing.current_period_end) : NaN;
  const running =
    (existing.status === "active" || existing.status === "trialing") &&
    Number.isFinite(endMs) &&
    endMs > nowMs;
  if (!running) return "write";
  if (existing.stripe_subscription_id) return "keep_stripe";
  return endMs >= Date.parse(newEnd) ? "keep_longer" : "write";
}
