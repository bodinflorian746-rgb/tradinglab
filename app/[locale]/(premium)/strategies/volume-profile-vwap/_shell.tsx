"use client";

// Gabarit des 4 leçons de la stratégie Volume Profile + VWAP : même en-tête (fil d'Ariane, badge,
// pastilles, « N / 4 leçons »), même bloc de citation, mêmes prérequis et même pied (leçon terminée,
// navigation) que les autres modules de stratégie. Leçons en français seulement (site FR) : toutes les
// locales affichent ce contenu.

import Link from "next/link";
import { useState, useEffect, type ReactNode } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LESSON_STEPS_FR } from "@/lib/lessons/exercises";

const MODULE = "volume-profile-vwap";
const MODULE_TITLE = "Volume Profile + VWAP";

export const LESSONS = [
  { id: "lecon1", title: "Construire son plan avec le Volume Profile" },
  { id: "lecon2", title: "Filtrer les opportunités avec le VWAP" },
  { id: "lecon3", title: "Confirmer son entrée" },
  { id: "lecon4", title: "Exécuter et gérer un trade complet" },
];

export function StrategyLesson({ n, duration, title, lead, quote, prereqs, children }: {
  n: number;
  duration: string;
  title: string;
  lead: string;
  quote: string;
  prereqs: { label: string; href: string; ref: string }[];
  children: ReactNode;
}) {
  const id = `lecon${n}`;
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), MODULE, id));
  }, [id]);

  const prev = n > 1 ? `/strategies/${MODULE}/lecon${n - 1}` : null;
  const next = n < LESSONS.length ? `/strategies/${MODULE}/lecon${n + 1}` : null;

  return (
    <main className="tsx-v2 tsx-v2--soft lesson-v2 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Stratégies</Link>
          <span>/</span>
          <Link href={`/strategies/${MODULE}`} className="hover:text-zinc-400 transition-colors">{MODULE_TITLE}</Link>
          <span>/</span>
          <span className="text-zinc-500">Leçon {n}</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
              Avancé
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">{duration}</span>
            {done && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <path d="M1 4.5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Terminée
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold leading-tight mb-4">{title}</h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">{lead}</p>
          </div>

          <div className="mt-5 flex items-center gap-2 text-xs text-zinc-600">
            {LESSON_STEPS_FR.map((step, i, arr) => (
              <span key={step} className="flex items-center gap-2">
                <span>{step}</span>
                {i < arr.length - 1 && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-zinc-800 shrink-0">
                    <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-2 flex-wrap">
            {LESSONS.map((lesson) => {
              const isCurrent = lesson.id === id;
              return (
                <div key={lesson.id}>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                    isCurrent ? "bg-zinc-800 border-zinc-600 text-white" : "border-zinc-800 text-zinc-500"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? "bg-white" : "bg-zinc-600"}`} />
                    {isCurrent ? (
                      <>
                        <span className="md:hidden">Leçon {lesson.id.replace("lecon", "")}</span>
                        <span className="hidden md:inline">{lesson.title}</span>
                      </>
                    ) : (
                      lesson.title
                    )}
                  </span>
                </div>
              );
            })}
            <span className="ml-auto text-xs text-zinc-600">{n} / {LESSONS.length} leçons</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-amber-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">« {quote} »</p>
            </div>
          </section>

          {/* PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prérequis</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              {prereqs.map((r) => (
                <li key={r.href + r.label}>
                  - {r.label} → <Link href={r.href} className="text-amber-400 hover:text-amber-300 underline underline-offset-2">{r.ref}</Link>
                </li>
              ))}
            </ul>
          </div>

          {children}

        </div>

        {/* Footer */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, MODULE, id);
                  setDone(true);
                }}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-zinc-950 font-semibold py-3.5 rounded-xl transition-all duration-150 shadow-lg shadow-emerald-500/10"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l3.5 3.5 6.5-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Marquer la leçon comme terminée
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-5 py-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-emerald-400">
                    <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-400">Leçon terminée</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Leçon {n} du module {MODULE_TITLE} complétée.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href={prev ?? `/strategies/${MODULE}`} className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {prev ? "Leçon précédente" : `Module ${MODULE_TITLE}. Vue d'ensemble`}
              </Link>
              <Link href={next ?? `/strategies/${MODULE}`} className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                {next ? "Leçon suivante" : "Retour au module"}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M6 4l4 3-4 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}

/** Section de la leçon : titre, graphique facultatif, contenu */
export function Block({ title, chart, children }: { title: string; chart?: ReactNode; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-white mb-3">{title}</h2>
      {chart && <div className="my-8">{chart}</div>}
      {children}
    </section>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p className="text-zinc-300 leading-relaxed text-sm mb-4">{children}</p>;
}

/** Encadré « Exemple concret » */
export function Example({ title = "Exemple concret", children }: { title?: string; children: ReactNode }) {
  return (
    <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
      <p className="text-white font-semibold text-sm mb-2">{title}</p>
      <div className="text-sm text-zinc-300 leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

/** Liste à tirets, avec un intitulé facultatif */
export function Points({ title, items }: { title?: string; items: ReactNode[] }) {
  return (
    <>
      {title && <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">{title}</p>}
      <ul className="space-y-1 text-sm text-zinc-300 mb-4">
        {items.map((x, i) => <li key={i}>- {x}</li>)}
      </ul>
    </>
  );
}

/** Erreurs à éviter : cartes en grille */
export function Mistakes({ title, items }: { title: string; items: { name: string; text: string }[] }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-white mb-3">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((m, i) => (
          <div key={m.name} className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm">
            <span className="text-white font-semibold">Erreur {i + 1} : {m.name}</span> <span className="text-zinc-300">{m.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
