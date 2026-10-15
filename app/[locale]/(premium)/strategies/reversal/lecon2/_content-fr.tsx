"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import HeadShouldersDiagram from "@/app/components/charts/HeadShouldersDiagram";
import HSNecklineSlopeDiagram from "@/app/components/charts/HSNecklineSlopeDiagram";
import HSTradeExecutionDiagram from "@/app/components/charts/HSTradeExecutionDiagram";
import { LESSON_STEPS_FR } from "@/lib/lessons/exercises";

const LESSONS = [
  { id: "lecon1", slug: "lecon1", title: "Double top / Double bottom : la signature du retournement", duration: "16 min", disabled: false },
  { id: "lecon2", slug: "lecon2", title: "Épaule-tête-épaule : le retournement majeur", duration: "18 min", disabled: false },
  { id: "lecon3", slug: "lecon3", title: "Divergence RSI : quand le momentum trahit la tendance", duration: "17 min", disabled: false },
  { id: "lecon4", slug: "lecon4", title: "Trader un reversal : checklist d’invalidation", duration: "18 min", disabled: false },
];

export default function ContentFr() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "reversal", "lecon2"));
  }, []);

  return (
    <main className="tsx-v2 tsx-v2--soft lesson-v2 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Stratégies</Link>
          <span>/</span>
          <Link href="/strategies/reversal" className="hover:text-zinc-400 transition-colors">Reversal &amp; Retournements</Link>
          <span>/</span>
          <span className="text-zinc-500">Leçon 2</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Débutant
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
            Épaule-tête-épaule : le retournement majeur
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              L&apos;épaule-tête-épaule est le pattern de retournement le plus réputé du trading technique. Plus complexe qu&apos;un double top, il devient plus fiable quand il se forme proprement. Cette leçon présente comment le repérer, le valider, et le trader avec un R/R modeste mais un winrate élevé.
            </p>
          </div>

          <div className="mt-5 flex items-center gap-2 text-xs text-zinc-600">
            {LESSON_STEPS_FR.map((step, i, arr) => (
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

        {/* ── Contenu ── */}
        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Quand le marché fait 3 sommets et que le 3ème échoue plus bas que le précédent, c&apos;est rarement un hasard. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prérequis</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Structure de marché, sommets et creux → cf. Formation Intermédiaire, leçon 1</li>
              <li>- Support / Résistance → cf. Stratégie SR L1</li>
              <li>- Double Top / Double Bottom → cf. Stratégie Reversal L1</li>
            </ul>
          </div>

          {/* Bloc 3 — POURQUOI LE H&S FONCTIONNE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Pourquoi l&apos;épaule-tête-épaule fonctionne</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Un ETE se forme à la fin d&apos;une tendance haussière. Le prix crée trois sommets : un premier sommet appelé épaule gauche, un sommet plus haut appelé tête, puis un troisième sommet plus bas que la tête appelé épaule droite. Les deux creux entre les sommets forment la ligne de cou. Quand cette ligne de cou casse, le retournement est confirmé.</p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Chaque sommet successif montre une perte de force des acheteurs. La tête représente le dernier vrai mouvement haussier. Quand l&apos;épaule droite échoue à revenir au niveau de la tête, le marché montre que les acheteurs arrivent au bout du mouvement. Le breakout de la ligne de cou déclenche ensuite les stops des acheteurs et accélère la baisse.</p>
            <p className="text-zinc-300 leading-relaxed text-sm">L&apos;ETE reste un pattern très accessible pour un retail. Aucun indicateur compliqué ni calcul avancé n&apos;est nécessaire. Il se voit directement sur le chart, peu importe l&apos;actif ou l&apos;unité de temps. C&apos;est le pattern de retournement le plus enseigné depuis plus de 100 ans, et il reste utilisé aujourd&apos;hui.</p>
          </section>

          {/* Bloc 4 — H&S CLASSIQUE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Épaule-tête-épaule : fin de tendance haussière</h2>
            <div className="my-8">
              <HeadShouldersDiagram />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">L&apos;ETE classique apparaît à la fin d&apos;une tendance haussière. Il forme trois sommets : une épaule gauche avec un sommet modéré, une tête avec un sommet au-dessus des deux épaules, puis une épaule droite avec un sommet proche de l&apos;épaule gauche. Les deux creux entre ces sommets définissent la ligne de cou.</p>

            <p className="text-zinc-300 leading-relaxed text-sm font-semibold text-zinc-200 mb-2">Les 3 conditions pour qu&apos;un ETE soit valide :</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-4">
              <li>- Une tendance haussière préalable claire</li>
              <li>- La tête doit être strictement plus haute que les 2 épaules</li>
              <li>- Un breakout confirmé de la ligne de cou (clôture, pas mèche)</li>
            </ul>

            <p className="text-zinc-300 leading-relaxed text-sm">Exemple sur EUR/USD. Le marché est haussier depuis plusieurs séances. Il monte vers 1.0920 pour former l&apos;épaule gauche, redescend à 1.0880, repart vers 1.0960 pour former la tête, puis redescend à 1.0875. Ensuite, il remonte vers 1.0925 pour former l&apos;épaule droite, au même niveau que l&apos;épaule gauche. La ligne de cou relie les deux creux autour de 1.0878. Quand le prix clôture sous 1.0875, l&apos;ETE est confirmé.</p>
          </section>

          {/* Bloc 5 — VARIANTES DE NECKLINE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Variantes de ligne de cou</h2>
            <div className="my-8">
              <HSNecklineSlopeDiagram />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">La ligne de cou d&apos;un ETE n&apos;est pas toujours strictement horizontale. Le calcul du measured move ne change pas : la hauteur se mesure de la tête jusqu&apos;à la ligne de cou, à la verticale de la tête, puis se reporte sous le point de breakout de la ligne de cou.</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- <span className="text-white font-semibold">Ligne de cou horizontale</span>, le breakout se fait au niveau des deux creux : hauteur reportée sous la ligne de cou.</li>
              <li>- <span className="text-white font-semibold">Ligne de cou ascendante</span>, le point de breakout est plus haut sur la ligne : la hauteur se reporte depuis ce point, pas depuis le creux le plus bas.</li>
              <li>- <span className="text-white font-semibold">Ligne de cou descendante</span>, le point de breakout est plus bas sur la ligne : la hauteur se reporte depuis ce point, le TP descend d&apos;autant.</li>
            </ul>
          </section>

          {/* Bloc 6 — H&S INVERSÉ */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Épaule-tête-épaule inversé : fin de tendance baissière</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">L&apos;ETE inversé est le miroir de l&apos;ETE classique. Il apparaît à la fin d&apos;une tendance baissière. Le prix forme trois creux : une épaule gauche avec un creux modéré, une tête avec un creux sous les deux épaules, puis une épaule droite avec un creux proche de l&apos;épaule gauche. La ligne de cou relie les deux sommets entre les creux.</p>

            <p className="text-zinc-300 leading-relaxed text-sm font-semibold text-zinc-200 mb-2">Les 3 conditions restent les mêmes, en miroir :</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-4">
              <li>- Une tendance baissière préalable claire</li>
              <li>- La tête doit être strictement plus basse que les 2 épaules</li>
              <li>- Un breakout confirmé de la ligne de cou vers le haut (clôture)</li>
            </ul>

            <p className="text-zinc-300 leading-relaxed text-sm">Exemple sur EUR/USD. Le marché est baissier depuis plusieurs séances. Il descend vers 1.0770 pour former l&apos;épaule gauche, remonte à 1.0810, repart vers 1.0730 pour former la tête, puis remonte à 1.0815. Ensuite, il redescend vers 1.0775 pour former l&apos;épaule droite. La ligne de cou relie les deux sommets autour de 1.0812. Quand le prix clôture au-dessus de 1.0815, l&apos;ETE inversé est confirmé.</p>
          </section>

          {/* Bloc 7 — PLAN D'EXÉCUTION DU TRADE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan d&apos;exécution du trade</h2>
            <div className="my-8">
              <HSTradeExecutionDiagram />
            </div>
                        <p className="text-zinc-300 leading-relaxed text-sm mb-3">La clôture sous la ligne de cou confirme le pattern. Le prix ne se chasse pas pendant la chute.</p>
            <p className="text-zinc-300 leading-relaxed text-sm">L&apos;objectif est la measured move : la hauteur du pattern, de la tête à la ligne de cou, projetée sous la ligne de cou, et pas plus loin. Avec un SL au-dessus de l&apos;épaule droite (au-dessus de la tête, il serait encore plus loin), l&apos;entrée sur le breakout donne souvent un R/R trop faible. Dans ce cas, pas d&apos;entrée sur le breakout : on attend que le prix revienne tester la ligne de cou par en dessous et la rejette, puis on entre à la clôture de la bougie de rejet, SL juste au-dessus de sa mèche.</p>
          </section>

          {/* Bloc 8 — PLAN DE TRADE EUR/USD H1 */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de trade : ETE EUR/USD H1</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Le contexte de l&apos;ETE classique du Bloc 4 est repris. La tendance haussière était déjà en place. L&apos;épaule gauche se forme à 1.0920, la tête à 1.0960, l&apos;épaule droite à 1.0925, avec une ligne de cou autour de 1.0878. Le prix vient de clôturer une bougie H1 à 1.0870, sous la ligne de cou. Le pattern est confirmé.</p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Le TP suit la measured move : hauteur entre la tête à 1.0960 et la ligne de cou à 1.0878, soit 82 pips, projetée sous la ligne de cou : 1.0796. La cible reste à la projection, sans l&apos;étendre.</p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Pris sur le breakout à 1.0870 avec un SL au-dessus de l&apos;épaule droite (1.0930), le trade risquerait 60 pips pour 74 pips de gain : R/R 1:1,23, sous le repère de 1:2. Pas d&apos;entrée à ce moment-là. Deux bougies plus tard, le prix remonte tester la ligne de cou : mèche jusqu&apos;à 1.0886, clôture à 1.0866, de nouveau sous la ligne. C&apos;est le signal d&apos;entrée.</p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Entrée short : 1.0866 (clôture de la bougie de rejet du retest)</li>
                <li>- Stop loss : 1.0892 (6 pips au-dessus de la mèche du retest à 1.0886)</li>
                <li>- Take profit : 1.0796 (projection de la measured move)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Calcul du R/R</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Risque : 1.0892 - 1.0866 = 26 pips</li>
                <li>- Gain potentiel : 1.0866 - 1.0796 = 70 pips</li>
                <li>- R/R : 70 / 26 = 2,69, soit 1:2,69</li>
                <li>- Sur le breakout, le même TP donnait 74 / 60 = 1:1,23 : setup refusé. S&apos;il n&apos;y a pas de retest, le trade n&apos;est pas pris, c&apos;est un setup manqué, pas une perte.</li>
              </ul>
            </div>
          </section>

          {/* Bloc 9 — CALCUL RETAIL */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Calcul retail</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">La règle de risque (2% du capital au maximum) appliquée à l&apos;entrée au retest, au lot près.</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- Au lot minimum (0,01 lot), chaque pip vaut environ 0,085€ : ce stop de 26 pips représente environ 2€ de risque</li>
              <li>- Compte 300€ → 2% = 6€ maximum : 0,02 lot, risque environ 4€, gain potentiel environ 12€</li>
              <li>- Compte 500€ → 2% = 10€ maximum : 0,04 lot, risque environ 9€, gain potentiel environ 24€</li>
              <li>- Compte 1 000€ → 2% = 20€ maximum : 0,09 lot, risque environ 20€, gain potentiel environ 54€</li>
              <li>- Compte 2 500€ → 2% = 50€ maximum : 0,22 lot, risque environ 49€, gain potentiel environ 131€</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">Pris au retest, l&apos;ETE offre un R/R de 1:2,69 avec un stop court. Le prix ne revient pas toujours tester la ligne de cou : c&apos;est le prix de ce R/R, quelques setups manqués plutôt que des trades au R/R trop faible.</p>
          </section>

          {/* Bloc 10 — FILTRES : QUAND NE PAS PRENDRE LE SETUP */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Filtres : quand ne pas prendre le setup</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">1. Tête pas assez marquée.</span> <span className="text-zinc-300">Si la tête dépasse à peine les épaules, moins de 0,3% au-dessus, le pattern devient faible. Le marché hésite sans breakout structurelle franche. Setup à ignorer.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">2. Épaules trop asymétriques.</span> <span className="text-zinc-300">Si l&apos;épaule droite est beaucoup plus haute ou plus basse que la gauche, avec plus de 0,5% d&apos;écart, le pattern perd sa logique classique. La structure devient moins fiable.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">3. Breakout sur mèche, sans clôture.</span> <span className="text-zinc-300">Une mèche qui casse brièvement la ligne de cou puis remonte ne valide rien. Une vraie clôture franche est attendue. Sur ETE, la patience reste critique.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">4. News majeure dans la fenêtre.</span> <span className="text-zinc-300">Si FOMC, NFP ou CPI arrive dans les 30 minutes, le setup n&apos;est pas pris. Une news peut invalider le pattern immédiatement.</span></div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "Épaule-tête-épaule = 3 sommets après une tendance haussière. La tête est plus haute que les 2 épaules. ETE inversé = miroir sur tendance baissière.",
              "Confirmation = clôture franche sous ou au-dessus de la ligne de cou. Pas de mèche.",
              "TP = measured move : hauteur tête → ligne de cou, projetée sous la ligne de cou, sans l’étendre. Si le R/R est trop faible sur le breakout, l’entrée se fait au retest de la ligne de cou, SL au-dessus de la mèche du retest.",
              "Pris sur le breakout, le R/R de l'ETE est souvent sous 1:2 : l'entrée au retest le rend exploitable, au prix de quelques setups manqués.",
            ]}
          />

          <LessonExercice
            description="Sur EUR/USD H1, tu vois un ETE avec épaule gauche à 1.0950, tête à 1.0995, épaule droite à 1.0958. Ligne de cou à 1.0920. La tête est 37 pips au-dessus de l’épaule droite (0,34%). Le prix vient de clôturer à 1.0915. Tu prends le setup ?"
            steps={[
              "Vérifier que la tête (1.0995) est strictement plus haute que les 2 épaules : 37 pips au-dessus de l’épaule droite, soit 0,34%, au-dessus du seuil de 0,3%, OK",
              "Confirmer que les épaules sont symétriques : 1.0950 vs 1.0958, écart de 8 pips (0,07%), sous le seuil de 0,5%, OK",
              "Confirmer le breakout : clôture à 1.0915 sous la ligne de cou à 1.0920, pas une simple mèche",
              "Vérifier qu’aucune news majeure n’est prévue dans les 30 prochaines minutes",
              "Calculer la cible : hauteur tête → ligne de cou de 75 pips, projetée sous 1.0920, TP 1.0845. Sur le breakout, avec un SL au-dessus de l’épaule droite (1.0968) : 53 pips de risque pour 70 pips de gain, R/R 1:1,32, pas d’entrée",
              "Attendre le retest : si le prix remonte vers 1.0920 et la rejette (par exemple mèche à 1.0928, clôture à 1.0914), entrée short à 1.0914, SL 1.0934 au-dessus de la mèche, TP 1.0845 : 20 pips de risque pour 69 pips de gain, R/R 1:3,45",
            ]}
          />

          <LessonQuiz
            question="Qu’est-ce qui caractérise un épaule-tête-épaule ?"
            options={[
              "Deux sommets quasi égaux",
              "Trois sommets dont le central est le plus haut",
              "Une ligne de tendance brisée",
              "Un croisement de moyennes mobiles",
            ]}
            correctIndex={1}
            explanation="L'ETE est défini par 3 sommets : épaule gauche, tête (le plus haut), épaule droite. La tête doit être strictement plus haute que les 2 épaules pour que le pattern soit valide. Les deux creux entre ces sommets forment la ligne de cou."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "reversal", "lecon2");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Leçon 2 du module Reversal &amp; Retournements complétée.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/reversal/lecon1" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon 1
              </Link>
              <Link href="/strategies/reversal/lecon3" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                Leçon 3. Divergence RSI : quand le momentum trahit la tendance
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
