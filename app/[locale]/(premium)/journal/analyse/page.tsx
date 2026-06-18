// Page "Mon Analyse" (V0.3) — Centre d'Analyse du Trader.
// 100% mock (lib/journal/analysis-mock.ts) : test de perception de valeur.
// Aucune lecture Supabase, aucun calcul, aucune IA.

import Link from "next/link";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizedHref } from "@/lib/i18n/href";
import { MOCK_ANALYSIS } from "@/lib/journal/analysis-mock";
import { AnalysisView } from "../_components/analysis/AnalysisView";

export default async function AnalysePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const raw = (await params).locale;
  const locale: Locale = hasLocale(raw) ? raw : DEFAULT_LOCALE;
  const t = await getDictionary(locale, "journal");
  const a = MOCK_ANALYSIS;

  return (
    <main className="min-h-screen text-white">
      <div
        className="absolute inset-x-0 top-0 -z-10 h-[420px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(16,185,129,0.10) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-4xl mx-auto px-5 sm:px-6 py-10 md:py-14">
        {/* En-tête */}
        <div className="mb-8">
          <Link
            href={localizedHref("/journal", locale)}
            className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors mb-4"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t.analysis.back}
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{t.analysis.nav}</h1>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-amber-300 bg-amber-400/10 border border-amber-400/30 rounded-full px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              {t.analysis.demoBadge}
            </span>
          </div>
        </div>

        <AnalysisView a={a} t={t} />
      </div>
    </main>
  );
}
