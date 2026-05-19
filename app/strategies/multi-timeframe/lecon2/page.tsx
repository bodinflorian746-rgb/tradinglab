"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { ContreTendanceTrapDiagram } from "@/app/components/charts/ContreTendanceTrapDiagram";
import { DirectionDominanteDiagram } from "@/app/components/charts/DirectionDominanteDiagram";
import { HTFFilterDiagram } from "@/app/components/charts/HTFFilterDiagram";

const LESSONS = [
  { id: "lecon1", title: "Pourquoi analyser en multi-timeframe", disabled: false },
  { id: "lecon2", title: "Le timeframe supérieur : le biais", disabled: false },
  { id: "lecon3", title: "Le timeframe intermédiaire : la zone", disabled: false },
  { id: "lecon4", title: "Le timeframe d'exécution : l'entrée", disabled: false },
  { id: "lecon5", title: "Le process complet", disabled: false },
];

export default function MultiTimeframeLecon2Page() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "multi-timeframe", "lecon2"));
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
          <span className="text-zinc-500">Leçon 2</span>
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
            Le timeframe supérieur : définir la direction dominante
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Le timeframe supérieur construit le contexte avant toute exécution : il identifie la direction dominante, repère les zones importantes et montre où le marché pousse réellement. Il ne sert pas à entrer en position — il sert à éviter les trades pris contre la tendance de fond.
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
            <span className="ml-auto text-xs text-zinc-600">2 / 5 leçons</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-blue-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Le M5 montre une bougie. Le HTF, lui, montre la direction réelle du marché. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prérequis</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Lecture multi-timeframe → cf. Leçon 1</li>
              <li>- Structure de marché, HH/HL et LH/LL → cf. module SMC</li>
              <li>- Supports et résistances HTF → cf. module Support/Résistance</li>
            </ul>
          </div>

          {/* Bloc 3 — LE PIÈGE DE LA CONTRE-TENDANCE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le piège de la contre-tendance</h2>

            <div className="my-8">
              <ContreTendanceTrapDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Un setup propre sur M15 peut échouer pour une seule raison : il va contre la direction dominante du HTF. Le petit timeframe montre souvent un simple retracement local. Le timeframe supérieur, lui, montre si le marché pousse réellement vers le haut... ou vers le bas.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD : le Daily est baissier, avec une résistance Daily/H4 à 1.1760 et un prix actuel à 1.1715. Sur M15, un breakout haussier se forme à 1.1740. Le prix monte jusqu&apos;à 1.1752... puis se fait violemment rejeter vers 1.1685. Le breakout M15 existait bien — le problème venait de la tendance de fond, restée vendeuse.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Vérifier la direction HTF avant toute entrée</li>
              <li>- Une impulsion locale n&apos;est pas un retournement global</li>
              <li>- Éviter les achats contre une tendance baissière claire</li>
              <li>- Observer quelle direction produit les impulsions les plus fortes</li>
            </ul>
          </section>

          {/* Bloc 4 — LIRE LA DIRECTION DOMINANTE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Lire la direction dominante</h2>

            <div className="my-8">
              <DirectionDominanteDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La direction dominante se lit dans la qualité des impulsions et des corrections. Le but n&apos;est pas de compter les bougies — c&apos;est d&apos;observer quelle direction contrôle réellement le marché.
            </p>

            <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 mb-6">
              <p className="text-white font-semibold text-sm mb-2">Ce qu&apos;il faut regarder</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Impulsions haussières vs baissières</li>
                <li>- Force des rejets</li>
                <li>- Vitesse des déplacements</li>
                <li>- Taille des corrections</li>
              </ul>
            </div>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD : les corrections haussières en M15 sont lentes, mais les chutes en H4 sont agressives — de l&apos;ordre de 35 à 40 $ — avec des rejets systématiques sous 4 680 $. Le marché reste baissier malgré plusieurs rebonds locaux.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Comparer impulsions et corrections</li>
              <li>- Observer quelle direction « écrase » l&apos;autre</li>
              <li>- Prioriser les setups dans le sens de la tendance dominante</li>
              <li>- Ne pas confondre un rebond et un retournement</li>
            </ul>
          </section>

          {/* Bloc 5 — LE HTF SERT À FILTRER */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le HTF sert à filtrer</h2>

            <div className="my-8">
              <HTFFilterDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le HTF élimine les setups faibles avant même de chercher une entrée. Le trader ne cherche pas « un trade » — il cherche un trade aligné avec la direction dominante.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD : le Daily est baissier, la résistance Daily/H4 est à 1.1760, le prix actuel à 1.1715. Ce qui est recherché : un retour vers 1.1760, un rejet local, puis une continuation baissière. Ce qui est évité : un achat impulsif placé directement sous la résistance HTF.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Commencer toujours par le HTF</li>
              <li>- Identifier la direction dominante avant le setup</li>
              <li>- Noter les zones HTF avant de descendre de timeframe</li>
              <li>- Filtrer les trades pris contre la tendance</li>
            </ul>
          </section>

          {/* Bloc 6 — PLAN D'APPLICATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan d&apos;application : un cas EUR/USD</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le HTF se lit du plus grand vers le plus petit. Voici la séquence sur un cas EUR/USD — sans chercher d&apos;entrée, l&apos;objectif est seulement de poser le contexte.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Étape 1 — Daily</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : structure en LH/LL, résistance Daily à 1.1760, impulsions baissières plus fortes que les rebonds</li>
                <li>- Conclusion : direction dominante baissière, priorité aux ventes</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 2 — H4</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : zone de résistance entre 1.1750 et 1.1760, rejets répétés sous la résistance</li>
                <li>- Conclusion : zone idéale pour attendre une réaction baissière</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 3 — Préparer le scénario</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Attendu : une remontée vers la résistance, un rejet local, puis une confirmation plus tard sur le timeframe d&apos;exécution</li>
                <li>- Évité : un achat impulsif contre la tendance Daily</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-zinc-300 italic text-center">
                  Daily = direction dominante · H4 = zone de réaction · LTF = exécution (Leçon 4)
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "Le HTF définit la direction dominante du marché.",
              "Une impulsion locale ne change pas forcément la tendance de fond.",
              "Les impulsions les plus fortes montrent qui contrôle réellement le marché.",
              "Le HTF sert à filtrer les mauvais trades avant de chercher une entrée.",
            ]}
          />

          <LessonExercice
            description="Ouvre EUR/USD sur TradingView et apprends à reconnaître la vraie tendance du marché avant toute exécution."
            steps={[
              "Sur Daily : identifie la structure dominante, compare la force des impulsions et des corrections, et détermine la direction principale du marché.",
              "Passe ensuite sur H4 : repère une zone HTF importante et note où le marché pourrait réagir.",
              "Écris enfin la direction dominante, les setups à privilégier et les setups à éviter.",
            ]}
          />

          <LessonQuiz
            question="Quel élément permet le mieux d'identifier la direction dominante du marché ?"
            options={[
              "Le nombre total de bougies vertes",
              "Les impulsions les plus fortes et les rejets dominants",
              "Le timeframe M1 uniquement",
              "Une seule bougie impulsive isolée",
            ]}
            correctIndex={1}
            explanation="La direction dominante se lit dans la qualité des impulsions et des réactions, pas dans le nombre de bougies. Un marché baissier produit en général des chutes rapides, des corrections faibles et des rejets vendeurs agressifs. Le M1 ne montre que du bruit, et une bougie isolée ne suffit jamais à définir une tendance durable : c'est la force comparée des mouvements qui révèle quelle direction contrôle réellement le marché."
          />

        </div>

        {/* Footer */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "multi-timeframe", "lecon2");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Leçon 2 du module Multi-timeframe Process complétée.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/multi-timeframe/lecon1" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon précédente
              </Link>
              <Link href="/strategies/multi-timeframe/lecon3" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
