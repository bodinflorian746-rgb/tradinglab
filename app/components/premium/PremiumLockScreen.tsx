// Écran de verrouillage plein écran pour un *contenu* premium précis
// (leçon Trading/Macro, stratégie, jeu). Contrairement à PremiumPaywall qui
// floute le contenu derrière un overlay, PremiumLockScreen est rendu *à la
// place* du contenu : aucun contenu premium n'est jamais envoyé au client.
//
// Orientation conversion : page de vente de l'essai gratuit 48h (« je peux tout
// essayer gratuitement »), pas un rappel de blocage. Direction artistique alignée
// sur le hero de la landing (dégradé pétrole→nuit + halos emerald/teal, bordure
// premium lumineuse). Réutilise les CTA existants (PAYWALL_STRINGS +
// requestTrialCode) — aucune logique d'essai/abo dupliquée.
//
// Server Component : pas de hooks. Le <form action={requestTrialCode}> et les
// <Link> fonctionnent directement côté serveur.

import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { requestTrialCode } from "@/app/[locale]/pricing/actions";
import { PAYWALL_STRINGS, type PaywallReason } from "./paywall-strings";

type PremiumLockScreenProps = {
  locale: Locale;
  reason: PaywallReason;
};

// Dégradé de la carte : reprend les teintes pétrole→nuit de .app-bg + un léger
// halo emerald en haut (derrière le cadenas / le titre) et une pointe de bleu
// en bas-droite. Volontairement très discret.
const CARD_BG =
  "radial-gradient(120% 90% at 50% -10%, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.03) 32%, transparent 62%)," +
  "radial-gradient(90% 70% at 100% 108%, rgba(11,92,116,0.12) 0%, transparent 60%)," +
  "linear-gradient(165deg, #0a2f35 0%, #082429 46%, #06181f 100%)";

function Divider() {
  return (
    <div
      aria-hidden="true"
      className="h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"
    />
  );
}

export function PremiumLockScreen({ locale, reason }: PremiumLockScreenProps) {
  const t = PAYWALL_STRINGS[locale];
  const isNotLoggedIn = reason === "not_logged_in";

  return (
    <main className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16">
      <div
        className="relative overflow-hidden w-full max-w-md rounded-2xl border border-emerald-500/15 ring-1 ring-inset ring-white/[0.04] p-6 sm:p-8 text-center shadow-2xl shadow-emerald-950/40"
        style={{ background: CARD_BG }}
      >
        {/* Liseré lumineux haut (bordure premium). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent"
        />

        {/* Cadenas + halo vert discret derrière. */}
        <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-emerald-500/12 border border-emerald-400/25 flex items-center justify-center shadow-[0_0_22px_-2px_rgba(16,185,129,0.5)]">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <rect x="4" y="9" width="12" height="8" rx="2" stroke="#34d399" strokeWidth="1.6" />
            <path d="M7 9V6.5a3 3 0 016 0V9" stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>

        {/* Petit label en haut */}
        <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-[0.18em] mb-2.5">
          {t.contentLockedEyebrow}
        </p>

        {/* Titre principal — le plus gros texte de la page (offre 48h) */}
        <h1 className="text-2xl sm:text-3xl font-bold text-white leading-snug mb-5">
          {t.contentLockedTitle}
        </h1>

        <Divider />

        {/* Avantages */}
        <ul className="text-left text-sm text-zinc-200 space-y-2 my-5">
          {t.contentLockedBenefits.map((b) => (
            <li key={b} className="leading-relaxed">{b}</li>
          ))}
        </ul>

        {/* Réassurance (ligne de confiance) */}
        <p className="text-[13px] text-zinc-400 mb-5">
          {t.contentLockedReassurance}
        </p>

        <Divider />

        {/* CTA — inchangés. */}
        <div className="mt-5">
          {isNotLoggedIn ? (
            <>
              {/* from=trial : après création du compte, signUp() envoie auto
                  le code 48h (sendTrialCodeForUser) puis redirige vers
                  /code-envoye. Sans ce param, le signup ne déclenche aucun mail. */}
              <Link
                href={`/${locale}/signup?from=trial`}
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

        {/* Micro-texte de réassurance sous les boutons */}
        <p className="text-[11px] text-zinc-500 mt-4">
          {t.contentLockedMicrocopy}
        </p>
      </div>
    </main>
  );
}
