"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import BOSCHoCHSequenceDiagram from "@/app/components/charts/BOSCHoCHSequenceDiagram";
import { LiquidityGrabDiagram } from "@/app/components/charts/LiquidityGrabDiagram";
import MitigationZoneEntryDiagram from "@/app/components/charts/MitigationZoneEntryDiagram";

const LESSONS = [
  { id: "lecon1", title: "Leçon 1", disabled: false },
  { id: "lecon2", title: "Leçon 2", disabled: false },
  { id: "lecon3", title: "Leçon 3", disabled: false },
  { id: "lecon4", title: "Leçon 4", disabled: false },
  { id: "lecon5", title: "Le trade SMC complet : de l’analyse HTF à l’exécution", disabled: false },
];

export default function ContentFr() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "smc", "lecon5"));
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
          <span className="text-zinc-500">Leçon 5</span>
        </nav>

        {/* ── Header ── */}
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
            Le trade SMC complet : de l&apos;analyse HTF à l&apos;exécution
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Cette leçon assemble l&apos;ensemble du module SMC dans un déroulé opérationnel complet. La logique institutionnelle est reconstruite étape par étape : lecture HTF, identification de la liquidité, sweep, confirmation structurelle, mitigation et exécution.
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
              const isCurrent = lesson.id === "lecon5";
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
            <span className="ml-auto text-xs text-zinc-600">5 / 5 leçons</span>
          </div>
        </header>

        {/* ── Contenu ── */}
        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-blue-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Un trade SMC n&apos;est pas un signal isolé. C&apos;est une séquence : liquidité → sweep → déplacement → mitigation → exécution. »
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
              <li>- FVG &amp; Liquidité → cf. Stratégie SMC L4</li>
            </ul>
          </div>

          {/* Bloc 3 — LA SÉQUENCE INSTITUTIONNELLE COMPLÈTE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">La séquence institutionnelle complète</h2>
            <div className="my-8">
              <BOSCHoCHSequenceDiagram />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Le modèle SMC repose sur une succession d&apos;étapes cohérentes. Chaque élément prépare le suivant : la liquidité attire le prix, le sweep déclenche le déplacement, puis la mitigation fournit l&apos;entrée.</p>
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Les 7 étapes du trade SMC</p>
            <ol className="space-y-1 text-sm text-zinc-300 list-decimal pl-5">
              <li>Analyse HTF : déterminer le biais directionnel via la structure de marché</li>
              <li>Identifier la liquidité (BSL/SSL) qui sera la cible</li>
              <li>Attendre le sweep de la liquidité opposée</li>
              <li>Confirmer le CHoCH sur le timeframe d&apos;entrée</li>
              <li>Repérer l&apos;Order Block ou le FVG dans le displacement</li>
              <li>Entrer sur la mitigation de cette zone</li>
              <li>Gérer : SL au-delà de la zone, TP sur la liquidité ciblée</li>
            </ol>
          </section>

          {/* Bloc 4 — LIRE LA STRUCTURE ET LA LIQUIDITÉ */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Lire la structure et la liquidité</h2>
            <div className="my-8">
              <LiquidityGrabDiagram />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Le biais HTF donne la direction prioritaire du trade. La liquidité identifie ensuite les zones où les institutionnels chercheront à provoquer le mouvement avant l&apos;impulsion réelle. Le sweep apparaît généralement sous la forme d&apos;une mèche agressive suivie d&apos;une réintégration rapide.</p>
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Points à surveiller</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Structure HTF en LH/LL = biais bearish</li>
              <li>- Equal highs/lows = liquidité exploitable</li>
              <li>- Sweep = prise de stops + rejet rapide</li>
            </ul>
          </section>

          {/* Bloc 5 — CONFIRMER ET EXÉCUTER */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Confirmer et exécuter</h2>
            <div className="my-8">
              <MitigationZoneEntryDiagram />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Le CHoCH confirme que le contrôle du marché change de camp sur le timeframe d&apos;entrée. Le displacement laisse ensuite un Order Block ou un FVG qui servira de zone de mitigation. L&apos;entrée intervient lorsque le prix revient dans cette zone avant reprise impulsive.</p>
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Logique d&apos;exécution</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- CHoCH = confirmation structurelle</li>
              <li>- FVG/OB = zone d&apos;entrée institutionnelle</li>
              <li>- Mitigation = optimisation du ratio risque/rendement</li>
            </ul>
          </section>

          {/* Bloc 6 — PLAN DE TRADE EUR/USD H4 */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de trade chiffré complet (EUR/USD H4)</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">EUR/USD H4. Biais HTF baissier avec structure en LH/LL. Equal highs à 1.1780 = BSL identifiée. Cible finale : SSL sous le creux 1.1690. Une bougie H4 sweep la BSL en imprimant une mèche à 1.1792 puis clôture à 1.1772. Le prix casse ensuite le dernier creux mineur à 1.1755 : CHoCH bearish confirmé. Le displacement laisse un FVG bearish entre 1.1758 et 1.1770 avec un Order Block juste au-dessus.</p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Déroulé des 7 étapes</p>
              <ol className="space-y-1 text-sm text-zinc-300 list-decimal pl-5 mb-4">
                <li>Analyse HTF : Structure H4 en LH/LL · Biais directionnel bearish</li>
                <li>Identifier la liquidité : Equal highs à 1.1780 · BSL clairement visible</li>
                <li>Sweep de liquidité : Mèche à 1.1792 · Réintégration immédiate sous la BSL</li>
                <li>Confirmation CHoCH : Cassure du creux mineur à 1.1755 · Changement de caractère bearish confirmé</li>
                <li>Identifier la zone d&apos;entrée : FVG bearish 1.1758 → 1.1770 · Order Block juste au-dessus</li>
                <li>Entrée sur mitigation : Retour du prix dans le FVG · Entrée short sur mitigation</li>
                <li>Gestion : SL au-dessus de la mèche du sweep · TP sur la SSL à 1.1690</li>
              </ol>

              <p className="text-white font-semibold text-sm mb-2">Setup</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Entrée short : 1.1765</li>
                <li>- Stop loss : 1.1798</li>
                <li>- Take profit : 1.1690</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Calcul du R/R</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-3">
                <li>- Risque : 1.1798 - 1.1765 = 33 pips</li>
                <li>- Gain : 1.1765 - 1.1690 = 75 pips</li>
                <li>- R/R : 75 / 33 = 2,27</li>
              </ul>
              <p className="text-zinc-300 leading-relaxed text-sm">Le rendement potentiel représente plus du double du risque engagé.</p>
            </div>

            <p className="text-white font-semibold text-sm mb-2">Calcul retail</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- Compte 300€ → 5% = risque 15€, gain potentiel 34€</li>
              <li>- Compte 500€ → 3% = risque 15€, gain potentiel 34€</li>
              <li>- Compte 1 000€ → 2% = risque 20€, gain potentiel 45€</li>
              <li>- Compte 2 500€ → 2% = risque 50€, gain potentiel 113€</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">Le R/R reste 2,27:1 peu importe la taille du compte.</p>
          </section>

          {/* Bloc 7 — LES ERREURS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Les erreurs qui cassent le trade SMC</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">Erreur 1 : Entrer avant le CHoCH</span> <span className="text-zinc-300">= absence de confirmation structurelle.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">Erreur 2 : Confondre sweep et breakout</span> <span className="text-zinc-300">= achat/vente directement dans la prise de liquidité.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">Erreur 3 : Ignorer le biais HTF</span> <span className="text-zinc-300">= exécution contre la structure dominante.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">Erreur 4 : Viser une liquidité déjà prise</span> <span className="text-zinc-300">= absence de cible institutionnelle claire.</span></div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "La structure HTF définit le biais.",
              "Le sweep précède souvent le vrai mouvement.",
              "Le CHoCH confirme le changement de contrôle.",
              "Le FVG/OB fournit la zone d’exécution.",
            ]}
          />

          <LessonExercice
            description="Sur XAU/USD H4, le marché évolue dans un biais baissier. Les equal highs à 4 720$ représentent une BSL visible, et la cible de liquidité principale se situe sur la SSL du creux 4 600$. Une bougie H4 sweep la BSL avec une mèche à 4 735$ puis clôture à 4 705$. Le marché casse ensuite le creux mineur à 4 680$ et crée un FVG bearish entre 4 685$ et 4 700$. Le prix revient ensuite dans la zone. Comment se reconstruit le trade SMC complet sur ce setup ?"
            steps={[
              "Poser le biais HTF : la structure H4 est baissière (LH/LL). Le biais oriente vers des setups vendeurs en priorité.",
              "Identifier la liquidité : les equal highs à 4 720$ forment la BSL. La SSL du creux 4 600$ devient la cible finale du trade.",
              "Valider le sweep : la mèche à 4 735$ prend la liquidité au-dessus de 4 720$, et la clôture à 4 705$ confirme la réintégration sous la BSL.",
              "Confirmer le CHoCH : la cassure du creux mineur à 4 680$ valide le changement de caractère baissier sur le timeframe d’entrée.",
              "Construire le plan : entrée short 4 692$ (mitigation du FVG 4 685$-4 700$), stop loss 4 740$ (au-dessus de la mèche du sweep), take profit 4 600$ (cible la SSL). Risque 48$, gain 92$, R/R ≈ 1,9.",
            ]}
          />

          <LessonQuiz
            question="Quelle séquence correspond au déroulé logique d’un trade SMC complet ?"
            options={[
              "Sweep → mitigation → BOS → liquidité → entrée",
              "Analyse HTF → sweep → entrée → CHoCH → liquidité",
              "Analyse HTF → liquidité → sweep → CHoCH → mitigation → exécution",
              "Liquidité → breakout → entrée → mitigation → BOS",
            ]}
            correctIndex={2}
            explanation="Le modèle SMC repose sur une logique séquentielle. Le biais HTF définit la direction prioritaire. La liquidité attire ensuite le prix avant le sweep. Le CHoCH confirme le changement de contrôle, puis la mitigation du FVG ou de l’Order Block fournit l’entrée optimisée."
          />

          <LessonQuiz
            question="Quel élément distingue le plus souvent un sweep d’un vrai breakout impulsif ?"
            options={[
              "Le prix clôture au-dessus du niveau avec continuation immédiate",
              "Le prix réintègre rapidement la zone après avoir pris la liquidité",
              "Le sweep ne laisse jamais de mèche",
              "Le breakout apparaît uniquement sur timeframe Daily",
            ]}
            correctIndex={1}
            explanation="Le sweep cherche principalement à prendre les stops avant le vrai mouvement. La caractéristique principale reste donc la réintégration rapide du niveau sweepé. Un vrai breakout conserve généralement la clôture au-delà du niveau cassé avec continuation immédiate."
          />

          <LessonQuiz
            question="Dans un setup SMC bearish, où se situe généralement le stop loss le plus logique ?"
            options={[
              "Au milieu du FVG",
              "Directement sur le niveau d’entrée",
              "Sous la SSL cible",
              "Au-dessus de la mèche ayant sweep la liquidité",
            ]}
            correctIndex={3}
            explanation="La mèche du sweep représente souvent l’extrême du mouvement de prise de liquidité. Placer le stop loss au-delà de cette zone permet de laisser respirer le trade tout en invalidant clairement le scénario institutionnel si le niveau est repris."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "smc", "lecon5");
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
                  <p className="text-sm font-semibold text-emerald-400">Module SMC : Penser institutionnel terminé</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Toutes les leçons du module ont été complétées.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/smc/lecon4" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon 4
              </Link>
              <Link href="/strategies/smc" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
