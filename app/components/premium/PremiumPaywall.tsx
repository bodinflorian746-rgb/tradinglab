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
  titleLocked: string;
  titleHasCode: string;
  subtitleNotLoggedIn: string;
  subtitleHasCode: string;
  ctaSignup: string;
  ctaActivate: string;
  ctaSubscribe: string;
  ctaLogin: string;
};

const STRINGS: Record<Locale, Strings> = {
  fr: {
    eyebrow: "Accès Premium",
    titleLocked: "Accès Premium requis",
    titleHasCode: "Active tes 48h gratuites",
    subtitleNotLoggedIn:
      "Crée ton compte pour profiter de 48h d'essai gratuit, puis débloque tout TradeScaleX.",
    subtitleHasCode:
      "Tu as reçu un code par email à ton inscription. Entre-le pour activer tes 48h gratuites et débloquer tout TradeScaleX.",
    ctaSignup: "Essayer 48h gratuit",
    ctaActivate: "J'ai mon code",
    ctaSubscribe: "Voir les abonnements",
    ctaLogin: "Se connecter",
  },
  en: {
    eyebrow: "Premium access",
    titleLocked: "Premium access required",
    titleHasCode: "Activate your 48h free trial",
    subtitleNotLoggedIn:
      "Sign up to start your 48h free trial, then unlock the full TradeScaleX experience.",
    subtitleHasCode:
      "You received a code by email when you signed up. Enter it to activate your 48h free trial and unlock all of TradeScaleX.",
    ctaSignup: "Start 48h free trial",
    ctaActivate: "I have my code",
    ctaSubscribe: "See plans",
    ctaLogin: "Log in",
  },
  es: {
    eyebrow: "Acceso Premium",
    titleLocked: "Acceso Premium requerido",
    titleHasCode: "Activa tus 48 h gratis",
    subtitleNotLoggedIn:
      "Crea tu cuenta para empezar una prueba gratuita de 48 h y desbloquear todo TradeScaleX.",
    subtitleHasCode:
      "Recibiste un código por email al registrarte. Introdúcelo para activar tus 48 h gratis y desbloquear todo TradeScaleX.",
    ctaSignup: "Probar 48 h gratis",
    ctaActivate: "Tengo mi código",
    ctaSubscribe: "Ver planes",
    ctaLogin: "Iniciar sesión",
  },
};

export function PremiumPaywall({ locale, reason }: PremiumPaywallProps) {
  const t = STRINGS[locale];
  const isNotLoggedIn = reason === "not_logged_in";

  // Connecté mais non premium (trial_expired) → on invite à activer le code
  // reçu par mail (parcours post-signup fluide). Anonyme → invite à créer un
  // compte.
  const title = isNotLoggedIn ? t.titleLocked : t.titleHasCode;
  const subtitle = isNotLoggedIn ? t.subtitleNotLoggedIn : t.subtitleHasCode;
  const ctaHref = isNotLoggedIn ? `/${locale}/signup` : `/${locale}/activer-code`;
  const ctaLabel = isNotLoggedIn ? t.ctaSignup : t.ctaActivate;
  const secondaryHref = isNotLoggedIn ? `/${locale}/login` : `/${locale}/pricing`;
  const secondaryLabel = isNotLoggedIn ? t.ctaLogin : t.ctaSubscribe;

  // z-40 (sous la Navbar en z-50) pour que la nav reste cliquable.
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
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
            {title}
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
            href={secondaryHref}
            className="block text-sm text-zinc-400 hover:text-emerald-300 underline underline-offset-4 transition-colors"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
