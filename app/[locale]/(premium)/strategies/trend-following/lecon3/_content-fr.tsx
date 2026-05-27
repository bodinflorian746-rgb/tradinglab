"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { FibonacciDiagram } from "@/app/components/charts/FibonacciDiagram";
import { OTEDiagram } from "@/app/components/charts/OTEDiagram";
import PullbackContinuationDiagram from "@/app/components/charts/PullbackContinuationDiagram";
import FibPullbackChecklistDiagram from "@/app/components/charts/FibPullbackChecklistDiagram";
import FibTPProjectionDiagram from "@/app/components/charts/FibTPProjectionDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Reconnaître une tendance (HH/HL vs LH/LL)", disabled: false },
  { id: "lecon2", title: "Trendline et moyennes mobiles : tracer la tendance", disabled: false },
  { id: "lecon3", title: "Pullback Fibonacci 0.618/0.786 : entrée optimale", disabled: false },
  { id: "lecon4", title: "Leçon 4",          disabled: true },
];

export default function ContentFr() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "trend-following", "lecon3"));
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
          <span className="text-zinc-500">Leçon 3</span>
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
            Pullback Fibonacci 0.618/0.786 : entrée optimale
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Cette leçon enseigne à trader le pullback sur la zone OTE (Fibonacci 0.618-0.786) avec confluence Order Block / FVG pour une entrée de précision.
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
                « La zone OTE (0.618-0.786) est le point où le marché respire avant de repartir. C&apos;est aussi l&apos;entrée préférée des institutionnels. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prérequis</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Pullback en tendance → cf. Stratégie TF L1</li>
              <li>- Fibonacci retracement → cf. Formation Trading L4</li>
              <li>- Order Block / FVG → cf. Stratégie SMC L3 (mention rapide)</li>
            </ul>
          </div>

          {/* Bloc 3 — REPÉRER LA ZONE OTE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Repérer la zone OTE</h2>

            <div className="my-8">
              <OTEDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La zone OTE (Optimal Trade Entry) couvre les retracements Fibonacci 0.618 à 0.786. Retracement profond mais structurellement valide tant que le 0.786 tient.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Tracé Fibo : dernier HL → dernier HH (haussière) ou dernier LH → dernier LL (baissière)</li>
              <li>- Niveau 0.618 : entrée privilégiée, équilibre optimal entre retracement et risque</li>
              <li>- Niveau 0.786 : limite acceptable, exige signal de rejet fort</li>
              <li>- Au-delà de 0.786 : tendance probablement cassée, pas de trade dans l&apos;ancien sens</li>
            </ul>
          </section>

          {/* Bloc 4 — VALIDER LE PULLBACK FIBO */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Valider le pullback Fibo (checklist)</h2>

            <div className="my-8">
              <FibPullbackChecklistDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              4 critères qualifient un pullback Fibonacci tradable. Une fois validés, le setup entre dans la sélection prioritaire.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Impulsion claire : displacement directionnel marqué (corps significatifs)</li>
              <li>- Retracement 30-60% (idéalement 0.5 à 0.618) : profondeur tradable</li>
              <li>- Signal de rejet au contact (pin bar, engulfing, réaction immédiate)</li>
              <li>- Biais TF supérieur (H4 ou Daily) aligné avec le sens de l&apos;impulsion</li>
            </ul>
          </section>

          {/* Bloc 5 — CONFLUENCE MULTI-ÉLÉMENTS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Confluence multi-éléments</h2>

            <div className="my-8">
              <PullbackContinuationDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La zone OTE gagne en force lorsqu&apos;elle s&apos;inscrit dans une séquence cohérente : ancrage structurel en bas, retracement dans l&apos;OTE, trace institutionnelle au point d&apos;entrée, déséquilibre à combler en cible.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Support HTF en zone basse = ancrage structurel (où le prix veut défendre)</li>
              <li>- Pullback vers OTE 61.8%-78.6% = zone de retracement optimale pour ré-entrer dans la tendance</li>
              <li>- Order Block dans l&apos;OTE = trace institutionnelle où placer l&apos;entrée</li>
              <li>- FVG au-dessus = déséquilibre à combler, cible logique de continuation</li>
            </ul>
          </section>

          {/* Bloc 6 — PLAN DE TRADE CHIFFRÉ */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Plan de trade : pullback Fibo XAU/USD H4</h2>

            <div className="my-8">
              <FibonacciDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              XAU/USD en tendance haussière confirmée. Dernier HL à 4 480$, dernier HH à 4 660$ (impulsion 180$). Fibonacci : 0.618 = 4 548$, 0.786 = 4 519$. Le prix descend toucher 4 550$ (pratiquement 0.618). Pin bar haussière au contact.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup (trade long sur pullback 0.618)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Entrée long : 4 565$ (clôture de la pin bar)</li>
                <li>- Stop loss : 4 510$ (10$ sous le niveau 0.786 à 4 519$)</li>
                <li>- Take profit niveau 1 : 4 660$ (HH précédent), niveau 2 : 4 720$ (extension 138%)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Calcul du R/R</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Risque : 4 565$ - 4 510$ = 55$</li>
                <li>- Gain niveau 1 : 95$ → R/R 1,73</li>
                <li>- Gain niveau 2 : 155$ → R/R 155/55 = 2,82</li>
                <li>- Le setup vise prioritairement le TP niveau 2</li>
              </ul>
            </div>

            <div className="my-8">
              <FibTPProjectionDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Projection des cibles extension Fibonacci 1.272 et 1.618 pour sortir le trade en 2 fois.
            </p>

            <p className="text-white font-semibold text-sm mb-2">Calcul retail</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- Compte 300€ → 5% = risque 15€, gain potentiel 42€</li>
              <li>- Compte 500€ → 3% = risque 15€, gain potentiel 42€</li>
              <li>- Compte 1 000€ → 2% = risque 20€, gain potentiel 56€</li>
              <li>- Compte 2 500€ → 2% = risque 50€, gain potentiel 141€</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">
              Le R/R reste 2,82:1 peu importe la taille du compte.
            </p>
          </section>

          <LessonKeyPoints
            points={[
              "Tracé Fibonacci : dernier HL → HH (haussière) ou LH → LL (baissière). 4 niveaux clés : 0.382, 0.5, 0.618, 0.786.",
              "Zone d’entrée privilégiée : OTE entre 0.618 et 0.786 avec signal de rejet confirmé.",
              "Confluence OTE + OB + FVG + Support = entrée de précision institutionnelle.",
              "Stop loss au-delà de 0.786 avec marge 5-10 pips. Au-delà, la tendance est probablement cassée.",
            ]}
          />

          <LessonExercice
            description="Sur EUR/USD H4 en tendance haussière, le dernier HL est à 1.1720 et le dernier HH à 1.1820. Le prix retrace actuellement à 1.1760. À quel niveau Fibonacci correspond ce retracement et quel est le statut du setup ?"
            steps={[
              "Mesurer l’impulsion : 1.1820 - 1.1720 = 100 pips",
              "Calculer la position du retracement : 1.1820 - 1.1760 = 60 pips sous le HH, soit 60% de l’impulsion",
              "Identifier le niveau Fibonacci : 60% correspond à un niveau entre 0.5 (1.1770) et 0.618 (1.1758). Le prix actuel à 1.1760 se situe pratiquement au niveau 0.618, zone d’entrée optimale",
              "Attendre le signal de rejet (pin bar, engulfing) au contact de 1.1758-1.1760 pour valider le setup",
              "Construire le plan : entrée long à la clôture du signal, stop loss sous 1.1741 (niveau 0.786 + marge 10 pips), take profit à 1.1820 (HH précédent) ou 1.1858 (extension 138%). Taille de position selon le risque par trade adapté au capital",
            ]}
          />

          <LessonQuiz
            question="Sur une tendance haussière confirmée, le prix a retracé à 70% de la dernière impulsion. Une pin bar de rejet se forme à ce niveau. Quel est le statut opérationnel du setup ?"
            options={[
              "Setup invalide, retracement trop profond",
              "Zone d’entrée valide entre 0.618 et 0.786, setup exploitable avec signal de rejet",
              "Setup superficiel, attendre un retracement plus profond",
              "Indéterminé, Fibonacci ne s’applique pas en tendance",
            ]}
            correctIndex={1}
            explanation="Un retracement à 70% se situe entre 0.618 (61,8%) et 0.786 (78,6%), zone d’entrée valide mais profonde, exploitable uniquement avec un signal de rejet confirmé. La pin bar de rejet apporte cette confirmation. Le stop loss se place au-delà de 0.786 avec marge 5-10 pips. Au-delà de 0.786, la structure de la tendance serait remise en cause."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "trend-following", "lecon3");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Leçon 3 du module Trend Following complétée.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/trend-following/lecon2" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon 2
              </Link>
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Leçon 4. À venir
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
