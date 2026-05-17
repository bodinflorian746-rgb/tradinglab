"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import FlipDiagram from "@/app/components/charts/FlipDiagram";
import FlipRetestValidationDiagram from "@/app/components/charts/FlipRetestValidationDiagram";
import FlipFailureDiagram from "@/app/components/charts/FlipFailureDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Support et résistance : les zones où le marché réagit", disabled: false },
  { id: "lecon2", title: "Identifier un vrai niveau (vs une ligne tracée au hasard)", disabled: false },
  { id: "lecon3", title: "Flip support↔résistance et trader un rebond", disabled: false },
  { id: "lecon4", title: "Leçon 4",          disabled: true },
];

export default function SupportResistanceLecon3Page() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "support-resistance", "lecon3"));
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
          <span className="text-zinc-500">Leçon 3</span>
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
            Flip support↔résistance et trader un rebond
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Cette leçon enseigne à trader le flip de polarité : une résistance cassée devient support (et inverse), avec plan d&apos;exécution chiffré sur le retest.
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
                    {lesson.title}
                  </span>
                </div>
              );
            })}
            <span className="ml-auto text-xs text-zinc-600">3 / 4 leçons</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Un support cassé devient une résistance. Une résistance cassée devient un support. Le marché a la mémoire des prix. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prérequis</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Identification S/R → cf. Stratégie SR L1</li>
              <li>- Qualification d&apos;un niveau → cf. Stratégie SR L2</li>
              <li>- Concept de cassure (clôture franche) → cf. Formation Trading L3</li>
            </ul>
          </div>

          {/* Bloc 3 — LE FLIP DE POLARITÉ */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le flip de polarité</h2>

            <div className="my-8">
              <FlipDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Une zone cassée n&apos;est pas une zone morte. Elle inverse son rôle. La séquence cassure + retest + rebond constitue le setup flip.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Cassure franche : clôture nette + distance ≥ 15-20 pips/$ au-delà du niveau</li>
              <li>- Pas de réintégration dans les 3-5 bougies suivantes (sinon flip invalidé)</li>
              <li>- Retest : retour du prix vers le niveau cassé par le côté opposé</li>
              <li>- Rebond confirmé par un signal de rejet (pin bar, engulfing, réaction nette)</li>
            </ul>
          </section>

          {/* Bloc 4 — VALIDER LE RETEST */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Valider le retest</h2>

            <div className="my-8">
              <FlipRetestValidationDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Sans signal de rejet au contact de la zone inversée, le flip n&apos;est pas validé. 3 signaux sont opérationnellement acceptables.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Pin bar de rejet (mèche longue côté zone, corps réduit côté opposé)</li>
              <li>- Engulfing dans le sens du flip (englobe la bougie précédente)</li>
              <li>- Réaction immédiate (rebond net en 1-2 bougies sans pénétration profonde)</li>
              <li>- Signal absent = zone non confirmée, attendre une autre opportunité</li>
            </ul>
          </section>

          {/* Bloc 5 — PLAN DE TRADE CHIFFRÉ */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de trade : flip EUR/USD H4</h2>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              EUR/USD en tendance haussière depuis 2 semaines. Résistance majeure 1.1850 touchée 3 fois en 3 semaines avant d&apos;être cassée. 4 bougies confirment la cassure sans réintégration. Pin bar de rejet au retest.
            </p>

            <div className="border border-zinc-800 rounded-xl p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup (trade long sur flip confirmé)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Cassure : clôture à 1.1878 (28 pips au-dessus de la zone)</li>
                <li>- Validation : 4 bougies sans réintégration sous 1.1850</li>
                <li>- Retest : pin bar avec mèche basse à 1.1842 et clôture à 1.1858</li>
                <li>- Entrée long : 1.1858 (clôture de la pin bar)</li>
                <li>- Stop loss : 1.1830 (28 pips sous le wick, marge 12 pips)</li>
                <li>- Take profit : 1.1950 (prochaine résistance H4)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Calcul du R/R</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Risque : 1.1858 - 1.1830 = 28 pips</li>
                <li>- Gain potentiel : 1.1950 - 1.1858 = 92 pips</li>
                <li>- R/R : 92 / 28 = 3,28</li>
              </ul>
            </div>

            <p className="text-white font-semibold text-sm mb-2">Calcul retail</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- Compte 300€ → 5% = risque 15€, gain potentiel 49€</li>
              <li>- Compte 500€ → 3% = risque 15€, gain potentiel 49€</li>
              <li>- Compte 1 000€ → 2% = risque 20€, gain potentiel 66€</li>
              <li>- Compte 2 500€ → 2% = risque 50€, gain potentiel 164€</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">
              Le R/R reste 3,28:1 peu importe la taille du compte.
            </p>
          </section>

          {/* Bloc 6 — QUAND LE FLIP ÉCHOUE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Quand le flip échoue</h2>

            <div className="my-8">
              <FlipFailureDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Un flip peut échouer après une cassure apparemment franche. Le retour rapide du prix sous le niveau invalide le flip.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Retour rapide sous le niveau cassé dans les 3-5 bougies = flip invalidé</li>
              <li>- Le SL placé de l&apos;autre côté de la zone (avec marge 5-10 pips) borne la perte</li>
              <li>- Aucun déplacement du SL contre soi en cours de trade</li>
            </ul>
          </section>

          <LessonKeyPoints
            points={[
              "Un flip exige une cassure qualifiée : clôture franche, distance suffisante, pas de retour immédiat.",
              "La zone cassée inverse son rôle au retest : support cassé → résistance, résistance cassée → support.",
              "Le retest se valide uniquement par un signal de rejet au contact (pin bar, engulfing, réaction nette).",
              "Le stop loss se place de l’autre côté de la zone avec marge 5-10 pips. Sans signal de rejet, pas d’entrée.",
            ]}
          />

          <LessonExercice
            description="Sur EUR/USD H4, une résistance à 1.1850 est cassée par une bougie qui clôture à 1.1875 avec un corps significatif. 4 bougies plus tard, le prix retrace vers 1.1850 et imprime une pin bar avec mèche longue qui rejette. Comment se construit le plan de trade flip ?"
            steps={[
              "Qualifier la cassure : clôture à 1.1875, distance 25 pips au-dessus de la zone, corps significatif, pas de retour immédiat sur 4 bougies — cassure validée",
              "Constater l’inversion du rôle : la résistance 1.1850 devient un support",
              "Identifier le signal de rejet : la pin bar au contact de la zone valide le flip",
              "Placer l’entrée long à la clôture de la pin bar, stop loss à 1.1830 (20 pips sous la zone pour absorber les wicks)",
              "Définir le take profit à la prochaine résistance majeure identifiée sur le chart H4 (ratio minimum 1:2), taille de position selon le risque par trade adapté au capital",
            ]}
          />

          <LessonQuiz
            question="Une résistance vient d’être cassée à la hausse avec une clôture franche. Le prix retrace ensuite vers la zone. Quel signal valide le flip et autorise une entrée long ?"
            options={[
              "Le simple retour du prix à la zone suffit",
              "Un signal de rejet (pin bar, engulfing, réaction nette) au contact de la zone",
              "Une cassure de la zone suivante",
              "Aucun signal nécessaire, l’entrée est mécanique",
            ]}
            correctIndex={1}
            explanation="Sans signal de rejet, le flip n’est pas validé. Une pin bar, un engulfing ou une réaction nette au contact de la zone confirment que la zone inversée joue son nouveau rôle. Sans ce signal, le prix peut traverser la zone et invalider le flip."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "support-resistance", "lecon3");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Leçon 3 du module Support / Résistance &amp; Range complétée.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/support-resistance/lecon2" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon 2
              </Link>
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Leçon 4 — À venir
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
