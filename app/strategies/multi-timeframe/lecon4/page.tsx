"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { ConfirmationM5Diagram } from "@/app/components/charts/ConfirmationM5Diagram";
import { RiskAffineDiagram } from "@/app/components/charts/RiskAffineDiagram";
import { ZoneEchecDiagram } from "@/app/components/charts/ZoneEchecDiagram";

const LESSONS = [
  { id: "lecon1", title: "Pourquoi analyser en multi-timeframe", disabled: false },
  { id: "lecon2", title: "Le timeframe supérieur : le biais", disabled: false },
  { id: "lecon3", title: "Le timeframe intermédiaire : la zone", disabled: false },
  { id: "lecon4", title: "Le timeframe d’exécution : l’entrée", disabled: false },
  { id: "lecon5", title: "Le process complet", disabled: false },
];

export default function MultiTimeframeLecon4Page() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "multi-timeframe", "lecon4"));
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
          <span className="text-zinc-500">Leçon 4</span>
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
            Le timeframe d&apos;exécution : attendre la confirmation
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Une bonne zone ne suffit pas. Le marché doit montrer qu&apos;il réagit réellement avant l&apos;entrée.
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
              const isCurrent = lesson.id === "lecon4";
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
            <span className="ml-auto text-xs text-zinc-600">4 / 5 leçons</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-blue-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Le LTF ne prédit pas le marché. Il confirme que le marché réagit. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prérequis</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Direction dominante HTF → cf. Leçon 2</li>
              <li>- Zones d&apos;intérêt H1-H4 → cf. Leçon 3</li>
              <li>- Structure de marché, BOS, CHoCH → cf. module SMC</li>
            </ul>
          </div>

          {/* Bloc 3 — LE LTF SERT À VALIDER LA RÉACTION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le LTF sert à valider la réaction</h2>

            <div className="my-8">
              <ConfirmationM5Diagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le timeframe d&apos;exécution (M1/M5/M15) est le timeframe du timing, pas celui de l&apos;analyse. Son rôle est de confirmer que le marché réagit physiquement dans la zone préparée à l&apos;étage supérieur. Une réaction nette déclenche l&apos;entrée ; aucune réaction = pas de trade. Le LTF ne prédit rien, il vérifie.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD : la zone H1 est entre 1.1750 et 1.1760. Sur M5, le prix arrive dans la bande, imprime trois mèches hautes consécutives au-dessus de 1.1755, puis une impulsion baissière casse le dernier creux local à 1.1748. La réaction est visible, la cassure structurelle confirme — le signal d&apos;entrée est valide.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Attendre une réaction visible dans la zone, pas une simple présence du prix</li>
              <li>- Mèches de rejet, cassure de creux local, BOS bearish = signaux LTF</li>
              <li>- Aucune réaction = aucune entrée — la patience prime</li>
              <li>- Le LTF ne prédit pas, il confirme</li>
            </ul>
          </section>

          {/* Bloc 4 — LE LTF SERT À AFFINER LE RISQUE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le LTF sert à affiner le risque</h2>

            <div className="my-8">
              <RiskAffineDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le LTF ne sert pas seulement à confirmer : il permet aussi de réduire la distance entre l&apos;entrée et le Stop Loss. La même idée se joue avec deux dimensionnements de risque très différents selon que l&apos;on entre dès le HTF ou après confirmation locale. Le SL reste calé sur une structure qui invalide le scénario — mais cette structure est plus serrée sur le LTF.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD : entrée short à 1.1758 sous la zone. Sans confirmation LTF, le SL doit couvrir l&apos;intégralité de la zone H4 — placé à 1.1790, soit 35 pts de risque. Avec confirmation M5, le SL passe juste au-dessus du dernier sommet local de rejet — placé à 1.1772, soit 14 pts. Même idée de trade, même cible, mais la distance entrée-SL est divisée par 2,5.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Le SL serré exige une structure locale claire (sommet de rejet, mèche)</li>
              <li>- Distance entrée-SL réduite = meilleur R/R sur la même cible</li>
              <li>- Le SL n&apos;est jamais collé arbitrairement — il invalide une structure</li>
              <li>- Risque mesuré en pts/pips, indépendamment de la taille de position (cf. Leçon 8 Débutant)</li>
            </ul>
          </section>

          {/* Bloc 5 — UNE ZONE PEUT ÉCHOUER */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Une zone peut échouer</h2>

            <div className="my-8">
              <ZoneEchecDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Toutes les zones ne réagissent pas. Une zone forte sur le papier peut être traversée sans aucun signal — le marché ne s&apos;y arrête pas, n&apos;y produit aucune mèche de rejet, aucune cassure locale en faveur du scénario. Le LTF protège alors le capital : pas de réaction = pas d&apos;entrée. La patience permet d&apos;attendre la zone suivante plutôt que de forcer un trade.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD : support H1 attendu à 4 545 $. Sur M5, le prix arrive et traverse la bande sans aucune mèche basse de rejet, dans une séquence baissière franche. La continuation se prolonge nettement sous la zone, sans rebond ni signe de reprise. Aucun signal d&apos;entrée n&apos;est émis — le setup est invalidé.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Une zone peut être traversée sans réaction — c&apos;est attendu</li>
              <li>- L&apos;absence de réaction est elle-même un signal — ne pas entrer</li>
              <li>- Garder la patience : la zone suivante ou un retour peut donner un meilleur signal</li>
              <li>- Trader sur confirmation, jamais sur prédiction</li>
            </ul>
          </section>

          {/* Bloc 6 — PLAN D'APPLICATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan d&apos;application : un cas EUR/USD complet</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Voici la séquence complète Daily → H1 → M5 sur un cas EUR/USD. L&apos;objectif est de dérouler les trois étages bout à bout et de matérialiser le rôle distinct de chacun.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Étape 1 — HTF (Daily / H4)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : biais baissier en LH/LL, résistance Daily 1.1780, prix actuel 1.1715</li>
                <li>- Conclusion : direction dominante baissière — ventes prioritaires</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 2 — Timeframe intermédiaire (H1)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : zone confluente 1.1750-1.1760 (ancien support cassé + FVG bearish non mitigé)</li>
                <li>- Conclusion : préparer un scénario short au retour du prix dans la zone</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 3 — LTF (M5)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : prix dans la zone, trois mèches hautes de rejet consécutives, cassure du creux local à 1.1748</li>
                <li>- Conclusion : confirmation valide — entrée short à 1.1758, SL serré juste au-dessus du dernier sommet de rejet (1.1772, 14 pts)</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-zinc-300 italic text-center">
                  HTF = direction · Timeframe intermédiaire = zone · LTF = timing + risque réduit
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "Le LTF ne sert pas à analyser — il sert à confirmer que la zone réagit.",
              "Une réaction visible (mèche de rejet, cassure de structure locale) déclenche l’entrée.",
              "Le LTF permet aussi de réduire le risque par un SL serré sur la structure locale.",
              "Aucune réaction = aucune entrée — protéger le capital prime sur le besoin de trader.",
            ]}
          />

          <LessonExercice
            description="Ouvre EUR/USD sur TradingView et entraîne-toi à attendre la confirmation LTF avant toute entrée."
            steps={[
              "Trace une zone d’intérêt sur H1 (cf. Leçon 3) et attends que le prix y revienne.",
              "Quand le prix touche la zone, descends sur M5. Cherche un rejet (mèche), une cassure de structure locale (BOS) ou une accumulation de signaux dans le sens du biais HTF.",
              "Si la réaction est nette : note le point d’entrée et le SL serré, calé sur la structure locale. Si aucune réaction n’apparaît : reste sur la touche, prends note de la traversée et passe à la zone suivante.",
            ]}
          />

          <LessonQuiz
            question="Le prix arrive dans une zone HTF préparée. Sur M5, aucune mèche de rejet, aucune cassure de structure locale — juste une traversée franche. Que fais-tu ?"
            options={[
              "Tu entres quand même : la zone HTF est solide, le LTF n'a qu'un rôle secondaire",
              "Tu entres avec un SL très large pour absorber la fluctuation",
              "Tu n'entres pas : sans réaction LTF, le setup est invalidé",
              "Tu prends l'autre sens, en supposant un retournement",
            ]}
            correctIndex={2}
            explanation="Le rôle du LTF est de CONFIRMER la réaction du marché dans la zone. Si la zone est traversée sans aucun signal de rejet ou de cassure structurelle, le scénario est invalidé. L'absence de réaction est en soi un signal — la patience permet d'attendre la prochaine opportunité plutôt que d'entrer à l'aveugle."
            answerExplanations={[
              "Faux. Le LTF n'est pas accessoire — il est la condition même de l'entrée. Une zone qui ne réagit pas n'est pas exploitable, peu importe sa qualité HTF.",
              "Faux. Élargir le SL pour 'absorber le risque' ne corrige pas le problème de fond : sans réaction LTF, rien n'indique que le scénario va se déclencher. C'est juste un pari plus cher.",
              "Correct. Sans signal LTF (mèche de rejet, BOS, cassure de creux local), le setup n'est pas confirmé. La règle est claire : aucune réaction = aucune entrée. Le capital reste protégé.",
              "Faux. Prendre l'autre sens sur la simple traversée d'une zone, sans contexte HTF favorable ni signal de retournement structurel, c'est trader contre la tendance dominante sans aucune base.",
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
                  markLessonComplete(p, "multi-timeframe", "lecon4");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Leçon 4 du module Multi-timeframe Process complétée.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/multi-timeframe/lecon3" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon précédente
              </Link>
              <Link href="/strategies/multi-timeframe/lecon5" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
