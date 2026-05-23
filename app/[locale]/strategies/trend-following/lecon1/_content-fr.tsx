"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { TrendDiagram } from "@/app/components/charts/TrendDiagram";
import TrendIdentificationStepsDiagram from "@/app/components/charts/TrendIdentificationStepsDiagram";
import TrendStrengthGradationDiagram from "@/app/components/charts/TrendStrengthGradationDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Reconnaître une tendance (HH/HL vs LH/LL)", disabled: false },
  { id: "lecon2", title: "Leçon 2",          disabled: true },
  { id: "lecon3", title: "Leçon 3",          disabled: true },
  { id: "lecon4", title: "Leçon 4",          disabled: true },
];

export default function ContentFr() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "trend-following", "lecon1"));
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
          <span className="text-zinc-500">Leçon 1</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Débutant
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">15 min</span>
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
            Reconnaître une tendance (HH/HL vs LH/LL)
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Cette leçon enseigne à identifier une tendance exploitable et à trader le pullback dans le sens de cette tendance.
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

        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Une tendance saine se reconnaît à sa régularité. Une entrée propre se prend sur le retracement, pas sur l&apos;extension. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prérequis</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- HH/HL/LL/LH → cf. Formation Trading L3</li>
              <li>- Notion de pullback → cf. Formation Trading L3</li>
              <li>- Niveaux S/R pour cibles → cf. Stratégie SR L1</li>
            </ul>
          </div>

          {/* Bloc 3 — RECONNAÎTRE LA TENDANCE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Reconnaître la tendance (3 états)</h2>

            <div className="my-8">
              <TrendDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le marché alterne 3 états reconnaissables. Identifier l&apos;état en cours détermine la nature du setup à privilégier.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Tendance haussière : succession HH/HL ascendante → trade long sur pullback</li>
              <li>- Range latéral : oscillation entre 2 niveaux → trade range ou attente cassure</li>
              <li>- Tendance baissière : succession LL/LH descendante → trade short sur pullback</li>
              <li>- Timeframe principal d&apos;identification : H4. Confirmation Daily renforce le biais</li>
            </ul>
          </section>

          {/* Bloc 4 — IDENTIFIER EN 3 ÉTAPES */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Identifier en 3 étapes</h2>

            <div className="my-8">
              <TrendIdentificationStepsDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La qualification d&apos;une tendance suit une procédure méthodique en 3 étapes successives.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Étape 1 : repérer les pivots (creux et sommets) sur les 30-50 dernières bougies</li>
              <li>- Étape 2 : confirmer la succession (2 HL + 2 HH minimum, ou 2 LH + 2 LL minimum)</li>
              <li>- Étape 3 : valider l&apos;amplitude (≥ 30-50 pips sur EUR/USD H4, 50-100$ sur XAU/USD H4)</li>
            </ul>
          </section>

          {/* Bloc 5 — QUALIFIER LA FORCE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Qualifier la force</h2>

            <div className="my-8">
              <TrendStrengthGradationDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Toutes les tendances n&apos;ont pas la même force. L&apos;amplitude des swings et la pente conditionnent le R/R structurel.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Tendance faible (pente &lt; 20°, amplitude ~50 pips) : peu exploitable</li>
              <li>- Tendance modérée (pente ~35°, amplitude ~100 pips) : exploitable avec discipline</li>
              <li>- Tendance forte (pente &gt; 55°, amplitude ~200 pips) : setup à privilégier</li>
              <li>- Pullback exploitable : entre 30% et 60% de l&apos;impulsion précédente</li>
            </ul>
          </section>

          {/* Bloc 6 — PLAN DE TRADE CHIFFRÉ */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de trade : pullback EUR/USD H4</h2>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              EUR/USD en tendance haussière confirmée (2 HL à 1.1700 et 1.1730, 2 HH à 1.1780 et 1.1810). Le prix retrace vers 1.1760 (62% de l&apos;impulsion 80 pips) et imprime une pin bar haussière.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup (trade long sur pullback)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Entrée long : 1.1765 (clôture de la pin bar)</li>
                <li>- Stop loss : 1.1720 (10 pips sous le dernier HL à 1.1730)</li>
                <li>- Take profit niveau 1 : 1.1810 (HH précédent) — niveau 2 : 1.1890 (projection 80 pips)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Calcul du R/R</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Risque : 1.1765 - 1.1720 = 45 pips</li>
                <li>- Gain niveau 1 : 45 pips → R/R 1:1 (sortie partielle possible)</li>
                <li>- Gain niveau 2 : 125 pips → R/R 125/45 = 2,78</li>
                <li>- Le setup vise prioritairement le TP niveau 2</li>
              </ul>
            </div>

            <p className="text-white font-semibold text-sm mb-2">Calcul retail</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- Compte 300€ → 5% = risque 15€, gain potentiel 42€</li>
              <li>- Compte 500€ → 3% = risque 15€, gain potentiel 42€</li>
              <li>- Compte 1 000€ → 2% = risque 20€, gain potentiel 56€</li>
              <li>- Compte 2 500€ → 2% = risque 50€, gain potentiel 139€</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">
              Le R/R reste 2,78:1 peu importe la taille du compte.
            </p>
          </section>

          <LessonKeyPoints
            points={[
              "Une tendance exploitable exige 2 HL + 2 HH (haussière) ou 2 LH + 2 LL (baissière) minimum sur H4.",
              "L’alignement Daily + H4 dans le même sens maximise la fiabilité du setup.",
              "Le pullback exploitable se situe entre 30% et 60% de l’impulsion précédente.",
              "Stop loss au-delà du dernier creux/sommet structurel avec marge 5-10 pips. L’entrée exige un signal de rejet.",
            ]}
          />

          <LessonExercice
            description="Sur EUR/USD H4, le prix a formé 2 creux successifs à 1.1700 et 1.1730, puis 2 sommets successifs à 1.1780 et 1.1810. Le prix retrace ensuite vers 1.1760 et imprime une pin bar de rejet. Comment se construit le plan de trade pullback ?"
            steps={[
              "Confirmer la tendance haussière : 2 HL à 1.1700 et 1.1730 + 2 HH à 1.1780 et 1.1810",
              "Mesurer l’impulsion : dernier HL (1.1730) à dernier HH (1.1810) = 80 pips",
              "Calculer le retracement : retour à 1.1760 = 62% de l’impulsion (50/80), à la limite haute du retracement exploitable",
              "Valider le signal : la pin bar au contact du niveau confirme le rejet",
              "Placer le plan : entrée long à la clôture (1.1762), stop loss à 1.1720 (10 pips sous le dernier HL), take profit à 1.1810 (HH précédent) ou 1.1890 (projection sur 80 pips, ratio 1:3)",
            ]}
          />

          <LessonQuiz
            question="Sur un chart H4 en tendance haussière confirmée, le prix retrace de 45% de l’impulsion précédente et imprime un signal de rejet au contact du dernier creux structurel (HL). Quel est le placement correct du stop loss ?"
            options={[
              "À mi-chemin entre le niveau d’entrée et le dernier HL",
              "Au-delà du dernier HL avec une marge de 5-10 pips",
              "Au dernier HH",
              "Aucun stop loss, gestion manuelle",
            ]}
            correctIndex={1}
            explanation="Le stop loss se place au-delà du dernier creux structurel (HL en tendance haussière) avec une marge de 5-10 pips pour absorber les wicks. Cette position invalide structurellement la tendance : si le prix casse le dernier HL, la structure HL/HH est rompue. Un stop placé à mi-chemin est déclenché par le pullback normal."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "trend-following", "lecon1");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Leçon 1 du module Trend Following complétée.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Leçon précédente
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-600 border border-zinc-700">
                  Début du module
                </span>
              </span>
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
