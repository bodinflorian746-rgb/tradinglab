// Page de confirmation après demande du code 48h (requestTrialCode).
// Affichée quand l'utilisateur a cliqué "48h gratuit" : on lui a envoyé un
// code par email, on l'invite à le saisir sur /activer-code.
// Bilingue FR/ES via le dictionnaire common (clé codeSent).

import Link from "next/link";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default async function CodeSentPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ email?: string }>;
}) {
  const raw = (await params).locale;
  const locale: Locale = hasLocale(raw) ? raw : DEFAULT_LOCALE;
  const { email } = await searchParams;
  const t = (await getDictionary(locale, "common")).codeSent;

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-3">{t.title}</h1>

        <p className="text-sm text-zinc-400 leading-relaxed mb-1">{t.body}</p>
        {email && (
          <p className="text-sm font-semibold text-white mb-4 break-all">{email}</p>
        )}
        <p className="text-[12px] text-zinc-500 leading-relaxed mb-7">{t.hint}</p>

        <Link
          href={`/${locale}/activer-code`}
          className="block w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold py-3 rounded-xl transition-colors text-sm mb-3"
        >
          {t.ctaActivate}
        </Link>

        {/* TODO V2 : bouton "Renvoyer le code" (renvoi du mail Resend). */}

        <Link
          href={`/${locale}`}
          className="block text-sm text-zinc-400 hover:text-emerald-300 underline underline-offset-4 transition-colors"
        >
          {t.backHome}
        </Link>
      </div>
    </main>
  );
}
