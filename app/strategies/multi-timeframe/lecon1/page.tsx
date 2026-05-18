"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { SingleTimeframeTrapDiagram } from "@/app/components/charts/SingleTimeframeTrapDiagram";
import { HTFBiasDiagram } from "@/app/components/charts/HTFBiasDiagram";
import { IntermediateZoneDiagram } from "@/app/components/charts/IntermediateZoneDiagram";
import { LTFExecutionDiagram } from "@/app/components/charts/LTFExecutionDiagram";

const LESSONS = [
  { id: "lecon1", title: "Pourquoi analyser en multi-timeframe", disabled: false },
  { id: "lecon2", title: "Le timeframe supérieur : le biais", disabled: true },
  { id: "lecon3", title: "Le timeframe intermédiaire : la zone", disabled: true },
  { id: "lecon4", title: "Le timeframe d’exécution : l’entrée", disabled: true },
  { id: "lecon5", title: "Le process complet", disabled: true },
];

export default function MultiTimeframeLecon1Page() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "multi-timeframe", "lecon1"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Stratégies</Link>
          <span>/</span>
          <Link href="/strategies/multi-timeframe" className="hover:text-zinc-400 transition-colors">Multi-timeframe Process</Link>
          <span>/</span>
          <span className="text-zinc-500">Leçon 1</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Intermédiaire
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">16 min</span>
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
            Pourquoi analyser en multi-timeframe
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Cette leçon pose la logique du multi-timeframe : pourquoi trader un seul graphique rend aveugle, et le rôle concret de chaque étage — le timeframe supérieur donne le biais, le timeframe intermédiaire localise la zone, le timeframe d&apos;exécution déclenche l&apos;entrée.
            </p>
          </div>

          {/* Indicateur de structure */}
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

          {/* Pills des leçons */}
          <div className="mt-6 flex items-center gap-2 flex-wrap">
            {LESSONS.map((lesson) => {
              const isCurrent = lesson.id === "lecon1";
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
            <span className="ml-auto text-xs text-zinc-600">1 / 5 leçons</span>
          </div>
        </header>

        {/* ── Contenu ── */}
        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-blue-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Un setup parfait sur M15 peut devenir un piège complet si le Daily raconte l&apos;histoire inverse. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prérequis</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Tendances et lecture de graphique → cf. Formations Trading</li>
              <li>- Structure de marché, BOS et CHoCH → cf. module SMC, Leçon 2</li>
              <li>- Supports, résistances et zones clés → cf. module Support/Résistance</li>
            </ul>
          </div>

          {/* Bloc 3 — LE PIÈGE DU GRAPHIQUE UNIQUE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le piège du graphique unique</h2>

            <div className="my-8">
              <SingleTimeframeTrapDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Un seul timeframe ne montre qu&apos;une partie du marché, jamais l&apos;ensemble. Un graphique M15 peut afficher un rebond propre alors que le Daily reste dans une tendance baissière lourde. Le résultat : un « achat évident » sur le petit timeframe se transforme en simple retracement avant la reprise baissière.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD : le Daily affiche une structure baissière en LH/LL, avec une résistance majeure autour de 1.1820. Sur M15, un breakout haussier local se forme vers 1.1760. Le prix monte jusqu&apos;à 1.1775 — puis replonge vers 1.1700. Le signal M15 était techniquement valide ; le problème venait du contexte HTF.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Toujours vérifier le sens du HTF avant d&apos;entrer</li>
              <li>- Un signal LTF contre le HTF = probabilité réduite</li>
              <li>- Le petit timeframe montre souvent un retracement, pas un retournement</li>
              <li>- Le contexte HTF prime sur le signal local</li>
            </ul>
          </section>

          {/* Bloc 4 — HTF : TROUVER LE BIAIS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le timeframe supérieur : trouver le biais</h2>

            <div className="my-8">
              <HTFBiasDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le HTF répond à une seule question : dans quel sens le marché a-t-il statistiquement le plus de chances de continuer ? Il ne sert pas à entrer — il sert à filtrer les mauvais trades avant même de chercher un setup.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-2">Ce qu&apos;il faut regarder</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Structure du marché : HH/HL ou LH/LL</li>
                  <li>- Zones Daily et H4 importantes</li>
                  <li>- Direction des impulsions dominantes</li>
                  <li>- Liquidité HTF visible</li>
                </ul>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-2">Ce qu&apos;il faut en conclure</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Biais haussier = priorité aux achats</li>
                  <li>- Biais baissier = priorité aux ventes</li>
                  <li>- Zone HTF proche = prudence</li>
                  <li>- Marché sans structure claire = éviter les setups agressifs</li>
                </ul>
              </div>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Commencer toujours par le HTF</li>
              <li>- Identifier une direction avant de chercher une entrée</li>
              <li>- Ignorer les signaux opposés au biais principal</li>
              <li>- Noter les zones HTF avant de descendre de timeframe</li>
            </ul>
          </section>

          {/* Bloc 5 — TIMEFRAME INTERMÉDIAIRE : ZONE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le timeframe intermédiaire : trouver la zone</h2>

            <div className="my-8">
              <IntermediateZoneDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le timeframe intermédiaire localise la zone où le marché peut réagir. C&apos;est l&apos;étage qui transforme une idée générale du HTF en scénario exploitable. Le HTF dit « vendre » ; le timeframe intermédiaire dit « où ».
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-2">Ce qu&apos;il faut chercher</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Support / résistance H1 ou H4</li>
                  <li>- Order Block ou FVG</li>
                  <li>- Zone de liquidité</li>
                  <li>- Retest après une impulsion</li>
                </ul>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-2">Ce qu&apos;il faut faire</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Attendre le retour du prix dans la zone</li>
                  <li>- Préparer le scénario avant l&apos;entrée</li>
                  <li>- Éviter les entrées « au milieu du vide »</li>
                </ul>
              </div>
            </div>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD : le HTF est baissier. Sur H1, une zone de résistance se dessine entre 1.1765 et 1.1780. Le prix y revient — on surveille alors un signal vendeur sur le LTF.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Travailler depuis des zones précises</li>
              <li>- Attendre le retour du prix dans la zone</li>
              <li>- Préparer le scénario avant le déclenchement</li>
              <li>- Une zone HTF + H1 alignée = réaction plus propre</li>
            </ul>
          </section>

          {/* Bloc 6 — LTF : EXÉCUTION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le timeframe d&apos;exécution : déclencher le trade</h2>

            <div className="my-8">
              <LTFExecutionDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le LTF sert uniquement à exécuter. C&apos;est le timeframe du timing, pas celui du biais. Son rôle est de montrer que le marché réagit réellement dans la zone préparée sur les timeframes supérieurs.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-2">Ce qu&apos;il faut chercher</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- CHoCH ou BOS local</li>
                  <li>- Rejet violent</li>
                  <li>- Sweep de liquidité</li>
                  <li>- Bougie impulsive de sortie de zone</li>
                </ul>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-2">Ce qu&apos;il faut faire</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Entrer après confirmation</li>
                  <li>- Placer le SL derrière la structure locale</li>
                  <li>- Exécuter dans le sens du HTF</li>
                </ul>
              </div>
            </div>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD : la zone H1 est à 1.1765-1.1780. Sur M15, un sweep haussier va chercher la liquidité jusqu&apos;à 1.1778. Un CHoCH baissier se forme sur M5. L&apos;entrée short se déclenche après le rejet.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Le LTF sert au timing, pas au contexte</li>
              <li>- Attendre une réaction claire dans la zone</li>
              <li>- Éviter les entrées anticipées</li>
              <li>- Exécuter uniquement dans le sens préparé par le HTF</li>
            </ul>
          </section>

          {/* Bloc 7 — PROCESS COMPLET (sans SVG) */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le process complet : un trade EUR/USD étape par étape</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Mis bout à bout, les trois étages forment un entonnoir : le contexte réduit les possibilités, puis le timing affine l&apos;exécution. Voici la séquence complète sur un cas EUR/USD.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Étape 1 — HTF (H4)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : structure baissière en LH/LL, résistance importante à 1.1780, prix actuel à 1.1725</li>
                <li>- Conclusion : priorité aux ventes, aucun achat agressif recherché</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 2 — Timeframe intermédiaire (H1)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : zone de résistance entre 1.1765 et 1.1780, ancien support devenu résistance, rejet déjà observé</li>
                <li>- Conclusion : zone idéale pour attendre une réaction baissière</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 3 — LTF (M5 / M15)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : sweep haussier jusqu&apos;à 1.1778, CHoCH baissier sur M5, bougie impulsive de rejet</li>
                <li>- Conclusion : confirmation vendeuse valide, entrée short possible après la cassure locale</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-zinc-300 italic text-center">
                  HTF = direction · Timeframe intermédiaire = zone · LTF = timing
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "Un seul timeframe donne une vision incomplète du marché.",
              "Le HTF définit le biais principal — la direction du trade.",
              "Le timeframe intermédiaire localise la zone d’intérêt où agir.",
              "Le LTF sert uniquement au déclenchement : il donne le timing, pas le biais.",
            ]}
          />

          <LessonExercice
            description="Ouvre EUR/USD sur TradingView et déroule le process multi-timeframe par toi-même, du grand timeframe vers le petit. L’objectif : voir concrètement ce que chaque étage apporte à la décision."
            steps={[
              "Sur H4, identifie la structure dominante (HH/HL ou LH/LL), le dernier swing majeur, et une zone importante.",
              "Descends sur H1 : repère une zone où le prix pourrait réagir dans le sens du biais H4, et trace-la.",
              "Termine sur M5 ou M15 : attends un déclencheur dans la zone (rejet, CHoCH ou sweep) et note précisément ce qui validerait une entrée.",
              "Compare : qu’est-ce que le H4 te disait que le M5 ne montrait pas ? Qu’est-ce que le M5 précise que le H4 ne pouvait pas donner ?",
            ]}
          />

          <LessonQuiz
            question="Quel est le rôle principal du timeframe d’exécution (LTF) dans un processus multi-timeframe ?"
            options={[
              "Déterminer le biais principal du marché",
              "Identifier les zones Daily majeures",
              "Donner le timing précis de l’entrée",
              "Remplacer complètement l’analyse HTF",
            ]}
            correctIndex={2}
            explanation="Le LTF sert à confirmer l’exécution dans une zone déjà préparée par les timeframes supérieurs. Le biais vient du HTF, la zone vient du timeframe intermédiaire ; le LTF intervient seulement pour affiner le timing et réduire le risque. Il complète l’analyse HTF — il ne la remplace jamais."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "multi-timeframe", "lecon1");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Leçon 1 du module Multi-timeframe Process complétée.</p>
                </div>
              </div>
            )}

            {/* Navigation — uniquement retour module (Leçon 2 pas encore créée) */}
            <div className="mt-5 flex items-center">
              <Link href="/strategies/multi-timeframe" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Module Multi-timeframe — Vue d&apos;ensemble
              </Link>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
