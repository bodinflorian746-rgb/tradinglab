"use client";

// Error boundary brandée du segment [locale] — Next exige un Client Component
// avec les props { error, reset }. Attrape les erreurs de rendu des pages du
// segment (le layout, avec LocaleProvider, reste monté → useLocale OK).
//
// Localisation inline FR/ES/EN — même pattern que app/[locale]/page.tsx, pour
// ne créer que ce seul fichier. Palette stricte : zinc-950 + emerald-500.
// Aucun détail d'erreur affiché à l'écran (seulement loggé en console).

import { useEffect } from "react";
import Link from "next/link";
import Logo from "@/app/components/Logo";
import { localizedHref } from "@/lib/i18n/href";
import { useLocale } from "@/app/components/LocaleProvider";

const T = {
  fr: {
    title: "Une erreur est survenue",
    desc: "Quelque chose s'est mal passé de notre côté. Réessaie dans un instant.",
    retry: "Réessayer",
    home: "Retour à l'accueil",
  },
  en: {
    title: "Something went wrong",
    desc: "An unexpected error occurred on our side. Please try again in a moment.",
    retry: "Try again",
    home: "Back to home",
  },
  es: {
    title: "Se produjo un error",
    desc: "Algo salió mal de nuestro lado. Inténtalo de nuevo en un momento.",
    retry: "Reintentar",
    home: "Volver al inicio",
  },
} as const;

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useLocale();
  const t = T[locale];

  useEffect(() => {
    // Diagnostic uniquement — le détail n'est jamais montré à l'utilisateur.
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md text-center">
        <Link
          href={localizedHref("/", locale)}
          aria-label="TradeScaleX"
          className="inline-block mb-10"
        >
          <Logo size="md" />
        </Link>

        <div className="mx-auto mb-6 w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="8.2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11 6.5v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="11" cy="15" r="0.9" fill="currentColor" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">{t.title}</h1>
        <p className="text-sm text-zinc-400 leading-relaxed mb-8">{t.desc}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
          >
            {t.retry}
          </button>
          <Link
            href={localizedHref("/", locale)}
            className="inline-flex items-center justify-center border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
          >
            {t.home}
          </Link>
        </div>
      </div>
    </main>
  );
}
