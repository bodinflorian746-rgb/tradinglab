"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { KillzonesTimelineDiagram } from "@/app/components/charts/KillzonesTimelineDiagram";
import { AsiaRangeSweepDiagram } from "@/app/components/charts/AsiaRangeSweepDiagram";
import { NYOpenExpansionDiagram } from "@/app/components/charts/NYOpenExpansionDiagram";
import { TimingComparisonDiagram } from "@/app/components/charts/TimingComparisonDiagram";

const LESSONS = [
  { id: "lecon1", title: "Liquidité et manipulation", disabled: false },
  { id: "lecon2", title: "PD Arrays", disabled: false },
  { id: "lecon3", title: "Killzones", disabled: false },
  { id: "lecon4", title: "Displacement", disabled: false },
  { id: "lecon5", title: "Modèle ICT complet", disabled: false },
];

export default function ContentFr() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "ict", "lecon3"));
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
          <span className="text-zinc-500">Leçon 3</span>
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
            Killzones : quand le marché bouge vraiment
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Le marché ne produit pas ses plus gros mouvements au hasard. Certaines heures concentrent la majorité des impulsions, manipulations et expansions.
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
            <div className="bg-zinc-900 border-l-4 border-amber-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Le marché passe 80 % de sa journée à attendre. Tout ce qui compte se joue dans les 20 % restants. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prérequis</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Liquidité et manipulation → cf. module ICT, Leçon 1</li>
              <li>- PD Arrays et FVG → cf. module ICT, Leçon 2</li>
              <li>- Multi-timeframe → cf. module Multi-timeframe Process</li>
            </ul>
          </div>

          {/* Bloc 3 — LE MARCHÉ NE BOUGE PAS DE LA MÊME FAÇON TOUTE LA JOURNÉE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le marché ne bouge pas de la même façon toute la journée</h2>

            <div className="my-8">
              <KillzonesTimelineDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La volatilité du marché n'est pas répartie uniformément sur 24 heures. Certaines fenêtres horaires, appelées Killzones par la méthodologie ICT, concentrent la quasi-totalité des mouvements significatifs : impulsions, prises de liquidité, expansions de range, retournements structurels. Hors Killzone, le marché est généralement plat, bougies plates, latéralisation, faux signaux. Reconnaître ces fenêtres, c'est traduire le timing en avantage statistique.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- 80 % des mouvements significatifs se produisent dans 20 % des heures</li>
              <li>- Hors Killzone : range étroit, bougies plates, sweeps lents</li>
              <li>- En Killzone : expansion, impulsions franches, vrais déplacements</li>
              <li>- Trader sans regarder l'heure, c'est trader en aveugle</li>
            </ul>
          </section>

          {/* Bloc 4 — L'ASIA SESSION SERT SOUVENT DE LIQUIDITÉ */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">L'Asia Session sert souvent de liquidité</h2>

            <div className="my-8">
              <AsiaRangeSweepDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La session asiatique (environ 00h-07h UTC) produit rarement de gros mouvements directionnels. Elle dessine généralement un range étroit, avec des bougies de faible amplitude et peu de volume. Mais ce range a une fonction structurelle majeure : il sert de cible de liquidité pour les sessions suivantes. Le haut et le bas du range Asia concentrent les stops déposés par les traders qui ont positionné leur SL « juste au-dessus » ou « juste sous » la session calme. London ou New York viennent souvent sweep ces niveaux dès l'ouverture, puis impulser dans la direction opposée.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD M15 : pendant la session asiatique, le prix oscille dans un range étroit entre 1.1710 et 1.1725. À l'ouverture de Londres, une bougie casse sous 1.1710, descend jusqu'à 1.1702, les stops sous le range Asia sont déclenchés. Immédiatement après, le prix repart en flèche vers 1.1750 dans une séquence haussière impulsive. La cible n'était pas la cassure baissière, c'était la liquidité.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Le range Asia = poche de liquidité visible</li>
              <li>- Les stops accumulés au-dessus et sous ce range sont la cible de London / NY</li>
              <li>- Sweep du range Asia + réintégration = signal classique d'expansion</li>
              <li>- Trader Asia sans contexte de session = subir les sweeps qui vont arriver</li>
            </ul>
          </section>

          {/* Bloc 5 — NY OPEN PRODUIT SOUVENT LES PLUS GROS DÉPLACEMENTS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">New York Open produit souvent les plus gros déplacements</h2>

            <div className="my-8">
              <NYOpenExpansionDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              L'ouverture de New York (14h30 ou 15h30 heure de Paris selon la saison) coïncide avec l'arrivée massive du volume institutionnel américain, en plus de la session de Londres déjà active. Cette superposition produit fréquemment les expansions les plus violentes de la journée : impulsion explosive dans une direction, sweep d'un sommet ou d'un creux récent, puis retournement franc dans l'autre sens. Les setups SMC/ICT préparés en amont (PD Arrays, equal highs/lows) sont souvent « résolus » en quelques bougies à l'ouverture NY.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                Graphique M15 XAU/USD : juste avant l'ouverture de New York, le prix consolide autour de 4 640 $ dans des bougies plates de faible amplitude. À l'ouverture, après 14h30 ou 15h30 heure de Paris selon la saison, une bougie explosive haussière de 28 $ projette le prix à 4 668 $, où une mèche de sweep marque le sommet. Dans les minutes qui suivent, une cascade rouge ramène le prix à 4 610 $, une amplitude de 58 $ totale dans la première heure de NY, soit plus que la veille entière.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- NY Open = superposition London + flux US = pic de volatilité</li>
              <li>- Les setups préparés en HTF se résolvent souvent dans cette fenêtre</li>
              <li>- Sweep + retournement franc est le pattern le plus fréquent</li>
              <li>- Trader avant NY Open sans plan = trader le bruit qui précède</li>
            </ul>
          </section>

          {/* Bloc 6 — LES KILLZONES SERVENT À FILTRER LE TIMING */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Les Killzones servent à filtrer le timing</h2>

            <div className="my-8">
              <TimingComparisonDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le même setup technique, une résistance H1 testée, produira des réactions radicalement différentes selon le moment où le test arrive. En pleine Asia Session, la résistance peut être touchée et n'engendrer qu'une latéralisation molle ; en London Open, le même niveau peut produire un sweep franc suivi d'une impulsion baissière de 30 pips. La Killzone n'est pas un déclencheur en soi, c'est un FILTRE de timing : on attend que le contexte horaire soit propice avant de prendre un setup, même bien préparé techniquement.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD : la résistance H1 à 1.1780 est testée deux fois sur la même journée. Premier test à 03h UTC en plein Asia : le prix touche, produit une bougie de rejet de 4 pips, puis se cale en latéralisation pendant 2h sans déplacement. Second test à l'ouverture de London : le prix touche, sweep à 1.1792, puis cascade baissière de 35 pips en 4 bougies. Même setup, deux résultats, la différence est uniquement le timing.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Un setup ICT n'est valable que si le timing l'est aussi</li>
              <li>- Hors Killzone : réaction molle, latéralisation, faux signaux</li>
              <li>- En Killzone : sweep franc, impulsion, déplacement réel</li>
              <li>- Le filtre horaire élimine 80 % des « setups corrects » non rentables</li>
            </ul>
          </section>

          {/* Bloc 7 — PLAN D'APPLICATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan d'application : un trade Killzone EUR/USD</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Voici la séquence complète pour exploiter une Killzone sur EUR/USD. Quatre étapes, chacune avec son rôle.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Étape 1. HTF (Daily) : biais directionnel</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : EUR/USD Daily en LH/LL, résistance Daily à 1.1780</li>
                <li>- Conclusion : biais baissier, on cherchera des shorts au prochain test de zone supérieure</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 2. Asia Session (00h-07h UTC) : repérer le range</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : le prix oscille entre 1.1710 et 1.1725 pendant la session asiatique</li>
                <li>- Conclusion : range Asia tracé, niveaux notés. Les stops sous 1.1710 et au-dessus de 1.1725 sont des cibles potentielles pour London / NY</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 3. London Open (07h-10h UTC) : attendre le sweep</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : à 08h15, le prix casse sous 1.1710, descend à 1.1702 (sweep des stops sous le range Asia), puis impulsion haussière repart</li>
                <li>- Conclusion : sweep complet, mais le biais Daily reste vendeur. On attend la cible suivante : la résistance 1.1780</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Étape 4. Exécution (M15 pendant NY Open)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation : à l'ouverture NY (14h30 ou 15h30 heure de Paris selon la saison), le prix monte tester 1.1780, sweep à 1.1792, réintégration sous 1.1780, bougie baissière impulsive M15 qui casse le creux local à 1.1762</li>
                <li>- Conclusion : entrée short à 1.1758 (timing Killzone + setup ICT aligné), SL à 1.1795 (au-dessus du sweep), TP vers 1.1695. R/R ≈ 1 : 1,7, setup haute probabilité car aligné Daily + range Asia + NY Open</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-zinc-300 italic text-center">
                  HTF = biais · Asia = liquidité · London/NY = exécution · Hors Killzone = on attend
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "Le marché ne produit ses vrais mouvements que dans certaines fenêtres horaires (Killzones), pas en continu.",
              "L’Asia Session sert souvent de poche de liquidité ; London et NY viennent la sweep avant d’impulser.",
              "Le même setup technique produit des réactions radicalement différentes selon le timing horaire.",
              "La Killzone est un filtre, pas un déclencheur : sans timing favorable, on attend même un setup parfait.",
            ]}
          />

          <LessonExercice
            description="Sur TradingView, observe une journée complète sur une paire majeure et identifie où les Killzones produisent les vrais mouvements."
            steps={[
              "Repère visuellement la session asiatique (00h-07h UTC) sur M15 : note l'amplitude du range et la taille des bougies.",
              "Marque l'ouverture de London (07h UTC) et de NY (14h30 ou 15h30 heure de Paris selon la saison). Observe les 1-2 premières heures de chaque Killzone : sweep du range Asia ? impulsion franche ? amplitude par rapport à la session asiatique ?",
              "Sur la même journée, repère un setup technique (test de résistance, FVG, equal highs) qui s'est joué EN Killzone et un autre qui s'est joué HORS Killzone. Compare la qualité de la réaction.",
            ]}
          />

          <LessonQuiz
            question="Tu as un setup ICT parfait sur EUR/USD : biais Daily baissier, zone H1 confluente, le prix vient toucher la zone à 04h UTC en pleine Asia Session. Que fais-tu ?"
            options={[
              "Tu n'entres pas : le setup est correct mais le timing n'est pas une Killzone, la réaction sera molle ou nulle",
              "Tu entres immédiatement : le setup est aligné, peu importe l'heure",
              "Tu entres avec un SL très large pour absorber la lenteur de la session asiatique",
              "Tu prends l'autre sens en supposant que l'Asia va casser le biais Daily",
            ]}
            correctIndex={0}
            explanation="La Killzone est un filtre de timing, pas un détail accessoire. Un setup parfait techniquement mais qui se présente pendant l'Asia Session a une probabilité de réaction franche très faible, le marché manque simplement de volume pour produire une vraie impulsion. La discipline consiste à attendre London Open ou NY Open. Si le prix sweep le niveau pendant l'Asia, c'est souvent un faux mouvement qui sera réintégré quand le vrai volume arrive."
            answerExplanations={[
              "Correct. La Killzone filtre le timing même quand le setup est techniquement parfait. Hors Killzone, la probabilité de réaction franche chute drastiquement. La discipline ICT consiste à attendre que le timing horaire valide le setup avant d'entrer.",
              "Faux. « Peu importe l'heure » est l'opposé du modèle ICT. Le timing est aussi structurant que le setup lui-même, un setup parfait hors Killzone est statistiquement non rentable, peu importe sa qualité technique.",
              "Faux. Élargir le SL ne corrige pas le problème de timing : le marché n'a tout simplement pas le volume pour impulser pendant l'Asia. On ne prendrait que plus de risque sur un setup qui ne se déclenchera probablement pas.",
              "Faux. Prendre l'autre sens uniquement parce que la Killzone n'est pas favorable n'a aucun sens structurel. Le biais Daily reste prioritaire, la seule chose à faire, c'est attendre la prochaine Killzone pour exécuter le scénario aligné.",
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
                  markLessonComplete(p, "ict", "lecon3");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Leçon 3 du module ICT complet complétée.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/ict/lecon2" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon précédente
              </Link>
              <Link href="/strategies/ict/lecon4" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
