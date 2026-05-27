// Route Handler — création d'une session Stripe Checkout en mode subscription.
// V1 simple : accepte un priceId (body ou STRIPE_*_PRICE_ID résolu par
// lib/stripe-config selon STRIPE_MODE), trialDays optionnel, locale optionnel.
//
// Appel client : POST /api/stripe/checkout
//   body : { priceId?: string; trialDays?: number; locale?: string }
//   réponse 200 : { sessionId: string; url: string | null }
//   réponse 401 : utilisateur non connecté
//   réponse 4xx/5xx : { error: string }
//
// L'email et l'identité viennent de la session Supabase, jamais du body
// (le webhook a besoin d'un client_reference_id de confiance).
//
// Le client redirige ensuite l'utilisateur vers `url` (ou utilise sessionId
// avec @stripe/stripe-js redirectToCheckout).

import { NextResponse, type NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import { getStripePriceId } from "@/lib/stripe-config";
import { createClient } from "@/lib/supabase/server";

// Types extraits via Parameters<> pour éviter les chemins de namespace
// instables exposés par le SDK Stripe (Stripe.Checkout.* n'est pas
// toujours bien re-exporté selon les versions / moduleResolution).
type CheckoutSessionCreateParams = NonNullable<
  Parameters<typeof stripe.checkout.sessions.create>[0]
>;
type SubscriptionDataParams = NonNullable<
  CheckoutSessionCreateParams["subscription_data"]
>;

type CheckoutBody = {
  priceId?: string;
  trialDays?: number;
  locale?: string;
};

function parseBody(raw: unknown): CheckoutBody {
  if (!raw || typeof raw !== "object") return {};
  const r = raw as Record<string, unknown>;
  const body: CheckoutBody = {};
  if (typeof r.priceId === "string" && r.priceId.length > 0) body.priceId = r.priceId;
  if (typeof r.trialDays === "number" && Number.isFinite(r.trialDays)) body.trialDays = r.trialDays;
  if (typeof r.locale === "string" && /^[a-z]{2}$/.test(r.locale)) body.locale = r.locale;
  return body;
}

export async function POST(request: NextRequest) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_SITE_URL is missing." },
      { status: 500 },
    );
  }

  // Auth obligatoire : sans user.id le webhook ne saura pas qui a payé.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }

  const raw: unknown = await request.json().catch(() => null);
  const body = parseBody(raw);

  // priceId : body en priorité, sinon résolu via stripe-config selon
  // STRIPE_MODE (STRIPE_TEST_PRICE_ID ou STRIPE_LIVE_PRICE_ID).
  // getStripePriceId() throw si la var du mode actif est manquante.
  const priceId = body.priceId ?? getStripePriceId();

  const locale = body.locale ?? "fr";

  // Free trial : structure prête, activée uniquement si body.trialDays > 0.
  const subscriptionData: SubscriptionDataParams = {};
  if (typeof body.trialDays === "number" && body.trialDays > 0) {
    subscriptionData.trial_period_days = Math.floor(body.trialDays);
  }

  const params: CheckoutSessionCreateParams = {
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}/${locale}/dashboard?stripe_success=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/${locale}/pricing?stripe_cancelled=1`,
    // Lien session → user Supabase pour le webhook (checkout.session.completed).
    client_reference_id: user.id,
    metadata: { userId: user.id },
    customer_email: user.email,
  };
  if (Object.keys(subscriptionData).length > 0) {
    params.subscription_data = subscriptionData;
  }

  try {
    const session = await stripe.checkout.sessions.create(params);
    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
