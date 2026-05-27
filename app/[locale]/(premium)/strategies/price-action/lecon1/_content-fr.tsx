"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { CandleAnatomyDiagram } from "@/app/components/charts/CandleAnatomyDiagram";
import CandleStrengthComparisonDiagram from "@/app/components/charts/CandleStrengthComparisonDiagram";
import CandleContextReadingDiagram from "@/app/components/charts/CandleContextReadingDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Lire une bougie", disabled: false },
  { id: "lecon2", title: "Pin bar",          disabled: true },
  { id: "lecon3", title: "Leçon 3",          disabled: true },
  { id: "lecon4", title: "Leçon 4",          disabled: true },
];

export default function ContentFr() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "price-action", "lecon1"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Stratégies</Link>
          <span>/</span>
          <Link href="/strategies/price-action" className="hover:text-zinc-400 transition-colors">Price Action</Link>
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
            <span className="text-xs text-zinc-600">12 min</span>
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
            Lire une bougie : corps, mèche, signal
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Cette leçon enseigne à lire rapidement le rapport de force d&apos;une bougie et à reconnaître les 4 patterns clés (Marubozu, pin bar, doji, engulfing) qui structurent toute la price action.
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
                « Une bougie n&apos;est pas un dessin. C&apos;est le résumé chiffré d&apos;une bataille entre acheteurs et vendeurs sur une période donnée. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prérequis</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Notions de OHLC (open/high/low/close) → cf. Formation Trading L1</li>
              <li>- Bougies japonaises → cf. Formation Trading L1</li>
              <li>- Concept de swing high/low → cf. Formation Trading L2</li>
            </ul>
          </div>

          {/* Bloc 3 — ANATOMIE D'UNE BOUGIE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Anatomie d&apos;une bougie</h2>

            <div className="my-8">
              <CandleAnatomyDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Une bougie résume 4 valeurs (OHLC) sur une période donnée. La forme visible (corps + mèches) raconte le rapport de force final.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Corps significatif (&gt; 50% moyenne des 20 dernières bougies) = direction claire</li>
              <li>- Mèche longue d&apos;un côté (≥ corps) = rejet net dans cette direction</li>
              <li>- Clôture dans le tiers haut ou bas = domination soutenue jusqu&apos;à la clôture</li>
              <li>- Bougie en cours de formation = lecture provisoire, attendre la clôture</li>
            </ul>
          </section>

          {/* Bloc 4 — RECONNAÎTRE LES 4 TYPES CLÉS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Reconnaître les 4 types clés</h2>

            <div className="my-8">
              <CandleStrengthComparisonDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              4 patterns reviennent en permanence sur les charts. Leur identification rapide oriente toute la lecture d&apos;ensemble.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- <span className="font-semibold text-zinc-100">Marubozu</span> : grand corps, pas de mèche = conviction maximale, signal de continuation</li>
              <li>- <span className="font-semibold text-zinc-100">Pin bar</span> : corps réduit + mèche longue d&apos;un côté = rejet de niveau, signal de retournement local</li>
              <li>- <span className="font-semibold text-zinc-100">Doji</span> : corps quasi inexistant = indécision, signal d&apos;attente ou retournement potentiel en zone extrême</li>
              <li>- <span className="font-semibold text-zinc-100">Engulfing</span> : corps qui englobe la bougie précédente dans le sens opposé = bascule de pouvoir nette</li>
            </ul>
          </section>

          {/* Bloc 5 — LE CONTEXTE CHANGE LA LECTURE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Le contexte change la lecture</h2>

            <div className="my-8">
              <CandleContextReadingDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Une même bougie n&apos;a pas la même valeur selon les bougies adjacentes et la position structurelle. La lecture isolée surestime systématiquement le signal.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Bougie verte au sommet d&apos;une impulsion = essoufflement, retournement potentiel</li>
              <li>- Bougie verte isolée au milieu d&apos;une chute = bruit, continuation baissière probable</li>
              <li>- Bougie verte dans un range latéral = pas de signal, oscillation normale</li>
              <li>- La bougie analysée doit être reliée à un niveau structurel pour devenir un signal opérationnel</li>
            </ul>
          </section>

          <LessonKeyPoints
            points={[
              "Une bougie se lit par 4 éléments : taille du corps, mèches, position de la clôture, contexte adjacent.",
              "4 patterns clés : Marubozu (conviction), pin bar (rejet), doji (indécision), engulfing (bascule).",
              "Lecture uniquement sur bougies entièrement clôturées. La bougie en cours reste provisoire.",
              "Le contexte structurel détermine la valeur d’un signal : même pattern, valeur différente selon sa position.",
            ]}
          />

          <LessonExercice
            description="Sur XAU/USD H4, une bougie clôture avec ces caractéristiques : ouverture 4 580$, plus haut 4 595$, plus bas 4 530$, clôture 4 588$. Comment se lit cette bougie selon les 4 critères du rapport de force ?"
            steps={[
              "Critère 1. Taille du corps : ouverture 4 580$ à clôture 4 588$ = corps haussier de 8$ (à comparer à la moyenne des 20 bougies récentes)",
              "Critère 2. Mèches : mèche basse de 50$ (4 580$ - 4 530$), mèche haute de 7$ (4 595$ - 4 588$), mèche basse 6 fois plus longue que le corps, signal de rejet haussier puissant en bas",
              "Critère 3. Position de la clôture : 4 588$ dans la fourchette 4 530$-4 595$ = 89% de la fourchette, dans le tiers supérieur, domination des acheteurs sur la fin de période",
              "Critère 4. Contexte adjacent : à mettre en relation avec les bougies précédentes et un niveau structurel proche",
              "Synthèse : la bougie correspond au pattern pin bar haussier (corps réduit + mèche basse longue + clôture en haut), signal de rejet à la baisse particulièrement opérationnel s’il intervient au contact d’un support ou d’une zone Order Block",
            ]}
          />

          <LessonQuiz
            question="Une bougie présente un corps réduit, une mèche basse longue (3 fois la taille du corps) et une clôture dans le tiers supérieur de la fourchette. Quel pattern et quel message du marché ?"
            options={[
              "Doji d’indécision, équilibre entre les camps",
              "Pin bar haussière, rejet à la baisse confirmé",
              "Marubozu baissier, domination totale des vendeurs",
              "Engulfing baissier, bascule de pouvoir vers les vendeurs",
            ]}
            correctIndex={1}
            explanation="Corps réduit + mèche basse 3 fois plus longue que le corps + clôture dans le tiers supérieur = signature exacte d’une pin bar haussière. Le message du marché : tentative d’extension baissière rapidement rejetée par les acheteurs, qui reprennent le contrôle avant la clôture. Signal de rejet à la baisse particulièrement opérationnel s’il apparaît au contact d’un niveau structurel."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "price-action", "lecon1");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Leçon 1 du module Price Action complétée.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <span />
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Leçon 2, Pin bar, le rejet de niveau
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
