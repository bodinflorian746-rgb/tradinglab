import Link from "next/link";
import { signUp } from "@/app/[locale]/auth/actions";

export default async function SignupPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { locale } = await params;
  const { error } = await searchParams;

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-2 text-center">Créer un compte</h1>
        <p className="text-sm text-zinc-400 text-center mb-6">
          Rejoins TradeScaleX en quelques secondes.
        </p>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-300">
            {decodeURIComponent(error)}
          </div>
        )}

        <form action={signUp} className="space-y-4">
          <input type="hidden" name="locale" value={locale} />

          <div>
            <label htmlFor="email" className="block text-xs font-medium text-zinc-400 mb-1.5">
              Email
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
              Mot de passe
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
            <p className="mt-1 text-[11px] text-zinc-500">6 caractères minimum.</p>
          </div>

          <div>
            <label htmlFor="code" className="block text-xs font-medium text-zinc-400 mb-1.5">
              Code d&apos;accès
            </label>
            <input
              id="code"
              type="text"
              name="code"
              required
              autoComplete="off"
              spellCheck={false}
              placeholder="Ex : TEST-V1-ABC123"
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:border-emerald-500 focus:outline-none transition-colors text-sm font-mono tracking-wide"
            />
            <p className="mt-1 text-[11px] text-zinc-500">Un code = un compte. Usage unique.</p>
            <p className="mt-1.5 text-[11px] text-zinc-500">
              Pas encore de code ?{" "}
              <Link
                href={`/${locale}/pricing`}
                className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
              >
                Voir les formules d&apos;accès
              </Link>
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            Créer mon compte
          </button>
        </form>

        <p className="text-sm text-zinc-500 mt-6 text-center">
          Déjà un compte ?{" "}
          <Link
            href={`/${locale}/login`}
            className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}
