"use client";

// Paywall premium — overlay client centré au-dessus du contenu blurré.
// Rendu uniquement par PremiumGate quand isPremium=false. Strings inline
// (3 locales, ~6 clés) pour éviter de toucher au système i18n existant.

import Link from "next/link";
import type { Locale } from "@/i18n/config";

export type PaywallReason = "trial_expired" | "not_logged_in";

type PremiumPaywallProps = {
  locale: Locale;
  reason: PaywallReason;
};

type Strings = {
  eyebrow: string;
  title: string;
  subtitleNotLoggedIn: string;
  subtitleTrialExpired: string;
  ctaTrial: string;
  ctaSubscribe: string;
  secondaryAccessCode: string;
};

const STRINGS: Record<Locale, Strings> = {
  fr: {
    eyebrow: "Accès Premium",
    title: "Accès Premium requis",
    subtitleNotLoggedIn:
      "Crée ton compte pour profiter de 48h d'essai gratuit, puis débloque tout TradeScaleX.",
    subtitleTrialExpired:
      "Ton essai gratuit est terminé. Choisis ton accès pour continuer à apprendre.",
    ctaTrial: "Essayer 48h gratuit",
    ctaSubscribe: "Voir les abonnements",
    secondaryAccessCode: "J'ai un code d'accès",
  },
  en: {
    eyebrow: "Premium access",
    title: "Premium access required",
    subtitleNotLoggedIn:
      "Sign up to start your 48h free trial, then unlock the full TradeScaleX experience.",
    subtitleTrialExpired:
      "Your free trial has ended. Choose a plan to keep learning.",
    ctaTrial: "Start 48h free trial",
    ctaSubscribe: "See plans",
    secondaryAccessCode: "I have an access code",
  },
  es: {
    eyebrow: "Acceso Premium",
    title: "Acceso Premium requerido",
    subtitleNotLoggedIn:
      "Crea tu cuenta para empezar una prueba gratuita de 48h y desbloquear todo TradeScaleX.",
    subtitleTrialExpired:
      "Tu prueba gratuita ha terminado. Elige un plan para seguir aprendiendo.",
    ctaTrial: "Probar 48h gratis",
    ctaSubscribe: "Ver planes",
    secondaryAccessCode: "Tengo un código de acceso",
  },
};

export function PremiumPaywall({ locale, reason }: PremiumPaywallProps) {
  const t = STRINGS[locale];
  const isNotLoggedIn = reason === "not_logged_in";
  const ctaHref = isNotLoggedIn ? `/${locale}/signup` : `/${locale}/pricing`;
  const ctaLabel = isNotLoggedIn ? t.ctaTrial : t.ctaSubscribe;
  const subtitle = isNotLoggedIn ? t.subtitleNotLoggedIn : t.subtitleTrialExpired;

  // z-40 (sous la Navbar en z-50) pour que la nav reste cliquable.
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.title}
      className="fixed inset-0 z-40 flex items-center justify-center px-6 py-12"
    >
      {/* Dim layer additionnel — le blur des enfants est déjà appliqué par PremiumGate */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-zinc-950/70"
      />

      {/* Card */}
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center">
          <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-widest mb-3">
            {t.eyebrow}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            {t.title}
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            {subtitle}
          </p>

          <Link
            href={ctaHref}
            className="block w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold py-3 rounded-xl transition-colors text-sm mb-3"
          >
            {ctaLabel}
          </Link>

          <Link
            href={`/${locale}/redeem`}
            className="block text-sm text-zinc-400 hover:text-emerald-300 underline underline-offset-4 transition-colors"
          >
            {t.secondaryAccessCode}
          </Link>
        </div>
      </div>
    </div>
  );
}
