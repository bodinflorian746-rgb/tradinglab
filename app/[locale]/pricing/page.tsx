import Link from "next/link";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { localizedHref } from "@/lib/i18n/href";
import { getDictionary } from "@/i18n/dictionaries";
import CheckoutButton from "./CheckoutButton";
import { requestTrialCode } from "./actions";

// Badge "48h gratuit" : un <form> qui POST sur requestTrialCode. L'action gère
// le cas non connecté (redirect /signup?from=trial) côté serveur.
function TrialBadgeForm({ locale, label }: { locale: string; label: string }) {
  return (
    <form action={requestTrialCode} className="mb-3">
      <input type="hidden" name="locale" value={locale} />
      <button
        type="submit"
        className="block w-full text-center bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/15 font-semibold py-2.5 rounded-xl transition-colors text-sm"
      >
        {label}
      </button>
    </form>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-emerald-400">
      <path
        d="M3 8l3.5 3.5L13 4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default async function PricingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ trial_error?: string }>;
}) {
  const raw = (await params).locale;
  const locale: Locale = hasLocale(raw) ? raw : DEFAULT_LOCALE;
  const { trial_error } = await searchParams;
  const t = await getDictionary(locale, "pricing");
  const h = (p: string) => localizedHref(p, locale);
  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-12 md:py-20">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t.title}
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Erreur demande de code 48h */}
        {trial_error === "1" && (
          <div className="max-w-3xl mx-auto mb-8 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-300 text-center">
            {t.trialError}
          </div>
        )}

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Via broker partenaire */}
          <div className="relative bg-zinc-900 border border-emerald-500/40 rounded-2xl p-8 flex flex-col">
            {/* Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-emerald-500 text-zinc-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                {t.broker.badge}
              </span>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white mb-1">
                {t.broker.name}
              </h2>
              <div className="flex items-end gap-1 mb-3">
                <span className="text-5xl font-bold">{t.broker.price}</span>
                <span className="text-zinc-400 mb-2">{t.broker.period}</span>
              </div>
              <p className="text-sm text-zinc-400">
                {t.broker.description}
              </p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {t.broker.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-zinc-200">
                  <CheckIcon />
                  {f}
                </li>
              ))}
            </ul>

            <TrialBadgeForm locale={locale} label={t.broker.trialBadge} />
            <Link
              href={h("/login")}
              className="block text-center bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              {t.broker.cta}
            </Link>
            <Link
              href={h("/access")}
              className="block text-center text-xs text-zinc-400 hover:text-zinc-200 underline underline-offset-4 mt-3 transition-colors"
            >
              {t.broker.haveCode}
            </Link>
          </div>

          {/* Accès direct */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-zinc-300 mb-1">
                {t.direct.name}
              </h2>
              <div className="flex items-end gap-1 mb-3">
                <span className="text-5xl font-bold">{t.direct.price}</span>
                <span className="text-zinc-500 mb-2">{t.direct.period}</span>
              </div>
              <p className="text-sm text-zinc-500">
                {t.direct.description}
              </p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {t.direct.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-zinc-300">
                  <CheckIcon />
                  {f}
                </li>
              ))}
            </ul>

            <TrialBadgeForm locale={locale} label={t.direct.trialBadge} />
            <CheckoutButton
              locale={locale}
              className="block w-full text-center border border-zinc-700 hover:border-zinc-500 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 text-sm"
            >
              {t.direct.cta}
            </CheckoutButton>
          </div>
        </div>

        {/* Guarantee */}
        <p className="text-center text-zinc-500 text-sm mt-10">
          {t.guarantee}
        </p>
      </div>
    </main>
  );
}
