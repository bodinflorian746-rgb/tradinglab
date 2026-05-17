"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { MarketStructureDiagram } from "@/app/components/charts/MarketStructureDiagram";
import InternalVsExternalStructureZoomDiagram from "@/app/components/charts/InternalVsExternalStructureZoomDiagram";
import SMCPhasesDiagram from "@/app/components/charts/SMCPhasesDiagram";

const LESSONS = [
  { id: "lecon1", title: "Market Structure SMC : lire la structure du marché comme une institution", disabled: false },
  { id: "lecon2", title: "Leçon 2", disabled: false },
  { id: "lecon3", title: "Leçon 3", disabled: false },
  { id: "lecon4", title: "Leçon 4", disabled: true },
  { id: "lecon5", title: "Leçon 5", disabled: true },
];

export default function SmcLecon1Page() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "smc", "lecon1"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Stratégies</Link>
          <span>/</span>
          <Link href="/strategies/smc" className="hover:text-zinc-400 transition-colors">SMC : Penser institutionnel</Link>
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
            Market Structure SMC : lire la structure du marché comme une institution
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Cette leçon couvre la lecture institutionnelle de la structure du marché : identifier les swings significatifs, distinguer structure interne et externe, et reconnaître les phases d&apos;accumulation, expansion et distribution.
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
                    {lesson.title}
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
                « Le retail voit une tendance. L&apos;institutionnel voit une structure avec des intentions précises à chaque swing. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prérequis</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- HH/HL/LL/LH et tendance directionnelle → cf. Formation Trading L3</li>
              <li>- Swing high / swing low → cf. Formation Trading L2</li>
              <li>- Phases accumulation/distribution → cf. Formation Macro L4</li>
            </ul>
          </div>

          {/* Bloc 3 — RECONNAÎTRE LA STRUCTURE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Reconnaître la structure</h2>

            <div className="my-8">
              <MarketStructureDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La lecture SMC repose sur l&apos;identification des swing highs et swing lows significatifs, pas de chaque oscillation du prix. Un swing significatif laisse une empreinte structurelle visible.
            </p>

            <h3 className="text-sm font-semibold text-zinc-200 mb-2">Critères d&apos;un swing significatif</h3>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Amplitude minimale : 50-80 pips EUR/USD H4, 50-100$ XAU/USD H4</li>
              <li>- Bougie de pivot claire avec mèche significative de rejet</li>
              <li>- Réaction post-swing : retracement ≥ 20% en direction opposée</li>
              <li>- Visibilité multi-timeframe : visible Daily et H4</li>
            </ul>
          </section>

          {/* Bloc 4 — STRUCTURE INTERNE VS EXTERNE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Structure interne vs externe</h2>

            <div className="my-8">
              <InternalVsExternalStructureZoomDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La lecture SMC distingue 2 niveaux de structure imbriqués sur le même graphique. L&apos;alignement des deux donne le biais directionnel fort.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-2">Structure interne (M15 - H1)</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Mouvements visibles sur timeframes courts</li>
                  <li>- Peut afficher HH/HL à l&apos;intérieur d&apos;un LL/LH externe</li>
                  <li>- Trader dans le sens externe = alignement institutionnel</li>
                </ul>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-2">Structure externe (H4 - Daily)</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Swings majeurs visibles sur timeframes longs</li>
                  <li>- Donne le biais directionnel à plusieurs jours/semaines</li>
                  <li>- Aucune position institutionnelle ne va contre sans BOS + CHoCH</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Bloc 5 — LES 3 PHASES DU MARCHÉ */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Les 3 phases du marché</h2>

            <div className="my-8">
              <SMCPhasesDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le marché alterne 3 phases reconnaissables. Identifier la phase en cours détermine la nature des setups exploitables.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-emerald-400 font-semibold text-sm mb-2">Accumulation</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Range latéral après tendance baissière</li>
                  <li>- Amplitude réduite, faux breakouts fréquents</li>
                  <li>- Setups range + breakout haussier post-confirmation</li>
                </ul>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-emerald-400 font-semibold text-sm mb-2">Expansion (markup/markdown)</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Tendance directionnelle nette HH/HL ou LL/LH</li>
                  <li>- Amplitude des swings supérieure à la moyenne</li>
                  <li>- Setups pullback + BOS continuation prioritaires</li>
                </ul>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-amber-400 font-semibold text-sm mb-2">Distribution</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Range latéral après tendance haussière</li>
                  <li>- Faux breakouts haussiers pour piéger acheteurs retail</li>
                  <li>- Setups range + breakout baissier post-confirmation</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Bloc 6 — MÉTHODE 4 ÉTAPES */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Lecture top-down en 4 étapes</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La cartographie SMC d&apos;un graphique suit une méthode top-down structurée.
            </p>
            <ol className="space-y-2 text-sm text-zinc-300 list-decimal pl-5">
              <li><span className="font-semibold text-white">Daily ou Weekly</span> — identifier les 3-5 derniers swings majeurs (structure externe)</li>
              <li><span className="font-semibold text-white">Classifier la phase</span> — accumulation, expansion, ou distribution</li>
              <li><span className="font-semibold text-white">H4</span> — vérifier l&apos;alignement de la structure interne avec la structure externe</li>
              <li><span className="font-semibold text-white">H1 ou M15</span> — pré-identifier zones d&apos;intérêt (HL, liquidity, OB potentiels)</li>
            </ol>
          </section>

          {/* Bloc 7 — EXEMPLE CHIFFRÉ XAU/USD */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Exemple chiffré : lecture SMC sur XAU/USD</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              XAU/USD en dynamique haussière depuis 8 semaines. Application de la méthode SMC pour cartographier le marché.
            </p>

            <div className="border border-zinc-800 rounded-xl p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Swings Daily majeurs</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Swing low : 4 380$ (-5 sem.)</li>
                <li>- Swing high : 4 520$ (-4 sem.)</li>
                <li>- HL : 4 460$ (-3 sem.)</li>
                <li>- HH : 4 720$ (-1 sem.)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Verdict</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Phase : expansion haussière (markup) confirmée</li>
                <li>- Biais : long</li>
                <li>- Zone de pullback active : 4 580$-4 600$ (dernier HL H4)</li>
                <li>- Zone secondaire : 4 540$-4 560$ (61.8% Fibo)</li>
                <li>- Setup à surveiller : signal de rejet M15 au contact 4 580$-4 600$ pour long dans le sens du markup Daily</li>
              </ul>
            </div>
          </section>

          {/* Bloc 8 — ERREURS COURANTES */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Erreurs courantes</h2>
            <div className="space-y-3">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-red-400 font-semibold text-sm mb-2">1. Confondre structure interne et externe</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- HH/HL M15 dans un Daily baissier = pullback, pas retournement</li>
                  <li>- Toujours établir la structure externe en premier</li>
                </ul>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-red-400 font-semibold text-sm mb-2">2. Lire le M15 sans contexte HTF</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Chaque oscillation devient un signal sans cohérence</li>
                  <li>- Procédure top-down obligatoire : Daily → M15</li>
                </ul>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-red-400 font-semibold text-sm mb-2">3. Swing significatif sur amplitude insuffisante</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Un swing de 20 pips EUR/USD H4 n&apos;est PAS une référence structurelle</li>
                  <li>- Appliquer strictement les seuils du Bloc 3</li>
                </ul>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "La lecture SMC distingue structure interne (M15/H1) et externe (H4/Daily). L’alignement donne le biais.",
              "Le marché alterne 3 phases : accumulation, expansion (markup/markdown), distribution.",
              "Procédure top-down obligatoire : Daily → H4 → H1 → M15. Pas d’analyse directionnelle sur M15 isolé.",
              "Aucun setup contre la structure externe Daily sans BOS contre-tendance + CHoCH confirmé.",
            ]}
          />

          <LessonExercice
            description="Sur EUR/USD, le Daily affiche une structure baissière avec LL/LH sur les 6 dernières semaines. Le H4 montre depuis 3 jours une structure interne avec un HH récent à 1.1780 et un HL à 1.1720. Le prix actuel est à 1.1760. Comment classifier cette situation et quel biais opérationnel en découle ?"
            steps={[
              "Identifier la structure externe Daily : structure baissière confirmée (LL/LH) sur les 6 dernières semaines — biais directionnel majeur baissier.",
              "Identifier la structure interne H4 : structure haussière de court terme (HH récent à 1.1780, HL à 1.1720) — mouvement contre-tendance par rapport au Daily.",
              "Classifier la situation : structure interne H4 haussière INTERNE à une structure externe Daily baissière → pullback technique dans la tendance baissière majeure.",
              "Vérifier l’absence de signal de retournement : aucun BOS contre-tendance Daily ni CHoCH confirmé. La structure externe Daily reste valide.",
              "Biais opérationnel : SHORT, dans le sens de la structure externe Daily. Aucun setup long n’est exploitable tant que le Daily n’a pas produit BOS + CHoCH. La structure interne H4 sert uniquement à identifier la zone de rejet potentielle autour de 1.1780 (dernier HH H4 = résistance short potentielle au contact).",
            ]}
          />

          <LessonQuiz
            question="Sur un setup SMC, quel timeframe dicte la direction globale du trade ?"
            options={[
              "M15, qui donne le signal le plus récent",
              "H4, qui combine direction et timing",
              "Daily, qui établit la structure externe et le biais directionnel",
              "M1, pour la précision maximale",
            ]}
            correctIndex={2}
            explanation="La structure externe Daily dicte le biais directionnel global. H4 affine le contexte (structure interne et niveaux opérationnels), M15 sert uniquement au timing fin de l’entrée. Aucun setup SMC ne se prend contre la direction donnée par le Daily."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "smc", "lecon1");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Leçon 1 du module SMC : Penser institutionnel complétée.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/smc" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Module SMC — Vue d&apos;ensemble
              </Link>
              <Link href="/strategies/smc/lecon2" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                Leçon 2
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
