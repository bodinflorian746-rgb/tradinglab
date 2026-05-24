"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { BOSDiagram } from "@/app/components/charts/BOSDiagram";
import { CHoCHDiagram } from "@/app/components/charts/CHoCHDiagram";
import BOSvsCHoCHComparisonDiagram from "@/app/components/charts/BOSvsCHoCHComparisonDiagram";
import BOSFakeoutDiagram from "@/app/components/charts/BOSFakeoutDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Reconnaître une tendance (HH/HL vs LH/LL)", disabled: false },
  { id: "lecon2", title: "Trendline et moyennes mobiles : tracer la tendance", disabled: false },
  { id: "lecon3", title: "Trader avec la tendance : pullback et entrée", disabled: false },
  { id: "lecon4", title: "Quand sortir : retournement de tendance", disabled: false },
];

export default function ContentFr() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "trend-following", "lecon4"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Stratégies</Link>
          <span>/</span>
          <Link href="/strategies/trend-following" className="hover:text-zinc-400 transition-colors">Trend Following</Link>
          <span>/</span>
          <span className="text-zinc-500">Leçon 4</span>
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
            Quand sortir : retournement de tendance
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Cette leçon enseigne à distinguer BOS (continuation) et CHoCH (retournement) : critères chiffrés, faux BOS à éviter, plan d&apos;exécution sur inversion confirmée.
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
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Une tendance ne se termine pas sur une bougie rouge. Elle se termine sur une cassure structurelle confirmée. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prérequis</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Structure HH/HL/LL/LH → cf. Formation Trading L3</li>
              <li>- Cassure structurelle → cf. Formation Trading L3</li>
              <li>- Approche SMC complète → cf. Stratégies SMC L1 et L2</li>
            </ul>
          </div>

          {/* Bloc 3 — BOS VS CHoCH CÔTE À CÔTE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">BOS vs CHoCH côte à côte</h2>

            <div className="my-8">
              <BOSvsCHoCHComparisonDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Même structure de départ, sens de cassure opposé. La nature du niveau cassé dicte la nature du signal.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- <span className="font-semibold text-zinc-100">BOS</span> : cassure dans le sens de la tendance (HH en haussier, LL en baissier) = continuation</li>
              <li>- <span className="font-semibold text-zinc-100">CHoCH</span> : cassure contre le sens (HL en haussier, LH en baissier) = retournement</li>
              <li>- La sortie sur BOS protège les gains. L&apos;inversion exige le CHoCH confirmé</li>
            </ul>
          </section>

          {/* Bloc 4 — RECONNAÎTRE UN BOS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Reconnaître un BOS</h2>

            <div className="my-8">
              <BOSDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Un Break of Structure (BOS) valide la continuation de la tendance par la cassure franche du dernier extrême structurel.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- BOS haussier : cassure du dernier HH par clôture nette au-dessus</li>
              <li>- BOS baissier : cassure du dernier LL par clôture nette en-dessous</li>
              <li>- Distance minimum : 15-20 pips EUR/USD H4 ou 15-20$ XAU/USD H4</li>
              <li>- Pas de réintégration dans les 3-5 bougies suivantes</li>
            </ul>
          </section>

          {/* Bloc 5 — RECONNAÎTRE UN CHoCH */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Reconnaître un CHoCH</h2>

            <div className="my-8">
              <CHoCHDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Un Change of Character (CHoCH) amorce un retournement par la cassure du dernier creux ou sommet de structure inverse.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- CHoCH baissier (depuis haussier) : cassure du dernier HL</li>
              <li>- CHoCH haussier (depuis baissier) : cassure du dernier LH</li>
              <li>- Premier signal de retournement structurel, déclenche la sortie des positions</li>
              <li>- L&apos;inversion (entrée dans le nouveau sens) exige la confirmation par formation nouvelle structure + CHoCH complet</li>
            </ul>
          </section>

          {/* Bloc 6 — FAUX BOS À ÉVITER */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Faux BOS à éviter</h2>

            <div className="my-8">
              <BOSFakeoutDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Une mèche qui perce le niveau structurel sans clôture franche n&apos;est pas un BOS. C&apos;est souvent un liquidity grab institutionnel.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Mèche dépasse le HH/LL, mais corps clôture en deçà = BOS invalide</li>
              <li>- Liquidity grab : les institutions ciblent les stops accumulés au-delà du niveau</li>
              <li>- Attendre la clôture complète de la bougie avant toute lecture de BOS</li>
            </ul>
          </section>

          {/* Bloc 7 — PLAN DE TRADE CHIFFRÉ */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de trade : inversion sur CHoCH XAU/USD H4</h2>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              XAU/USD en tendance haussière H4 depuis 3 semaines (2 HL à 4 520$ et 4 580$, 2 HH à 4 620$ et 4 660$). BOS baissier : clôture à 4 555$ (25$ sous le HL 4 580$). Validation 4 bougies sans réintégration. Formation nouvelle structure : LH à 4 600$ puis LL à 4 530$ = CHoCH confirmé.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup (trade short sur inversion confirmée)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Entrée short : 4 580$ (retracement vers ex-HL devenu résistance, signal de rejet attendu)</li>
                <li>- Stop loss : 4 615$ (au-delà du LH à 4 600$, marge 15$)</li>
                <li>- Take profit : 4 450$ (zone support identifiée plus bas)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Calcul du R/R</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Risque : 4 615$ - 4 580$ = 35$</li>
                <li>- Gain potentiel : 4 580$ - 4 450$ = 130$</li>
                <li>- R/R : 130 / 35 = 3,71</li>
              </ul>
            </div>

            <p className="text-white font-semibold text-sm mb-2">Calcul retail</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- Compte 300€ → 5% = risque 15€, gain potentiel 55€</li>
              <li>- Compte 500€ → 3% = risque 15€, gain potentiel 55€</li>
              <li>- Compte 1 000€ → 2% = risque 20€, gain potentiel 74€</li>
              <li>- Compte 2 500€ → 2% = risque 50€, gain potentiel 185€</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">
              Le R/R reste 3,71:1 peu importe la taille du compte.
            </p>
          </section>

          <LessonKeyPoints
            points={[
              "BOS = cassure du dernier extrême structurel dans le sens de la tendance (continuation).",
              "CHoCH = cassure du dernier creux/sommet de structure inverse (retournement).",
              "La sortie d’une position se déclenche dès le BOS validé. L’inversion exige le CHoCH confirmé.",
              "Sans clôture franche (mèche seulement), pas de BOS, c’est un liquidity grab.",
            ]}
          />

          <LessonExercice
            description="Sur XAU/USD H4, la tendance haussière en cours a formé un dernier HL à 4 580$ et un dernier HH à 4 660$. Une bougie clôture à 4 555$ avec un corps significatif, soit 25$ sous le dernier HL. 4 bougies suivantes maintiennent leur clôture sous 4 580$. Le prix forme ensuite un sommet à 4 600$ puis redescend former un creux à 4 530$. Comment se construit le plan complet ?"
            steps={[
              "Qualifier le BOS baissier : clôture franche à 4 555$ (25$ sous le HL 4 580$), corps significatif, pas de réintégration sur 4 bougies. BOS validé",
              "Déclencher la sortie de toute position long existante dès la clôture à 4 555$",
              "Observer la structure post-cassure : sommet à 4 600$ (premier LH potentiel) puis creux à 4 530$ (premier LL)",
              "Confirmer le CHoCH baissier : la séquence LH (4 600$) + LL (4 530$) inverse officiellement la tendance",
              "Construire le plan d’inversion : entrée short au retracement vers 4 580$ (ex-HL devenu résistance) avec signal de rejet, stop loss à 4 615$ (au-delà du LH 4 600$ + marge 15$), take profit à 4 450$ (ratio R/R 1:3,7), taille de position selon le risque par trade",
            ]}
          />

          <LessonQuiz
            question="Quelle est la condition minimum pour qualifier une tendance haussière comme exploitable sur un chart H4 ?"
            options={[
              "1 sommet plus haut suffit",
              "2 creux ascendants (HL) et 2 sommets ascendants (HH) successifs",
              "Une moyenne mobile orientée à la hausse",
              "Un volume élevé sur 5 bougies",
            ]}
            correctIndex={1}
            explanation="Une tendance exploitable exige minimum 2 HL + 2 HH successifs sur le timeframe H4. En dessous de ce seuil, le marché reste en range ou en consolidation, pas en tendance structurellement confirmée."
          />

          <LessonQuiz
            question="Sur une tendance haussière confirmée, quelle profondeur de retracement définit un pullback exploitable ?"
            options={[
              "Inférieure à 10% de l’impulsion",
              "Entre 30% et 60% de l’impulsion précédente",
              "Supérieure à 80% de l’impulsion",
              "Pas de seuil défini",
            ]}
            correctIndex={1}
            explanation="Le pullback exploitable se situe entre 30% et 60% de l’impulsion précédente. Un retracement inférieur à 30% reste superficiel et n’offre pas de niveau d’entrée propre. Un retracement supérieur à 60% remet en cause la structure de la tendance."
          />

          <LessonQuiz
            question="Une cassure du dernier HL est confirmée sur tendance haussière. Une position d’inversion (entrée short) est envisagée. À quel moment exécuter cette inversion ?"
            options={[
              "Dès la cassure du HL (BOS)",
              "Après la confirmation CHoCH (premier LH + premier LL dans la nouvelle structure)",
              "Au retour du prix sur le HL cassé sans autre confirmation",
              "Aucune attente, l’entrée est immédiate",
            ]}
            correctIndex={1}
            explanation="L’inversion exige la confirmation CHoCH avant exécution. La sortie d’une position existante peut se déclencher dès le BOS, mais une position d’inversion ne se prend qu’après la formation du premier LH + premier LL dans la nouvelle structure baissière. Sans CHoCH, le BOS peut s’invalider."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "trend-following", "lecon4");
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
                  <p className="text-sm font-semibold text-emerald-400">Module Trend Following terminé</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Toutes les leçons du module ont été complétées.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/trend-following/lecon3" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon 3
              </Link>
              <Link href="/strategies/trend-following" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
