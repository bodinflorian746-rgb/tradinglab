"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import EngulfingSetupDiagram from "@/app/components/charts/EngulfingSetupDiagram";
import EngulfingValidationGridDiagram from "@/app/components/charts/EngulfingValidationGridDiagram";
import BullishVsBearishEngulfingDiagram from "@/app/components/charts/BullishVsBearishEngulfingDiagram";
import EngulfingContextDiagram from "@/app/components/charts/EngulfingContextDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Lire une bougie", disabled: false },
  { id: "lecon2", title: "Pin bar",          disabled: false },
  { id: "lecon3", title: "Engulfing",        disabled: false },
  { id: "lecon4", title: "Leçon 4",          disabled: true },
];

export default function ContentFr() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "price-action", "lecon3"));
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
          <span className="text-zinc-500">Leçon 3</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Débutant
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">14 min</span>
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
            Engulfing : le retournement de force
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Cette leçon enseigne à trader une bougie englobante (bullish ou bearish) sur niveau structurel : critères de validation, confluence requise, plan d&apos;exécution chiffré.
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
            <span className="ml-auto text-xs text-zinc-600">3 / 4 leçons</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « L&apos;engulfing ne propose pas. Il impose. La 2ème bougie est si forte qu&apos;elle efface la première. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prérequis</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Anatomie d&apos;une bougie → cf. Stratégie PA L1</li>
              <li>- Concept d&apos;avalement / engulfing → cf. Formation Trading L2</li>
              <li>- Niveaux support/résistance → cf. Formation Trading L3</li>
            </ul>
          </div>

          {/* Bloc 3 — BULLISH VS BEARISH */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Bullish vs Bearish engulfing</h2>

            <div className="my-8">
              <BullishVsBearishEngulfingDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Un engulfing = bascule de pouvoir en 2 bougies. La 2ème englobe le corps de la 1ère dans le sens opposé.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- <span className="font-semibold text-zinc-100">Bullish engulfing</span> : 1ère bougie rouge + 2ème bougie verte qui englobe le corps rouge, sur un support clé</li>
              <li>- <span className="font-semibold text-zinc-100">Bearish engulfing</span> : 1ère bougie verte + 2ème bougie rouge qui englobe le corps vert, sur une résistance clé</li>
              <li>- Le sens du signal suit la direction de la 2ème bougie (celle qui englobe)</li>
            </ul>
          </section>

          {/* Bloc 4 — VALIDER UN ENGULFING */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Valider un engulfing</h2>

            <div className="my-8">
              <EngulfingValidationGridDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Toutes les bougies qui se chevauchent ne sont pas des engulfings valides. 4 critères qualifient le pattern comme tradable.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Le corps de la 2ème bougie englobe ENTIÈREMENT le corps de la 1ère (mèches exclues)</li>
              <li>- Les 2 bougies sont de sens opposé (rouge puis verte ou inverse)</li>
              <li>- La 2ème bougie est clairement plus grande que la 1ère (pas 5%, vrai contraste)</li>
              <li>- Amplitude supérieure à la moyenne des 20 bougies précédentes</li>
            </ul>
          </section>

          {/* Bloc 5 — LA CONFLUENCE CHANGE TOUT */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">La confluence change tout</h2>

            <div className="my-8">
              <EngulfingContextDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Un engulfing isolé hors contexte structurel n&apos;est qu&apos;une grosse bougie. La confluence donne la valeur opérationnelle.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Engulfing au support / résistance qualifié = setup tradable</li>
              <li>- Engulfing sur retracement Fibonacci 0.5 / 0.618 / 0.786 en tendance = setup tradable</li>
              <li>- Engulfing en confluence MM50 ou MM200 = renforcement du signal</li>
              <li>- Engulfing isolé en pleine impulsion = bruit, pas de setup</li>
            </ul>
          </section>

          {/* Bloc 6 — PLAN DE TRADE CHIFFRÉ */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de trade : engulfing bullish XAU/USD H4</h2>

            <div className="my-8">
              <EngulfingSetupDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              XAU/USD rebondit depuis 4 500$ vers 4 720$, puis corrige sur Fibonacci 0.618 à 4 600$. Bullish engulfing au contact du Fibo dans une tendance H4 haussière.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- 1ère bougie bearish : Open 4 615$, Close 4 600$ (corps 15$)</li>
                <li>- 2ème bougie bullish : Open 4 595$, Close 4 625$ (corps 30$, 2x la 1ère)</li>
                <li>- Corps de la 2ème englobe entièrement celui de la 1ère</li>
                <li>- Entrée long : 4 630$ (cassure du high de la bougie englobante)</li>
                <li>- Stop loss : 4 590$ (5$ sous le low de la bougie englobante)</li>
                <li>- Take profit : 4 720$ (ancien high récent)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Calcul du R/R</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Risque : 4 630$ - 4 590$ = 40$</li>
                <li>- Gain potentiel : 4 720$ - 4 630$ = 90$</li>
                <li>- R/R : 90 / 40 = 2,25</li>
              </ul>
            </div>

            <p className="text-white font-semibold text-sm mb-2">Calcul retail</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- Compte 300€ → 5% = risque 15€, gain potentiel 34€</li>
              <li>- Compte 500€ → 3% = risque 15€, gain potentiel 34€</li>
              <li>- Compte 1 000€ → 2% = risque 20€, gain potentiel 45€</li>
              <li>- Compte 2 500€ → 2% = risque 50€, gain potentiel 113€</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">
              Le R/R reste 2,25:1 peu importe la taille du compte.
            </p>
          </section>

          <LessonKeyPoints
            points={[
              "Engulfing = 2 bougies de sens opposé, la 2ème englobe ENTIÈREMENT le corps de la 1ère.",
              "Pin bar = signal de rejet, Engulfing = signal de bascule : complémentaires, pas concurrents.",
              "Toujours sur un niveau clé ou un retracement, jamais au milieu de nulle part.",
              "SL sous le low de la bougie englobante (bullish) ou au-dessus du high (bearish), R/R minimum 1:2.",
            ]}
          />

          <LessonExercice
            description="Mets en pratique la lecture des bougies sur un graphique réel."
            steps={[
              "Ouvrir un graphique XAU/USD ou EUR/USD en timeframe H4",
              "Identifier 2 engulfings valides sur l'historique des 30 derniers jours et noter le contexte : support, résistance ou Fibo",
              "Pour chaque engulfing, vérifier que le corps de la 2ème bougie englobe entièrement le corps de la 1ère",
              "Calculer le R/R potentiel pour 1 engulfing valide : entrée à la cassure, SL sous le low de la bougie engulfing, TP au prochain niveau",
              "Repérer 1 cas où une pin bar et un engulfing apparaissent au même niveau, puis observer ce qui s'est passé après",
            ]}
          />

          <LessonQuiz
            question="Sur EUR/USD H4, une bougie bearish engulfing apparaît au milieu d’un range, sans support ou résistance proche, sans tendance claire, sans confluence Fibonacci. Quel est le verdict opérationnel ?"
            options={[
              "Setup exploitable, l’engulfing est un signal autonome",
              "Setup invalide, l’absence de contexte structurel disqualifie le signal",
              "Setup exploitable à condition d’un volume élevé",
              "Indéterminé sans confirmation multi-timeframe",
            ]}
            correctIndex={1}
            explanation="Une bougie engulfing isolée hors contexte structurel ne constitue pas un signal opérationnel. Le contact avec un niveau structurel qualifié (support, résistance, Fibonacci, tendance claire) est indispensable. Sans contexte, la bougie engulfing reste informative mais ne déclenche pas de setup."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "price-action", "lecon3");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Leçon 3 du module Price Action complétée.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/strategies/price-action/lecon2"
                className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="text-zinc-600">
                  <path d="M9.5 3.5l-4 4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon 2. Pin bar : le rejet de niveau
              </Link>
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Leçon 4. Setup multi-timeframe Daily → H1
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
