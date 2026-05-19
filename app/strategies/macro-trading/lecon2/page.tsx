"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { NFPHeadlineReactionDiagram } from "@/app/components/charts/NFPHeadlineReactionDiagram";
import { NFPStabilizationDiagram } from "@/app/components/charts/NFPStabilizationDiagram";
import { NFPReversalDiagram } from "@/app/components/charts/NFPReversalDiagram";

const LESSONS = [
  { id: "lecon1", title: "FOMC Fade", disabled: false },
  { id: "lecon2", title: "NFP Overreaction", disabled: false },
  { id: "lecon3", title: "Régime Risk-off", disabled: false },
  { id: "lecon4", title: "Filtre macro pré-trade", disabled: false },
];

export default function MacroTradingLecon2Page() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-trading", "lecon2"));
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
          <span className="text-zinc-500">Leçon 2</span>
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
            NFP Overreaction : trader la sur-réaction au rapport sur l&apos;emploi US
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Le premier mouvement NFP impressionne souvent plus qu&apos;il n&apos;informe réellement. Le marché réagit au chiffre headline… puis réévalue brutalement le rapport quelques minutes plus tard.
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
            <div className="bg-zinc-900 border-l-4 border-amber-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Le chiffre NFP n&apos;est qu&apos;une ligne du rapport. Le marché met quelques minutes à lire tout le reste — et c&apos;est là que se joue le vrai mouvement. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prérequis</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- NFP et calendrier économique → cf. module Macro</li>
              <li>- Consensus vs chiffre réel → cf. module Macro</li>
              <li>- Supports, résistances et liquidité → cf. module Stratégies</li>
              <li>- Multi-timeframe → cf. module Multi-timeframe Process</li>
            </ul>
          </div>

          {/* Bloc 3 — LE CHIFFRE HEADLINE PROVOQUE SOUVENT UNE SUR-RÉACTION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le chiffre headline provoque souvent une sur-réaction</h2>

            <div className="my-8">
              <NFPHeadlineReactionDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le NFP est publié chaque premier vendredi du mois et déclenche presque toujours une impulsion violente sur le dollar et les actifs qui lui sont sensibles — XAU/USD, EUR/USD, indices US. Mais cette première réaction se construit sur le chiffre headline (le nombre d&apos;emplois créés) en une fraction de seconde, alors que le rapport complet contient d&apos;autres données — salaires, taux de chômage, taux de participation, révisions des mois précédents. Le marché réagit d&apos;abord au headline, puis intègre brutalement le reste du rapport quelques minutes plus tard. Cette double phase est la signature même du setup NFP Overreaction.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD : prix avant NFP 4 640 $. Le chiffre tombe au-dessus du consensus, headline interprété hawkish. Première impulsion bearish jusqu&apos;à 4 575 $ en 5 minutes, cassant un support à 4 600 $. Puis le marché digère le détail du rapport (salaires plus mous, révisions baissières), le prix se stabilise autour de 4 580-4 585 $, puis remonte progressivement vers 4 625 $ dans l&apos;heure suivante.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Points actionnables : le headline provoque une réaction instantanée, rarement bien calibrée structurellement</li>
              <li>- L&apos;amplitude initiale peut dépasser largement le niveau « logique » du rapport complet</li>
              <li>- Le marché met typiquement 15 à 60 minutes pour digérer le rapport complet</li>
              <li>- Trader dans la première impulsion = trader la lecture émotionnelle du headline</li>
            </ul>
          </section>

          {/* Bloc 4 — LE RETOURNEMENT APPARAÎT APRÈS LA STABILISATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le retournement apparaît après la stabilisation</h2>

            <div className="my-8">
              <NFPStabilizationDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La fenêtre d&apos;exécution du setup NFP s&apos;ouvre quand le mouvement initial cesse de progresser. Visuellement, cela se traduit par une SÉRIE de bougies M15 avec des mèches répétées dans le sens contraire de l&apos;impulsion — mèches basses si l&apos;impulsion était bearish, mèches hautes si elle était bullish. Le prix se compresse autour d&apos;un niveau, n&apos;arrive plus à faire de nouveaux extrêmes. C&apos;est la trace visible que les vendeurs (ou acheteurs) initiaux ont fini d&apos;agir, et que la liquidité contraire commence à absorber. Sans cette stabilisation visible, le setup n&apos;est pas activé.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD : après la chute initiale NFP à 4 575 $, quatre bougies M15 consécutives impriment des mèches basses de 6-8 $ chacune, sans clôturer en dessous. Le prix se cale entre 4 580-4 585 $. Une fois cette base reconnue, le marché entame une reprise franche vers 4 630 $ dans l&apos;heure suivante.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Points actionnables : la stabilisation se lit sur le M15, pas sur les timeframes plus rapides</li>
              <li>- Série de mèches répétées + perte d&apos;accélération = signal de fin d&apos;impulsion</li>
              <li>- Pas de stabilisation = pas de setup, peu importe l&apos;amplitude initiale</li>
              <li>- L&apos;exécution se prend après confirmation, jamais en anticipation</li>
            </ul>
          </section>

          {/* Bloc 5 — LE NFP PEUT PRODUIRE UN VRAI CHANGEMENT DE DIRECTION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le NFP peut produire un vrai changement de direction</h2>

            <div className="my-8">
              <NFPReversalDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Tous les NFP ne produisent pas un simple fade. Quand la réévaluation post-stabilisation se transforme en mouvement franc, large et soutenu, le marché change réellement de direction — le rapport complet implique une lecture différente du headline initial, et les participants institutionnels positionnent dans le sens inverse. Le signe distinctif : le retour ne s&apos;arrête pas au niveau pré-NFP mais le dépasse nettement. Quand cette dynamique apparaît, le setup n&apos;est plus un fade tactique mais une opportunité de tendance courte/moyenne.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD : impulsion initiale NFP de 4 640 $ vers 4 575 $. Base autour de 4 580-4 585 $. Puis cassure bullish au-dessus de 4 620 $, accélération jusqu&apos;à 4 665 $ — au-delà du niveau pré-NFP. Le rapport complet (salaires solides, révisions positives) annulait l&apos;interprétation hawkish du headline. Le marché a complètement renversé son biais.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Points actionnables : le dépassement du niveau pré-NFP signale un vrai retournement, pas un simple fade</li>
              <li>- Une cassure franche au-dessus (ou sous) du niveau pré-NFP change la nature du setup</li>
              <li>- Le retournement complet justifie un target plus ambitieux que le fade tactique classique</li>
              <li>- La distinction fade / retournement se confirme dans les 30-60 minutes après stabilisation</li>
            </ul>
          </section>

          {/* Bloc 6 — PLAN D'APPLICATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan d&apos;application : un NFP Overreaction complet sur XAU/USD</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Voici la séquence complète d&apos;un trade NFP Overreaction, du contexte pré-NFP à la gestion du risque. Six étapes, chacune avec son rôle.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Étape 1 — Contexte H4 pré-NFP</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : XAU/USD compresse entre 4 630 $ et 4 650 $ dans les heures précédant le NFP, volatilité réduite</li>
                <li>- Conclusion : forte probabilité d&apos;expansion sur la publication — on prépare le scénario de fade</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 2 — Publication NFP</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : chiffre headline au-dessus du consensus, première impulsion bearish 4 640 → 4 575 $ en quelques minutes</li>
                <li>- Conclusion : réaction headline excessive — on attend la stabilisation, pas d&apos;entrée immédiate</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 3 — Stabilisation M15</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : le prix cesse de faire de nouveaux plus bas, quatre bougies M15 avec mèches basses répétées, prix calé autour de 4 580-4 585 $</li>
                <li>- Conclusion : absorption acheteuse visible — la condition du setup est validée</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 4 — Confirmation de la réévaluation</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : première bougie de reprise franche, le marché commence à imprimer des plus hauts locaux</li>
                <li>- Conclusion : la réévaluation est engagée — on peut exécuter le fade</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 5 — Exécution du Fade</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Entrée long : 4 612 $</li>
                <li>- Stop loss : 4 568 $ (au-delà de l&apos;extrémité de l&apos;impulsion)</li>
                <li>- Target : 4 655 $ (proche du niveau pré-NFP)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 6 — Gestion du risque</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Volatilité post-NFP supérieure à la normale → taille de position prudente</li>
                <li>- Exécution uniquement après stabilisation visible, jamais dans l&apos;impulsion</li>
                <li>- Si la stabilisation n&apos;apparaît pas dans les 30 minutes : on passe son tour</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-zinc-300 italic text-center">
                  Headline = sur-réaction · Stabilisation = condition · Réévaluation = signal · Pré-NFP = target naturel
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "La première impulsion NFP est portée par le chiffre headline — pas par le rapport complet qui se digère sur 15-60 minutes.",
              "Le signal exploitable apparaît après la stabilisation : mèches répétées, perte d’accélération, prix calé autour d’une zone étroite.",
              "Le fade classique vise un retour partiel vers le niveau pré-NFP ; un dépassement franc signale un vrai retournement de biais.",
              "Sans stabilisation visible, pas d’entrée — l’amplitude initiale n’est jamais en soi un signal d’exécution.",
            ]}
          />

          <LessonExercice
            description="Sur TradingView, identifie un NFP récent sur EUR/USD ou XAU/USD et reconstruis a posteriori le setup NFP Overreaction."
            steps={[
              "Repère le moment exact de la publication NFP : note le prix juste avant, l&apos;amplitude de la première impulsion, et le niveau extrême atteint dans les 5-10 minutes.",
              "Observe ce qui se passe dans les 15-60 minutes suivantes : stabilisation visible ? mèches répétées ? cassure du niveau pré-NFP dans le sens contraire ? Note le point précis où la dynamique s&apos;inverse.",
              "Si la stabilisation s&apos;est produite : reconstruis le setup fade (entrée, SL serré, target vers le niveau pré-NFP). Si le retour dépasse franchement le pré-NFP : note le retournement complet. Si rien de net ne se produit : note pourquoi le setup n&apos;aurait pas dû être pris.",
            ]}
          />

          <LessonQuiz
            question="Le NFP vient de tomber sur XAU/USD : impulsion bearish violente vers 4 575 $, prix calé autour de 4 580-4 585 $ depuis 20 minutes avec des mèches basses répétées. Que fais-tu ?"
            options={[
              "Tu shortes en supposant que la chute va continuer",
              "Tu attends une première bougie de reprise franche puis tu prends le fade long",
              "Tu places un ordre limite à 4 575 $ pour acheter la mèche basse exacte",
              "Tu ignores le setup : la volatilité post-NFP est trop dangereuse à trader",
            ]}
            correctIndex={1}
            explanation="La séquence NFP Overreaction est claire : impulsion → stabilisation → confirmation → exécution. Ici la stabilisation est visible (mèches basses répétées, prix calé), mais la confirmation de la réévaluation n'est pas encore arrivée. On attend la première bougie de reprise franche pour valider que le marché a réellement basculé sur la lecture complète du rapport. Sans cette confirmation, l'entrée serait prématurée — la stabilisation peut durer plus longtemps que prévu, voire céder dans le sens initial."
            answerExplanations={[
              "Faux. Shorter après stabilisation, c&apos;est trader dans le sens de l&apos;impulsion émotionnelle initiale alors que le marché signale précisément qu&apos;il a fini de descendre. C&apos;est le contre-pied du setup NFP Overreaction.",
              "Correct. La séquence exige stabilisation PUIS confirmation. La première bougie de reprise franche valide la réévaluation et ouvre la fenêtre d&apos;exécution du fade. Sans cette confirmation, on patiente — la stabilisation peut être plus longue, ou se prolonger en latéralisation.",
              "Faux. Un ordre limite à l&apos;extrémité du mouvement initial part du principe qu&apos;on connaît la borne — alors qu&apos;elle peut être retestée plus bas ou non. Et même si le prix y revient, l&apos;entrée se ferait sans confirmation structurelle.",
              "Faux. La volatilité post-NFP est précisément ce qui rend ce setup intéressant — c&apos;est elle qui crée l&apos;amplitude exploitée par le fade. La discipline (attendre stabilisation + confirmation) suffit à gérer le risque sans renoncer au setup.",
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
                  markLessonComplete(p, "macro-trading", "lecon2");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Leçon 2 du module Macro Trading complétée.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/macro-trading/lecon1" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon précédente
              </Link>
              <Link href="/strategies/macro-trading/lecon3" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
