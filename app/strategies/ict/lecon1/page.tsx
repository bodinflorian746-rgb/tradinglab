"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { IctLiquidityGrabDiagram } from "@/app/components/charts/IctLiquidityGrabDiagram";
import { FalseBreakoutTrapDiagram } from "@/app/components/charts/FalseBreakoutTrapDiagram";
import { PostSweepReactionDiagram } from "@/app/components/charts/PostSweepReactionDiagram";

const LESSONS = [
  { id: "lecon1", title: "Liquidité et manipulation", disabled: false },
  { id: "lecon2", title: "PD Arrays", disabled: false },
  { id: "lecon3", title: "Killzones", disabled: false },
  { id: "lecon4", title: "Displacement", disabled: false },
  { id: "lecon5", title: "Modèle ICT complet", disabled: false },
];

export default function IctLecon1Page() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "ict", "lecon1"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Stratégies</Link>
          <span>/</span>
          <Link href="/strategies/ict" className="hover:text-zinc-400 transition-colors">ICT complet</Link>
          <span>/</span>
          <span className="text-zinc-500">Leçon 1</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
              Avancé
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
            Comprendre le modèle ICT : liquidité et manipulation
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Le marché ne casse pas les sommets par hasard. Il va souvent chercher la liquidité avant le vrai déplacement.
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
            <span className="ml-auto text-xs text-zinc-600">1 / 5 leçons</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-amber-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Le marché ne paie pas les évidences. Il paie ceux qui attendent que la manipulation soit consommée. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prérequis</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Structure de marché, BOS et CHoCH → cf. module SMC, leçon « BOS et CHoCH : lire les signaux structurels institutionnels »</li>
              <li>- FVG et liquidité → cf. module SMC, leçon « FVG et liquidité : trader le déséquilibre institutionnel »</li>
              <li>- Multi-timeframe → cf. module Multi-timeframe Process</li>
            </ul>
          </div>

          {/* Bloc 3 — LE MARCHÉ CHERCHE LES ZONES ÉVIDENTES */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le marché cherche les zones évidentes</h2>

            <div className="my-8">
              <IctLiquidityGrabDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La grille de lecture ICT part d&apos;un constat simple : les niveaux les plus évidents — equal highs, equal lows, derniers sommets ou creux clairement visibles sur le graphique — concentrent les ordres stop des participants retail. Stop loss au-dessus d&apos;un sommet, stop loss sous un creux : ces zones forment des poches de liquidité visibles à l&apos;œil nu sur le graphique. Le marché va y aller, mécaniquement, parce que c&apos;est là que dorment les ordres qui font tourner les algorithmes institutionnels.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD H1 : deux sommets quasiment identiques se forment à 1.1780 sur quelques heures. Tous les traders en short voient cette résistance et placent leur SL juste au-dessus, vers 1.1790-1.1795. Le marché monte une troisième fois, traverse 1.1780, atteint 1.1792 — tous les stops sont déclenchés — puis chute violemment vers 1.1720. La liquidité a été prise, le mouvement réel commence après.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Equal highs / equal lows = liquidité visible à l&apos;œil nu</li>
              <li>- Plus un niveau est évident, plus il concentre de stops</li>
              <li>- Le marché va chercher ces zones — ce n&apos;est pas du hasard, c&apos;est de l&apos;exécution d&apos;ordres</li>
              <li>- Trader la cassure naïve de ces niveaux = se faire prendre du mauvais côté</li>
            </ul>
          </section>

          {/* Bloc 4 — UNE CASSURE N'EST PAS TOUJOURS UNE CONTINUATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Une cassure n&apos;est pas toujours une continuation</h2>

            <div className="my-8">
              <FalseBreakoutTrapDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le réflexe naturel d&apos;un trader débutant face à une cassure de résistance, c&apos;est d&apos;acheter la cassure. Le réflexe ICT, c&apos;est de se demander si cette cassure est tenue ou si elle est une simple manipulation. Une cassure qui ne se confirme pas — c&apos;est-à-dire qui n&apos;est pas suivie d&apos;une continuation franche dans la nouvelle direction — est presque toujours un piège. Le prix revient sous la résistance, et tous ceux qui ont acheté la cassure se retrouvent en perte instantanément.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD M15 : la résistance est à 4 680 $, testée plusieurs fois. Une bougie casse au-dessus, atteint 4 695 $ — les traders breakout entrent en achat avec leur SL sous 4 680. Quelques bougies plus tard, le prix réintègre sous 4 680, descend rapidement vers 4 650. La cassure n&apos;était pas tenue, elle servait juste à déclencher les ordres breakout pour alimenter la descente.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Une cassure n&apos;a de valeur que si elle est tenue et suivie d&apos;une continuation</li>
              <li>- Réintégration immédiate sous le niveau cassé = piège, on inverse mentalement le scénario</li>
              <li>- Le breakout naïf est l&apos;une des configurations les plus coûteuses pour les traders retail</li>
              <li>- L&apos;ICT ne trade pas la cassure — il trade ce qui se passe APRÈS</li>
            </ul>
          </section>

          {/* Bloc 5 — LE VRAI SIGNAL = LA RÉACTION APRÈS LA LIQUIDITÉ */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le vrai signal = la réaction après la liquidité</h2>

            <div className="my-8">
              <PostSweepReactionDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le cœur du modèle ICT tient en une phrase : on ne trade pas la prise de liquidité, on trade la RÉACTION qui suit. Le sweep en lui-même n&apos;est pas un signal — c&apos;est une condition préalable. Le signal arrive juste après : le prix doit réintégrer sous (ou au-dessus, selon le sens) le niveau balayé, puis une bougie impulsive franche doit confirmer le retournement. C&apos;est cette séquence sweep → réintégration → impulsion qui valide une entrée — pas la mèche du sweep seule.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                Graphique M15 EUR/USD : le prix vient d&apos;imprimer une mèche au-dessus de 1.1780 (sweep). Sur la bougie suivante, il referme sous 1.1780 (réintégration). Sur la bougie d&apos;après, gros corps baissier de 35 pts (impulsion). C&apos;est cette séquence qui autorise un short — entrée sur la cassure du dernier creux local, SL juste au-dessus du sommet du sweep, TP vers la prochaine zone de liquidité en aval.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Le sweep seul ne déclenche rien — c&apos;est une condition, pas un signal</li>
              <li>- La réintégration sous le niveau balayé est la première confirmation</li>
              <li>- Une bougie impulsive franche dans la nouvelle direction valide l&apos;entrée</li>
              <li>- SL serré au-dessus du sommet du sweep — la structure invalide le scénario</li>
            </ul>
          </section>

          {/* Bloc 6 — PLAN D'APPLICATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan d&apos;application : un sweep EUR/USD complet</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Voici la séquence complète HTF → Liquidité → Sweep → Réaction sur un cas EUR/USD. Quatre étapes, chacune avec son rôle.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Étape 1 — HTF (Daily) : biais directionnel</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : EUR/USD Daily en structure LH/LL depuis trois semaines, résistance majeure 1.1860</li>
                <li>- Conclusion : biais baissier confirmé — on cherchera des shorts sur prise de liquidité haute</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 2 — Liquidité (H1) : repérer la cible</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : deux sommets quasi identiques formés à 1.1780 dans la dernière séance</li>
                <li>- Conclusion : equal highs à 1.1780 = liquidité visible. Les stops short dorment au-dessus, vers 1.1790-1.1795</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 3 — Sweep (M15) : attendre la prise</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : une bougie M15 imprime une mèche au-dessus de 1.1780, atteint 1.1792, et referme sous 1.1780</li>
                <li>- Conclusion : la liquidité a été prise. On passe en mode « guet » pour la réaction — pas d&apos;entrée encore</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 4 — Réaction (M15) : exécuter</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : la bougie suivante est un gros corps baissier impulsif (35 pts), cassure du dernier creux local à 1.1762</li>
                <li>- Conclusion : entrée short à 1.1758 sur la cassure, SL à 1.1795 (3 pts au-dessus du sommet du sweep), TP vers la prochaine zone de liquidité basse à 1.1695. R/R ≈ 1 : 1,7 — setup haute probabilité aligné Daily + sweep + réaction</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-zinc-300 italic text-center">
                  HTF = biais · Liquidité = cible · Sweep = condition · Réaction = signal
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "Le marché va chercher les zones de liquidité évidentes — equal highs/lows, derniers sommets/creux visibles.",
              "Une cassure n’est pas une continuation tant qu’elle n’est pas tenue. La réintégration sous le niveau cassé est un signe de manipulation.",
              "Le vrai signal d’entrée arrive APRÈS le sweep : réintégration + bougie impulsive dans la direction opposée.",
              "Sans réaction franche, le sweep seul ne suffit pas — la patience prime sur le besoin de trader la mèche.",
            ]}
          />

          <LessonExercice
            description="Sur TradingView, repère un sweep complet sur la paire de ton choix et trace la séquence HTF → Liquidité → Sweep → Réaction."
            steps={[
              "HTF (Daily ou H4) : identifie la structure et conclus un biais directionnel clair. Sans biais HTF net, ne descends pas plus bas.",
              "H1 : repère deux sommets quasi identiques (equal highs) ou deux creux quasi identiques (equal lows) dans le sens du biais. Trace une ligne horizontale à ce niveau — c’est la zone de liquidité visée.",
              "M15 : attends que le prix vienne sweep ce niveau (mèche qui dépasse, corps qui referme du bon côté). Puis cherche la réintégration et la bougie impulsive. Si la séquence est complète, note l’entrée, le SL au-dessus/sous le sommet/creux du sweep, et le TP vers la prochaine zone de liquidité.",
            ]}
          />

          <LessonQuiz
            question="Le prix vient d'imprimer une mèche au-dessus d'un equal high à 1.1780, atteint 1.1792 puis referme sous 1.1780. Que cherches-tu pour valider une entrée short ?"
            options={[
              "Tu entres immédiatement : le sweep seul est le signal d'entrée",
              "Tu attends une bougie baissière impulsive après la réintégration sous le niveau",
              "Tu attends une bougie verte sur M1 qui confirme la reprise haussière",
              "Tu attends que le prix retouche exactement le sommet de la mèche à 1.1792 avant d'entrer",
            ]}
            correctIndex={1}
            explanation="Le sweep n'est qu'une condition préalable, pas un signal. Le modèle ICT exige une SÉQUENCE complète : sweep → réintégration sous le niveau → bougie impulsive dans la nouvelle direction. Sans cette bougie impulsive de confirmation, on n'entre pas — la patience permet d'éviter les faux signaux où le sweep est suivi d'une consolidation latérale ou d'un autre push haussier."
            answerExplanations={[
              "Faux. Entrer sur le sweep seul, sans attendre la réaction, c'est trader la mèche — exactement ce que le modèle ICT cherche à éviter. Le sweep peut être suivi d'une consolidation, d'un autre push haussier, ou de rien du tout. Sans confirmation, c'est un pari.",
              "Correct. La séquence ICT complète exige sweep → réintégration → bougie impulsive. C'est l'impulsion baissière qui confirme que la prise de liquidité s'est traduite en mouvement réel. L'entrée se fait sur la cassure du dernier creux local, SL serré au-dessus du sommet du sweep.",
              "Faux. Une bougie verte signalerait la reprise haussière — c'est-à-dire l'invalidation du scénario short. Pour valider un short, on cherche une bougie ROUGE impulsive, pas verte. De plus, descendre jusqu'à M1 pour chercher une confirmation va à l'inverse du modèle, qui s'exécute sur M15.",
              "Faux. Un sweep ne se rejoue jamais exactement au pip près. Attendre la retouche du sommet de la mèche, c'est attendre un événement qui n'arrivera pas — le prix part dans la direction opposée pendant que tu regardes au mauvais endroit.",
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
                  markLessonComplete(p, "ict", "lecon1");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Leçon 1 du module ICT complet complétée.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/ict" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Module ICT — Vue d&apos;ensemble
              </Link>
              <Link href="/strategies/ict/lecon2" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
