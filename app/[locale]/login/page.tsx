import Link from "next/link";
import { redirect } from "next/navigation";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { createClient } from "@/lib/supabase/server";
import { signIn } from "@/app/[locale]/auth/actions";

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; from?: string }>;
}) {
  const raw = (await params).locale;
  const locale: Locale = hasLocale(raw) ? raw : DEFAULT_LOCALE;

  // Garde : déjà connecté → home.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(`/${locale}`);

  const { error, from } = await searchParams;
  const t = (await getDictionary(locale, "common")).login;

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-2 text-center">{t.title}</h1>
        <p className="text-sm text-zinc-400 text-center mb-6">{t.subtitle}</p>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-300">
            {decodeURIComponent(error)}
          </div>
        )}

        <form action={signIn} className="space-y-4">
          <input type="hidden" name="locale" value={locale} />
          {from && <input type="hidden" name="from" value={from} />}

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

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-zinc-400 mb-1.5">
              {t.passwordLabel}
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              autoComplete="current-password"
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

        <p className="text-center mt-4">
          <Link
            href={`/${locale}/mot-de-passe-oublie`}
            className="text-xs text-zinc-500 hover:text-zinc-300 underline underline-offset-4 transition-colors"
          >
            {t.forgotPassword}
          </Link>
        </p>

        <p className="text-sm text-zinc-500 mt-6 text-center">
          {t.noAccount}{" "}
          <Link
            href={`/${locale}/signup`}
            className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
          >
            {t.signup}
          </Link>
        </p>
      </div>
    </main>
  );
}
