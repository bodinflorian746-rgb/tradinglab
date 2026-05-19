"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { ZoneHistoireDiagram } from "@/app/components/charts/ZoneHistoireDiagram";
import { RetourDesequilibreDiagram } from "@/app/components/charts/RetourDesequilibreDiagram";
import { ScenarioZoneDiagram } from "@/app/components/charts/ScenarioZoneDiagram";

const LESSONS = [
  { id: "lecon1", title: "Pourquoi analyser en multi-timeframe", disabled: false },
  { id: "lecon2", title: "Le timeframe supérieur : le biais", disabled: false },
  { id: "lecon3", title: "Le timeframe intermédiaire : la zone", disabled: false },
  { id: "lecon4", title: "Le timeframe d’exécution : l’entrée", disabled: false },
  { id: "lecon5", title: "Le process complet", disabled: false },
];

export default function MultiTimeframeLecon3Page() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "multi-timeframe", "lecon3"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Stratégies</Link>
          <span>/</span>
          <Link href="/strategies/multi-timeframe" className="hover:text-zinc-400 transition-colors">Multi-timeframe Process</Link>
          <span>/</span>
          <span className="text-zinc-500">Leçon 3</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Intermédiaire
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">18 min</span>
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
            Le timeframe intermédiaire : repérer la zone qui compte
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Le HTF donne la direction. Le timeframe intermédiaire montre où le marché a une vraie raison de réagir.
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
              const isCurrent = lesson.id === "lecon3";
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
            <span className="ml-auto text-xs text-zinc-600">3 / 5 leçons</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-blue-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Une zone forte n&apos;est jamais une ligne tracée au hasard. C&apos;est un niveau qui empile plusieurs raisons de réagir. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prérequis</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Direction dominante HTF → cf. Leçon 2</li>
              <li>- Supports et résistances → cf. module Support/Résistance</li>
              <li>- FVG, liquidité, sweep → cf. module SMC</li>
            </ul>
          </div>

          {/* Bloc 3 — UNE ZONE DOIT RACONTER UNE HISTOIRE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Une zone doit raconter une histoire</h2>

            <div className="my-8">
              <ZoneHistoireDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Une zone d&apos;intérêt valide ne se résume pas à une ligne tracée au hasard. Une zone forte raconte une histoire : elle empile plusieurs raisons de réaction au même niveau — un ancien support devenu résistance, un FVG laissé par une impulsion, une zone de liquidité non encore prise. Plus le niveau cumule de raisons, plus la probabilité de réaction est élevée.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD H1 : 1.1760 est un ancien support cassé lors d&apos;une chute. Le prix a ensuite laissé un FVG bearish entre 1.1750 et 1.1760 dans l&apos;impulsion baissière. À la remontée actuelle, ce niveau cumule donc deux raisons : ancien support devenu résistance et FVG non mitigé. La zone concentre plusieurs raisons de réaction au même endroit.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Chercher la confluence avant de tracer une zone</li>
              <li>- Empiler les raisons : ancien S/R, FVG, liquidité, projection</li>
              <li>- Privilégier les zones qui cumulent au moins deux critères</li>
              <li>- Ignorer les niveaux isolés sans contexte technique</li>
            </ul>
          </section>

          {/* Bloc 4 — LE MARCHÉ REVIENT DANS LES ZONES FORTES */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le marché revient dans les zones fortes</h2>

            <div className="my-8">
              <RetourDesequilibreDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le marché ne monte ni ne descend en ligne droite. Après une impulsion forte, le prix revient fréquemment dans les zones de déséquilibre laissées en chemin — FVG, Order Block, mèche de rejet. Ce retour n&apos;est pas un retournement : c&apos;est une mitigation du déséquilibre avant la reprise du mouvement initial.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD H1 : impulsion bearish brutale depuis 4 680 $. Le mouvement laisse un FVG bearish entre 4 648 $ et 4 660 $. Plusieurs heures plus tard, le prix remonte progressivement dans cette bande. Au contact, la mèche traverse partiellement le FVG, puis le rejet s&apos;enclenche avec force vers le bas. Le retour dans le déséquilibre a précédé la continuation baissière.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Repérer les FVG laissés par les impulsions HTF</li>
              <li>- Attendre le retour du prix dans la zone, ne pas anticiper</li>
              <li>- Un retour n&apos;est pas un retournement — c&apos;est une mitigation</li>
              <li>- Privilégier les zones cohérentes avec le biais HTF</li>
            </ul>
          </section>

          {/* Bloc 5 — LE TIMEFRAME INTERMÉDIAIRE PRÉPARE LE SCÉNARIO */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le timeframe intermédiaire prépare le scénario</h2>

            <div className="my-8">
              <ScenarioZoneDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le timeframe intermédiaire ne sert pas à entrer — il sert à préparer le terrain. C&apos;est l&apos;étage qui transforme la direction HTF en plan exploitable. On y trace la zone, on y note les niveaux, on y prépare ce qu&apos;on attendra ensuite sur le timeframe d&apos;exécution. Le scénario est posé bien avant qu&apos;un signal apparaisse.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD H1 : biais HTF baissier, zone de résistance large entre 1.1750 et 1.1760 tracée à l&apos;avance. À l&apos;approche de la bande, les bougies haussières perdent en amplitude — les impulsions se raccourcissent, les corrections s&apos;allongent. Le marché s&apos;essouffle sans qu&apos;aucun signal d&apos;entrée n&apos;ait encore été émis. Le scénario est prêt : il ne reste qu&apos;à attendre le déclencheur sur le timeframe d&apos;exécution.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Tracer la zone AVANT que le prix l&apos;atteigne</li>
              <li>- Noter les niveaux clés en amont</li>
              <li>- Observer la perte d&apos;impulsion à l&apos;approche de la zone</li>
              <li>- Ne pas entrer sur le timeframe intermédiaire — préparer, c&apos;est tout</li>
            </ul>
          </section>

          {/* Bloc 6 — PLAN D'APPLICATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan d&apos;application : un cas EUR/USD</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le timeframe intermédiaire se lit après le HTF et avant le LTF. Voici comment poser la zone sur un cas EUR/USD — l&apos;objectif n&apos;est pas d&apos;entrer, mais de préparer le scénario.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Étape 1 — HTF (Daily/H4)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : structure en LH/LL, biais baissier déjà identifié (cf. Leçon 2)</li>
                <li>- Conclusion : direction dominante baissière, ventes prioritaires</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 2 — Timeframe intermédiaire (H1)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : ancien support à 1.1760 devenu résistance, FVG bearish 1.1750-1.1760 non mitigé</li>
                <li>- Conclusion : zone confluente à surveiller — préparer un scénario short au retour du prix</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 3 — Préparer le scénario</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Attendu : une remontée vers la bande 1.1750-1.1760, perte d&apos;impulsion à l&apos;approche, puis confirmation sur le timeframe d&apos;exécution (Leçon 4)</li>
                <li>- Évité : une entrée anticipée avant le retour effectif du prix dans la zone</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-zinc-300 italic text-center">
                  HTF = direction · Timeframe intermédiaire = zone · LTF = exécution (Leçon 4)
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "Une zone forte cumule plusieurs raisons de réaction — la confluence avant tout.",
              "Le marché revient dans les déséquilibres laissés par les impulsions HTF.",
              "Le timeframe intermédiaire prépare le scénario, il n’exécute pas.",
              "Tracer la zone avant que le prix l’atteigne — jamais après.",
            ]}
          />

          <LessonExercice
            description="Ouvre EUR/USD sur TradingView en H1 et entraîne-toi à identifier une zone qui raconte une histoire."
            steps={[
              "Repère un ancien support important sur H1 et trace-le. Vérifie s’il a été cassé puis transformé en résistance.",
              "Cherche un FVG laissé par la dernière impulsion baissière. Trace la bande complète, pas une simple ligne.",
              "Note toutes les raisons qui s’empilent sur ce niveau : ancien S/R, FVG, liquidité, projection. Si tu en cumules au moins deux, la zone raconte une histoire.",
            ]}
          />

          <LessonQuiz
            question="Qu'est-ce qui rend une zone d'intérêt particulièrement forte sur le timeframe intermédiaire ?"
            options={[
              "Le simple fait que le prix l’ait déjà touchée plusieurs fois",
              "La confluence — plusieurs raisons de réaction empilées au même niveau",
              "Sa position sur un nombre rond comme 1.1800 ou 1.2000",
              "Le fait que ce soit le plus haut ou le plus bas absolu de la journée",
            ]}
            correctIndex={1}
            explanation="Une zone forte raconte une histoire : un ancien support devenu résistance, un FVG laissé par une impulsion, une zone de liquidité non encore prise. Plus le niveau cumule de raisons, plus la probabilité de réaction est élevée. Un simple toucher répété, un nombre rond ou un extrême journalier ne suffisent pas seuls — c'est l'empilement de critères techniques qui crée une zone vraiment exploitable."
            answerExplanations={[
              "Incorrect. Un niveau touché plusieurs fois retient l'attention, mais sans contexte (ancien S/R, FVG, liquidité), il reste fragile. Le nombre de touchers ne crée pas de confluence à lui seul.",
              "Correct. La confluence — l'empilement de plusieurs raisons de réaction au même endroit — est le critère central. Plus la zone cumule d'arguments techniques, plus la probabilité de réaction est forte.",
              "Incorrect. Les nombres ronds attirent l'attention psychologique des participants, mais ne créent pas, à eux seuls, une zone d'intérêt institutionnelle. Sans confluence technique réelle, ce sont des niveaux faibles.",
              "Incorrect. Le plus haut ou plus bas du jour n'est qu'une référence statistique. Sans alignement avec une zone structurelle, un FVG ou de la liquidité, ce niveau ne raconte aucune histoire exploitable.",
            ]}
          />

        </div>

        {/* Footer */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "multi-timeframe", "lecon3");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Leçon 3 du module Multi-timeframe Process complétée.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/multi-timeframe/lecon2" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon précédente
              </Link>
              <Link href="/strategies/multi-timeframe/lecon4" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                Leçon suivante
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
