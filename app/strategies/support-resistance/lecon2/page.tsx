"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { SupportResistance } from "@/app/components/charts/SupportResistance";
import { ConfluenceDiagram } from "@/app/components/charts/ConfluenceDiagram";
import SRQualificationChecklistDiagram from "@/app/components/charts/SRQualificationChecklistDiagram";
import SRHierarchyDiagram from "@/app/components/charts/SRHierarchyDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Support et résistance : les zones où le marché réagit", disabled: false },
  { id: "lecon2", title: "Identifier un vrai niveau (vs une ligne tracée au hasard)", disabled: false },
  { id: "lecon3", title: "Leçon 3",          disabled: true },
  { id: "lecon4", title: "Leçon 4",          disabled: true },
];

export default function SupportResistanceLecon2Page() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "support-resistance", "lecon2"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Stratégies</Link>
          <span>/</span>
          <Link href="/strategies/support-resistance" className="hover:text-zinc-400 transition-colors">Support / Résistance &amp; Range</Link>
          <span>/</span>
          <span className="text-zinc-500">Leçon 2</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Débutant
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">15 min</span>
            {done && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <path d="M1 4.5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Terminée
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold leading-tight mb-4">
            Identifier un vrai niveau (vs une ligne tracée au hasard)
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Cette leçon enseigne à distinguer un vrai niveau d&apos;une ligne décorative via 4 critères de qualification, la hiérarchie multi-timeframe, et la recherche de confluences.
            </p>
          </div>

          <div className="mt-5 flex items-center gap-2 text-xs text-zinc-600">
            {["Lecture", "À retenir", "Exercice", "Quiz"].map((step, i, arr) => (
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
              const isCurrent = lesson.id === "lecon2";
              return (
                <div key={lesson.id}>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                    isCurrent
                      ? "bg-zinc-800 border-zinc-600 text-white"
                      : lesson.disabled
                      ? "border-zinc-800/50 text-zinc-700"
                      : "border-zinc-800 text-zinc-500"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? "bg-white" : lesson.disabled ? "bg-zinc-700" : "bg-zinc-600"}`} />
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
            <span className="ml-auto text-xs text-zinc-600">2 / 4 leçons</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Toutes les zones tracées ne se valent pas. Qualifier un vrai niveau, c&apos;est savoir lequel mérite un setup et lequel reste décoratif. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prérequis</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Identification zones S/R → cf. Stratégie SR L1</li>
              <li>- Notion de confluence → cf. Formation Trading L3</li>
              <li>- Timeframes → cf. Formation Trading L1</li>
            </ul>
          </div>

          {/* Bloc 3 — 4 CRITÈRES DE QUALIFICATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4 critères de qualification</h2>

            <div className="my-8">
              <SRQualificationChecklistDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Une zone tradable doit valider 4 critères chiffrés appliqués séquentiellement. Une zone qui n&apos;en valide que 2 ou 3 reste à surveiller sans constituer une priorité opérationnelle.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Touches multiples : ≥ 2 touches confirmées, idéalement 3 pour confiance élevée</li>
              <li>- Réactions claires : rebond ≥ 1% sur EUR/USD ou 25-50$ sur XAU/USD à chaque touche</li>
              <li>- Fraîcheur : zone touchée dans les 30 derniers jours = mémoire collective forte</li>
              <li>- Confluence avec niveau rond, Fibonacci, MM ou Order Block = priorité</li>
            </ul>
          </section>

          {/* Bloc 4 — LA CONFLUENCE RENFORCE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">La confluence renforce</h2>

            <div className="my-8">
              <ConfluenceDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La force d&apos;une zone augmente lorsqu&apos;elle coïncide avec d&apos;autres éléments structurels. Une zone à 2 confluences ou plus devient prioritaire.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Confluence Fibonacci 0.5 / 0.618 / 0.786 = zone respectée par les institutionnels</li>
              <li>- Confluence MM50 ou MM200 (Daily ou H4) = niveau dynamique défendu</li>
              <li>- Confluence niveau rond psychologique (1.1800, 4 500$) = mémoire émotionnelle</li>
              <li>- 3 confluences ou plus = vrai niveau majeur, sélection prioritaire</li>
            </ul>
          </section>

          {/* Bloc 5 — HIÉRARCHIE MULTI-TIMEFRAME */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Hiérarchie multi-timeframe</h2>

            <div className="my-8">
              <SRHierarchyDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La force d&apos;un niveau dépend aussi du timeframe sur lequel il est tracé. Plus le timeframe est élevé, plus la zone est défendue institutionnellement.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Daily = niveau majeur, référence prioritaire pour la sélection des setups</li>
              <li>- H4 = niveau secondaire, zone de trade principale en alignement avec Daily</li>
              <li>- H1 = niveau intermédiaire, sert pour l&apos;approche et l&apos;observation</li>
              <li>- M15/M30 = niveau marginal, utilisé uniquement pour le timing au contact d&apos;un niveau supérieur</li>
            </ul>
          </section>

          <LessonKeyPoints
            points={[
              "Une zone tradable valide 4 critères : 2 touches minimum, réactions claires, fraîcheur récente, confluence avec d’autres éléments structurels.",
              "Hiérarchie de force par timeframe : Daily > H4 > H1 > M30/M15.",
              "Les confluences (niveau rond, Fibonacci, MM, Order Block) multiplient la force. 2 confluences ou plus = priorité.",
              "Un niveau M15 isolé ne tient pas seul. Il sert au timing d’entrée au contact d’un niveau supérieur.",
            ]}
          />

          <LessonExercice
            description="Une zone de résistance EUR/USD entre 1.1880 et 1.1900 a été touchée 2 fois dans les 8 dernières semaines avec rejets nets (mèches de 30 à 40 pips). Le niveau psychologique 1.1900 est au sommet de la zone. La MM50 H4 passe actuellement à 1.1875. Quel est le verdict de qualification ?"
            steps={[
              "Critère 1 — Touches : 2 touches confirmées dans les 8 dernières semaines = minimum requis validé",
              "Critère 2 — Réactions : rejets nets avec mèches de 30 à 40 pips = réactions claires proportionnées",
              "Critère 3 — Fraîcheur : zone touchée dans les 8 dernières semaines = fraîcheur acceptable",
              "Critère 4 — Confluences : niveau psychologique 1.1900 au sommet de la zone (confluence 1) + MM50 H4 à 1.1875 dans la zone (confluence 2) = 2 confluences identifiées",
              "Verdict : zone tradable confirmée. 3 critères validés franchement + 2 confluences. Note opérationnelle élevée. La zone entre dans la sélection prioritaire pour un setup short sur retracement avec signal de rejet confirmé",
            ]}
          />

          <LessonQuiz
            question="Une zone visible uniquement sur M15, touchée 2 fois dans la dernière journée, sans alignement avec H4 ou Daily, peut-elle constituer une référence principale pour un setup ?"
            options={[
              "Oui, 2 touches suffisent quel que soit le timeframe",
              "Non, les niveaux M15 isolés servent uniquement au timing d’entrée au contact d’un niveau supérieur",
              "Oui, à condition qu’il y ait une confluence Fibonacci",
              "Non, il faut minimum 5 touches sur M15",
            ]}
            correctIndex={1}
            explanation="Les niveaux M15 isolés ont une durée de vie réduite et peuvent être ignorés ou cassés par le marché sans réelle contestation. La hiérarchie par timeframe place Daily > H4 > H1 > M30/M15. Un niveau M15 sert uniquement comme point de timing d’entrée au contact d’une zone supérieure, jamais comme référence principale, même avec 2 touches récentes."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "support-resistance", "lecon2");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Leçon 2 du module Support / Résistance &amp; Range complétée.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/support-resistance/lecon1" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon 1
              </Link>
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Leçon 3 — À venir
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-600 border border-zinc-700">
                  Bientôt
                </span>
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
