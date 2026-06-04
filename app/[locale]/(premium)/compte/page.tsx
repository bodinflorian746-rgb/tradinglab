// /compte — état d'abonnement de l'user + accès au portail Stripe pour gérer
// (changer carte, voir factures, résilier). Server Component, localisé FR/ES.
//
// Cas gérés via la table subscriptions + lib/auth/premium.isPremium :
//   1. status active/trialing + cancel_at_period_end=false → "actif" + bouton portail
//   2. status active/trialing + cancel_at_period_end=true  → "actif jusqu'au X" + bouton
//   3. pas d'abo Stripe mais trial 48h en cours              → "essai gratuit" sans portail
//   4. status canceled / aucun abo                            → "pas d'abo" + lien pricing
//
// La page est placée sous (premium) : le PremiumGate s'applique. Les users
// actifs/trial passent. Les users sans accès tombent sur le paywall — c'est OK,
// ils n'ont rien à gérer ici, /pricing est leur entrée naturelle.

import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isPremium } from "@/lib/auth/premium";
import { getDictionary } from "@/i18n/dictionaries";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { localizedHref } from "@/lib/i18n/href";
import { createPortalSession } from "./actions";

function formatDate(iso: string | null | undefined, locale: Locale): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const lang = locale === "es" ? "es-ES" : "fr-FR";
  return new Intl.DateTimeFormat(lang, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

type SubRow = {
  status: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean | null;
  stripe_customer_id: string | null;
};

type StateKind = "active" | "ending" | "trial" | "none";

export default async function ComptePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ portal_error?: string; no_portal?: string }>;
}) {
  const raw = (await params).locale;
  const locale: Locale = hasLocale(raw) ? raw : DEFAULT_LOCALE;
  const sp = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    // PremiumGate redirige déjà, mais défensif.
    redirect(`/${locale}/login`);
  }

  // RLS : l'user lit uniquement sa propre ligne.
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("status, current_period_end, cancel_at_period_end, stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle<SubRow>();

  // Détermine la branche d'affichage. Trial = fallback uniquement si pas d'abo
  // Stripe actif (isPremium renvoie reason="trial" dans ce cas).
  const status = sub?.status ?? null;
  const isActive = status === "active" || status === "trialing";
  const cancelAtEnd = sub?.cancel_at_period_end === true;
  const periodEnd = sub?.current_period_end ?? null;
  const hasStripeCustomer = !!sub?.stripe_customer_id;

  let state: StateKind;
  if (isActive && !cancelAtEnd) {
    state = "active";
  } else if (isActive && cancelAtEnd) {
    state = "ending";
  } else {
    const premium = await isPremium(user.id);
    state = premium.reason === "trial" ? "trial" : "none";
  }

  const common = await getDictionary(locale, "common");
  const t = common.account;
  const formattedDate = formatDate(periodEnd, locale);
  const endingLine = t.subscription.ending.replace("{date}", formattedDate);

  // Bouton portail : seulement si un customer_id Stripe existe ET que l'état
  // implique un abonnement à gérer (active/ending). Pour trial/none → pas
  // de bouton (rien à gérer côté Stripe).
  const showPortalButton = hasStripeCustomer && (state === "active" || state === "ending");

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-12 md:py-16">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-3xl md:text-4xl font-bold mb-2">{t.title}</h1>
        <p className="text-zinc-400 text-sm md:text-base mb-8">{t.subtitle}</p>

        {sp.portal_error === "1" && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-300">
            {t.errors.portal}
          </div>
        )}
        {sp.no_portal === "1" && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-zinc-800/40 border border-zinc-700/60 text-sm text-zinc-300">
            {t.errors.noPortal}
          </div>
        )}

        <section className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 md:p-8">
          <p className="text-xs uppercase tracking-widest font-semibold text-zinc-500 mb-2">
            {t.emailLabel}
          </p>
          <p className="text-sm text-white mb-6 break-all">{user.email}</p>

          <p className="text-xs uppercase tracking-widest font-semibold text-zinc-500 mb-2">
            {t.statusLabel}
          </p>

          {state === "active" && (
            <p className="text-base text-white font-medium mb-6">
              {t.subscription.active}
            </p>
          )}
          {state === "ending" && (
            <p className="text-base text-white font-medium mb-6">
              {endingLine}
            </p>
          )}
          {state === "trial" && (
            <p className="text-base text-white font-medium mb-6">
              {t.subscription.trial}
            </p>
          )}
          {state === "none" && (
            <p className="text-base text-white font-medium mb-6">
              {t.subscription.none}
            </p>
          )}

          {showPortalButton && (
            <form action={createPortalSession}>
              <input type="hidden" name="locale" value={locale} />
              <button
                type="submit"
                className="inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
              >
                {t.buttons.managePortal}
              </button>
            </form>
          )}

          {state === "none" && (
            <Link
              href={localizedHref("/pricing", locale)}
              className="inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
            >
              {t.buttons.viewPricing}
            </Link>
          )}

          {state === "trial" && (
            <Link
              href={localizedHref("/pricing", locale)}
              className="inline-flex items-center justify-center border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
            >
              {t.buttons.viewPricing}
            </Link>
          )}
        </section>

      </div>
    </main>
  );
}
