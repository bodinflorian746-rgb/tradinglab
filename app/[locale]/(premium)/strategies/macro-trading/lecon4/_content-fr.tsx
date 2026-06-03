"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { MacroFilterCalendarDiagram } from "@/app/components/charts/MacroFilterCalendarDiagram";
import { MacroFilterRegimeDiagram } from "@/app/components/charts/MacroFilterRegimeDiagram";
import { MacroFilterFlowchartDiagram } from "@/app/components/charts/MacroFilterFlowchartDiagram";

const LESSONS = [
  { id: "lecon1", title: "FOMC Fade", disabled: false },
  { id: "lecon2", title: "NFP Overreaction", disabled: false },
  { id: "lecon3", title: "Régime Risk-off", disabled: false },
  { id: "lecon4", title: "Filtre macro pré-trade", disabled: false },
];

export default function ContentFr() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-trading", "lecon4"));
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
          <span className="text-zinc-500">Leçon 4</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
              Avancé
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">20 min</span>
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
            Le filtre macro pré-trade : valider le contexte avant d'exécuter
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Un setup technique propre peut devenir un mauvais trade dans un mauvais contexte macro. Le filtre macro ne sert pas à trouver des trades. Il sert à éviter ceux qui n'auraient jamais dû être pris.
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
            <span className="ml-auto text-xs text-zinc-600">4 / 4 leçons</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-amber-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Les meilleurs trades commencent par un refus : refuser d'exécuter quand le contexte macro ne valide pas le setup. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prérequis</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- FOMC Fade → cf. module Macro Trading, Leçon 1</li>
              <li>- NFP Overreaction → cf. module Macro Trading, Leçon 2</li>
              <li>- Régime Risk-off → cf. module Macro Trading, Leçon 3</li>
              <li>- Calendrier économique → cf. module Macro</li>
              <li>- Multi-timeframe → cf. module Multi-timeframe Process</li>
            </ul>
          </div>

          {/* Bloc 3 — LE CALENDRIER ÉCONOMIQUE EST LE PREMIER FILTRE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le calendrier économique est le premier filtre</h2>

            <div className="my-8">
              <MacroFilterCalendarDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Avant tout setup, la première question à se poser est simple : y a-t-il une publication économique majeure dans la fenêtre qui vient ? FOMC, NFP, CPI, données d'emploi, conférence Powell, ces événements provoquent des volatilités extrêmes et imprévisibles qui désorganisent complètement les structures techniques. Un setup techniquement parfait à 10h UTC peut être réduit à néant par une bougie de 70 $ à 13h30 UTC sur la publication NFP. Le calendrier économique est donc le filtre le plus simple et le plus efficace : si une news majeure est dans la fenêtre du trade, on ne prend pas le trade, peu importe la qualité technique du setup.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD 13h25 UTC : setup short H4 parfait, prix sous résistance, structure baissière nette. Mais le calendrier indique la publication du CPI américain à 13h30 UTC. La probabilité d'une volatilité de 50-100 $ dans les minutes qui suivent est très élevée, le SL serait emporté avant que le scénario ait la moindre chance de s'exprimer. Filtre rouge : pas de trade. On attend que la publication soit digérée (typiquement 30-60 minutes) avant de réévaluer.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Points actionnables : consulter le calendrier économique AVANT d'analyser le graphique</li>
              <li>- News majeure dans les 30 minutes à venir = filtre rouge, pas d'exécution</li>
              <li>- News majeure dans la dernière heure = attendre la digestion avant tout trade</li>
              <li>- Aucun setup technique ne justifie de trader en aveugle sur une publication majeure</li>
            </ul>
          </section>

          {/* Bloc 4 — LE TRADE DOIT ÊTRE ALIGNÉ AVEC LE RÉGIME DOMINANT */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le trade doit être aligné avec le régime dominant</h2>

            <div className="my-8">
              <MacroFilterRegimeDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le second filtre est le régime macro. Si le contexte général (risk-on, risk-off, biais Daily des actifs refuges, structure HTF) pointe dans une direction, prendre un trade contre cette direction n'est pas seulement risqué, c'est statistiquement perdant. Un signal bearish M15 isolé sur l'or pendant un régime risk-off bullish établi a une probabilité de continuation très faible. La structure HTF absorbe en général ces signaux contraires en quelques bougies, le SL est touché, et le trade échoue. Trader dans le sens du régime, jamais contre.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD H4 en régime risk-off établi, structure HH/HL claire qui pointe vers 4 740 $. Un signal bearish M15 apparaît au cours d'un mini-pullback : rejet sur résistance locale, début de cassure du dernier creux. Techniquement, c'est un short valide. Macro-contextuellement, c'est un trade à contre-courant du régime dominant. Filtre rouge : on ne prend pas. Le marché continue effectivement de monter et casse les sommets précédents dans les heures qui suivent.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Points actionnables : vérifier le régime macro et la structure HTF avant chaque trade</li>
              <li>- Setup contre-tendance = filtre amber ou rouge, sauf preuve structurelle de retournement</li>
              <li>- Le régime dominant prime sur le signal local, toujours</li>
              <li>- Un signal techniquement valide mais hors régime = setup à passer son tour</li>
            </ul>
          </section>

          {/* Bloc 5 — LE FILTRE MACRO SERT À RÉDUIRE LES MAUVAIS TRADES */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le filtre macro sert à réduire les mauvais trades</h2>

            <div className="my-8">
              <MacroFilterFlowchartDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le filtre macro n'est PAS un outil pour trouver des trades. C'est un outil pour en éviter. Sa logique est négative : à chaque étape, on cherche une raison de NE PAS prendre le trade. News majeure imminente ? Refus. Régime contraire ? Refus. Setup faible ? Refus. Seuls les setups qui passent les trois filtres méritent l'exécution. Cette logique inverse, chercher des raisons de refuser plutôt que des raisons d'entrer, est exactement ce qui sépare les traders profitables des autres : ils prennent peu de trades, mais ceux qu'ils prennent ont passé tous les contrôles.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                Sur une semaine de trading, un trader discipliné peut identifier 15 setups techniques. En appliquant le filtre macro : 5 sont refusés à cause de news majeures dans la fenêtre, 4 sont refusés parce qu'ils vont contre le régime dominant, 2 sont refusés parce que le setup technique manque d'une confluence claire. Il en reste 4, qu'il exécute. Cette sélectivité, perçue comme « trader moins », est en réalité le multiplicateur de performance principal.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Points actionnables : appliquer les 3 filtres systématiquement à chaque setup envisagé</li>
              <li>- Un seul filtre rouge suffit à refuser le trade, aucune négociation</li>
              <li>- Trader moins de setups mais de meilleure qualité = principal levier de performance</li>
              <li>- La logique du filtre est NÉGATIVE : chercher à éviter, pas à trouver</li>
            </ul>
          </section>

          {/* Bloc 6 — PLAN D'APPLICATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan d'application : deux cas concrets sur XAU/USD</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Voici deux cas concrets, un trade validé à travers le filtre, et un trade refusé, pour illustrer la décision étape par étape.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Cas 1. Trade validé en 3 étapes</p>

              <p className="text-zinc-300 leading-relaxed text-sm mb-2"><span className="font-semibold text-white">Étape 1. Calendrier :</span></p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-3">
                <li>- Observation : aucune publication majeure dans les 2 heures précédentes ni dans les 4 heures à venir</li>
                <li>- Conclusion : filtre calendrier VERT, on continue</li>
              </ul>

              <p className="text-zinc-300 leading-relaxed text-sm mb-2"><span className="font-semibold text-white">Étape 2. Régime macro :</span></p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-3">
                <li>- Observation : régime risk-off établi, structure HH/HL claire en H4 sur XAU, biais Daily haussier confirmé</li>
                <li>- Conclusion : filtre régime VERT, un setup long est aligné</li>
              </ul>

              <p className="text-zinc-300 leading-relaxed text-sm mb-2"><span className="font-semibold text-white">Étape 3. Setup technique :</span></p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-3">
                <li>- Observation : pullback H4 vers un ancien sommet devenu support, stabilisation M15 visible, bougie de reprise franche</li>
                <li>- Conclusion : filtre setup VERT, exécution validée. Entrée long avec SL sous le pullback, target sur la prochaine zone de continuation</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3 mb-5">
                <p className="text-sm text-emerald-400 font-semibold text-center">
                  3 filtres VERTS → trade exécuté
                </p>
              </div>

              <p className="text-white font-semibold text-sm mb-2">Cas 2. Trade refusé</p>

              <p className="text-zinc-300 leading-relaxed text-sm mb-2"><span className="font-semibold text-white">Étape 1. Calendrier :</span></p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-3">
                <li>- Observation : publication CPI US à 13h30 UTC, dans 25 minutes</li>
                <li>- Conclusion : filtre calendrier ROUGE, pas de trade, peu importe le reste</li>
              </ul>

              <p className="text-sm text-zinc-400 italic leading-relaxed mb-1">
                Note : on ne va pas vérifier les autres filtres. Un seul filtre rouge suffit à refuser. Le setup technique peut être superbe, le régime peut être aligné, la news imminente rend l'exécution trop risquée. On attend la publication digérée pour réévaluer.
              </p>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-red-400 font-semibold text-center">
                  Filtre ROUGE dès l'étape 1 → trade refusé
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "Le filtre macro est une logique NÉGATIVE : chercher des raisons de refuser un trade, pas d’en prendre.",
              "Trois filtres en série : calendrier économique, régime macro, setup technique. Un seul rouge = pas de trade.",
              "Trader moins mais mieux est le principal levier de performance, la sélectivité prime sur la fréquence.",
              "Aucun setup technique ne justifie de trader contre le calendrier ou contre le régime dominant.",
            ]}
          />

          <LessonExercice
            description="Pendant une semaine, applique le filtre macro à chaque setup que tu identifies. Note les refus et les exécutions."
            steps={[
              "À chaque setup technique repéré, consulte d'abord le calendrier économique pour les 2 heures à venir. Si une news majeure est dans cette fenêtre, marque le setup REFUSÉ pour cause de calendrier.",
              "Si le calendrier est vert, vérifie le régime macro et la structure HTF. Si le setup va contre le régime dominant, marque-le REFUSÉ pour cause de régime.",
              "Si les deux premiers filtres passent, évalue la qualité technique du setup (confluence, structure, niveaux). Si elle est insuffisante, marque REFUSÉ pour cause de setup faible. Sinon, marque EXÉCUTÉ. À la fin de la semaine, compare le nombre de setups identifiés au nombre de setups exécutés, c'est ta sélectivité.",
            ]}
          />

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Ce qu'il faut retenir des leçons macro</h2>
            <ul className="space-y-2 text-sm text-zinc-300">
              <li>- FOMC Fade : la première impulsion après la décision est émotionnelle. On attend l&apos;essoufflement (mèches de rejet, échec à imprimer un nouveau plus haut ou plus bas), puis on fade vers un retour partiel du mouvement, sans viser un retournement de la tendance Daily.</li>
              <li>- NFP Overreaction : le marché surréagit au chiffre avant de se réévaluer sur 15 à 60 minutes. Le signal arrive après stabilisation (mèches répétées, perte d&apos;accélération, range étroit), avec un fade vers le niveau d&apos;avant la news.</li>
              <li>- Régime Risk-off : il se confirme par la concordance de plusieurs signaux macro, jamais un seul marché. Tant que la structure HH/HL tient sur les actifs refuges, on trade dans le sens du régime ; les pullbacks H4 sont des entrées, pas des retournements.</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mt-4">
              Le point commun de ces trois setups : on n&apos;entre jamais sur la première réaction émotionnelle, on attend la confirmation. Et avant de chercher un setup, le filtre macro ci-dessous sert à valider si le contexte autorise à trader.
            </p>
          </section>

          <LessonQuiz
            question="Tu identifies un setup short H4 techniquement parfait sur XAU/USD à 13h00 UTC. Le calendrier indique une publication NFP à 13h30 UTC. Le régime macro est neutre. Que fais-tu ?"
            options={[
              "Tu exécutes : le setup technique est solide, c'est ce qui compte",
              "Tu n'exécutes pas : la news imminente est un filtre rouge, peu importe la qualité du setup",
              "Tu exécutes avec une taille réduite pour limiter le risque",
              "Tu places un ordre limite plus loin pour éviter la volatilité initiale",
            ]}
            correctIndex={1}
            explanation="La règle du filtre macro est non-négociable : un seul filtre rouge suffit à refuser le trade. Ici, le calendrier est explicitement rouge (NFP dans 30 minutes), ce qui rend l'exécution trop risquée, la volatilité post-NFP peut emporter le SL en quelques minutes sans rapport avec la qualité technique du setup. La qualité du régime macro ou du setup technique ne compensent jamais un filtre calendrier rouge. La discipline est d'attendre la publication digérée (typiquement 30-60 minutes) avant de réévaluer."
            answerExplanations={[
              "Faux. « Le setup technique est solide » ne suffit jamais à compenser un filtre calendrier rouge. La volatilité NFP est imprévisible et peut emporter le SL avant que le setup ait la moindre chance de s'exprimer.",
              "Correct. Un seul filtre rouge suffit à refuser, et le calendrier est le filtre le plus simple à respecter. On attend la publication, on observe la réaction, et on réévalue ensuite. La discipline prime sur l'attachement au setup identifié.",
              "Faux. Réduire la taille ne change pas la nature du problème : la volatilité NFP peut largement dépasser n'importe quel SL raisonnable. On ne diminue pas un mauvais trade en risquant moins, on le supprime.",
              "Faux. Placer un ordre limite plus loin ne contourne pas le filtre. C'est une rationalisation pour exécuter quand même un setup qu'on a déjà mentalement décidé de prendre, exactement ce que le filtre est censé empêcher.",
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
                  markLessonComplete(p, "macro-trading", "lecon4");
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
                  <p className="text-sm font-semibold text-emerald-400">Module Macro Trading terminé</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Tu as complété les 4 leçons du module Macro Trading.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/macro-trading/lecon3" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon précédente
              </Link>
              <Link href="/strategies/macro-trading" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                Retour au module
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
