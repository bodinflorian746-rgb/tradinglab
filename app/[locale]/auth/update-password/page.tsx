// Page de saisie d'un nouveau mot de passe (variante "home connectée").
//
// Atterrissage : l'user vient de cliquer le lien recovery reçu par mail.
//   - Si l'URL contient `?code=...` (Supabase PKCE), on passe par
//     /auth/callback pour échanger le code en session (le Server Component
//     ne peut pas écrire les cookies — c'est le rôle du Route Handler).
//   - Sinon, on vérifie qu'une session existe (cookies recovery) ; absente
//     → redirect /login.
//
// Le formulaire submit vers updatePassword qui appelle supabase.auth.updateUser
// puis redirige vers la home connectée (la session est conservée).

import { redirect } from "next/navigation";
import Link from "next/link";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { createClient } from "@/lib/supabase/server";
import { updatePassword } from "./actions";

export default async function UpdatePasswordPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ code?: string; error?: string }>;
}) {
  const raw = (await params).locale;
  const locale: Locale = hasLocale(raw) ? raw : DEFAULT_LOCALE;
  const { code, error } = await searchParams;

  // Échange code → session via /auth/callback (qui peut écrire les cookies).
  // Le callback nous renverra ici sans le `code` en query.
  if (typeof code === "string" && code.length > 0) {
    redirect(`/${locale}/auth/callback?code=${encodeURIComponent(code)}&next=/auth/update-password`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/${locale}/login`);
  }

  const t = (await getDictionary(locale, "common")).updatePassword;
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

        <form action={updatePassword} className="space-y-4">
          <input type="hidden" name="locale" value={locale} />

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-zinc-400 mb-1.5">
              {t.newPasswordLabel}
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:border-emerald-500 focus:outline-none transition-colors text-sm"
            />
            <p className="mt-1 text-[11px] text-zinc-500">{t.passwordHint}</p>
          </div>

          <div>
            <label htmlFor="confirm" className="block text-xs font-medium text-zinc-400 mb-1.5">
              {t.confirmLabel}
            </label>
            <input
              id="confirm"
              type="password"
              name="confirm"
              required
              minLength={6}
              autoComplete="new-password"
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
            className="text-zinc-400 hover:text-white underline underline-offset-4"
          >
            {t.backToLogin}
          </Link>
        </p>
      </div>
    </main>
  );
}
