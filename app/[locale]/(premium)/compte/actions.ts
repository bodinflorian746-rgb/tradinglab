"use server";

// Server Action — création d'une session du portail client Stripe pour gérer
// l'abonnement (changer la carte, voir les factures, résilier). Le portail
// Stripe gère lui-même tous les flux (annulation, reprise, etc.) et déclenche
// les webhooks customer.subscription.updated / deleted qui sont déjà routés
// vers la table public.subscriptions par app/api/stripe/webhook/route.ts.
//
// Conditions :
//   - utilisateur connecté (sinon redirect /login)
//   - existence d'un stripe_customer_id dans subscriptions (sinon redirect
//     /compte?no_portal=1 ; cas trial / broker / lifetime sans Stripe)
//
// L'appel Stripe utilise le singleton lib/stripe.ts (mode test/live résolu
// automatiquement via STRIPE_MODE).

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

function getStr(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v : "";
}

export async function createPortalSession(formData: FormData) {
  const locale = getStr(formData, "locale") || "fr";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/${locale}/login`);
  }

  // RLS : l'user authentifié lit uniquement sa propre subscription.
  const { data: sub, error: subErr } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (subErr) {
    console.error(`[compte] lookup subscriptions échoué pour ${user.id}: ${subErr.message}`);
    redirect(`/${locale}/compte?portal_error=1`);
  }

  if (!sub?.stripe_customer_id) {
    // Pas d'abo Stripe : trial code, broker/lifetime, ou rien du tout.
    // Le portail Stripe n'a rien à gérer ici.
    redirect(`/${locale}/compte?no_portal=1`);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    console.error(`[compte] NEXT_PUBLIC_SITE_URL manquant`);
    redirect(`/${locale}/compte?portal_error=1`);
  }

  let portalUrl: string;
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: `${siteUrl}/${locale}/compte`,
    });
    portalUrl = session.url;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Stripe error";
    console.error(`[compte] billingPortal.sessions.create échoué pour ${user.id}: ${msg}`);
    redirect(`/${locale}/compte?portal_error=1`);
  }

  redirect(portalUrl);
}
