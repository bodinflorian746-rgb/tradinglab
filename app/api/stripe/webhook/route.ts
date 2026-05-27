// Route Handler — Stripe webhook.
//
// Vérification de signature : req.text() obligatoire (octet-pour-octet).
// 3 events gérés → upsert dans public.subscriptions (onConflict: 'user_id').
//   - checkout.session.completed   : INSERT initial (lookup user via session)
//   - customer.subscription.updated: status / périodes / cancel_at_period_end
//   - customer.subscription.deleted: status = 'canceled'
//
// Toutes les dates Stripe sont en secondes Unix → ISO pour Postgres.
// SDK Stripe v22 : current_period_start/end ne sont plus sur Subscription,
// ils vivent sur subscription.items.data[0]. cancel_at_period_end reste
// sur Subscription.
//
// Pour les events subscription.updated/deleted on retrouve le user_id par
// lookup sur stripe_subscription_id (la ligne a été créée par
// checkout.session.completed). Si elle n'existe pas → console.error + 200.
//
// On répond toujours 2xx en cas d'erreur métier (sinon Stripe ré-essaie en
// boucle). Seules les erreurs de signature renvoient 400.

import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { getStripeWebhookSecret } from "@/lib/stripe-config";
import { createAdminClient } from "@/lib/supabase/admin";

// Force le runtime Node (pas Edge) : stripe.webhooks.constructEvent utilise
// le module crypto natif pour la vérification HMAC. Edge n'a pas accès à
// node:crypto et casserait la signature silencieusement.
export const runtime = "nodejs";
// Empêche toute mise en cache / pré-rendering : webhook = effets de bord à
// chaque appel.
export const dynamic = "force-dynamic";

function unixToISO(seconds: number | null | undefined): string | null {
  if (typeof seconds !== "number" || !Number.isFinite(seconds)) return null;
  return new Date(seconds * 1000).toISOString();
}

function getSubscriptionPeriod(subscription: Stripe.Subscription): {
  start: string | null;
  end: string | null;
} {
  const item = subscription.items?.data?.[0];
  if (!item) return { start: null, end: null };
  return {
    start: unixToISO(item.current_period_start),
    end: unixToISO(item.current_period_end),
  };
}

function getCustomerId(subscription: Stripe.Subscription): string | null {
  const c = subscription.customer;
  if (!c) return null;
  return typeof c === "string" ? c : c.id;
}

async function findUserIdBySubscriptionId(
  stripeSubscriptionId: string,
): Promise<string | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_subscription_id", stripeSubscriptionId)
    .maybeSingle();
  if (error) {
    console.error(
      `[stripe-webhook] lookup user_id failed for sub=${stripeSubscriptionId}: ${error.message}`,
    );
    return null;
  }
  return (data?.user_id as string | undefined) ?? null;
}

type SubscriptionRow = {
  user_id: string;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  stripe_price_id?: string | null;
  status?: string | null;
  current_period_start?: string | null;
  current_period_end?: string | null;
  cancel_at_period_end?: boolean;
  updated_at: string;
};

async function upsertSubscriptionRow(row: SubscriptionRow): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("subscriptions")
    .upsert(row, { onConflict: "user_id" });
  if (error) {
    console.error(
      `[stripe-webhook] upsert subscriptions failed for user=${row.user_id}: ${error.message}`,
    );
  }
}

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
): Promise<void> {
  const userId =
    session.client_reference_id ??
    (typeof session.metadata?.userId === "string" ? session.metadata.userId : null);

  if (!userId) {
    console.error(
      `[stripe-webhook] checkout.session.completed sans user_id (client_reference_id ni metadata.userId). session=${session.id}`,
    );
    return;
  }

  if (!session.subscription) {
    console.error(
      `[stripe-webhook] checkout.session.completed sans subscription. session=${session.id}`,
    );
    return;
  }

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription.id;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const { start, end } = getSubscriptionPeriod(subscription);

  await upsertSubscriptionRow({
    user_id: userId,
    stripe_customer_id: getCustomerId(subscription),
    stripe_subscription_id: subscription.id,
    stripe_price_id: subscription.items.data[0]?.price?.id ?? null,
    status: subscription.status,
    current_period_start: start,
    current_period_end: end,
    cancel_at_period_end: subscription.cancel_at_period_end,
    updated_at: new Date().toISOString(),
  });
}

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
): Promise<void> {
  const userId = await findUserIdBySubscriptionId(subscription.id);
  if (!userId) {
    console.error(
      `[stripe-webhook] customer.subscription.updated: aucune ligne pour subscription=${subscription.id}`,
    );
    return;
  }

  const { start, end } = getSubscriptionPeriod(subscription);

  await upsertSubscriptionRow({
    user_id: userId,
    status: subscription.status,
    current_period_start: start,
    current_period_end: end,
    cancel_at_period_end: subscription.cancel_at_period_end,
    updated_at: new Date().toISOString(),
  });
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
): Promise<void> {
  const userId = await findUserIdBySubscriptionId(subscription.id);
  if (!userId) {
    console.error(
      `[stripe-webhook] customer.subscription.deleted: aucune ligne pour subscription=${subscription.id}`,
    );
    return;
  }

  await upsertSubscriptionRow({
    user_id: userId,
    status: "canceled",
    updated_at: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  // 1. Signature obligatoire
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header." },
      { status: 400 },
    );
  }

  // 2. Webhook secret résolu via stripe-config selon STRIPE_MODE
  // (STRIPE_TEST_WEBHOOK_SECRET ou STRIPE_LIVE_WEBHOOK_SECRET).
  // Throw si la var du mode actif est manquante → renvoyé en 500.
  let webhookSecret: string;
  try {
    webhookSecret = getStripeWebhookSecret();
  } catch (err) {
    const message = err instanceof Error ? err.message : "webhook secret missing";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  // 3. Body brut pour la vérification cryptographique
  const body = await req.text();

  // 4. Construction + vérification de l'event Stripe
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 },
    );
  }

  // 5. Routing des events
  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      default:
        // Event reçu mais non géré : accuser réception sans bruit.
        break;
    }
  } catch (err) {
    // Erreur métier : log mais on renvoie 2xx pour éviter le retry storm.
    // Les events Stripe restent inspectables dans le Dashboard.
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `[stripe-webhook] handler error for ${event.type} (id=${event.id}): ${message}`,
    );
  }

  return NextResponse.json({ received: true });
}
