"use client";

// Page 404 brandée du segment [locale] — rendue par Next pour toute route
// introuvable sous /[locale]/*.
//
// Client Component : les pages `not-found` ne reçoivent PAS `params`, donc la
// locale est lue via useLocale() (LocaleProvider, monté par [locale]/layout.tsx
// qui wrappe aussi le not-found). useLocale a un fallback sûr (DEFAULT_LOCALE).
//
// Localisation inline FR/ES/EN — même pattern que app/[locale]/page.tsx (objet
// T), pour ne créer que ce seul fichier. Palette stricte : zinc-950 + emerald-500.

import Link from "next/link";
import Logo from "@/app/components/Logo";
import { localizedHref } from "@/lib/i18n/href";
import { useLocale } from "@/app/components/LocaleProvider";

const T = {
  fr: {
    title: "Page introuvable",
    desc: "La page que tu cherches n'existe pas ou a été déplacée.",
    cta: "Retour aux formations",
  },
  en: {
    title: "Page not found",
    desc: "The page you're looking for doesn't exist or has been moved.",
    cta: "Back to courses",
  },
  es: {
    title: "Página no encontrada",
    desc: "La página que buscas no existe o ha sido movida.",
    cta: "Volver a las formaciones",
  },
} as const;

export default function NotFound() {
  const locale = useLocale();
  const t = T[locale];

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

        <p className="text-6xl sm:text-7xl font-bold text-emerald-500 mb-4 tabular-nums">
          404
        </p>
        <h1 className="text-2xl font-bold text-white mb-3">{t.title}</h1>
        <p className="text-sm text-zinc-400 leading-relaxed mb-8">{t.desc}</p>

        <Link
          href={localizedHref("/formations", locale)}
          className="inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
        >
          {t.cta}
        </Link>
      </div>
    </main>
  );
}
