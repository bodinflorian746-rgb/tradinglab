"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LiquidityPoolsDiagram } from "@/app/components/charts/LiquidityPoolsDiagram";
import { LiquidityGrabDiagram } from "@/app/components/charts/LiquidityGrabDiagram";
import { FVGDiagram } from "@/app/components/charts/FVGDiagram";

const LESSONS = [
  { id: "lecon1", title: "Leçon 1", disabled: false },
  { id: "lecon2", title: "Leçon 2", disabled: false },
  { id: "lecon3", title: "Leçon 3", disabled: false },
  { id: "lecon4", title: "FVG et liquidité : trader le déséquilibre institutionnel", disabled: false },
  { id: "lecon5", title: "Leçon 5", disabled: true },
];

export default function ContentFr() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "smc", "lecon4"));
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
          <span className="text-zinc-500">Leçon 4</span>
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
            FVG et liquidité : trader le déséquilibre institutionnel
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Le marché ne se déplace pas uniquement par tendance ou structure. Les mouvements les plus agressifs apparaissent souvent après une prise de liquidité suivie d&apos;un déséquilibre de prix. Cette leçon relie 3 concepts opérationnels : la liquidité (BSL/SSL), le sweep et le Fair Value Gap (FVG).
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

        {/* ── Contenu ── */}
        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-blue-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Le retail voit un breakout. Les institutions voient une zone de stops à balayer avant le vrai mouvement. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prérequis</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Market Structure → cf. Stratégie SMC L1</li>
              <li>- BOS / CHoCH → cf. Stratégie SMC L2</li>
              <li>- Order Blocks → cf. Stratégie SMC L3</li>
            </ul>
          </div>

          {/* Bloc 3 — LES POOLS DE LIQUIDITÉ */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Les pools de liquidité</h2>
            <div className="my-8">
              <LiquidityPoolsDiagram />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Les zones de liquidité correspondent aux endroits où les stops du retail sont concentrés. Les sommets récents attirent les stops vendeurs (BSL), tandis que les creux récents concentrent les stops acheteurs (SSL). Les equal highs et equal lows créent des zones de liquidité évidentes pour les institutionnels.</p>
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Points à repérer</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Equal highs = BSL potentielle</li>
              <li>- Equal lows = SSL potentielle</li>
              <li>- Sommets/creux HTF = liquidité majeure</li>
            </ul>
          </section>

          {/* Bloc 4 — LE SWEEP */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le sweep : le grab de liquidité</h2>
            <div className="my-8">
              <LiquidityGrabDiagram />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Le sweep apparaît lorsque le prix traverse brutalement une zone de liquidité avant de réintégrer rapidement le range ou la structure précédente. La mèche prend les stops. La clôture rejette le mouvement. Le sweep sert souvent à remplir des ordres institutionnels avant l&apos;impulsion opposée.</p>
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Caractéristiques du sweep</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Perçage rapide d&apos;un sommet ou d&apos;un creux</li>
              <li>- Mèche agressive avec rejet visible</li>
              <li>- Clôture réintégrée sous/au-dessus du niveau sweepé</li>
            </ul>
          </section>

          {/* Bloc 5 — LE FAIR VALUE GAP */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le Fair Value Gap (FVG)</h2>
            <div className="my-8">
              <FVGDiagram />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Le Fair Value Gap représente un déséquilibre laissé par une impulsion rapide. Dans une séquence de 3 bougies, un espace reste non traité entre la mèche de la bougie 1 et celle de la bougie 3. Le marché revient fréquemment dans cette zone afin de mitiger l&apos;inefficience avant de poursuivre son mouvement.</p>
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Caractéristiques du FVG</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Apparition dans une impulsion forte</li>
              <li>- Déséquilibre visible entre 3 bougies</li>
              <li>- Retour fréquent du prix pour mitigation</li>
            </ul>
          </section>

          {/* Bloc 6 — COMBINER SWEEP + FVG */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Combiner sweep + FVG : le setup complet</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Le sweep crée souvent un déplacement brutal qui laisse un FVG dans le mouvement de rejet. Le retour du prix dans le FVG permet ensuite d&apos;obtenir une entrée plus précise avec un stop réduit.</p>
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Séquence type</p>
            <ol className="space-y-1 text-sm text-zinc-300 list-decimal pl-5">
              <li>Liquidité identifiée (BSL/SSL)</li>
              <li>Sweep de la zone</li>
              <li>Displacement agressif</li>
              <li>Création du FVG</li>
              <li>Retour dans le FVG</li>
              <li>Cible vers la liquidité opposée</li>
            </ol>
          </section>

          {/* Bloc 7 — PLAN DE TRADE EUR/USD H4 */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de trade chiffré (EUR/USD H4)</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">EUR/USD H4. Accumulation entre 1.1700 et 1.1750. Equal highs à 1.1760 = BSL identifiée. Une bougie H4 perce 1.1760 puis clôture à 1.1745. Le rejet crée un FVG bearish entre 1.1735 et 1.1748. Le setup consiste à attendre le retour du prix dans le FVG afin de chercher une entrée short vers la SSL située sous 1.1700.</p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Entrée short : 1.1745</li>
                <li>- Stop loss : 1.1768</li>
                <li>- Take profit : 1.1700</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Lecture du setup</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Sweep haussier au-dessus de 1.1760</li>
                <li>- Réintégration immédiate sous la BSL</li>
                <li>- Displacement bearish agressif</li>
                <li>- Création du FVG bearish</li>
                <li>- Retour dans le FVG = zone d&apos;entrée</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Calcul du R/R</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-3">
                <li>- Risque : 1.1768 - 1.1745 = 23 pips</li>
                <li>- Gain : 1.1745 - 1.1700 = 45 pips</li>
                <li>- R/R : 45 / 23 = 1,96</li>
              </ul>
              <p className="text-zinc-300 leading-relaxed text-sm">Le setup présente un rendement presque deux fois supérieur au risque engagé.</p>
            </div>

            <p className="text-white font-semibold text-sm mb-2">Calcul retail</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- Compte 300€ → 5% = risque 15€, gain potentiel 29€</li>
              <li>- Compte 500€ → 3% = risque 15€, gain potentiel 29€</li>
              <li>- Compte 1 000€ → 2% = risque 20€, gain potentiel 39€</li>
              <li>- Compte 2 500€ → 2% = risque 50€, gain potentiel 98€</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">Le R/R reste 1,96:1 peu importe la taille du compte.</p>
          </section>

          {/* Bloc 8 — FILTRES */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Filtres : quand ne pas prendre le setup</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">Sweep sans FVG clair</span> <span className="text-zinc-300">= manque de déséquilibre exploitable.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">FVG déjà totalement mitigé</span> <span className="text-zinc-300">= inefficience déjà comblée.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">Contexte de range sale</span> <span className="text-zinc-300">= absence de direction HTF.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">News macro majeure imminente</span> <span className="text-zinc-300">= volatilité imprévisible.</span></div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "La liquidité se concentre au-dessus des sommets et sous les creux.",
              "Le sweep balaie les stops avant le vrai mouvement.",
              "Le FVG représente une inefficience laissée par l’impulsion.",
              "Le setup SMC complet = sweep → displacement → FVG → mitigation.",
            ]}
          />

          <LessonExercice
            description="Sur XAU/USD H4, le marché affiche 2 equal highs à 4 680$ et un creux récent à 4 600$. Une bougie H4 perce 4 680$, imprime une mèche à 4 690$, puis clôture à 4 660$. Les bougies suivantes créent un FVG bearish entre 4 645$ et 4 658$. Le prix revient ensuite dans le FVG. Comment se construit le plan de trade sur ce setup ?"
            steps={[
              "Identifier la liquidité : les 2 equal highs à 4 680$ constituent une BSL. La mèche à 4 690$ confirme le sweep au-dessus du niveau.",
              "Confirmer le rejet : la clôture à 4 660$, sous les equal highs, valide la réintégration — le breakout était un sweep, pas une cassure.",
              "Localiser le FVG : le déséquilibre bearish se situe entre 4 645$ et 4 658$. Le retour du prix dans cette zone fournit le point d’entrée short.",
              "Poser le plan : entrée short 4 655$ (dans le FVG), stop loss 4 695$ (au-dessus de la mèche du sweep), take profit 4 605$ (cible la SSL sous le creux 4 600$).",
              "Calculer le R/R : risque 40$, gain potentiel 50$, R/R 1,25. Le setup reste acceptable mais présente un rendement moins favorable que le cas EUR/USD H4.",
            ]}
          />

          <LessonQuiz
            question="Quelle caractéristique distingue le plus souvent un sweep d’un vrai breakout institutionnel ?"
            options={[
              "Le marché clôture au-dessus du niveau cassé avec continuation forte",
              "Le sweep laisse rarement une mèche visible",
              "Le prix réintègre rapidement le niveau sweepé après avoir pris la liquidité",
              "Un sweep apparaît uniquement pendant les news macro",
            ]}
            correctIndex={2}
            explanation="Le sweep se reconnaît à la réintégration rapide du niveau sweepé après que la liquidité a été prise. La mèche perce, les stops sont déclenchés, puis le prix revient sous (ou au-dessus) du niveau et rejette le mouvement. Un vrai breakout institutionnel se traduirait au contraire par une clôture franche au-delà du niveau avec continuation directionnelle."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "smc", "lecon4");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Leçon 4 du module SMC : Penser institutionnel complétée.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/smc/lecon3" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon 3
              </Link>
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Leçon 5 — À venir
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
