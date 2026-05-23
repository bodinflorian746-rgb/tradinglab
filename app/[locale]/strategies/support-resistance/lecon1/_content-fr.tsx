"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { SupportResistance } from "@/app/components/charts/SupportResistance";
import StrongVsWeakLevelDiagram from "@/app/components/charts/StrongVsWeakLevelDiagram";
import ZoneVsLineDiagram from "@/app/components/charts/ZoneVsLineDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Support et résistance : les zones où le marché réagit", disabled: false },
  { id: "lecon2", title: "Leçon 2",          disabled: true },
  { id: "lecon3", title: "Leçon 3",          disabled: true },
  { id: "lecon4", title: "Leçon 4",          disabled: true },
];

export default function ContentFr() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "support-resistance", "lecon1"));
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
          <span className="text-zinc-500">Leçon 1</span>
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
            Support et résistance : les zones où le marché réagit
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Cette leçon enseigne à identifier visuellement les zones de support et résistance sur un chart : par les touches multiples, par la distinction zone/ligne, et par l&apos;évaluation de leur force.
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
            <span className="ml-auto text-xs text-zinc-600">1 / 4 leçons</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Trouver une zone qui tient, ça se fait en 30 secondes sur un chart. Pas en 30 minutes de lecture. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prérequis</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Notion de support et résistance → cf. Formation Trading L3</li>
              <li>- Lecture des bougies → cf. Stratégie PA L1</li>
              <li>- Concept de swing high/low → cf. Formation Trading L2</li>
            </ul>
          </div>

          {/* Bloc 3 — IDENTIFIER PAR LES TOUCHES MULTIPLES */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Identifier par les touches multiples</h2>

            <div className="my-8">
              <SupportResistance supportPrice="4 500$" resistancePrice="4 650$" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Une zone se révèle par les rebonds répétés du prix sur un même niveau. La répétition valide la mémoire collective du marché autour de cette zone.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Minimum 2 touches pour qualifier une zone, 3 touches pour une confiance élevée</li>
              <li>- Timeframe d&apos;identification principal : H4 (historique 100-150 bougies)</li>
              <li>- Sur EUR/USD : épaisseur 10-20 pips. Sur XAU/USD : épaisseur 10-20$</li>
              <li>- Pas de trade sur 1ère touche : la touche initiale valide l&apos;existence, pas la tradabilité</li>
            </ul>
          </section>

          {/* Bloc 4 — NIVEAU FORT VS NIVEAU FAIBLE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Niveau fort vs niveau faible</h2>

            <div className="my-8">
              <StrongVsWeakLevelDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Toutes les zones tracées n&apos;ont pas la même force. Le nombre de touches et la qualité des réactions distinguent les niveaux exploitables des niveaux marginaux.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- 4 touches franches avec rebonds nets = niveau fort, prioritaire dans la sélection des setups</li>
              <li>- 2 touches molles sans amplitude post-rebond = niveau faible, à exclure</li>
              <li>- Fraîcheur : zone touchée dans les 30 derniers jours conserve son poids structurel</li>
              <li>- Zones psychologiques (1.1800, 4 500$, 100 000$) renforcent la force du niveau</li>
            </ul>
          </section>

          {/* Bloc 5 — TOUJOURS UNE ZONE, PAS UNE LIGNE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Toujours une zone, pas une ligne</h2>

            <div className="my-8">
              <ZoneVsLineDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Un niveau institutionnel est une zone d&apos;intérêt, pas une ligne précise. Le tracé doit absorber les wicks naturels du marché.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Tracé en ligne fine = wicks répétés font croire à une cassure inexistante</li>
              <li>- Tracé en zone (rectangle 10-20 pips) = wicks naturels absorbés, lecture fiable</li>
              <li>- Le tracé englobe corps + mèches, jamais limité aux corps seuls</li>
              <li>- Outil rectangle de la plateforme, coloration translucide (40% opacité)</li>
            </ul>
          </section>

          <LessonKeyPoints
            points={[
              "Une zone valide comporte minimum 2 touches confirmées, idéalement 3 (mémoire collective).",
              "L’épaisseur d’une zone : 10-20 pips sur EUR/USD, 10-20$ sur XAU/USD.",
              "Le tracé en zone (pas en ligne) absorbe les wicks naturels et évite les faux signaux.",
              "Une zone fraîche (touchée dans les 30 derniers jours) prime sur une zone ancienne.",
            ]}
          />

          <LessonExercice
            description="Sur EUR/USD H4, 3 creux sont identifiés à 1.1685, 1.1690 et 1.1688. Le prix actuel se situe à 1.1750. Comment se trace la zone de support ?"
            steps={[
              "Démarrer le tracé avec l’outil Rectangle, du plus bas des 3 creux (1.1685) au plus haut (1.1690) — zone initiale de 5 pips, trop fine",
              "Élargir la zone : limite basse à 1.1680, limite haute à 1.1695 — zone finale de 15 pips, conforme à la règle 10-20 pips",
              "Colorer le rectangle en vert transparent (40% d’opacité)",
              "Vérifier les 4 critères : 3 touches confirmées (OK), épaisseur 15 pips (OK), distance 60 pips du prix actuel (OK), fraîcheur à confirmer selon historique",
              "Conclure : la zone valide les 4 critères et devient tradable",
            ]}
          />

          <LessonQuiz
            question="Combien de touches minimum sont nécessaires pour valider une zone de support ?"
            options={[
              "1 touche suffit si le niveau est psychologique",
              "2 touches minimum, 3 idéalement",
              "5 touches obligatoires",
              "Aucun seuil défini, jugement à l’œil",
            ]}
            correctIndex={1}
            explanation="La règle opérationnelle : 2 touches minimum au même niveau pour qualifier une zone tradable. 3 touches élèvent la confiance et confirment la mémoire collective. Une seule touche, même sur un niveau psychologique, reste un niveau ponctuel non confirmé."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "support-resistance", "lecon1");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Leçon 1 du module Support / Résistance &amp; Range complétée.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <span />
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Leçon 2 — À venir
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
