"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import PinBarSetupDiagram from "@/app/components/charts/PinBarSetupDiagram";
import PinBarValidationGridDiagram from "@/app/components/charts/PinBarValidationGridDiagram";
import PinBarLocationDiagram from "@/app/components/charts/PinBarLocationDiagram";
import PinBarFailureDiagram from "@/app/components/charts/PinBarFailureDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Lire une bougie", disabled: false },
  { id: "lecon2", title: "Pin bar",          disabled: false },
  { id: "lecon3", title: "Leçon 3",          disabled: true },
  { id: "lecon4", title: "Leçon 4",          disabled: true },
];

export default function PinBarPage() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "price-action", "lecon2"));
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
          <span className="text-zinc-500">Leçon 2</span>
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
            Pin bar : le rejet de niveau
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Cette leçon enseigne à trader une pin bar de rejet à un niveau structurel : critères de validation, plan d&apos;exécution chiffré, et reconnaissance d&apos;un setup qui échoue.
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

        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « Une pin bar isolée ne dit rien. Une pin bar au contact d&apos;un niveau dit tout. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prérequis</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Anatomie d&apos;une bougie → cf. Stratégie PA L1</li>
              <li>- Concept de rejet / mèche significative → cf. Formation Trading L2</li>
              <li>- Niveaux support/résistance → cf. Formation Trading L3</li>
            </ul>
          </div>

          {/* Bloc 3 — VALIDER UNE PIN BAR */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Valider une pin bar</h2>

            <div className="my-8">
              <PinBarValidationGridDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              4 critères chiffrés qualifient une pin bar tradable. Sans validation des 4, la bougie reste informative mais ne déclenche pas de setup.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Ratio mèche / corps ≥ 2:1 (idéalement 3:1)</li>
              <li>- Mèche directionnelle cohérente : longue en bas pour pin bar haussière, longue en haut pour baissière</li>
              <li>- Clôture dans le tiers opposé à la mèche directionnelle</li>
              <li>- Contact direct avec un niveau structurel qualifié (support, résistance, Fibonacci, OB)</li>
            </ul>
          </section>

          {/* Bloc 4 — LA PIN BAR A BESOIN D'UN NIVEAU */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">La pin bar a besoin d&apos;un niveau</h2>

            <div className="my-8">
              <PinBarLocationDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le contact avec un niveau structurel est le critère le plus discriminant. Une pin bar parfaite en milieu de range ne vaut rien.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Pin bar au support fort = tradable (rebond institutionnel attendu)</li>
              <li>- Pin bar à la résistance forte = tradable (rejet institutionnel attendu)</li>
              <li>- Pin bar en milieu de range = hors niveau, signal disqualifié</li>
              <li>- Conditions externes : alignement TF supérieur, absence de news majeure dans les 60 min</li>
            </ul>
          </section>

          {/* Bloc 5 — PLAN DE TRADE CHIFFRÉ */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de trade : pin bar haussière XAU/USD H4</h2>

            <div className="my-8">
              <PinBarSetupDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              XAU/USD descend vers le support psychologique 4 500$ (déjà touché 3 fois en 6 semaines). Tendance H4 haussière. Pin bar bullish au contact du support.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Entrée long : 4 520$ (clôture de la pin bar)</li>
                <li>- Stop loss : 4 470$ (sous la mèche basse, marge incluse)</li>
                <li>- Take profit : 4 650$ (résistance H4 suivante)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Calcul du R/R</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Risque : 4 520$ - 4 470$ = 50$</li>
                <li>- Gain potentiel : 4 650$ - 4 520$ = 130$</li>
                <li>- R/R : 130 / 50 = 2,6</li>
              </ul>
            </div>

            <p className="text-white font-semibold text-sm mb-2">Calcul retail</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- Compte 300€ → 5% = risque 15€, gain potentiel 39€</li>
              <li>- Compte 500€ → 3% = risque 15€, gain potentiel 39€</li>
              <li>- Compte 1 000€ → 2% = risque 20€, gain potentiel 52€</li>
              <li>- Compte 2 500€ → 2% = risque 50€, gain potentiel 130€</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">
              Le R/R reste 2,6:1 peu importe la taille du compte.
            </p>
          </section>

          {/* Bloc 6 — QUAND LE SETUP ÉCHOUE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Quand le setup échoue</h2>

            <div className="my-8">
              <PinBarFailureDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Une pin bar parfaitement valide peut échouer. Le SL est là pour borner la perte quand le scénario s&apos;invalide.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Le marché peut casser le niveau structurel = invalidation du rejet</li>
              <li>- Le SL doit être placé au-delà de la mèche directionnelle, avec marge 5-10 pips / 5-10$</li>
              <li>- Aucun déplacement du SL contre soi en cours de trade</li>
            </ul>
          </section>

          <LessonKeyPoints
            points={[
              "Une pin bar tradable valide 4 critères : ratio mèche/corps ≥ 2:1, direction cohérente, clôture dans le tiers opposé, contact avec un niveau structurel.",
              "Le contact avec un niveau structurel est le critère le plus discriminant. Pin bar isolée hors contexte = pas de setup.",
              "Stop loss au-delà de la mèche avec marge 5-10 pips/$. Jamais à la clôture ou dans le corps.",
              "Pas de trade dans les 60 minutes autour d’une news majeure (NFP, FOMC, CPI).",
            ]}
          />

          <LessonExercice
            description="Sur EUR/USD H1, le prix s’approche d’une résistance qualifiée à 1.1820 (3 touches dans les 5 dernières semaines, MM50 H4 à 1.1815 = confluence). Une bougie H1 imprime une mèche haute jusqu’à 1.1835 puis clôture à 1.1803. Ouverture à 1.1815. Quelle qualification pour ce signal et quel plan de trade ?"
            steps={[
              "Mesurer la pin bar : mèche haute 32 pips (de 1.1803 à 1.1835), corps 12 pips (de 1.1815 à 1.1803). Ratio mèche/corps = 32/12 = 2,67:1 — critère 1 validé",
              "Vérifier la direction et le contact : mèche longue en haut, pin bar baissière au contact de la résistance 1.1820 — critères 2 et 4 validés",
              "Position de la clôture : 1.1803 dans la fourchette 1.1803-1.1835, au plus bas absolu, clôture dans le tiers inférieur — critère 3 validé",
              "Confluence : MM50 H4 à 1.1815 dans la zone = renforcement du signal",
              "Plan : entrée short à 1.1803 (clôture pin bar), stop loss à 1.1843 (8 pips au-dessus du wick à 1.1835), take profit à 1.1720 (support H4 suivant). Risque 40 pips, gain 83 pips, R/R 2,07. Taille de position selon le risque par trade adapté au capital",
            ]}
          />

          <LessonQuiz
            question="Une pin bar haussière imprime une mèche basse 3 fois plus grande que son corps et clôture dans le tiers supérieur, mais elle apparaît au milieu d’un range latéral sans niveau structurel proche. Quel est le verdict opérationnel ?"
            options={[
              "Setup exploitable, la qualité de la pin bar suffit",
              "Setup invalide, l’absence de contact avec un niveau structurel disqualifie le signal",
              "Setup exploitable à condition d’un volume élevé",
              "Indéterminé sans confirmation Fibonacci",
            ]}
            correctIndex={1}
            explanation="Le contact avec un niveau structurel qualifié est le critère le plus discriminant d’une pin bar tradable. Sans ce contact, le rejet n’est pas ancré sur une zone de mémoire collective. Le mouvement post-pin bar manque de carburant structurel et le signal s’invalide fréquemment dans les bougies suivantes. Même un ratio 3:1 et une clôture parfaite ne compensent pas l’absence de niveau."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "price-action", "lecon2");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Leçon 2 du module Price Action complétée.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/strategies/price-action/lecon1"
                className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="text-zinc-600">
                  <path d="M9.5 3.5l-4 4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon 1 — Lire une bougie : corps, mèche, signal
              </Link>
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Leçon 3 — Engulfing — le retournement de force
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
