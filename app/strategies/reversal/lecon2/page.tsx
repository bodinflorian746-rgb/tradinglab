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

const LESSONS = [
  { id: "lecon1", slug: "lecon1", title: "Double top / Double bottom : la signature du retournement", duration: "16 min", disabled: false },
  { id: "lecon2", slug: "lecon2", title: "Head & Shoulders : le retournement majeur", duration: "18 min", disabled: false },
  { id: "lecon3", slug: "lecon3", title: "Leçon 3", duration: "", disabled: true },
  { id: "lecon4", slug: "lecon4", title: "Leçon 4", duration: "", disabled: true },
];

export default function ReversalLecon2Page() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "reversal", "lecon2"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
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
            Head &amp; Shoulders : le retournement majeur
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Le Head &amp; Shoulders est le pattern de retournement le plus réputé du trading technique. Plus complexe qu&apos;un double top, il devient plus fiable quand il se forme proprement. Cette leçon présente comment le repérer, le valider, et le trader avec un R/R modeste mais un taux de réussite élevé.
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
                    {lesson.title}
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
              <li>- Structure de marché, sommets et creux → cf. Formation Trading L3</li>
              <li>- Support / Résistance → cf. Stratégie SR L1</li>
              <li>- Double Top / Double Bottom → cf. Stratégie Reversal L1</li>
            </ul>
          </div>

          {/* Bloc 3 — POURQUOI LE H&S FONCTIONNE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Pourquoi le Head &amp; Shoulders fonctionne</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Un H&amp;S se forme à la fin d&apos;une tendance haussière. Le prix crée trois sommets : un premier sommet appelé épaule gauche, un sommet plus haut appelé tête, puis un troisième sommet plus bas que la tête appelé épaule droite. Les deux creux entre les sommets forment la neckline. Quand cette neckline casse, le retournement est confirmé.</p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Chaque sommet successif montre une perte de force des acheteurs. La tête représente le dernier vrai mouvement haussier. Quand l&apos;épaule droite échoue à revenir au niveau de la tête, le marché montre que les acheteurs arrivent au bout du mouvement. La cassure de la neckline déclenche ensuite les stops des acheteurs et accélère la baisse.</p>
            <p className="text-zinc-300 leading-relaxed text-sm">Le H&amp;S reste un pattern très accessible pour un retail. Aucun indicateur compliqué ni calcul avancé n&apos;est nécessaire. Il se voit directement sur le chart, peu importe l&apos;actif ou l&apos;unité de temps. C&apos;est le pattern de retournement le plus enseigné depuis plus de 100 ans, et il fonctionne toujours.</p>
          </section>

          {/* Bloc 4 — H&S CLASSIQUE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Head &amp; Shoulders : fin de tendance haussière</h2>
            <div className="my-8">
              <HeadShouldersDiagram />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Le H&amp;S classique apparaît à la fin d&apos;une tendance haussière. Il forme trois sommets : une épaule gauche avec un sommet modéré, une tête avec un sommet plus haut, puis une épaule droite avec un sommet proche de l&apos;épaule gauche. Les deux creux entre ces sommets définissent la neckline.</p>

            <p className="text-zinc-300 leading-relaxed text-sm font-semibold text-zinc-200 mb-2">Les 3 conditions pour qu&apos;un H&amp;S soit valide :</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-4">
              <li>- Une tendance haussière préalable claire</li>
              <li>- La tête doit être strictement plus haute que les 2 épaules</li>
              <li>- Une cassure confirmée de la neckline (clôture, pas mèche)</li>
            </ul>

            <p className="text-zinc-300 leading-relaxed text-sm">Exemple sur XAU/USD. Le marché est haussier depuis plusieurs séances. Il monte vers 4 620$ pour former l&apos;épaule gauche, redescend à 4 580$, repart vers 4 660$ pour former la tête, puis redescend à 4 575$. Ensuite, il remonte vers 4 625$ pour former l&apos;épaule droite, au même niveau que l&apos;épaule gauche. La neckline relie les deux creux autour de 4 578$. Quand le prix clôture sous 4 575$, le H&amp;S est confirmé.</p>
          </section>

          {/* Bloc 5 — VARIANTES DE NECKLINE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Variantes de neckline</h2>
            <div className="my-8">
              <HSNecklineSlopeDiagram />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">La neckline d&apos;un H&amp;S n&apos;est pas toujours strictement horizontale. Sa pente conditionne le measured move et donc la cible TP.</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- <span className="text-white font-semibold">Neckline horizontale</span> — measured move standard, TP plein conservé.</li>
              <li>- <span className="text-white font-semibold">Neckline ascendante</span> — measured move étendu, le TP gagne quelques pips supplémentaires.</li>
              <li>- <span className="text-white font-semibold">Neckline descendante</span> — measured move réduit, TP plus serré, R/R souvent moins favorable.</li>
            </ul>
          </section>

          {/* Bloc 6 — H&S INVERSÉ */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Head &amp; Shoulders Inversé : fin de tendance baissière</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Le H&amp;S inversé est le miroir du H&amp;S classique. Il apparaît à la fin d&apos;une tendance baissière. Le prix forme trois creux : une épaule gauche avec un creux modéré, une tête avec un creux plus bas, puis une épaule droite avec un creux proche de l&apos;épaule gauche. La neckline relie les deux sommets entre les creux.</p>

            <p className="text-zinc-300 leading-relaxed text-sm font-semibold text-zinc-200 mb-2">Les 3 conditions restent les mêmes, en miroir :</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-4">
              <li>- Une tendance baissière préalable claire</li>
              <li>- La tête doit être strictement plus basse que les 2 épaules</li>
              <li>- Une cassure confirmée de la neckline vers le haut (clôture)</li>
            </ul>

            <p className="text-zinc-300 leading-relaxed text-sm">Exemple sur XAU/USD. Le marché est baissier depuis plusieurs séances. Il descend vers 4 470$ pour former l&apos;épaule gauche, remonte à 4 510$, repart vers 4 430$ pour former la tête, puis remonte à 4 515$. Ensuite, il redescend vers 4 475$ pour former l&apos;épaule droite. La neckline relie les deux sommets autour de 4 512$. Quand le prix clôture au-dessus de 4 515$, le H&amp;S inversé est confirmé.</p>
          </section>

          {/* Bloc 7 — PLAN D'EXÉCUTION DU TRADE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan d&apos;exécution du trade</h2>
            <div className="my-8">
              <HSTradeExecutionDiagram />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">L&apos;entrée se fait short juste sous la neckline pour saisir le breakdown. Le prix ne se chasse pas pendant la chute. Une clôture propre sous la neckline est requise.</p>
            <p className="text-zinc-300 leading-relaxed text-sm">Le SL classique se place au-dessus de la tête pour une invalidation maximale, mais ça donne souvent un R/R trop faible. Le SL tactique plus serré se place au-dessus de l&apos;épaule droite : moins sécurisé, mais plus exploitable. Le TP suit la measured move : hauteur du pattern entre la tête et la neckline, projetée sous la neckline.</p>
          </section>

          {/* Bloc 8 — PLAN DE TRADE XAU/USD H1 */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de trade : H&amp;S XAU/USD H1</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Le contexte du H&amp;S classique du Bloc 4 est repris. La tendance haussière était déjà en place. L&apos;épaule gauche se forme à 4 620$, la tête à 4 660$, l&apos;épaule droite à 4 625$, avec une neckline autour de 4 578$. Le prix vient de clôturer une bougie H1 à 4 570$, sous la neckline. Le pattern est confirmé.</p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Le SL tactique est placé juste au-dessus de l&apos;épaule droite à 4 630$. Le SL classique au-dessus de la tête à 4 670$ donnerait un R/R trop faible : l&apos;option tactique reste retenue pour ce setup.</p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Le TP suit la measured move : hauteur du pattern entre la tête à 4 660$ et la neckline à 4 578$, soit 82$. Cette hauteur est projetée sous la neckline vers 4 496$. La cible est étendue légèrement à 4 480$ pour obtenir un R/R rond de 1,5:1.</p>

            <div className="border border-zinc-800 rounded-xl p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Entrée short : 4 570$ (clôture sous neckline)</li>
                <li>- Stop loss : 4 630$ (60$ au-dessus de l&apos;épaule droite à 4 625$)</li>
                <li>- Take profit : 4 480$ (90$, measured move étendu)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Calcul du R/R</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Risque : 4 630 - 4 570 = 60$</li>
                <li>- Gain potentiel : 4 570 - 4 480 = 90$</li>
                <li>- R/R : 90 / 60 = 1,5:1</li>
                <li>- Setup exploitable au seuil minimum.</li>
              </ul>
            </div>
          </section>

          {/* Bloc 9 — CALCUL RETAIL */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Calcul retail</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Le risque par trade s&apos;adapte au capital. Sur ce setup R/R 1,5:1, voici la répartition selon la taille du compte.</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- Compte 300€ → 5% = risque 15€, gain potentiel environ 22€</li>
              <li>- Compte 500€ → 3% = risque 15€, gain potentiel environ 22€</li>
              <li>- Compte 1 000€ → 2% = risque 20€, gain potentiel environ 30€</li>
              <li>- Compte 2 500€ → 2% = risque 50€, gain potentiel environ 75€</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">Le R/R 1,5:1 reste modeste comparé à un Pin bar ou un pullback de tendance, mais le H&amp;S a un taux de réussite plus élevé quand le pattern est propre. Sur 100 trades, la rentabilité est atteinte même avec un R/R modeste si le win rate dépasse 50%.</p>
          </section>

          {/* Bloc 10 — FILTRES : QUAND NE PAS PRENDRE LE SETUP */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Filtres : quand ne pas prendre le setup</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">1. Tête pas assez marquée.</span> <span className="text-zinc-300">Si la tête dépasse à peine les épaules, moins de 0,3% au-dessus, le pattern devient faible. Le marché hésite sans cassure structurelle franche. Setup à ignorer.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">2. Épaules trop asymétriques.</span> <span className="text-zinc-300">Si l&apos;épaule droite est beaucoup plus haute ou plus basse que la gauche, avec plus de 0,5% d&apos;écart, le pattern perd sa logique classique. La structure devient moins fiable.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">3. Cassure sur mèche, sans clôture.</span> <span className="text-zinc-300">Une mèche qui casse brièvement la neckline puis remonte ne valide rien. Une vraie clôture franche est attendue. Sur H&amp;S, la patience reste critique.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">4. News majeure dans la fenêtre.</span> <span className="text-zinc-300">Si FOMC, NFP ou CPI arrive dans les 30 minutes, le setup n&apos;est pas pris. Une news peut invalider le pattern immédiatement.</span></div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "Head & Shoulders = 3 sommets après une tendance haussière. La tête est plus haute que les 2 épaules. H&S Inversé = miroir sur tendance baissière.",
              "Confirmation = clôture franche sous ou au-dessus de la neckline. Pas de mèche.",
              "SL classique au-dessus de la tête, SL tactique au-dessus de l’épaule droite pour un R/R plus exploitable. TP = measured move (hauteur tête → neckline projetée).",
              "Le R/R du H&S est modeste, souvent autour de 1,5:1, mais le taux de réussite reste élevé quand le pattern est propre.",
            ]}
          />

          <LessonExercice
            description="Sur XAU/USD H1, tu vois un H&S avec épaule gauche à 4 650$, tête à 4 680$, épaule droite à 4 658$. Neckline à 4 620$. La tête est 30 pips au-dessus des épaules (0,65%). Le prix vient de clôturer à 4 615$. Tu prends le setup ?"
            steps={[
              "Vérifier que la tête (4 680$) est strictement plus haute que les 2 épaules : 30 pips au-dessus, soit 0,65% — supérieur au seuil de 0,3%, OK",
              "Confirmer que les épaules sont symétriques : 4 650$ vs 4 658$, écart de 8 pips (0,17%) — sous le seuil de 0,5%, OK",
              "Confirmer la cassure : clôture à 4 615$ sous la neckline à 4 620$, pas une simple mèche",
              "Vérifier qu’aucune news majeure n’est prévue dans les 30 prochaines minutes",
              "Prendre l’entrée short à 4 615$, SL au-dessus de l’épaule droite à 4 668$, TP measured move étendu à 4 540$ pour un R/R rond de 1,5:1",
            ]}
          />

          <LessonQuiz
            question="Qu’est-ce qui caractérise un Head & Shoulders ?"
            options={[
              "Deux sommets quasi égaux",
              "Trois sommets dont le central est le plus haut",
              "Une ligne de tendance brisée",
              "Un croisement de moyennes mobiles",
            ]}
            correctIndex={1}
            explanation="Le H&S est défini par 3 sommets : épaule gauche, tête (le plus haut), épaule droite. La tête doit être strictement plus haute que les 2 épaules pour que le pattern soit valide. Les deux creux entre ces sommets forment la neckline."
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
              <Link href="/strategies/reversal/lecon1" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon 1
              </Link>
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Leçon 3 — À venir
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
