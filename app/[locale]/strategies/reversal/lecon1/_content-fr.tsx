"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import DoubleTopBottomDiagram from "@/app/components/charts/DoubleTopBottomDiagram";
import DTBValidationGridDiagram from "@/app/components/charts/DTBValidationGridDiagram";
import DTBMeasuredMoveProjectionDiagram from "@/app/components/charts/DTBMeasuredMoveProjectionDiagram";

const LESSONS = [
  { id: "lecon1", slug: "lecon1", title: "Double top / Double bottom : la signature du retournement", duration: "16 min", disabled: false },
  { id: "lecon2", slug: "lecon2", title: "Leçon 2", duration: "", disabled: true },
  { id: "lecon3", slug: "lecon3", title: "Leçon 3", duration: "", disabled: true },
  { id: "lecon4", slug: "lecon4", title: "Leçon 4", duration: "", disabled: true },
];

export default function ContentFr() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "reversal", "lecon1"));
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
          <span className="text-zinc-500">Leçon 1</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Débutant
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
            Double top / Double bottom : la signature du retournement
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Reconnaître un retournement avant qu&apos;il soit trop tard fait la différence entre conserver les gains et tout rendre. Le double top et le double bottom sont les deux patterns de retournement les plus simples à repérer. Cette leçon présente comment les identifier et les trader.
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

        {/* ── Contenu ── */}
        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Quand le marché échoue deux fois au même prix, ce n&apos;est plus du hasard. C&apos;est un signal. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prérequis</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Structure de marché HH/HL/LL/LH → cf. Formation Trading L3</li>
              <li>- Support / Résistance → cf. Stratégie SR L1</li>
              <li>- Bougie de cassure, clôture vs mèche → cf. Formation Trading L2</li>
            </ul>
          </div>

          {/* Bloc — POURQUOI CES PATTERNS FONCTIONNENT */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Pourquoi ces patterns fonctionnent</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Quand le prix touche une résistance, redescend, puis revient tester ce même niveau sans le casser, c&apos;est un signal clair. Les acheteurs n&apos;ont plus assez de force pour pousser au-dessus. Le marché montre que ce niveau est défendu. En miroir, le double bottom montre la même logique sur un support.</p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Un double top n&apos;est pas juste un dessin sur un graphique. C&apos;est l&apos;expression visible d&apos;un déséquilibre. À chaque test du niveau, des vendeurs prennent leurs profits ou de nouveaux vendeurs entrent. Au deuxième échec, ceux qui étaient long en pullback commencent à sortir, ce qui accélère la baisse.</p>
            <p className="text-zinc-300 leading-relaxed text-sm">Ce pattern reste accessible au retail parce qu&apos;il se lit vite. Contrairement aux concepts ICT ou aux structures complexes, un double top se voit en 5 secondes. Aucun besoin de 6 indicateurs pour le détecter.</p>
          </section>

          {/* Bloc 3 — DOUBLE TOP */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Double Top : fin de tendance haussière</h2>
            <div className="my-8">
              <DoubleTopBottomDiagram />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Un double top se forme à la fin d&apos;une tendance haussière. Le prix touche une résistance, redescend légèrement et forme un creux appelé neckline. Il remonte tester le même niveau de résistance. S&apos;il échoue à le casser et redescend, le pattern est complet. La confirmation arrive quand le prix casse la neckline sous le creux intermédiaire.</p>

            <p className="text-zinc-300 leading-relaxed text-sm font-semibold text-zinc-200 mb-2">Les 3 conditions pour qu&apos;un double top soit valide :</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-4">
              <li>- Une tendance haussière préalable claire (HH/HL)</li>
              <li>- Deux sommets quasi égaux (écart toléré : 0,2% maximum)</li>
              <li>- Une cassure confirmée de la neckline (clôture, pas une simple mèche)</li>
            </ul>

            <p className="text-zinc-300 leading-relaxed text-sm">Exemple sur EUR/USD. Le marché est haussier depuis plusieurs jours. Il touche une résistance à 1.1880 et redescend vers 1.1800. Il remonte tester 1.1895, quasi égal au premier sommet, puis échoue. Il redescend et clôture une bougie sous 1.1800. Double top confirmé.</p>
          </section>

          {/* Bloc 4 — VALIDER LE PATTERN */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Valider le pattern</h2>
            <div className="my-8">
              <DTBValidationGridDiagram />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">La validation d&apos;un double top ou bottom suit 4 critères stricts. Une seule absence invalide structurellement le pattern.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">1. Tendance préalable claire.</span> <span className="text-zinc-300">Pas de range avant les sommets/creux. La structure HH/HL ou LH/LL doit être nette.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">2. Écart ≤ 0,3%.</span> <span className="text-zinc-300">Sur EUR/USD : 30 pips maximum entre les 2 sommets/creux. Au-delà : pattern non valide.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">3. Cassure par clôture.</span> <span className="text-zinc-300">Clôture franche de bougie sous (ou au-dessus) de la neckline. Mèche seule = test, pas confirmation.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">4. Absence de news majeure.</span> <span className="text-zinc-300">FOMC, NFP, CPI dans les 30 minutes : le pattern peut être cassé dans n&apos;importe quel sens.</span></div>
            </div>
          </section>

          {/* Bloc 5 — DOUBLE BOTTOM */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Double Bottom : fin de tendance baissière</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Le double bottom est le miroir parfait du double top. Le prix touche un support, remonte légèrement et forme une neckline. Il redescend tester le même support. S&apos;il échoue à le casser et remonte, le pattern est complet. La confirmation arrive quand le prix casse la neckline au-dessus du sommet intermédiaire.</p>

            <p className="text-zinc-300 leading-relaxed text-sm font-semibold text-zinc-200 mb-2">Les 3 conditions, en miroir :</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-4">
              <li>- Une tendance baissière préalable claire (LH/LL)</li>
              <li>- Deux creux quasi égaux</li>
              <li>- Une cassure confirmée de la neckline (clôture au-dessus)</li>
            </ul>

            <p className="text-zinc-300 leading-relaxed text-sm">Exemple sur XAU/USD. Le marché est baissier depuis 2 jours. Il touche un support à 4 480$ et remonte vers 4 520$. Il redescend tester 4 478$ et rejette. Il remonte et clôture une bougie au-dessus de 4 520$. Double bottom confirmé.</p>
          </section>

          {/* Bloc 6 — PROJECTION DU TAKE PROFIT (MEASURED MOVE) */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Projection du Take Profit (measured move)</h2>
            <div className="my-8">
              <DTBMeasuredMoveProjectionDiagram />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Le take profit d&apos;un double top/bottom suit le principe du measured move : la hauteur du pattern (du sommet à la neckline) se projette depuis la neckline dans le sens de la cassure.</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Hauteur pattern = distance sommet (ou creux) → neckline.</li>
              <li>- TP théorique = neckline ± hauteur du pattern, selon le sens de la cassure.</li>
              <li>- TP ajusté de quelques pips pour obtenir un R/R rond (2:1 ou 3:1).</li>
            </ul>
          </section>

          {/* Bloc 7 — PLAN DE TRADE EUR/USD H1 */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de trade : Double Top EUR/USD H1</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Le contexte du double top EUR/USD du Bloc 3 est repris. Tendance haussière préalable, deux sommets à 1.1880 et 1.1895, neckline à 1.1800. Le prix vient de clôturer une bougie H1 à 1.1795, sous la neckline. Pattern confirmé.</p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">L&apos;entrée se fait short juste sous la neckline pour saisir le breakdown. Un prix qui plonge déjà ne se chasse pas. Une confirmation propre avec une clôture sous la neckline est requise. Le SL va au-dessus du dernier sommet pour invalider proprement le pattern. Le TP suit la measured move : la hauteur du pattern, du sommet à la neckline, se projette depuis la neckline vers le bas.</p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Hauteur du pattern : 1.1880 - 1.1800 = 80 pips. Projection théorique sous la neckline : 1.1720. Le TP est pris 5 pips plus bas à 1.1715 pour obtenir un R/R rond de 2:1 (40 pips de risque, 80 pips de gain).</p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Entrée short : 1.1795 (clôture sous neckline)</li>
                <li>- Stop loss : 1.1835 (40 pips au-dessus de la mèche du 2ème sommet)</li>
                <li>- Take profit : 1.1715 (80 pips, measured move ajusté)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Calcul du R/R</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Risque : 1.1835 - 1.1795 = 40 pips</li>
                <li>- Gain potentiel : 1.1795 - 1.1715 = 80 pips</li>
                <li>- R/R : 80 / 40 = 2:1</li>
                <li>- Setup exploitable.</li>
              </ul>
            </div>
          </section>

          {/* Bloc 8 — CALCUL RETAIL */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Calcul retail</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Le risque par trade s&apos;adapte au capital. Sur ce setup R/R 2:1, voici la répartition selon la taille du compte.</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- Compte 300€ → 5% = risque 15€, gain potentiel 30€</li>
              <li>- Compte 500€ → 3% = risque 15€, gain potentiel 30€</li>
              <li>- Compte 1 000€ → 2% = risque 20€, gain potentiel 40€</li>
              <li>- Compte 2 500€ → 2% = risque 50€, gain potentiel 100€</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">Le R/R 2:1 reste constant peu importe la taille du compte. Ce qui change, c&apos;est la taille de lot et le pourcentage de risque adapté au capital.</p>
          </section>

          {/* Bloc 9 — FILTRES : QUAND NE PAS PRENDRE LE SETUP */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Filtres : quand ne pas prendre le setup</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">1. Pas de tendance préalable claire.</span> <span className="text-zinc-300">Si le marché était en range avant les 2 sommets/creux, ce n&apos;est pas un retournement. Setup à ignorer.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">2. Écart trop grand entre sommets/creux.</span> <span className="text-zinc-300">Au-delà de 0,3% (30 pips sur EUR/USD), la mécanique n&apos;est plus celle du double top. Pattern non valide.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">3. Cassure sur mèche, sans clôture.</span> <span className="text-zinc-300">Une mèche qui pique sous la neckline puis revient au-dessus ne confirme rien. Attendre la clôture franche.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">4. News majeure dans la fenêtre.</span> <span className="text-zinc-300">FOMC, NFP, CPI dans les 30 minutes : le setup n&apos;est pas pris. La news peut casser le pattern dans n&apos;importe quel sens.</span></div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "Double top = 2 sommets quasi égaux sur une résistance après tendance haussière. Double bottom = miroir sur un support.",
              "Confirmation = clôture (pas mèche) de l’autre côté de la neckline.",
              "Entrée juste après la cassure. SL au-delà du dernier sommet/creux. TP = measured move (hauteur du pattern projetée).",
              "Setup ignoré si la tendance préalable n’est pas claire, si l’écart dépasse 0,3%, ou si une news majeure arrive.",
            ]}
          />

          <LessonExercice
            description="Sur EUR/USD H1, tu vois un double top avec un premier sommet à 1.1850 et un deuxième à 1.1825. Écart : 25 pips, soit environ 0,23%. La neckline est à 1.1750. Le prix clôture à 1.1745. Tu prends le setup ?"
            steps={[
              "Vérifier que l’écart entre les 2 sommets reste sous la limite : 0,23% < 0,3% — OK",
              "Confirmer que la cassure est par clôture sous 1.1750, pas une simple mèche — OK",
              "Vérifier que la tendance haussière préalable est claire (HH/HL)",
              "Vérifier qu’aucune news majeure n’est prévue dans les 30 prochaines minutes",
              "Prendre l’entrée short à 1.1745, SL au-dessus du 2ème sommet, TP measured move",
            ]}
          />

          <LessonQuiz
            question="Qu’est-ce qui confirme un double top ?"
            options={[
              "Le deuxième sommet qui touche la résistance",
              "Une mèche qui pique sous la neckline",
              "Une clôture de bougie sous la neckline",
              "Un volume très élevé",
            ]}
            correctIndex={2}
            explanation="La confirmation d’un double top arrive uniquement quand le prix clôture une bougie sous la neckline. Une simple mèche qui pique sous puis revient au-dessus ne valide rien — attendre une clôture franche reste indispensable pour éviter les faux signaux."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "reversal", "lecon1");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Leçon 1 du module Reversal &amp; Retournements complétée.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/reversal" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Retour au module
              </Link>
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Leçon 2 — À venir
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
