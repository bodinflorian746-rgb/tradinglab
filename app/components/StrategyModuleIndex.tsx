// Composant serveur générique pour les pages index de module stratégie.
// Branche tout le contenu sur dict.strategies.modules[moduleId] et
// dict.strategies.page.levels. Les 8 pages /strategies/{module}/page.tsx
// l'utilisent au lieu d'avoir leur propre LESSONS array hardcodée.

import Link from "next/link";
import { STRATEGY_MODULES, type StrategyLevel } from "@/lib/strategies";
import { type Locale } from "@/i18n/config";
import { localizedHref } from "@/lib/i18n/href";
import { getDictionary } from "@/i18n/dictionaries";

const LEVEL_CLASSES: Record<StrategyLevel, string> = {
  debutant:      "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  intermediaire: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  avance:        "bg-amber-400/10 text-amber-400 border border-amber-400/20",
};

export async function StrategyModuleIndex({
  moduleId,
  locale,
}: {
  moduleId: keyof Awaited<ReturnType<typeof getDictionary<"strategies">>>["modules"];
  locale: Locale;
}) {
  const meta = STRATEGY_MODULES.find((m) => m.id === moduleId);
  if (!meta) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white px-6 py-12">
        <p className="text-zinc-400">Unknown module: {moduleId}</p>
      </main>
    );
  }

  const sdict = await getDictionary(locale, "strategies");
  const mod = sdict.modules[moduleId];
  const lvlLabel = sdict.page.levels[meta.level].label;
  const badgeClass = LEVEL_CLASSES[meta.level];
  const breadcrumb = sdict.page.breadcrumb;

  const lessonIds = Array.from({ length: meta.lessonCount }, (_, i) => `lecon${i + 1}` as const);

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">

        <nav className="flex items-center gap-2 text-sm text-zinc-600 mb-8">
          <Link href={localizedHref("/strategies", locale)} className="hover:text-zinc-400 transition-colors">
            {breadcrumb}
          </Link>
          <span>/</span>
          <span className="text-zinc-400">{mod.title}</span>
        </nav>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <h1 className="text-4xl md:text-5xl font-bold">{mod.title}</h1>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${badgeClass}`}>
              {lvlLabel}
            </span>
          </div>
          <p className="text-zinc-400 text-lg max-w-2xl leading-relaxed">
            {mod.subtitle}
          </p>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="divide-y divide-zinc-800/60">
            {lessonIds.map((lid, i) => {
              const lesson = (mod.lessons as Record<string, { title: string; description: string; duration: string } | undefined>)[lid];
              if (!lesson) return null;
              const number = i + 1;
              const href = `/strategies/${moduleId}/${lid}`;
              return (
                <Link
                  key={lid}
                  href={localizedHref(href, locale)}
                  className="block hover:bg-zinc-800/40 transition-colors"
                >
                  <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        {number}
                      </div>
                      <div className="min-w-0">
                        <span className="text-sm font-medium text-white block">{lesson.title}</span>
                        {lesson.description && (
                          <span className="text-xs text-zinc-500 mt-0.5 block">{lesson.description}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {lesson.duration && (
                        <span className="text-xs text-zinc-700">{lesson.duration}</span>
                      )}
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="text-emerald-400">
                        <path d="M5.5 10.5l4-4-4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </main>
  );
}

