// Interrupteur serveur du checkout Stripe (nouvelles souscriptions uniquement).
//
// Checkout autorisé si et seulement si STRIPE_CHECKOUT_ENABLED vaut
// exactement "true". Variable absente ou toute autre valeur → désactivé
// (fail-closed). Server-only : jamais exposé au navigateur (pas de préfixe
// NEXT_PUBLIC_).
//
// N'affecte PAS le webhook ni le portail client : les abonnements existants
// continuent d'être synchronisés et résiliables.

import "server-only";

export function isStripeCheckoutEnabled(): boolean {
  return process.env.STRIPE_CHECKOUT_ENABLED === "true";
}
