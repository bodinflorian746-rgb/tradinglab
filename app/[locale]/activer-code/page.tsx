// Page d'activation du code d'accès (1 seul champ).
// Le visiteur entre le code reçu par email → server action activateCode →
// validation + consommation + démarrage du trial 48h → /dashboard.
// Bilingue FR/ES via le dictionnaire common (clé activateCode).

import Link from "next/link";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { activateCode } from "./actions";

export default async function ActivateCodePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const raw = (await params).locale;
  const locale: Locale = hasLocale(raw) ? raw : DEFAULT_LOCALE;
  const { error } = await searchParams;
  const t = (await getDictionary(locale, "common")).activateCode;

  const errors = t.errors as Record<string, string>;
  const errorMsg = error ? (errors[error] ?? errors.generic) : null;

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-2 text-center">{t.title}</h1>
        <p className="text-sm text-zinc-400 text-center mb-6 leading-relaxed">{t.subtitle}</p>

        {errorMsg && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-300">
            {errorMsg}
          </div>
        )}

        <form action={activateCode} className="space-y-4">
          <input type="hidden" name="locale" value={locale} />

          <div>
            <label htmlFor="code" className="block text-xs font-medium text-zinc-400 mb-1.5">
              {t.label}
            </label>
            <input
              id="code"
              type="text"
              name="code"
              required
              autoComplete="off"
              spellCheck={false}
              placeholder="TSX-ABCD-2345"
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:border-emerald-500 focus:outline-none transition-colors text-sm font-mono tracking-wide uppercase"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            {t.submit}
          </button>
        </form>

        <p className="text-sm text-zinc-500 mt-6 text-center">
          <Link
            href={`/${locale}/login`}
            className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
          >
            {t.backToLogin}
          </Link>
        </p>
      </div>
    </main>
  );
}
