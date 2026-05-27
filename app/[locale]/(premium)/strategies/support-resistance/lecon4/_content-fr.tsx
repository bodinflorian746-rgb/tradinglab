"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { GraphFakeBreakout } from "@/app/components/charts/GraphFakeBreakout";
import FakeVsRealBreakoutComparisonDiagram from "@/app/components/charts/FakeVsRealBreakoutComparisonDiagram";
import StopHuntDiagram from "@/app/components/charts/StopHuntDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Support et résistance : les zones où le marché réagit", disabled: false },
  { id: "lecon2", title: "Identifier un vrai niveau (vs une ligne tracée au hasard)", disabled: false },
  { id: "lecon3", title: "Flip support↔résistance et trader un rebond", disabled: false },
  { id: "lecon4", title: "Cassure vraie vs fake breakout", disabled: false },
];

export default function ContentFr() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "support-resistance", "lecon4"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Stratégies</Link>
          <span>/</span>
          <Link href="/strategies/support-resistance" className="hover:text-zinc-400 transition-colors">Support / Résistance &amp; Range</Link>
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
            <span className="text-xs text-zinc-600">17 min</span>
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
            Cassure vraie vs fake breakout
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Cette leçon enseigne à reconnaître un faux breakout et trader le retour : distinction vrai/faux, mécanique du stop hunt institutionnel, plan d&apos;exécution chiffré.
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
                « La fausse cassure piège les retails qui entrent trop vite. La même cassure, prise à contre-courant, devient un setup propre. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prérequis</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Identification S/R → cf. Stratégie SR L1</li>
              <li>- Concept de clôture vs mèche → cf. Formation Trading L2</li>
              <li>- Notion de stop hunt / liquidity → cf. Formation Trading L4</li>
            </ul>
          </div>

          {/* Bloc 3 — VRAI VS FAUX BREAKOUT */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Vrai vs faux breakout</h2>

            <div className="my-8">
              <FakeVsRealBreakoutComparisonDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La distinction entre vrai breakout et fake breakout repose sur le comportement de la bougie de cassure et des suivantes. Le critère essentiel : clôture nette ou mèche puis retour.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Vrai breakout : clôture nette au-delà du niveau + follow-through sur 3-5 bougies</li>
              <li>- Faux breakout : mèche dépasse le niveau, mais clôture revient dans la zone</li>
              <li>- Réintégration en 1-3 bougies après la mèche = fake confirmé</li>
              <li>- Zone forte (3+ touches, niveau psychologique) = terrain favorable aux fakes</li>
            </ul>
          </section>

          {/* Bloc 4 — RECONNAÎTRE UN FAKE BREAKOUT */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Reconnaître un fake breakout</h2>

            <div className="my-8">
              <GraphFakeBreakout />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              4 critères qualifient un fake breakout opérationnellement exploitable.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Mèche d&apos;au moins 50% du corps de la bougie, ressortant côté cassure</li>
              <li>- Réintégration franche dans la zone en 1-3 bougies suivantes</li>
              <li>- Volume relatif élevé sur la mèche, puis effondrement post-rejet</li>
              <li>- Contexte de zone forte (3+ touches, niveau psychologique, OB visible)</li>
            </ul>
          </section>

          {/* Bloc 5 — LE STOP HUNT INSTITUTIONNEL */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le stop hunt institutionnel</h2>

            <div className="my-8">
              <StopHuntDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le fake breakout est souvent un stop hunt institutionnel : les ordres stops sont ciblés et déclenchés, puis le prix revient à sa direction d&apos;origine.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Zone de stops cluster située juste au-delà du niveau structurel (4 720$ → 4 745$)</li>
              <li>- Mèche pique dans la zone, déclenche les stops, puis clôture sous le niveau</li>
              <li>- Continuation baissière rapide après absorption de la liquidité</li>
              <li>- Le trade se prend dans le sens opposé à la cassure rejetée</li>
            </ul>
          </section>

          {/* Bloc 6 — PLAN DE TRADE CHIFFRÉ */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de trade : fake breakout XAU/USD H1</h2>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Résistance 4 650$ touchée 3 fois en 2 mois (niveau psychologique fort). 4e approche provoque une cassure suspecte. Bougie 1 : mèche jusqu&apos;à 4 680$ + clôture à 4 655$. Bougie 2 : clôture à 4 640$.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup (trade short sur fake breakout)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Bougie 1 : mèche 25$ au-dessus, corps 5$, clôture à la limite</li>
                <li>- Bougie 2 : clôture franche à 4 640$ (réintégration confirmée)</li>
                <li>- Entrée short : 4 640$ (clôture de la bougie de confirmation)</li>
                <li>- Stop loss : 4 685$ (5$ au-dessus du wick à 4 680$)</li>
                <li>- Take profit : 4 540$ (zone support identifiée plus bas)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Calcul du R/R</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Risque : 4 685$ - 4 640$ = 45$</li>
                <li>- Gain potentiel : 4 640$ - 4 540$ = 100$</li>
                <li>- R/R : 100 / 45 = 2,22</li>
              </ul>
            </div>

            <p className="text-white font-semibold text-sm mb-2">Calcul retail</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- Compte 300€ → 5% = risque 15€, gain potentiel 33€</li>
              <li>- Compte 500€ → 3% = risque 15€, gain potentiel 33€</li>
              <li>- Compte 1 000€ → 2% = risque 20€, gain potentiel 44€</li>
              <li>- Compte 2 500€ → 2% = risque 50€, gain potentiel 111€</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">
              Le R/R reste 2,22:1 peu importe la taille du compte.
            </p>
          </section>

          <LessonKeyPoints
            points={[
              "Un fake breakout combine 4 critères : wick long sans clôture franche, réintégration rapide, volume disproportionné, zone forte.",
              "Le trade se prend dans le sens opposé à la cassure rejetée, après double confirmation (clôture + 2ème bougie).",
              "Le stop loss se place au-delà du wick initial avec marge 3-5 pips.",
              "Les fake breakouts s’observent préférentiellement sur des zones fortes (3+ touches, niveaux psychologiques).",
            ]}
          />

          <LessonExercice
            description="Sur XAU/USD H1, la résistance 4 650$ a été touchée 3 fois en 2 mois. Une bougie imprime une mèche jusqu’à 4 680$ puis clôture à 4 655$. La bougie suivante clôture à 4 640$. Comment se construit le plan de trade fake breakout ?"
            steps={[
              "Valider les 4 critères de détection : wick de 25$ au-dessus de la zone sans clôture franche, réintégration en 1 bougie, zone forte (3 touches + niveau psychologique 4 650$)",
              "Valider la double confirmation : bougie 1 clôture à 4 655$ (à la limite), bougie 2 clôture à 4 640$ (réintégration franche)",
              "Placer l’entrée short à 4 640$ (clôture de la bougie de confirmation)",
              "Placer le stop loss à 4 685$ (5$ au-dessus du wick initial à 4 680$)",
              "Placer le take profit à 4 560$ (zone support identifiée plus bas, ratio R/R 1:1,8), taille de position selon le risque par trade adapté au capital",
            ]}
          />

          <LessonQuiz
            question="Quel est le nombre minimum de touches requis pour qualifier une zone de support ou de résistance comme tradable ?"
            options={[
              "1 touche, si elle est forte",
              "2 touches minimum, 3 idéalement",
              "5 touches obligatoires",
              "Aucun seuil défini",
            ]}
            correctIndex={1}
            explanation="2 touches minimum confirment l’existence de la zone, 3 touches élèvent le niveau de confiance et confirment la mémoire collective du marché. Une seule touche reste un niveau ponctuel non confirmé."
          />

          <LessonQuiz
            question="Une résistance vient d’être cassée à la hausse avec une clôture franche. Le prix retrace ensuite vers la zone. Quel signal valide le flip et autorise une entrée long sur la zone devenue support ?"
            options={[
              "Le simple retour du prix à la zone suffit",
              "Un signal de rejet (pin bar, engulfing, réaction nette) au contact de la zone",
              "Une cassure de la zone suivante",
              "Aucun signal requis, l’entrée est mécanique",
            ]}
            correctIndex={1}
            explanation="Sans signal de rejet au contact de la zone inversée, le flip n’est pas validé. Une pin bar, un engulfing ou une réaction nette confirment que la zone joue son nouveau rôle de support."
          />

          <LessonQuiz
            question="Une bougie imprime une mèche au-delà d’une résistance forte, puis clôture sous la limite. Quelle confirmation supplémentaire est requise avant d’envisager un trade short fake breakout ?"
            options={[
              "Une seconde bougie qui maintient ou renforce la réintégration dans la zone",
              "Aucune confirmation, l’entrée se fait sur le wick rejeté",
              "Une cassure de la zone suivante",
              "Un retracement complet vers la zone opposée",
            ]}
            correctIndex={0}
            explanation="La double confirmation (clôture de la bougie de rejet dans la zone + seconde bougie qui maintient la réintégration) filtre les rejets ponctuels qui se transforment finalement en cassure valide. Entrer dès le wick initial expose à un risque élevé."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "support-resistance", "lecon4");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Leçon 4 du module Support / Résistance &amp; Range complétée.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/support-resistance/lecon3" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon 3
              </Link>
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Module terminé
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-600 border border-zinc-700">
                  ✓
                </span>
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
