// Page de demande de réinitialisation du mot de passe.
// L'utilisateur saisit son email → server action envoie un lien Supabase →
// affichage de confirmation "lien envoyé si compte existe".

import Link from "next/link";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { requestPasswordReset } from "./actions";

export default async function ForgotPasswordPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const raw = (await params).locale;
  const locale: Locale = hasLocale(raw) ? raw : DEFAULT_LOCALE;
  const { sent, error } = await searchParams;
  const t = (await getDictionary(locale, "common")).resetPassword;

  const errors = t.errors as Record<string, string>;
  const errorMsg = error ? (errors[error] ?? errors.generic) : null;
  const isSent = sent === "1";

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
        {isSent ? (
          <>
            <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
                <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-3 text-center">{t.sentTitle}</h1>
            <p className="text-sm text-zinc-400 leading-relaxed text-center mb-6">{t.sentBody}</p>
            <Link
              href={`/${locale}/login`}
              className="block text-center text-sm text-emerald-400 hover:text-emerald-300 underline underline-offset-4 transition-colors"
            >
              {t.backToLogin}
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-2 text-center">{t.title}</h1>
            <p className="text-sm text-zinc-400 text-center mb-6 leading-relaxed">{t.subtitle}</p>

            {errorMsg && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-300">
                {errorMsg}
              </div>
            )}

            <form action={requestPasswordReset} className="space-y-4">
              <input type="hidden" name="locale" value={locale} />

              <div>
                <label htmlFor="email" className="block text-xs font-medium text-zinc-400 mb-1.5">
                  {t.emailLabel}
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:border-emerald-500 focus:outline-none transition-colors text-sm"
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
          </>
        )}
      </div>
    </main>
  );
}
