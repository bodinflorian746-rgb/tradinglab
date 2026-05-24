"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { FOMCImpulseExcessDiagram } from "@/app/components/charts/FOMCImpulseExcessDiagram";
import { FOMCExhaustionDiagram } from "@/app/components/charts/FOMCExhaustionDiagram";
import { FOMCFadeSetupDiagram } from "@/app/components/charts/FOMCFadeSetupDiagram";

const LESSONS = [
  { id: "lecon1", title: "FOMC Fade", disabled: false },
  { id: "lecon2", title: "NFP Overreaction", disabled: false },
  { id: "lecon3", title: "Régime Risk-off", disabled: false },
  { id: "lecon4", title: "Filtre macro pré-trade", disabled: false },
];

export default function ContentFr() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-trading", "lecon1"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Stratégies</Link>
          <span>/</span>
          <Link href="/strategies/macro-trading" className="hover:text-zinc-400 transition-colors">Macro Trading</Link>
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
            FOMC Fade : trader le retour de balancier après la décision
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Le marché réagit souvent trop vite après le FOMC. La première impulsion attire l&apos;attention. Le retour de balancier crée souvent le vrai setup exploitable.
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
            <div className="bg-zinc-900 border-l-4 border-amber-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « La décision FOMC est rarement le signal. C&apos;est ce qui se passe APRÈS l&apos;impulsion initiale qui crée le vrai trade. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prérequis</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Décisions FOMC et conférence Powell → cf. module Macro</li>
              <li>- Hawkish vs dovish → cf. module Macro</li>
              <li>- Supports, résistances et liquidité → cf. module Stratégies</li>
              <li>- Multi-timeframe → cf. module Multi-timeframe Process</li>
            </ul>
          </div>

          {/* Bloc 3 — LA PREMIÈRE IMPULSION EST SOUVENT EXCESSIVE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">La première impulsion est souvent excessive</h2>

            <div className="my-8">
              <FOMCImpulseExcessDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La décision FOMC déclenche presque toujours une réaction immédiate du marché, mais cette première impulsion est rarement le vrai mouvement directionnel. Elle est portée par l&apos;émotion des participants qui surinterprètent le ton de Powell, le wording des minutes, ou un changement de point de vue marginal. Cette réaction émotionnelle pousse souvent le prix au-delà du niveau structurel qui aurait été cohérent avec le contenu réel de la décision, d&apos;où l&apos;excès.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD : prix avant FOMC 4 660 $ ; première impulsion bearish jusqu&apos;à 4 590 $ ; mouvement initial de 70 $ en quelques minutes. Trente minutes plus tard : retour du prix vers 4 638 $, correction de la majorité de l&apos;impulsion initiale.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Points actionnables : la première impulsion FOMC est souvent une réaction émotionnelle, pas une lecture structurelle</li>
              <li>- Le mouvement initial dépasse fréquemment ce que justifient les données réelles</li>
              <li>- Trader l&apos;impulsion = trader le bruit, pas la décision</li>
              <li>- Le vrai mouvement directionnel arrive après, parfois dans l&apos;heure, parfois plus tard</li>
            </ul>
          </section>

          {/* Bloc 4 — LE SIGNAL APPARAÎT APRÈS L'ESSOUFFLEMENT */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le signal apparaît après l&apos;essoufflement</h2>

            <div className="my-8">
              <FOMCExhaustionDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              L&apos;essoufflement est le signal-clé du FOMC Fade. Après l&apos;impulsion initiale, le marché atteint un niveau où il n&apos;arrive plus à progresser : les bougies suivantes affichent des mèches de rejet répétées, l&apos;accélération s&apos;arrête, le prix échoue à imprimer un nouveau plus haut (ou plus bas) significatif. C&apos;est la signature visible que l&apos;émotion s&apos;épuise, les participants qui ont chassé l&apos;impulsion réalisent qu&apos;ils sont seuls, et la pression dans la direction initiale faiblit. Ce point d&apos;essoufflement est la condition préalable à l&apos;exécution du fade.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD : impulsion bullish 4 640 $ → 4 705 $ après FOMC. Au sommet, trois bougies M15 consécutives impriment des mèches hautes de 6-8 $ sans clôturer au-dessus de 4 705. L&apos;accélération est cassée, le marché ne fait plus de nouveaux plus hauts. Quelques bougies plus tard, le prix corrige vers 4 670 $, le fade fonctionne.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Points actionnables : essoufflement = mèches de rejet répétées + perte d&apos;accélération</li>
              <li>- Échec à imprimer un nouveau plus haut / plus bas significatif = signal de fin d&apos;impulsion</li>
              <li>- Pas d&apos;essoufflement visible = on ne fade pas, on attend</li>
              <li>- Le M15 est l&apos;échelle de lecture de l&apos;essoufflement</li>
            </ul>
          </section>

          {/* Bloc 5 — LE RETOUR DE BALANCIER DOIT RESTER STRUCTURÉ */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le retour de balancier doit rester structuré</h2>

            <div className="my-8">
              <FOMCFadeSetupDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le FOMC Fade ne consiste pas à anticiper un retournement complet de tendance, c&apos;est un trade de retour PARTIEL, calibré sur la zone où la majorité de l&apos;impulsion excessive a été corrigée. La structure doit rester claire : entrée après stabilisation du prix au point d&apos;essoufflement, stop loss serré juste au-delà de l&apos;extrémité de l&apos;impulsion, target sur le niveau structurel d&apos;où l&apos;impulsion est partie. Sans ces trois éléments alignés, le setup n&apos;est pas valide.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD : chute FOMC 4 660 $ → 4 590 $ ; stabilisation M15 autour de 4 595 $ ; retour progressif vers 4 638 $. Setup fade : entrée long 4 600 $, stop loss 4 578 $, target 4 638 $. Le setup vise un retour partiel du mouvement, pas un retournement Daily complet.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Points actionnables : le fade vise un retour partiel, typiquement 50-80 % de l&apos;impulsion</li>
              <li>- Entrée après stabilisation visible, jamais en cours d&apos;impulsion</li>
              <li>- SL serré au-delà de l&apos;extrémité, structure d&apos;invalidation claire</li>
              <li>- Target sur le niveau structurel précédent l&apos;impulsion (ancien support / résistance)</li>
            </ul>
          </section>

          {/* Bloc 6 — PLAN D'APPLICATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan d&apos;application : un FOMC Fade complet sur XAU/USD</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Voici la séquence complète d&apos;un setup FOMC Fade, du contexte pré-FOMC à la gestion du risque. Cinq étapes, chacune avec son rôle.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Étape 1. Contexte H4</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : XAU sous résistance H4 à 4 680 $, marché attentiste avant FOMC, compression de volatilité</li>
                <li>- Conclusion : forte probabilité d&apos;expansion sur la décision, on prépare le scénario de fade</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 2. Réaction FOMC</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : première impulsion bearish 4 660 $ → 4 590 $, mouvement de 70 $ en quelques minutes, volatilité agressive</li>
                <li>- Conclusion : réaction potentiellement excessive, on attend l&apos;essoufflement, pas l&apos;entrée immédiate</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 3. Essoufflement</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : le marché cesse de créer de nouveaux plus bas, longues mèches basses M15, stabilisation autour de 4 595 $</li>
                <li>- Conclusion : pression vendeuse en ralentissement, la condition du fade est validée</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 4. Exécution du Fade</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Entrée long : 4 600 $</li>
                <li>- Stop loss : 4 578 $ (au-delà de l&apos;extrémité de l&apos;impulsion)</li>
                <li>- Target : 4 638 $ (retour partiel vers le niveau pré-FOMC)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 5. Gestion du risque</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Volatilité supérieure à la normale → taille de position prudente</li>
                <li>- Exécution uniquement après stabilisation, pas en cours d&apos;impulsion</li>
                <li>- Le danger principal reste l&apos;entrée prématurée dans l&apos;impulsion initiale</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-zinc-300 italic text-center">
                  Excès = condition · Essoufflement = signal · Stabilisation = entrée · Retour partiel = target
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "La première impulsion FOMC est presque toujours portée par l’émotion, pas par l’interprétation structurelle.",
              "Le signal exploitable apparaît après l’essoufflement : mèches de rejet, échec à imprimer un nouveau plus bas / plus haut.",
              "Le FOMC Fade vise un retour PARTIEL du mouvement initial, pas un retournement complet de tendance Daily.",
              "Pas de stabilisation visible = pas d’entrée. Entrer dans l’impulsion initiale = trader le bruit émotionnel.",
            ]}
          />

          <LessonExercice
            description="Sur TradingView, identifie un FOMC récent sur EUR/USD ou XAU/USD et reconstruis a posteriori le setup FOMC Fade."
            steps={[
              "Repère la bougie M15 du FOMC : note le prix avant l&apos;impulsion, l&apos;amplitude de la première réaction, et le niveau extrême atteint.",
              "Observe ce qui se passe dans les 30-60 minutes suivantes : essoufflement visible ? mèches de rejet ? stabilisation ? Note le point précis où la pression s&apos;arrête.",
              "Si la stabilisation s&apos;est produite : reconstruis le setup fade (entrée, SL serré, target sur le niveau pré-FOMC). Vérifie a posteriori si le R/R aurait été favorable. Si pas de stabilisation visible : note pourquoi le setup n&apos;aurait pas dû être pris.",
            ]}
          />

          <LessonQuiz
            question="Tu es en position devant le FOMC sur XAU/USD. La décision tombe et provoque une impulsion bearish violente de 70 $ en quelques minutes. Que fais-tu ?"
            options={[
              "Tu shortes dans l'impulsion pour profiter du mouvement en cours",
              "Tu n'entres pas tout de suite : tu attends l'essoufflement de l'impulsion avant tout trade",
              "Tu entres long immédiatement en pariant sur un retournement complet",
              "Tu places un ordre limite pile à l'extrémité atteinte par l'impulsion",
            ]}
            correctIndex={1}
            explanation="La règle centrale du FOMC Fade est claire : on n'entre jamais en cours d'impulsion. La première réaction FOMC est portée par l'émotion, son amplitude est imprévisible, et son extrémité peut être dépassée plusieurs fois avant la vraie stabilisation. La discipline consiste à attendre que le marché signale lui-même son essoufflement, mèches de rejet, échec à imprimer de nouveaux plus bas, stabilisation autour d'un niveau. C'est ce signal qui ouvre la fenêtre d'exécution, pas l'amplitude du mouvement initial."
            answerExplanations={[
              "Faux. Shorter dans l'impulsion, c'est précisément le piège que le FOMC Fade cherche à éviter. L'impulsion émotionnelle peut s'étendre sans crier gare, et entrer en plein milieu expose à un SL très large ou à un retournement violent contre la position.",
              "Correct. L'essoufflement est la condition préalable absolue du setup. Sans signal visible de fin d'impulsion (mèches de rejet, perte d'accélération, stabilisation), il n'y a pas d'entrée. La patience est la discipline structurelle du Fade.",
              "Faux. Le FOMC Fade n'est pas un trade de retournement immédiat. Entrer long en plein milieu d'une impulsion bearish, c'est anticiper un retournement qui n'a aucune base structurelle visible, c'est exactement le contraire du modèle.",
              "Faux. Placer un ordre limite à l'extrémité de l'impulsion suppose qu'on connaît à l'avance l'extrémité, ce qui est impossible. Le marché peut dépasser plusieurs fois avant de stabiliser, et l'ordre limite serait déclenché sans confirmation structurelle.",
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
                  markLessonComplete(p, "macro-trading", "lecon1");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Leçon 1 du module Macro Trading complétée.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/macro-trading" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Module Macro Trading. Vue d&apos;ensemble
              </Link>
              <Link href="/strategies/macro-trading/lecon2" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
