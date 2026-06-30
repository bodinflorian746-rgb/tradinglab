"use client";

// Paywall premium — overlay client centré au-dessus du contenu blurré.
// Rendu uniquement par PremiumGate quand isPremium=false. Strings inline
// (3 locales, ~6 clés) pour éviter de toucher au système i18n existant.

import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { requestTrialCode } from "@/app/[locale]/pricing/actions";
import { PAYWALL_STRINGS, type PaywallReason } from "./paywall-strings";

// Ré-export pour compatibilité des imports existants (PremiumGate, etc.).
export type { PaywallReason };

type PremiumPaywallProps = {
  locale: Locale;
  reason: PaywallReason;
};

export function PremiumPaywall({ locale, reason }: PremiumPaywallProps) {
  const t = PAYWALL_STRINGS[locale];
  const isNotLoggedIn = reason === "not_logged_in";

  // Connecté mais non premium (trial_expired) → action principale = recevoir le
  // code 48h, puis "j'ai déjà un code", puis "voir nos accès". Anonyme → invite
  // à créer un compte.
  const title = isNotLoggedIn ? t.titleLocked : t.titleHasCode;
  const subtitle = isNotLoggedIn ? t.subtitleNotLoggedIn : t.subtitleHasCode;

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

          {isNotLoggedIn ? (
            <>
              <Link
                href={`/${locale}/signup`}
                className="block w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold py-3 rounded-xl transition-colors text-sm mb-3"
              >
                {t.ctaSignup}
              </Link>
              <Link
                href={`/${locale}/login`}
                className="block text-sm text-zinc-400 hover:text-emerald-300 underline underline-offset-4 transition-colors"
              >
                {t.ctaLogin}
              </Link>
            </>
          ) : (
            <>
              {/* 1. Action principale : recevoir le code 48h par email. */}
              <form action={requestTrialCode} className="mb-3">
                <input type="hidden" name="locale" value={locale} />
                <button
                  type="submit"
                  className="block w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold py-3 rounded-xl transition-colors text-sm"
                >
                  {t.ctaRequestCode}
                </button>
              </form>

              {/* 2. Secondaire : j'ai déjà un code. */}
              <Link
                href={`/${locale}/activer-code`}
                className="mb-3 block w-full text-center bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/15 font-semibold py-2.5 rounded-xl transition-colors text-sm"
              >
                {t.ctaActivate}
              </Link>

              {/* 3. Lien : voir nos accès. */}
              <Link
                href={`/${locale}/pricing`}
                className="block text-sm text-zinc-400 hover:text-emerald-300 underline underline-offset-4 transition-colors"
              >
                {t.ctaSubscribe}
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
