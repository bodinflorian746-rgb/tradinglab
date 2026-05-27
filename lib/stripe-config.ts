// Config Stripe centralisée. Switch test ↔ live via une seule variable
// d'environnement, sans toucher au code.
//
// ─── Comment switcher entre test et live ────────────────────────────────────
//   1. Éditer .env.local : STRIPE_MODE=test   (ou   STRIPE_MODE=live)
//   2. Vérifier que le bloc correspondant (STRIPE_TEST_* ou STRIPE_LIVE_*)
//      est rempli.
//   3. Redémarrer `npm run dev` (Next ne relit .env.local qu'au boot).
//
// ─── Pourquoi le fallback est "test" par défaut ─────────────────────────────
//   En cas d'oubli (var absente en CI, nouveau dev qui clone, env mal
//   chargée), on doit dégrader vers le mode safe. "test" ne fait aucun
//   paiement réel, "live" si. Mieux vaut un échec en test qu'un débit
//   accidentel en production.
//
// ─── Usage ─────────────────────────────────────────────────────────────────
//   import { getStripeSecretKey, getStripeWebhookSecret, ... } from "@/lib/stripe-config";
//   // Les helpers throw une erreur explicite si la var requise est absente
//   // pour le mode actif. Pas de any, pas de fallback silencieux.

export type StripeMode = "test" | "live";

// Flag de log "first call only" : évite de spammer la console à chaque
// invocation du helper (utile en dev avec HMR / multiples requêtes).
let modeLogged = false;

function logModeOnce(mode: StripeMode): void {
  if (modeLogged) return;
  modeLogged = true;
  console.log(`[stripe-config] mode=${mode}`);

  // Protection runtime point 8 : live + localhost = paiements RÉELS
  // depuis ta machine. Cas légitime (tester l'intégration live en local)
  // mais on doit le crier clairement pour éviter l'accident.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  if (mode === "live" && siteUrl.includes("localhost")) {
    console.warn(
      "[stripe-config] ⚠️  STRIPE_MODE=live ET NEXT_PUBLIC_SITE_URL contient 'localhost'. " +
        "Tout paiement déclenché va débiter de l'argent réel. Vérifie que c'est intentionnel.",
    );
  }
}

export function getStripeMode(): StripeMode {
  const raw = process.env.STRIPE_MODE;
  const mode: StripeMode = raw === "live" ? "live" : "test";
  logModeOnce(mode);
  return mode;
}

function requireEnv(name: string): string {
  const v = process.env[name];
  if (typeof v !== "string" || v.length === 0) {
    throw new Error(
      `[stripe-config] variable d'environnement manquante: ${name}. ` +
        `Vérifie .env.local et redémarre npm run dev.`,
    );
  }
  return v;
}

export function getStripeSecretKey(): string {
  return getStripeMode() === "live"
    ? requireEnv("STRIPE_LIVE_SECRET_KEY")
    : requireEnv("STRIPE_TEST_SECRET_KEY");
}

export function getStripeWebhookSecret(): string {
  return getStripeMode() === "live"
    ? requireEnv("STRIPE_LIVE_WEBHOOK_SECRET")
    : requireEnv("STRIPE_TEST_WEBHOOK_SECRET");
}

export function getStripePriceId(): string {
  return getStripeMode() === "live"
    ? requireEnv("STRIPE_LIVE_PRICE_ID")
    : requireEnv("STRIPE_TEST_PRICE_ID");
}

export function getStripePublishableKey(): string {
  return getStripeMode() === "live"
    ? requireEnv("NEXT_PUBLIC_STRIPE_LIVE_PUBLISHABLE_KEY")
    : requireEnv("NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY");
}
